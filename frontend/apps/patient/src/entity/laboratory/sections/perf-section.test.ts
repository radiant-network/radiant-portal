import { describe, expect, it } from 'vitest';

import { scaleAgeMismatch, stripScoreText } from './perf-section';

describe('stripScoreText', () => {
  it('returns empty when the score text is missing', () => {
    expect(stripScoreText(undefined)).toBe('');
    expect(stripScoreText('')).toBe('');
  });

  it('strips a leading "NN - " prefix', () => {
    expect(stripScoreText('90 - Minor restrictions in strenuous physical activity')).toBe(
      'Minor restrictions in strenuous physical activity',
    );
  });

  it('strips an en-dash and em-dash prefix', () => {
    expect(stripScoreText('80 – Fully active')).toBe('Fully active');
    expect(stripScoreText('70 — Cares for self')).toBe('Cares for self');
  });

  it('leaves text unchanged when there is no numeric prefix', () => {
    expect(stripScoreText('Fully active')).toBe('Fully active');
  });
});

describe('scaleAgeMismatch', () => {
  it('returns null when scale or day is missing', () => {
    expect(scaleAgeMismatch(undefined, 3000)).toBeNull();
    expect(scaleAgeMismatch('lansky', undefined)).toBeNull();
  });

  it('flags a Lansky score recorded at age 16 or older', () => {
    expect(scaleAgeMismatch('lansky', 16 * 365.25)).toBe('lansky-adult');
    expect(scaleAgeMismatch('lansky', 20 * 365.25)).toBe('lansky-adult');
  });

  it('does not flag a Lansky score recorded under age 16', () => {
    expect(scaleAgeMismatch('lansky', 12 * 365.25)).toBeNull();
  });

  it('flags a Karnofsky score recorded under age 16', () => {
    expect(scaleAgeMismatch('karnofsky', 10 * 365.25)).toBe('karnofsky-paediatric');
  });

  it('does not flag a Karnofsky score recorded at or over age 16', () => {
    expect(scaleAgeMismatch('karnofsky', 16 * 365.25)).toBeNull();
    expect(scaleAgeMismatch('karnofsky', 25 * 365.25)).toBeNull();
  });

  it('is case-insensitive on the scale name', () => {
    expect(scaleAgeMismatch('LANSKY', 20 * 365.25)).toBe('lansky-adult');
    expect(scaleAgeMismatch('Karnofsky', 10 * 365.25)).toBe('karnofsky-paediatric');
  });
});
