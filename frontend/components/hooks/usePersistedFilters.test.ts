import { describe, expect, it } from 'vitest';

import { pruneUnknownKeys } from './usePersistedFilters';

const CASE_DEFAULTS = {
  priority_code: [],
  status_code: [],
};

describe('pruneUnknownKeys', () => {
  it('drops a retired filter left behind in storage', () => {
    const stored = { priority_code: ['routine'], status_code: [], resolution_status_code: ['solved'] };

    expect(pruneUnknownKeys(stored, CASE_DEFAULTS)).toEqual({
      priority_code: ['routine'],
      status_code: [],
    });
  });

  it('keeps the values of filters that are still declared', () => {
    const stored = { priority_code: ['urgent'], status_code: ['completed'] };

    expect(pruneUnknownKeys(stored, CASE_DEFAULTS)).toEqual(stored);
  });

  it('falls back to the default for a filter added since the value was stored', () => {
    const stored = { priority_code: ['routine'] };

    expect(pruneUnknownKeys(stored, CASE_DEFAULTS)).toEqual({
      priority_code: ['routine'],
      status_code: [],
    });
  });
});
