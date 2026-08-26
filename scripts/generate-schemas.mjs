import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { load } from 'js-yaml';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const specPath = join(root, 'openapi.yaml');
const outPath = join(root, 'src', 'schemas.ts');

function rewriteRefs(node) {
  if (Array.isArray(node)) return node.map(rewriteRefs);
  if (node && typeof node === 'object') {
    const out = {};
    for (const [key, value] of Object.entries(node)) {
      out[key] =
        key === '$ref' && typeof value === 'string'
          ? value.replace('#/components/schemas/', '#/$defs/')
          : rewriteRefs(value);
    }
    return out;
  }
  return node;
}

const spec = load(await readFile(specPath, 'utf8'));
const schemas = spec.components?.schemas;
if (!schemas) {
  console.error('no components.schemas found in openapi.yaml');
  process.exit(1);
}

const defs = rewriteRefs(schemas);

const banner = `/**
 * This file was auto-generated from openapi.yaml by scripts/generate-schemas.mjs.
 * Do not make direct changes to the file.
 */
`;
const body = `export const schemaDefs: Record<string, object> = ${JSON.stringify(defs, null, 2)};\n`;

await writeFile(outPath, banner + body);
console.log('src/schemas.ts generated');
