export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Splits a comma-separated list, trimming each entry and dropping blanks. */
export function splitEmailList(value: string): string[] {
  return value
    .split(',')
    .map(email => email.trim())
    .filter(email => email.length > 0);
}

/** The list as the API stores it: trimmed entries, one comma and a space between them. */
export function normalizeEmailList(value: string): string {
  return splitEmailList(value).join(', ');
}

/** Empty is a valid list (no distribution list); every non-blank entry must be an address. */
export function isEmailList(value: string): boolean {
  return splitEmailList(value).every(email => EMAIL_PATTERN.test(email));
}
