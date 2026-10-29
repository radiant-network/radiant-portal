import { describe, expect, it } from 'vitest';

import { labUnitLabel } from './lab-unit';

describe('labUnitLabel', () => {
  it('returns empty when unit is undefined', () => {
    expect(labUnitLabel(undefined)).toBe('');
  });

  it('relabels known notations case-insensitively', () => {
    expect(labUnitLabel('g/dL')).toBe('g/dL');
    expect(labUnitLabel('g/dl')).toBe('g/dL');
    expect(labUnitLabel('/uL')).toBe('/µL');
    expect(labUnitLabel('10*3/uL')).toBe('×10³/µL');
    expect(labUnitLabel('10^9/L')).toBe('×10⁹/L');
    expect(labUnitLabel('x10E9/L')).toBe('×10⁹/L');
    expect(labUnitLabel('cells/uL')).toBe('cells/µL');
    expect(labUnitLabel('k/uL')).toBe('k/µL');
  });

  it('returns the raw unit when the notation is not in the map', () => {
    expect(labUnitLabel('mmol/L')).toBe('mmol/L');
  });
});
