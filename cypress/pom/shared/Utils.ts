/// <reference types="cypress"/>
import { CommonSelectors } from './Selectors';
import { CommonTexts } from './Texts';

/**
 * Constant represents one minute
 */
export const oneMinute = 60 * 1000;

/**
 * Builds a RegExp that matches either the English or French text from CommonTexts.
 * Special RegExp characters are automatically escaped.
 * @param commonTextsId The identifier key in CommonTexts (e.g., 'loginContent').
 * @returns A RegExp matching either EN or FR text exactly.
 */
export const buildBilingualRegExp = (commonTextsId: string): RegExp => {
  const escapeRegExp = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const keyOfCommonTextsId = commonTextsId as keyof typeof CommonTexts.en;

  const enValue = CommonTexts.en[keyOfCommonTextsId];
  const frValue = CommonTexts.fr[keyOfCommonTextsId];

  if (typeof enValue === 'function' || typeof frValue === 'function') {
    throw new Error(`buildBilingualRegExp does not support function values. Key: ${commonTextsId}`);
  }

  return new RegExp(`^(${escapeRegExp(enValue)}|${escapeRegExp(frValue)})$`);
};

/**
 * Resolves a facet configuration from its section name and facet id.
 * @param tableFacets The facets configuration of the zone (e.g., tableSNVFacets).
 * @param section The section name (e.g., 'Variant', 'Gene', 'Pathogenicity').
 * @param facet The facet id (e.g., 'chromosome', 'variant_type').
 * @throws Error if the section or facet is not found in the configuration.
 */
export const findFacetData = (tableFacets: any[], section: string, facet: string) => {
  const facetData = findSectionData(tableFacets, section).facets.find((f: any) => f.id === facet);

  if (!facetData) {
    throw new Error(`Facet "${facet}" not found in tableFacets section ${section}`);
  }
  return facetData;
};

/**
 * Resolves a facet section from its name.
 * Shared by the facet POM validations and the facet API tests (e.g., api/Occurrences/.../Count).
 * @param tableFacets The facets configuration of the zone (e.g., tableSNVFacets).
 * @param section The section name (e.g., 'Variant', 'Gene', 'Pathogenicity').
 * @throws Error if the section is not found in the configuration.
 */
export const findSectionData = <T extends { section: string; facets: unknown[] }>(tableFacets: T[], section: string): T => {
  const sectionData = tableFacets.find(s => s.section === section);

  if (!sectionData) {
    throw new Error(`Section "${section}" not found in tableFacets`);
  }
  return sectionData;
};

/**
 * Gets the color, display string and abbreviation associated with a classification.
 * @param classification The classification key (e.g., 'Benign', 'Likely_pathogenic', etc.).
 * @returns An object containing { color, display, abbrev } for the classification.
 */
export const getClass = (classification: string) => {
  const mapping: Record<string, { color: string; display: string; abbrev: string }> = {
    association: { color: 'neutral', display: 'Association', abbrev: 'AS' },
    association_not_found: { color: 'neutral', display: 'Association Not Found', abbrev: 'ANF' },
    Benign: { color: 'green', display: 'Benign', abbrev: 'B' },
    confers_sensitivity: { color: 'neutral', display: 'Confers Sensitivity', abbrev: 'CS' },
    Conflicting_classifications_of_pathogenicity: { color: 'orange', display: 'Conflict. Class. of Patho.', abbrev: 'CC' },
    Conflicting_interpretations_of_pathogenicity: { color: 'yellow', display: 'Conflict. Interpretat. of Patho.', abbrev: 'CI' },
    drug_response: { color: 'neutral', display: 'Drug Response', abbrev: 'DR' },
    established_risk_allele: { color: 'neutral', display: 'Established Risk Allele', abbrev: 'ERA' },
    Likely_benign: { color: 'lime', display: 'Likely Benign', abbrev: 'LB' },
    likely_oncogenic: { color: 'violet', display: 'Likely Oncogenic', abbrev: 'LO' },
    Likely_pathogenic: { color: 'orange', display: 'Likely Patho.', abbrev: 'LP' },
    Likely_risk_allele: { color: 'neutral', display: 'Likely Risk Allele', abbrev: 'LRA' },
    low_penetrance: { color: 'neutral', display: 'Low Penetrance', abbrev: 'LPN' },
    no_data: { color: 'neutral', display: 'No Data', abbrev: 'ND' },
    not_provided: { color: 'neutral', display: 'Not Provided', abbrev: 'NP' },
    oncogenic: { color: 'red', display: 'Oncogenic', abbrev: 'O' },
    other: { color: 'neutral', display: 'Other', abbrev: 'O' },
    Pathogenic: { color: 'red', display: 'Pathogenic', abbrev: 'P' },
    protective: { color: 'neutral', display: 'Protective', abbrev: 'PV' },
    risk_factor: { color: 'neutral', display: 'Risk Factor', abbrev: 'RF' },
    Uncertain_risk_allele: { color: 'neutral', display: 'Uncertain Risk Allele', abbrev: 'URA' },
    Uncertain_significance: { color: 'yellow', display: 'VUS', abbrev: 'VUS' },
  };

  return mapping[classification];
};

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
 * @param headRowSelector Optional selector to scope the lookup to a specific header row (e.g. `'tr:eq(1)'`) for tables with multi-level headers.
 * @returns A Cypress chain containing the column position (0-based) or -1 if not found
 */
export const getColumnPosition = (tableHead: string, columns: any, columnID: string, headRowSelector?: string) => {
  const columnName = getColumnName(columns, columnID);
  const baseSelector = headRowSelector ? `${tableHead} ${headRowSelector} ${CommonSelectors.tableCellHead}` : `${tableHead} ${CommonSelectors.tableCellHead}`;
  return cy.get(baseSelector).then($cells => {
    $cells.css('width', '125px'); // Widen columns for full name access
    let position;
    if (columnName.startsWith('[')) {
      position = Array.from($cells).findIndex($cell => {
        return Cypress.$($cell).find(columnName).length > 0;
      });
    } else if (columnName == '') {
      position = columns.find((col: { id: string }) => col.id === columnID)?.position;
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
 * Gets the display label associated with an external reference link.
 * @param ref The external reference key (e.g., 'clinvar', 'gnomad', 'dbsnp').
 * @returns The display label.
 */
export const getExternalRefDisplay = (ref: string) => {
  const mapping: Record<string, string> = {
    clinvar: 'ClinVar',
    dbsnp: 'dbSNP',
    gnomad: 'gnomAD',
  };

  return mapping[ref];
};

/**
 * Resolves a saved filter name to its UUID by reading the matching list item's
 * `data-cy` attribute in the manage-filters modal. The modal must be open.
 * @param name The saved filter name to look up.
 * @returns A Cypress chain yielding the UUID of the matching saved filter.
 */
export function getFilterIdByName(name: string): Cypress.Chainable<string> {
  return cy
    .get(`${CommonSelectors.modal} [data-cy^="list-item-action-"]`)
    .filter(`:contains("${name}")`)
    .invoke('attr', 'data-cy')
    .then(dataCy => (dataCy as string).replace('list-item-action-', ''));
}

/**
 * Gets the display string associated with a prediction score.
 * @param prediction The prediction score (e.g., 'loeuf', 'revel', etc.).
 * @returns The display string.
 */
export const getPredictionDisplay = (prediction: string) => {
  const mapping: Record<string, string> = {
    caddphred: 'CADD (Phred)',
    caddraw: 'CADD (Raw)',
    dann: 'DANN',
    fathmm: 'FATHMM',
    loeuf: 'LOEUF',
    lrt: 'LRT',
    phylop17way: 'PhyloP17Way',
    pli: 'pLI',
    polyphen2_hvar: 'PolyPhen-2 HVAR',
    revel: 'REVEL',
    sift: 'SIFT',
    spliceai: 'SpliceAI',
  };

  return mapping[prediction];
};

/**
 * Gets the color associated with a priority.
 * @param priority The priority (e.g., 'Routine', 'ASAP', etc.).
 * @returns The color string.
 */
export const getPriorityColor = (priority: string) => {
  const mapping: Record<string, string> = {
    Routine: 'grey',
    Urgent: 'blue',
    ASAP: 'amber',
    STAT: 'red',
  };

  return mapping[priority];
};

/**
 * Returns a settings checkbox by matching its label with a string or RegExp.
 * @param value Text or RegExp to match in the label.
 * @returns Cypress chainable for the matching checkbox(es).
 */
export function getSettingsCheckbox(value: string | RegExp) {
  if (typeof value === 'string') {
    return cy.get(CommonSelectors.settingsCheckbox(value));
  }
  return cy.get(CommonSelectors.settingsCheckbox('')).filter((_, el) => {
    const text = el.closest('[class*="items"]')?.textContent || '';
    return value.test(text);
  });
}

/**
 * Gets the color associated with a status.
 * @param priority The status (e.g., 'Completed', 'In Progress', etc.).
 * @returns The color string.
 */
export const getStatusColor = (status: string) => {
  const concatenatedStatus = status.replace(/\s+/g, '');
  const mapping: Record<string, string> = {
    Completed: 'green',
    Draft: 'neutral',
    InProgress: 'blue',
    Incomplete: 'orange',
    Revoke: 'red',
    Submitted: 'yellow',
    Unknown: 'blank',
  };

  return mapping[concatenatedStatus];
};

/**
 * Gets the icon associated with a status.
 * @param priority The status (e.g., 'Completed', 'In Progress', etc.).
 * @returns The icon string.
 */
export const getStatusIcon = (status: string) => {
  const concatenatedStatus = status.replace(/\s+/g, '');
  const mapping: Record<string, string> = {
    Completed: 'check',
    Draft: 'pen',
    InProgress: 'refresh-ccw',
    Incomplete: 'circle-dashed',
    Revoke: 'circle-x',
    Submitted: 'hourglass',
    Unknown: 'file-question',
  };

  return mapping[concatenatedStatus];
};

/**
 * Reads the total results count displayed by the results table.
 * There is a single results table on the variants page, so this is shared by all zones
 * (germline/somatic × snv/cnv) and the Query Builder oracle count.
 * @returns A Cypress chain yielding the total (0 when no results are displayed).
 */
export const getTableResultsCount = (): Cypress.Chainable<number> =>
  cy
    .get(CommonSelectors.tableIndexResult)
    .invoke('text')
    .then(parseResultsCount);

/**
 * Gets the text operateur associated with a symbol operator.
 * @param operator The symbol operator (e.g., 'between', '<', etc.).
 * @returns The text operateur.
 */
export const getTextOperator = (operator: string) => {
  const mapping: Record<string, string> = {
    '<': 'Less than',
    '<=': 'Less than or equal to',
    '>': 'Greater than',
    '>=': 'Greater than or equal to',
    between: 'Between',
    in: 'In',
  };

  return mapping[operator];
};

/**
 * Returns the URL for a given columnID and data object.
 * @param columnID The column identifier (e.g., 'dbsnp', 'gene', 'omim', etc.).
 * @param data The data object containing the necessary fields.
 * @returns The constructed URL as a string, or undefined if not applicable.
 */
export const getUrlLink = (columnID: string, data: any): string | undefined => {
  const strStart = data.start ? data.start.replace(/,/g, '') : '';
  const strEnd = data.end ? data.end.replace(/,/g, '') : '';
  switch (columnID) {
    case 'clingen':
      if (data.cnv_variant) return `https://search.clinicalgenome.org/kb/regions?page=1&type=GRCh38&region=chr${data.chromosome}%3A${strStart}-${strEnd}&size=25&search=`;
      if (data.gene) return `https://search.clinicalgenome.org/kb/genes?search=${data.gene}`;
      return undefined;
    case 'clinvar':
      return data.clinvar_name ? `https://www.ncbi.nlm.nih.gov/clinvar/variation/${data.clinvar_name}` : undefined;
    case 'cnv_variant':
      const DupDel = data.type == 'GAIN' ? 'DUP' : 'DEL';
      return data.cnv_variant ? `https://franklin.genoox.com/clinical-db/variant/sv/chr${data.chromosome}-${strStart}-${strEnd}-${DupDel}-HG38` : undefined;
    case 'cohort':
      return data.locus ? `https://bravo.sph.umich.edu/freeze8/hg38/variant/snv/${data.locus}` : undefined;
    case 'condition_mondo':
    case 'primary_condition':
      return data.primary_condition_id ? `http://purl.obolibrary.org/obo/${data.primary_condition_id.replace(/:/g, '_')}` : undefined;
    case 'dbsnp':
      return data.dbsnp ? `https://www.ncbi.nlm.nih.gov/snp/${data.dbsnp}` : undefined;
    case 'gene':
      return data.gene ? `https://www.omim.org/search?index=entry&start=1&limit=10&sort=score+desc%2C+prefix_sort+desc&search=${data.gene}` : undefined;
    case 'gnomad':
      return data.locus ? `https://gnomad.broadinstitute.org/variant/${data.locus}?dataset=gnomad_r3` : undefined;
    case 'link':
      if (data.omim_id) return `https://omim.org/entry/${data.omim_id}`;
      if (data.orphanet_id) return `https://www.orpha.net/en/disease/detail/${data.orphanet_id}`;
      if (data.hpo_id) return `https://hpo.jax.org/app/browse/term/${data.hpo_id}`;
      return undefined;
    case 'omim_phenotype':
      return data.omim_id ? `https://www.omim.org/entry/${data.omim_id}` : undefined;
    case 'rcv_link':
      return data.rcv_link ? `https://www.ncbi.nlm.nih.gov/clinvar/${data.rcv_link}.${data.version}` : undefined;
    case 'transcript_id':
      return data.transcript_id ? `https://www.ensembl.org/id/${data.transcript_id}` : undefined;
    default:
      return undefined;
  }
};

/**
 * Returns true if a value is considered "empty" (null, undefined, '', [], {}).
 * @param value The value to check.
 * @returns true if empty, false otherwise.
 */
export const isEmpty = (value: unknown): boolean => {
  if (value === null || value === undefined || value === '') return true;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value as object).length === 0;
  return false;
};

/**
 * Recursively normalizes a SQON captured from a `/count` request so it can be
 * compared structurally, independently of the data (QB-3 SQON validation).
 * Every group/pill `id` is dropped (group ids are volatile uuids) and every leaf
 * `value` array is replaced with a single `['_VALUE']` placeholder, keeping only
 * the structure (`op`, nesting) and `field` under scrutiny.
 * @param sqon The SQON node to normalize.
 * @returns A new normalized SQON node (the input is left untouched).
 */
export const normalizeSqon = (sqon: any): any => {
  const clone = JSON.parse(JSON.stringify(sqon));
  const walk = (node: any) => {
    if (Array.isArray(node)) {
      node.forEach(walk);
      return;
    }
    if (node && typeof node === 'object') {
      delete node.id;
      if (Array.isArray(node.content)) {
        walk(node.content); // group node → recurse into nested queries/pills
      } else if (node.content && typeof node.content === 'object' && 'value' in node.content) {
        node.content.value = ['_VALUE']; // leaf pill → neutralize the selected value(s)
      }
    }
  };
  walk(clone);
  return clone;
};

/**
 * Parses the total results count out of the table index result text (e.g. `1-20 of 1,234`).
 * @param text The raw text of the table element.
 * @returns The parsed total, or 0 when no `of N` segment is present (e.g. "No results").
 */
const parseResultsCount = (text: string): number => {
  const ofIndex = text.toLowerCase().indexOf(' of ');
  const digits = ofIndex === -1 ? '' : text.substring(ofIndex + 4).replace(/\D/g, '');
  return digits ? parseInt(digits, 10) : 0;
};

/**
 * Asserts the total results count displayed by the results table.
 * @param count The expected count (number or Cypress.Chainable yielding a number).
 * @param beEqual Whether the displayed count should be equal to `count` (default: true).
 */
export const shouldHaveTableResultsCount = (count: number | Cypress.Chainable<number>, beEqual: boolean = true) => {
  const compare = (expected: number) => {
    cy.get(CommonSelectors.tableIndexResult)
      .invoke('text')
      .should(text => {
        const current = parseResultsCount(text);
        if (beEqual) {
          expect(current).to.eq(expected);
        } else {
          expect(current).to.not.eq(expected);
        }
      });
  };
  if (typeof count === 'number') {
    compare(count);
  } else {
    count.then(compare);
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
