import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { load } from 'js-yaml';

const SPEC_URL = 'https://docs.mcsrranked.com/openapi.yaml';
const out = join(dirname(fileURLToPath(import.meta.url)), '..', 'openapi.yaml');

const LOCAL_PATCHES = [
  ['SeasonStanding', 'eloRate'],
  ['SeasonResultDetailed', 'highest'],
  ['SeasonResultDetailed', 'lowest'],
];

function isNullable(schemas, def, field) {
  const type = schemas?.[def]?.properties?.[field]?.type;
  return Array.isArray(type) && type.includes('null');
}

const res = await fetch(SPEC_URL);
if (!res.ok) {
  console.error(`failed to fetch spec: ${res.status} ${res.statusText}`);
  process.exit(1);
}

const next = await res.text();
const current = await readFile(out, 'utf8').catch(() => null);

if (current === next) {
  console.log('openapi.yaml already up to date');
} else {
  await writeFile(out, next);
  const delta = current === null ? 'created' : `${next.length - current.length} bytes`;
  console.log(`openapi.yaml updated (${delta}), run generate and review the diff`);
}

const schemas = load(next).components?.schemas;
const missing = LOCAL_PATCHES.filter(([def, field]) => !isNullable(schemas, def, field));

if (missing.length) {
  console.warn('\nlocal patches are NOT in the fetched spec, re-apply them before generating:');
  for (const [def, field] of missing) {
    console.warn(`  ${def}.${field} -> type: [integer, 'null']`);
  }
} else {
  console.log('local nullability patches are upstream now, drop LOCAL_PATCHES');
}
