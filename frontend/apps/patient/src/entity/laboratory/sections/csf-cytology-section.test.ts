import { describe, expect, it } from 'vitest';

import { cytologyConfidenceWeak, cytologyMapping, evidenceTierNoteKey } from './csf-cytology-section';

describe('cytologyMapping', () => {
  it('returns null when malignant_cells is missing', () => {
    expect(cytologyMapping(undefined)).toBeNull();
    expect(cytologyMapping('')).toBeNull();
  });

  it('maps the five canonical values to the expected variant', () => {
    expect(cytologyMapping('positive')?.variant).toBe('red');
    expect(cytologyMapping('suspicious')?.variant).toBe('amber');
    expect(cytologyMapping('negative')?.variant).toBe('neutral');
    expect(cytologyMapping('non_diagnostic')?.variant).toBe('amber');
    expect(cytologyMapping('no_malignancy_statement')?.variant).toBe('outline');
  });

  it('falls back to amber (not neutral) on an unrecognised value', () => {
    expect(cytologyMapping('garbled')?.variant).toBe('amber');
  });

  it('is case-insensitive', () => {
    expect(cytologyMapping('POSITIVE')?.variant).toBe('red');
  });
});

describe('cytologyConfidenceWeak', () => {
  it('is weak when evidence_tier is same_day_only', () => {
    expect(cytologyConfidenceWeak('same_day_only', undefined)).toBe(true);
  });

  it('is weak when multi_specimen_report is true', () => {
    expect(cytologyConfidenceWeak('named', true)).toBe(true);
  });

  it('is strong when neither trigger fires', () => {
    expect(cytologyConfidenceWeak('named', false)).toBe(false);
    expect(cytologyConfidenceWeak('text_confirmed', undefined)).toBe(false);
  });
});

describe('evidenceTierNoteKey', () => {
  it('returns a key only for text_confirmed and same_day_only', () => {
    expect(evidenceTierNoteKey('named')).toBeNull();
    expect(evidenceTierNoteKey(undefined)).toBeNull();
    expect(evidenceTierNoteKey('text_confirmed')).toContain('text_confirmed');
    expect(evidenceTierNoteKey('same_day_only')).toContain('same_day_only');
  });
});
