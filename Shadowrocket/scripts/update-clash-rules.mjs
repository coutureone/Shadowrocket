import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const shadowrocketDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const inputDir = join(shadowrocketDir, 'Rules');
const outputDir = join(shadowrocketDir, 'Clash', 'rules');

await mkdir(outputDir, { recursive: true });

const names = [
  'ai_ip', 'ai_non_ip', 'apple_cdn_domainset',
  'apple_cn_non_ip', 'apple_intelligence_non_ip', 'apple_services_non_ip',
  'apple_services_ip',
  'cdn_domainset', 'cdn_non_ip', 'china_ip', 'china_ip_ipv6', 'direct_non_ip',
  'domestic_ip', 'domestic_non_ip', 'download_domainset', 'download_non_ip',
  'global_non_ip', 'lan_ip', 'lan_non_ip', 'microsoft_cdn_non_ip',
  'microsoft_non_ip', 'neteasemusic_ip', 'neteasemusic_non_ip',
  'speedtest_domainset', 'stream_ip', 'stream_non_ip', 'telegram_ip',
  'telegram_non_ip'
];

function convert(line, name) {
  if (name.endsWith('_domainset')) {
    if (line.includes(',')) throw new Error(`${name}: unexpected domain-set rule: ${line}`);
    return line;
  }

  const [type, value] = line.split(',');
  if ((name.endsWith('_ip') && !name.endsWith('_non_ip')) || name.endsWith('_ip_ipv6')) {
    if (type === 'IP-CIDR' || type === 'IP-CIDR6') return value;
    if (type === 'IP-ASN') return null; // MRS only supports CIDR entries.
    throw new Error(`${name}: unsupported IP rule: ${line}`);
  }

  if (type === 'USER-AGENT') return null; // Mihomo has no equivalent rule.
  if (['DOMAIN', 'DOMAIN-SUFFIX', 'DOMAIN-KEYWORD', 'DOMAIN-WILDCARD'].includes(type)) {
    return `${type},${value}`;
  }
  throw new Error(`${name}: unsupported domain rule: ${line}`);
}

for (const name of names) {
  const source = await readFile(join(inputDir, `${name}.list`), 'utf8');
  const entries = source.split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'))
    .map((line) => convert(line, name))
    .filter((line) => line !== null);
  if (entries.length === 0) throw new Error(`${name}: no compatible rules`);
  const content = `# AUTO-GENERATED FILE. DO NOT EDIT.\n# Source: Shadowrocket/Rules/${name}.list\npayload:\n${entries.map((entry) => `  - ${JSON.stringify(entry)}`).join('\n')}\n`;
  await writeFile(join(outputDir, `${name}.yaml`), content, 'utf8');
  console.log(`${name}: ${entries.length} rules`);
}
