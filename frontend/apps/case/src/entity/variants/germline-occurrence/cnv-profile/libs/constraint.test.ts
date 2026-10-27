import { describe, expect, it } from 'vitest';

import { loeufLevel, pliLevel } from './constraint';

describe('pliLevel', () => {
  it('flags the intolerant, intermediate and tolerant genes', () => {
    expect(pliLevel(0.9)).toBe('intolerant');
    expect(pliLevel(0.5)).toBe('intermediate');
    expect(pliLevel(0.1)).toBe('tolerant');
  });

  it('gives nothing without a score', () => {
    expect(pliLevel(undefined)).toBeUndefined();
  });
});

describe('loeufLevel', () => {
  it('flags the genes below 0.35 only', () => {
    expect(loeufLevel(0.34)).toBe('intolerant');
    expect(loeufLevel(0.35)).toBeUndefined();
    expect(loeufLevel(undefined)).toBeUndefined();
  });
});
