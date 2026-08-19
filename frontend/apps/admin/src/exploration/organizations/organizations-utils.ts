/** Accent-stripped, case preserved. */
function stripAccents(value: string) {
  return value.normalize('NFD').replace(/\p{Diacritic}/gu, '');
}

/** Lowercased and accent-stripped. */
export function normalize(value: string) {
  return stripAccents(value).toLowerCase();
}

export const MAX_CODE_LENGTH = 50;

/**
 * Coerces free text to the code charset, keeping the case as typed. Trailing underscores are
 * kept — trimming them would make `_` impossible to type.
 */
export function toCodeCharset(value: string) {
  return stripAccents(value)
    .replace(/[^a-zA-Z0-9-]+/g, '_')
    .slice(0, MAX_CODE_LENGTH);
}

/** Code suggested from the name; unlike free typing it must also start with a letter. */
export function toOrganizationCode(name: string) {
  return toCodeCharset(name)
    .replace(/^[^a-zA-Z]+/, '')
    .replace(/[_-]+$/, '');
}
