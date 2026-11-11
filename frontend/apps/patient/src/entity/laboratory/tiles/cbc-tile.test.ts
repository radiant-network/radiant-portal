import { describe, expect, it } from 'vitest';

import { normaliseCount } from './cbc-tile';

describe('normaliseCount', () => {
  it('leaves counts already in ×10⁹/L untouched and emits no reported line', () => {
    expect(normaliseCount(2.9, 'x10E9/L')).toEqual({
      kind: 'canonical',
      value: 2.9,
      unit: '×10⁹/L',
      reported: null,
    });
  });

  it('scales /uL counts down by 1000 and keeps the reported line', () => {
    expect(normaliseCount(1500, '/uL')).toEqual({
      kind: 'canonical',
      value: 1.5,
      unit: '×10⁹/L',
      reported: '1500 /µL',
    });
  });

  it('normalises 10*3/uL counts without changing the magnitude and emits no reported line', () => {
    expect(normaliseCount(6.2, '10*3/uL')).toEqual({
      kind: 'canonical',
      value: 6.2,
      unit: '×10⁹/L',
      reported: null,
    });
  });

  it('scales cells/uL counts down and prettifies the reported unit', () => {
    expect(normaliseCount(1500, 'cells/uL')).toEqual({
      kind: 'canonical',
      value: 1.5,
      unit: '×10⁹/L',
      reported: '1500 cells/µL',
    });
  });

  it('flags an unrecognised unit as unverified and keeps the raw value', () => {
    expect(normaliseCount(42, 'mol/L')).toEqual({
      kind: 'unverified',
      value: 42,
      unit: 'mol/L',
    });
  });

  it('treats a missing unit as unverified', () => {
    expect(normaliseCount(42, undefined)).toEqual({
      kind: 'unverified',
      value: 42,
      unit: '',
    });
  });
});
