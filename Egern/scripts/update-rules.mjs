import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = resolve(SCRIPT_DIR, "..", "Rules");
const SOURCE_ORIGIN = "https://ruleset.skk.moe";
const SENTINEL_DOMAIN = "7h15.ru1353t.1s.m4d3.by.5ukk4w.skk.moe";

const SOURCES = [
  [
    "List/domainset/apple_cdn.conf",
    "apple_cdn_domainset.yaml",
    "domainset",
    "AGPL-3.0"
  ],
  [
    "List/domainset/cdn.conf",
    "cdn_domainset.yaml",
    "domainset",
    "AGPL-3.0"
  ],
  [
    "List/domainset/download.conf",
    "download_domainset.yaml",
    "domainset",
    "AGPL-3.0"
  ],
  [
    "List/domainset/speedtest.conf",
    "speedtest_domainset.yaml",
    "domainset",
    "AGPL-3.0"
  ],
  [
    "List/non_ip/ai.conf",
    "ai_non_ip.yaml",
    "domain",
    "AGPL-3.0"
  ],
  [
    "List/non_ip/apple_intelligence.conf",
    "apple_intelligence_non_ip.yaml",
    "domain",
    "AGPL-3.0"
  ],
  [
    "List/non_ip/cdn.conf",
    "cdn_non_ip.yaml",
    "domain",
    "AGPL-3.0"
  ],
  [
    "List/non_ip/stream.conf",
    "stream_non_ip.yaml",
    "domain",
    "AGPL-3.0"
  ],
  [
    "List/non_ip/telegram.conf",
    "telegram_non_ip.yaml",
    "domain",
    "AGPL-3.0"
  ],
  [
    "List/non_ip/apple_cn.conf",
    "apple_cn_non_ip.yaml",
    "domain",
    "AGPL-3.0"
  ],
  [
    "List/non_ip/apple_services.conf",
    "apple_services_non_ip.yaml",
    "domain",
    "AGPL-3.0"
  ],
  [
    "List/non_ip/apple_services.conf",
    "apple_services_ip.yaml",
    "ip",
    "AGPL-3.0"
  ],
  [
    "List/non_ip/microsoft_cdn.conf",
    "microsoft_cdn_non_ip.yaml",
    "domain",
    "AGPL-3.0"
  ],
  [
    "List/non_ip/microsoft.conf",
    "microsoft_non_ip.yaml",
    "domain",
    "AGPL-3.0"
  ],
  [
    "List/non_ip/neteasemusic.conf",
    "neteasemusic_non_ip.yaml",
    "domain",
    "AGPL-3.0"
  ],
  [
    "List/non_ip/download.conf",
    "download_non_ip.yaml",
    "domain",
    "AGPL-3.0"
  ],
  [
    "List/non_ip/lan.conf",
    "lan_non_ip.yaml",
    "domain",
    "AGPL-3.0"
  ],
  [
    "List/non_ip/domestic.conf",
    "domestic_non_ip.yaml",
    "domain",
    "AGPL-3.0"
  ],
  [
    "List/non_ip/direct.conf",
    "direct_non_ip.yaml",
    "domain",
    "AGPL-3.0"
  ],
  [
    "List/non_ip/global.conf",
    "global_non_ip.yaml",
    "domain",
    "AGPL-3.0"
  ],
  [
    "List/ip/ai.conf",
    "ai_ip.yaml",
    "ip",
    "AGPL-3.0"
  ],
  [
    "List/ip/stream.conf",
    "stream_ip.yaml",
    "ip",
    "AGPL-3.0"
  ],
  [
    "List/ip/telegram.conf",
    "telegram_ip.yaml",
    "ip",
    "AGPL-3.0"
  ],
  [
    "List/ip/neteasemusic.conf",
    "neteasemusic_ip.yaml",
    "ip",
    "AGPL-3.0"
  ],
  [
    "List/ip/lan.conf",
    "lan_ip.yaml",
    "ip",
    "AGPL-3.0"
  ],
  [
    "List/ip/domestic.conf",
    "domestic_ip.yaml",
    "ip",
    "AGPL-3.0"
  ],
  [
    "List/ip/china_ip.conf",
    "china_ip.yaml",
    "ip",
    "CC-BY-SA-2.0"
  ],
  [
    "List/ip/china_ip_ipv6.conf",
    "china_ip_ipv6.yaml",
    "ip",
    "CC-BY-SA-2.0"
  ]
];

const DOMAIN_MAP = new Map([
  ["DOMAIN", "domain_set"],
  ["DOMAIN-SUFFIX", "domain_suffix_set"],
  ["DOMAIN-KEYWORD", "domain_keyword_set"],
  ["DOMAIN-REGEX", "domain_regex_set"],
  ["DOMAIN-WILDCARD", "domain_wildcard_set"],
  ["URL-REGEX", "url_regex_set"],
  ["USER-AGENT", "user_agent_set"]
]);
const IP_MAP = new Map([
  ["IP-CIDR", "ip_cidr_set"],
  ["IP-CIDR6", "ip_cidr6_set"],
  ["IP-ASN", "asn_set"],
  ["GEOIP", "geoip_set"]
]);

function add(map, key, value) {
  if (!map.has(key)) map.set(key, []);
  map.get(key).push(value);
}

function parseLine(line) {
  const comma = line.indexOf(",");
  if (comma < 0) return { type: "", value: line, noResolve: false };
  const type = line.slice(0, comma).toUpperCase();
  let value = line.slice(comma + 1);
  let noResolve = false;
  if (IP_MAP.has(type) && value.endsWith(",no-resolve")) {
    value = value.slice(0, -",no-resolve".length);
    noResolve = true;
  }
  return { type, value, noResolve };
}

function convert(sourceText, mode) {
  const sets = new Map();
  const dropped = new Map();
  const ipResolveFlags = [];

  for (const rawLine of sourceText.replaceAll("\r\n", "\n").split("\n")) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#") || line.includes(SENTINEL_DOMAIN)) continue;

    if (mode === "domainset") {
      if (line.includes(",")) {
        dropped.set("INVALID-DOMAIN-SET", (dropped.get("INVALID-DOMAIN-SET") ?? 0) + 1);
        continue;
      }
      if (line.startsWith(".")) add(sets, "domain_suffix_set", line.slice(1));
      else add(sets, "domain_set", line);
      continue;
    }

    const { type, value, noResolve } = parseLine(line);
    const key = mode === "domain" ? DOMAIN_MAP.get(type) : IP_MAP.get(type);
    if (!key) {
      dropped.set(type || "UNKNOWN", (dropped.get(type || "UNKNOWN") ?? 0) + 1);
      continue;
    }
    add(sets, key, value);
    if (mode === "ip") ipResolveFlags.push(noResolve);
  }

  if (sets.size === 0) throw new Error("Conversion produced no Egern rules for mode " + mode);
  let noResolve = false;
  if (mode === "ip" && ipResolveFlags.length) {
    const hasTrue = ipResolveFlags.some(Boolean);
    const hasFalse = ipResolveFlags.some((v) => !v);
    if (hasTrue && hasFalse) throw new Error("Mixed no-resolve semantics in one Egern ruleset; split the source first.");
    noResolve = hasTrue;
  }
  return { sets, dropped, noResolve };
}

function renderYaml(sourceUrl, lastUpdated, contentHash, license, mode, converted) {
  const { sets, dropped, noResolve } = converted;
  const droppedText = [...dropped.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([type, count]) => type + "=" + count)
    .join(", ") || "none";
  const ruleCount = [...sets.values()].reduce((sum, values) => sum + values.length, 0);
  const out = [
    "# AUTO-GENERATED FILE. DO NOT EDIT.",
    "# Native Egern ruleset converted from Sukka Ruleset.",
    "# Source: " + sourceUrl,
    "# Source Last Updated: " + lastUpdated,
    "# Source Content Hash: " + contentHash,
    "# License: " + license,
    "# Conversion Mode: " + mode,
    "# Unsupported or inapplicable entries removed: " + droppedText,
    "# Rule Count: " + ruleCount
  ];
  if (noResolve) out.push("no_resolve: true");
  for (const [key, values] of sets) {
    out.push(key + ":");
    for (const value of values) out.push("  - " + JSON.stringify(value));
  }
  return out.join("\n") + "\n";
}

async function updateOne([sourcePath, outputName, mode, license]) {
  const sourceUrl = SOURCE_ORIGIN + "/" + sourcePath;
  const response = await fetch(sourceUrl, {
    headers: { "user-agent": "coutureone-Egern-rules-converter/1.0" },
    signal: AbortSignal.timeout(30000)
  });
  if (!response.ok) throw new Error(sourceUrl + ": HTTP " + response.status);
  const sourceText = await response.text();
  const lastUpdated = sourceText.match(/^# Last Updated:\s*(.+)$/m)?.[1] ?? "unknown";
  const contentHash = sourceText.match(/^# \$content-hash-v1\$:(.+)$/m)?.[1] ?? "unknown";
  const converted = convert(sourceText, mode);
  const output = renderYaml(sourceUrl, lastUpdated, contentHash, license, mode, converted);
  await writeFile(resolve(OUTPUT_DIR, outputName), output, "utf8");
  return outputName;
}

await mkdir(OUTPUT_DIR, { recursive: true });
const results = [];
for (const source of SOURCES) results.push(await updateOne(source));
console.log("Updated " + results.length + " Egern native rulesets.");
