import type { Header, RowData } from '@tanstack/react-table';

import type { AppFeatures } from '../data-table';

/**
 * Works like getFlatColumns of stantacks.
 *
 * Return all subheaders of a header
 */
export function getFlatSubheaders<TData extends RowData>(header: Header<AppFeatures, TData, unknown>) {
  const result: Header<AppFeatures, TData, unknown>[] = [];

  const generateFlatmap = (h: Header<AppFeatures, TData, unknown>) => {
    for (const subheader of h.subHeaders) {
      result.push(subheader);
      generateFlatmap(subheader);
    }
  };

  generateFlatmap(header);
  return result;
}
