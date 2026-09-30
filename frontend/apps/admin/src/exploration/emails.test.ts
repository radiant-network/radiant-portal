import { describe, expect, it } from 'vitest';

import { isEmailList, normalizeEmailList, splitEmailList } from './emails';

describe('splitEmailList', () => {
  it('trims entries and drops blanks', () => {
    expect(splitEmailList(' a@lab.invalid ,, b@lab.invalid , ')).toEqual(['a@lab.invalid', 'b@lab.invalid']);
  });

  it('reads an empty or blank value as no address', () => {
    expect(splitEmailList('')).toEqual([]);
    expect(splitEmailList(' , ')).toEqual([]);
  });
});

describe('normalizeEmailList', () => {
  it('joins with a comma and a space', () => {
    expect(normalizeEmailList('a@lab.invalid,b@lab.invalid')).toBe('a@lab.invalid, b@lab.invalid');
  });

  it('turns a blank value into an empty string', () => {
    expect(normalizeEmailList('  ')).toBe('');
  });
});

describe('isEmailList', () => {
  it('accepts an empty list and well-formed addresses', () => {
    expect(isEmailList('')).toBe(true);
    expect(isEmailList('a@lab.invalid')).toBe(true);
    expect(isEmailList('a@lab.invalid, b@lab.invalid')).toBe(true);
  });

  it('rejects any malformed entry', () => {
    expect(isEmailList('a@lab.invalid, nope')).toBe(false);
    expect(isEmailList('Lab <a@lab.invalid>')).toBe(false);
    expect(isEmailList('a@lab.invalid; b@lab.invalid')).toBe(false);
  });
});
