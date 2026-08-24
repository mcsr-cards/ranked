import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const SPEC_URL = 'https://docs.mcsrranked.com/openapi.yaml';
const out = join(dirname(fileURLToPath(import.meta.url)), '..', 'openapi.yaml');

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
