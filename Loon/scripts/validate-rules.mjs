import { readdir, readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const RULES_DIR = resolve(SCRIPT_DIR,"..","Rules");
const ALLOWED = new Set(["DOMAIN","DOMAIN-SUFFIX","DOMAIN-KEYWORD","USER-AGENT","URL-REGEX","IP-CIDR","IP-CIDR6","IP-ASN","GEOIP"]);
const files = (await readdir(RULES_DIR)).filter((name)=>name.endsWith(".list")).sort();
if (!files.length) throw new Error("No Loon rule files found");
let total = 0;
for (const name of files) {
  const data = await readFile(resolve(RULES_DIR,name),"utf8");
  let count = 0;
  for (const raw of data.replaceAll("\r\n","\n").split("\n")) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const type = line.split(",",1)[0].toUpperCase();
    if (!ALLOWED.has(type)) throw new Error(name + ": unsupported Loon rule type " + type);
    if ((type === "DOMAIN" || type === "DOMAIN-SUFFIX") && line.split(",")[1]?.startsWith(".")) throw new Error(name + ": unconverted domain-set entry " + line);
    count++;
  }
  if (!count) throw new Error(name + ": empty rule file");
  total += count;
}
console.log("Validated " + files.length + " Loon rule files, " + total + " rules.");
