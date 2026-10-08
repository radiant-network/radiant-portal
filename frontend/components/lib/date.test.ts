import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { formatDate, formatLocalizedDate, getDateFnsLocale } from './date';

const YEAR_MONTH_DAY = 'yyyy-MM-dd';
const MONTH_DAY_YEAR_EN = 'MMM dd, yyyy';
const MONTH_DAY_YEAR_FR = 'dd MMM yyyy';
const ORIGINAL_TZ = process.env.TZ;

// Pinned per file rather than in the shared vitest config: the shift only shows west of Greenwich,
// and the rest of the suite keeps the machine's timezone.
beforeAll(() => {
  process.env.TZ = 'America/Montreal';
});

afterAll(() => {
  process.env.TZ = ORIGINAL_TZ;
});

describe('formatDate', () => {
  it('keeps the calendar day of a date served as a UTC midnight instant', () => {
    expect(formatDate('2018-12-26T00:00:00Z', YEAR_MONTH_DAY, true)).toBe('2018-12-26');
  });

  it('keeps the calendar day of a date served without a time part', () => {
    expect(formatDate('2018-12-26', YEAR_MONTH_DAY)).toBe('2018-12-26');
  });

  it('still reads a genuine instant in local time', () => {
    expect(formatDate('2026-09-16T02:30:00Z', YEAR_MONTH_DAY)).toBe('2026-09-15');
  });
});

describe('getDateFnsLocale', () => {
  it('returns the French Canadian locale for French', () => {
    expect(getDateFnsLocale('fr').code).toBe('fr-CA');
  });

  it('falls back to the English Canadian locale for any other language', () => {
    expect(getDateFnsLocale('en').code).toBe('en-CA');
    expect(getDateFnsLocale('de').code).toBe('en-CA');
  });

  it('carries the translated calendar labels', () => {
    expect(getDateFnsLocale('fr').labels?.labelPrevious).toBe('Aller au mois précédent');
  });
});

describe('formatLocalizedDate', () => {
  const date = new Date(2025, 2, 5);

  it('formats with English month names', () => {
    expect(formatLocalizedDate(date, MONTH_DAY_YEAR_EN, 'en')).toBe('Mar 05, 2025');
  });

  it('formats with French month names', () => {
    expect(formatLocalizedDate(date, MONTH_DAY_YEAR_FR, 'fr')).toBe('05 mars 2025');
  });
});
