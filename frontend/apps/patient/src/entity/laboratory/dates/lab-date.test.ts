import { describe, expect, it } from 'vitest';

import { patientAgeLabel, resolvePatientDayDate } from './lab-date';

describe('patientAgeLabel', () => {
  it('formats a sub-90 year age to one decimal', () => {
    expect(patientAgeLabel(3960)).toEqual({ ageText: '10.8', capped: false });
  });

  it('caps 90+y to the HIPAA safe-harbor sentinel', () => {
    expect(patientAgeLabel(90 * 365.25)).toEqual({ ageText: '90+', capped: true });
    expect(patientAgeLabel(40000)).toEqual({ ageText: '90+', capped: true });
  });
});

describe('resolvePatientDayDate', () => {
  it('returns no-date when both day and date are empty', () => {
    expect(resolvePatientDayDate(undefined, undefined)).toEqual({ kind: 'no-date' });
  });

  it('returns the date verbatim when the date is present', () => {
    expect(resolvePatientDayDate(3960, '2025-12-01')).toEqual({ kind: 'date', date: '2025-12-01' });
  });

  it('falls back to age-day when the date is missing but the day is present', () => {
    expect(resolvePatientDayDate(3960, undefined)).toEqual({
      kind: 'age-day',
      day: 3960,
      ageText: '10.8',
      capped: false,
    });
  });

  it('caps the age label to 90+ when the age exceeds the HIPAA safe-harbor bar', () => {
    expect(resolvePatientDayDate(40000, undefined)).toEqual({
      kind: 'age-day',
      day: 40000,
      ageText: '90+',
      capped: true,
    });
  });
});
