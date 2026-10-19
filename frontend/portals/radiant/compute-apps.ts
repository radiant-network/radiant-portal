import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const APP_CONSTANTS = [
  'VARIANT',
  'CASE',
  'FILE_ARCHIVE',
  'ANALYSIS',
  'ADMIN',
  'PATIENT',
  'STUDY',
  'COMMUNITY',
] as const;

export function computeApps(theme: string, portalRoot: string): Record<string, boolean> {
  const path = resolve(portalRoot, `config/routes.${theme}.ts`);
  const source = readFileSync(path, 'utf8');

  const spreads = new Set<string>();
  for (const match of source.matchAll(/\.\.\.\s*([A-Z_]+)/g)) {
    spreads.add(match[1]);
  }

  const defines: Record<string, boolean> = {};
  for (const name of APP_CONSTANTS) {
    defines[`__APPS_${name}__`] = spreads.has(name);
  }
  return defines;
}
