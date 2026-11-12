import { describe, expect, it } from 'vitest';

import { getFilenameFromContentDisposition } from './file-download';

const FALLBACK = 'report.xlsx';

describe('getFilenameFromContentDisposition', () => {
  it('reads an unquoted filename', () => {
    expect(getFilenameFromContentDisposition('attachment; filename=MRN1_42_20261027T120000Z.xlsx', FALLBACK)).toBe(
      'MRN1_42_20261027T120000Z.xlsx',
    );
  });

  it('reads a quoted filename', () => {
    expect(getFilenameFromContentDisposition('attachment; filename="42_20261027.xlsx"', FALLBACK)).toBe(
      '42_20261027.xlsx',
    );
  });

  it('decodes an RFC 5987 filename', () => {
    expect(getFilenameFromContentDisposition("attachment; filename*=UTF-8''rapport%20cas.xlsx", FALLBACK)).toBe(
      'rapport cas.xlsx',
    );
  });

  it('falls back when the header is missing', () => {
    expect(getFilenameFromContentDisposition(undefined, FALLBACK)).toBe(FALLBACK);
  });

  it('falls back when the header has no filename', () => {
    expect(getFilenameFromContentDisposition('attachment', FALLBACK)).toBe(FALLBACK);
  });
});
