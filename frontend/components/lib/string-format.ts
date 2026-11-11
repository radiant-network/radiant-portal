export function replaceUnderscore(s: string): string {
  return s.replace(/_/g, ' ');
}

export function titleCase(s: string): string {
  return s.toLowerCase().replace(/^\w/, s => s.charAt(0).toUpperCase() + s.substring(1).toLowerCase());
}
