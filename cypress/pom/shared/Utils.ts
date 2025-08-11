/// <reference types="cypress"/>

/**
 * Constant represents one minute
 */
export const oneMinute = 60*1000;

/**
 * Formats a number to a string with 'K' for thousands (e.g., 13677 -> '13.7K').
 * @param value The value to format (string or number).
 * @returns The formatted string.
 */
export const formatToK = (value: string | number): string => {
  const num = typeof value === 'string' ? parseInt(value, 10) : value;
  
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  };

  return num.toString();
};

/**
 * Formats a number to a string with a comma as the thousands separator (e.g., 13677 -> '13,677').
 * If a RegExp is provided, returns its source.
 * @param value The value to format (string, number, or RegExp).
 * @returns The formatted string.
 */
export const formatWithCommaThousands = (value: string | RegExp | number): string => {
  if (value instanceof RegExp) {
    return value.source;
  }
  const num = typeof value === 'string' ? parseInt(value, 10) : value;
  return num.toLocaleString('en-EN').replace(/\u202f/g, ',');
};

/**
 * Gets the column name from a columns array by column ID.
 * @param columns The array of column objects.
 * @param columnID The ID of the column.
 * @returns The column name, or 'undefined' if not found.
 */
export const getColumnName = (columns: any, columnID: string) => {
  const columnName: string | undefined = columns.find((col: { id: string; }) => col.id === columnID)?.name;
  return columnName !== undefined ? columnName : 'undefined';
};

/**
 * Gets the position (index) of a column from a columns array by column ID.
 * @param columns The array of column objects.
 * @param columnID The ID of the column.
 * @returns The column position, or -1 if not found.
 */
export const getColumnPosition = (columns: any, columnID: string) => {
  const columnPosition: number | undefined = columns.find((col: { id: string; }) => col.id === columnID)?.position;
  return columnPosition !== undefined ? columnPosition : -1;
};

/**
 * Returns the current date and time as formatted strings.
 * @returns An object containing:
 *  - strDate: the date in YYYYMMDD format
 *  - strTime: the time in HHMM format
 */
export const getDateTime = () => {
    const date = new Date();
    const joinWithPadding = (l: number[]) => l.reduce((xs, x) => xs + `${x}`.padStart(2, '0'), '');
    const strDate = joinWithPadding([date.getFullYear(), date.getMonth() + 1, date.getDate()]);
    const strTime = joinWithPadding([date.getHours(), date.getMinutes()]);

    return { strDate, strTime };
};

/**
 * Extracts the position from a variant string like 'chrX:g.123403094G>A'
 * and returns it formatted with spaces as thousands separators (e.g., '123 403 094').
 * @param data The data object containing the necessary fields.
 * @returns The formatted position string, or an empty string if not found.
 */
export const getStartPosition = (data: any): string => {
  const match = data.variant.match(/^chr\w+:g\.(\d+)[ACGT]?>[ACGT]?/i);
  if (!match) return '';
  const pos = match[1];
  return formatWithCommaThousands(pos);
};

/**
 * Returns the URL for a given columnID and data object.
 * @param columnID The column identifier (e.g., 'dbsnp', 'gene', 'omim', etc.).
 * @param data The data object containing the necessary fields.
 * @returns The constructed URL as a string, or undefined if not applicable.
 */
export const getUrlLink = (columnID: string, data: any): string | undefined => {
  switch (columnID) {
    case 'dbsnp':
      return data.dbsnp ? `https://www.ncbi.nlm.nih.gov/snp/${data.dbsnp}` : undefined;
    case 'gene':
    case 'omim':
      return data.omimID ? `https://www.omim.org/entry/${data.omimID}` : undefined;
    case 'clinvar':
      return data.clinvarID ? `https://www.ncbi.nlm.nih.gov/clinvar/variation/${data.clinvarID}` : undefined;
    case 'participants':
      return data.clinvarID ? `https://www.ncbi.nlm.nih.gov/clinvar/variation/${data.clinvarID}` : undefined;
    default:
      return undefined;
  }
};

/**
 * Converts a string to a RegExp.
 * Optionally adds ^ and $ to match the whole string.
 * @param str The string to convert.
 * @param exact If true, adds ^ and $ to the pattern (default: false).
 * @returns The constructed RegExp.
 */
export const stringToRegExp = (str: string, exact: boolean = false): RegExp => {
  const replacedStr = str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regexpStr = exact ? `^${replacedStr}$` : replacedStr;
  return new RegExp(regexpStr);
};