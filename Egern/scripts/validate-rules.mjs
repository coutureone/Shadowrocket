import { readdir, readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const RULES_DIR = resolve(SCRIPT_DIR, "..", "Rules");
const ALLOWED_KEYS = new Set([
  "no_resolve", "domain_set", "domain_keyword_set", "domain_suffix_set",
  "domain_regex_set", "domain_wildcard_set", "geoip_set", "ip_cidr_set",
  "ip_cidr6_set", "url_regex_set", "asn_set", "user_agent_set"
]);

const files = (await readdir(RULES_DIR)).filter((name) => name.endsWith(".yaml")).sort();
if (!files.length) throw new Error("No Egern YAML rulesets found");
let total = 0;
for (const name of files) {
  const text = await readFile(resolve(RULES_DIR, name), "utf8");
  let activeKey = null;
  let count = 0;
  for (const raw of text.replaceAll("\r\n", "\n").split("\n")) {
    if (!raw.trim() || raw.trimStart().startsWith("#")) continue;
    if (!raw.startsWith(" ")) {
      const i = raw.indexOf(":");
      if (i < 0) throw new Error(name + ": invalid YAML top-level line: " + raw);
      const key = raw.slice(0, i);
      if (!ALLOWED_KEYS.has(key)) throw new Error(name + ": unsupported Egern ruleset key: " + key);
      if (key === "no_resolve") {
        if (raw.trim() !== "no_resolve: true") throw new Error(name + ": invalid no_resolve value");
        activeKey = null;
      } else {
        if (raw.trim() !== key + ":") throw new Error(name + ": invalid set declaration");
        activeKey = key;
      }
      continue;
    }
    if (!activeKey || !raw.startsWith("  - ")) throw new Error(name + ": malformed list item: " + raw);
    const encoded = raw.slice(4);
    const value = JSON.parse(encoded);
    if (typeof value !== "string" || !value) throw new Error(name + ": invalid list value");
    count++;
  }
  if (!count) throw new Error(name + ": empty ruleset");
  total += count;
}
console.log("Validated " + files.length + " Egern rulesets, " + total + " rules.");
