import { execFileSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const mihomo = process.env.MIHOMO_BIN ?? 'mihomo';
const rulesDir = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'Clash', 'rules');
const domainSets = [
  'apple_cdn_domainset', 'cdn_domainset', 'download_domainset', 'speedtest_domainset'
];
const ipSets = [
  'ai_ip', 'china_ip', 'china_ip_ipv6', 'domestic_ip',
  'lan_ip', 'neteasemusic_ip', 'stream_ip', 'telegram_ip'
];

for (const [behavior, names] of [['domain', domainSets], ['ipcidr', ipSets]]) {
  for (const name of names) {
    execFileSync(mihomo, [
      'convert-ruleset', behavior, 'yaml',
      resolve(rulesDir, `${name}.yaml`), resolve(rulesDir, `${name}.mrs`)
    ], { stdio: 'inherit' });
    console.log(`${name}.mrs`);
  }
}
