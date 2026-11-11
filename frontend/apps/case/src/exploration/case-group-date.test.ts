import { describe, expect, it } from 'vitest';

import { formatCaseGroupDate } from './case-group-date';

describe('formatCaseGroupDate', () => {
  const date = new Date(2026, 8, 3, 16, 35);

  it('uses the 24-hour French format', () => {
    expect(formatCaseGroupDate(date, 'fr')).toBe('2026-09-03 16h35');
  });

  it('uses the 12-hour English format', () => {
    expect(formatCaseGroupDate(date, 'en')).toBe('2026-09-03 4:35 PM');
  });
});
