import { describe, expect, it } from 'vitest';

import { cnvFocus } from './focus';

describe('cnvFocus', () => {
  it('opens on the CNV', () => {
    expect(cnvFocus({ cnv_id: 'c1' })).toEqual({ kind: 'cnv', cnvId: 'c1' });
  });
});
