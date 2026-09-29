import { access, readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const profiles = [
  'Shadowrocket/Shadowrocket-Universal-Split-DNS.conf',
  'Shadowrocket/Shadowrocket-Universal-Split-DNS-APNs-Test.conf',
  'Shadowrocket/Clash/Shadowrocket-Universal-Split-DNS.yaml'
];

function ruleKind(rule) {
  const [type, target] = rule.split(',');
  if (type === 'RULE-SET') {
    const name = target.split('/').at(-1).replace(/\.list$/, '');
    return /_ip(?:_ipv6)?$/.test(name) && !name.endsWith('_non_ip') ? 'ip' : 'domain';
  }
  if (type === 'DOMAIN-SET' || type.startsWith('DOMAIN')) return 'domain';
  if (type.startsWith('IP-') || type === 'GEOIP') return 'ip';
  if (type === 'FINAL' || type === 'MATCH') return 'final';
  throw new Error(`Unknown rule type: ${rule}`);
}

function ruleLines(content, isClash) {
  if (isClash) {
    const rules = content.split(/^rules:\s*$/m)[1];
    if (!rules) throw new Error('Missing Clash rules section');
    return rules.split('\n').map((line) => line.trim())
      .filter((line) => line.startsWith('- ')).map((line) => line.slice(2));
  }
  const rules = content.split(/^\[Rule\]\s*$/m)[1]?.split(/^\[/m)[0];
  if (!rules) throw new Error('Missing Shadowrocket [Rule] section');
  return rules.split('\n').map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'));
}

for (const profile of profiles) {
  const isClash = profile.endsWith('.yaml');
  const content = await readFile(resolve(root, profile), 'utf8');
  const rules = ruleLines(content, isClash);
  let seenIp = false;
  for (const [index, rule] of rules.entries()) {
    const kind = ruleKind(rule);
    if (kind === 'domain' && seenIp) {
      throw new Error(`${profile}: domain rule after IP rule at ${index + 1}: ${rule}`);
    }
    if (kind === 'ip') seenIp = true;
    if (kind === 'final' && index !== rules.length - 1) {
      throw new Error(`${profile}: final rule is not last: ${rule}`);
    }
    if (!isClash && (rule.startsWith('RULE-SET,') || rule.startsWith('DOMAIN-SET,'))) {
      const filename = rule.split(',')[1].split('/').at(-1);
      await access(resolve(root, 'Shadowrocket/Rules', filename));
    }
  }
  console.log(`${profile}: ${rules.length} ordered rules`);
}

const clash = await readFile(resolve(root, profiles[2]), 'utf8');
const providerSection = clash.split(/^rule-providers:\s*$/m)[1]?.split(/^rules:\s*$/m)[0];
if (!providerSection) throw new Error('Missing Clash rule providers');
const providers = new Map();
let current;
for (const line of providerSection.split('\n')) {
  const name = line.match(/^  ([a-z0-9_]+):\s*$/)?.[1];
  if (name) {
    current = { name };
    providers.set(name, current);
  } else if (current) {
    const field = line.match(/^    (behavior|format|path):\s*(\S+)/);
    if (field) current[field[1]] = field[2];
  }
}
for (const provider of providers.values()) {
  if (!['domain', 'classical', 'ipcidr'].includes(provider.behavior)) {
    throw new Error(`${provider.name}: invalid behavior`);
  }
  if (!['yaml', 'mrs'].includes(provider.format) || !provider.path?.endsWith(`.${provider.format}`)) {
    throw new Error(`${provider.name}: format/path mismatch`);
  }
  await access(resolve(root, 'Shadowrocket/Clash', provider.path));
}
for (const rule of ruleLines(clash, true)) {
  if (rule.startsWith('RULE-SET,')) {
    const [, name, , option] = rule.split(',');
    if (!providers.has(name)) throw new Error(`Unknown Clash provider: ${name}`);
    if (ruleKind(rule) === 'ip') {
      const source = await readFile(resolve(root, 'Shadowrocket/Rules', `${name}.list`), 'utf8');
      const entries = source.split(/\r?\n/).filter((line) => line.startsWith('IP-'));
      const noResolveCount = entries.filter((line) => line.endsWith(',no-resolve')).length;
      if (noResolveCount > 0 && noResolveCount < entries.length) {
        throw new Error(`${name}: mixed no-resolve IP rules need separate providers`);
      }
      if ((noResolveCount === entries.length) !== (option === 'no-resolve')) {
        throw new Error(`${name}: Clash no-resolve differs from the Sukka source`);
      }
    }
  }
}
console.log(`${providers.size} Clash rule providers available`);
