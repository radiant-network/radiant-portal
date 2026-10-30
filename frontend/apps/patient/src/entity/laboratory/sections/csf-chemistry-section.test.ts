import { describe, expect, it } from 'vitest';

import { csfResultDisplay } from './csf-chemistry-section';

describe('csfResultDisplay', () => {
  it('returns null when the result is missing', () => {
    expect(csfResultDisplay(undefined)).toBeNull();
  });

  it('returns null when neither value nor display is set', () => {
    expect(csfResultDisplay({ unit: 'mg/dL' })).toBeNull();
  });

  it('prefixes the comparator onto the value when present', () => {
    expect(csfResultDisplay({ value: 10, comparator: '<', unit: 'mg/dL', display: '<10 mg/dL' })).toEqual({
      shown: '<10',
      unit: 'mg/dL',
      tooltip: '<10 mg/dL',
    });
  });

  it('omits the comparator when it is absent', () => {
    expect(csfResultDisplay({ value: 31, unit: 'mg/dL' })).toEqual({
      shown: '31',
      unit: 'mg/dL',
      tooltip: null,
    });
  });

  it('falls back to the display string when value is null and reuses it as tooltip', () => {
    expect(csfResultDisplay({ display: 'Negative' })).toEqual({
      shown: 'Negative',
      unit: '',
      tooltip: 'Negative',
    });
  });
});
