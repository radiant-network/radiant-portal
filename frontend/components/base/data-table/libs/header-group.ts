import { Header } from '@tanstack/react-table';

/**
 * Works like getFlatColumns of stantacks.
 *
 * Return all subheaders of a header
 */
export function getFlatSubheaders(header: Header<any, any>) {
  const result: Header<any, any>[] = [];

  const generateFlatmap = (h: Header<any, any>) => {
    for (const subheader of h.subHeaders) {
      result.push(subheader);
      generateFlatmap(subheader);
    }
  };

  generateFlatmap(header);
  return result;
}
