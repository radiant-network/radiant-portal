#!/usr/bin/env node
// Verify that the nightly (and ferlease-pr) workflow shards cover all specs without gaps or duplicates.
import { readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

let minimatch;
try {
  ({ minimatch } = await import('minimatch'));
} catch {
  console.error("Failure: Package 'minimatch' not found. Run 'npm install' in the repository root directory.");
  process.exit(1);
}

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const WORKFLOW = '.github/workflows/cypress-nightly.yml';
const SIBLING_WORKFLOW = '.github/workflows/ferlease-pr.yml';

const walk = (dir) =>
  readdirSync(join(ROOT, dir), { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(`${dir}/${e.name}`) : e.name.endsWith('.cy.ts') ? [`${dir}/${e.name}`] : [],
  );

const specs = [...walk('cypress/api'), ...walk('cypress/e2e')].sort();

const block = readFileSync(join(ROOT, WORKFLOW), 'utf8').match(/^\s*SHARDS=\(\s*$([\s\S]*?)^\s*\)\s*$/m);
if (!block) {
  console.error(`Failure: array SHARDS=( ... ) not found in ${WORKFLOW}.`);
  console.error("If the workflow has been reformatted, adjust the extraction in this script.");
  process.exit(1);
}
const shards = [...block[1].matchAll(/"([^"]+)"/g)].map((m) => m[1].split(','));
if (shards.length === 0) {
  console.error(`Failure: no shards read in ${WORKFLOW}.`);
  process.exit(1);
}

const errors = [];
const owners = new Map(specs.map((s) => [s, []]));

shards.forEach((patterns, i) => {
  patterns.forEach((pattern) => {
    const matched = specs.filter((s) => minimatch(s, pattern));
    if (matched.length === 0) errors.push(`Dead pattern (0 spec) in the shard ${i}: ${pattern}`);
    matched.forEach((s) => owners.get(s).push(i));
  });
});

const orphans = specs.filter((s) => owners.get(s).length === 0);
if (orphans.length) {
  errors.push(`${orphans.length} not covered by any shard:`);
  orphans.forEach((s) => errors.push(`    ${s}`));
}

const dupes = specs.filter((s) => owners.get(s).length > 1);
if (dupes.length) {
  errors.push(`${dupes.length} spec(s) in multiple shards:`);
  dupes.forEach((s) => errors.push(`    ${s}  ->  shards ${owners.get(s).join(', ')}`));
}

if (errors.length) {
  console.error(`Cypress CI shards out of sync with the spec files (${WORKFLOW}):`);
  errors.forEach((e) => console.error(`  ${e}`));
  console.error(`\nReminder: ${SIBLING_WORKFLOW} holds its own copy of the SHARDS array — apply the same fix there.`);
  process.exit(1);
}
console.log(`Cypress CI shards OK — ${specs.length} specs.`);
