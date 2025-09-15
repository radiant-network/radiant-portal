/// <reference types="cypress"/>
import { CommonSelectors } from './Selectors';

/**
 * Constant represents one minute
 */
export const oneMinute = 60 * 1000;

/**
 * Gets the column name from a columns array by column ID.
 * @param columns The array of column objects.
 * @param columnID The ID of the column.
 * @returns The column name, or 'undefined' if not found.
 */
export const getColumnName = (columns: any, columnID: string) => {
  const columnName: string | undefined = columns.find((col: { id: string }) => col.id === columnID)?.name;
  return columnName !== undefined ? columnName : 'undefined';
};

/**
 * Gets the position (index) of a column in the application table by column ID.
 * @param tableHead The table head.
 * @param columns The array of column objects.
 * @param columnID The ID of the column.
 * @returns A Cypress chain containing the column position (0-based) or -1 if not found
 */
export const getColumnPosition = (tableHead: string, columns: any, columnID: string) => {
  const columnName = getColumnName(columns, columnID);
  return cy
    .get(`${tableHead} ${CommonSelectors.tableCellHead}`)
    .should('be.visible')
    .then($cells => {
      let position;
      if (columnName.startsWith('[')) {
        position = Array.from($cells).findIndex($cell => {
          return Cypress.$($cell).find(columnName).length > 0;
        });
      } else {
        position = Array.from($cells).findIndex($cell => $cell.textContent?.match(stringToRegExp(columnName, true)));
      }

      return position;
    });
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
      return data.gene ? `https://www.omim.org/search?index=entry&start=1&limit=10&sort=score+desc%2C+prefix_sort+desc&search=${data.gene}` : undefined;
    case 'primary_condition':
      const conditionId = data.primary_condition_id.replace(/:/g, '_');
      return `http://purl.obolibrary.org/obo/${conditionId}`;
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
