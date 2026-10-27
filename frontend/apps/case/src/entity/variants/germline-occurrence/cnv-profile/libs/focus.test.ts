import { describe, expect, it } from 'vitest';

import { cnvFocus, genesFocus } from './focus';

describe('cnvFocus', () => {
  it('opens on the CNV', () => {
    expect(cnvFocus({ cnv_id: 'c1' })).toEqual({ kind: 'cnv', cnvId: 'c1' });
  });
});

describe('genesFocus', () => {
  it('opens on the gene of a CNV over a single gene', () => {
    expect(genesFocus({ cnv_id: 'c1', symbol: ['ORM1'] })).toEqual({ kind: 'gene', symbol: 'ORM1' });
  });

  it('opens on the CNV over several genes', () => {
    expect(genesFocus({ cnv_id: 'c1', symbol: ['ORM1', 'ORM2'] })).toEqual({ kind: 'cnv', cnvId: 'c1' });
  });

  it('opens on the CNV over no gene', () => {
    expect(genesFocus({ cnv_id: 'c1', symbol: [] })).toEqual({ kind: 'cnv', cnvId: 'c1' });
  });
});
