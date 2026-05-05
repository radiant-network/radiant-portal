/// <reference types="cypress"/>
import { CommonSelectors } from 'pom/shared/Selectors';
import { getColumnPosition, getUrlLink, stringToRegExp } from 'pom/shared/Utils';

const selectors = {
  tab: '[data-cy="frequency-tab"]',

  publicCohorts: {
    tableId: '[data-cy="public-cohorts-table"]',
  },
  myNetwork: {
    tableId: '[id="primary_condition_tab"]',
    tableHeadRow: 'tr:eq(1)',
  },
};

const tableColumns = {
  publicCohorts: [
    {
      id: 'cohort',
      name: 'Cohort',
      apiField: 'cohort',
      isVisibleByDefault: true,
      pinByDefault: null,
      isSortable: false,
      isPinnable: false,
      position: 0,
      tooltip: null,
    },
    {
      id: 'alt',
      name: '# ALT Alleles',
      apiField: 'ac',
      isVisibleByDefault: true,
      pinByDefault: null,
      isSortable: false,
      isPinnable: false,
      position: 1,
      tooltip: 'Number of alternative alleles',
    },
    {
      id: 'alt_ref',
      name: '# Alleles (ALT + REF)',
      apiField: 'an',
      isVisibleByDefault: true,
      pinByDefault: null,
      isSortable: false,
      isPinnable: false,
      position: 2,
      tooltip: 'Number of alternative alleles + reference alleles',
    },
    {
      id: 'homo',
      name: '# Homo',
      apiField: 'hom',
      isVisibleByDefault: true,
      pinByDefault: null,
      isSortable: false,
      isPinnable: false,
      position: 3,
      tooltip: 'Number of homozygote variants',
    },
    {
      id: 'freq',
      name: 'Frequency',
      apiField: 'af',
      isVisibleByDefault: true,
      pinByDefault: null,
      isSortable: false,
      isPinnable: false,
      position: 4,
      tooltip: 'Allele Frequency',
    },
  ],
  myNetwork: [
    {
      id: 'primary_condition',
      name: 'Primary Condition',
      apiField: 'split_value_code',
      isVisibleByDefault: true,
      pinByDefault: null,
      isSortable: true,
      isPinnable: true,
      position: 0,
      tooltip: null,
    },
    {
      id: 'freq_all',
      name: '', // Frequency (headers à 2 niveaux avec labels dupliqués)
      apiField: 'frequencies.pc_all',
      isVisibleByDefault: true,
      pinByDefault: null,
      isSortable: true,
      isPinnable: true,
      position: 1,
      tooltip: null,
    },
    {
      id: 'homo_all',
      name: '', // Homozygotes (headers à 2 niveaux avec labels dupliqués)
      apiField: 'frequencies.hom_all',
      isVisibleByDefault: true,
      pinByDefault: null,
      isSortable: true,
      isPinnable: true,
      position: 2,
      tooltip: null,
    },
    {
      id: 'freq_affected',
      name: '', // Frequency (headers à 2 niveaux avec labels dupliqués)
      apiField: 'frequencies.pc_affected',
      isVisibleByDefault: true,
      pinByDefault: null,
      isSortable: true,
      isPinnable: true,
      position: 3,
      tooltip: null,
    },
    {
      id: 'homo_affected',
      name: '', // Homozygotes (headers à 2 niveaux avec labels dupliqués)
      apiField: 'frequencies.hom_affected',
      isVisibleByDefault: true,
      pinByDefault: null,
      isSortable: true,
      isPinnable: true,
      position: 4,
      tooltip: null,
    },
    {
      id: 'freq_non_affected',
      name: '', // Frequency (headers à 2 niveaux avec labels dupliqués)
      apiField: 'frequencies.pc_non_affected',
      isVisibleByDefault: true,
      pinByDefault: null,
      isSortable: true,
      isPinnable: true,
      position: 5,
      tooltip: null,
    },
    {
      id: 'homo_non_affected',
      name: '', // Homozygotes (headers à 2 niveaux avec labels dupliqués)
      apiField: 'frequencies.hom_non_affected',
      isVisibleByDefault: true,
      pinByDefault: null,
      isSortable: true,
      isPinnable: true,
      position: 6,
      tooltip: null,
    },
  ],
};

/**
 * Generates the set of table action functions (pin, sort, unpin) for a given table.
 * @param tableId The table selector.
 * @param columns The array of column objects.
 * @param headRowSelector Optional selector to scope header lookups to a specific row (e.g. `'tr:eq(1)'`) for tables with multi-level headers.
 */
const generateTableActionsFunctions = (tableId: string, columns: any[], headRowSelector?: string) => ({
  /**
   * Pins a column in the table by its ID.
   * @param columnID The ID of the column to pin.
   */
  pinColumn(columnID: string) {
    cy.then(() =>
      getColumnPosition(CommonSelectors.tableHead(tableId), columns, columnID, headRowSelector).then(position => {
        cy.pinColumn(position, tableId);
      })
    );
  },
  /**
   * Sorts a column, optionally using an intercept.
   * @param columnID The ID of the column to sort.
   */
  sortColumn(columnID: string) {
    cy.then(() =>
      getColumnPosition(CommonSelectors.tableHead(tableId), columns, columnID, headRowSelector).then(position => {
        if (position !== -1) {
          cy.sortTableAndWait(position, tableId);
        } else {
          cy.handleColumnNotFound(columnID);
        }
      })
    );
  },
  /**
   * Unpins a column in the table by its ID.
   * @param columnID The ID of the column to unpin.
   */
  unpinColumn(columnID: string) {
    cy.then(() =>
      getColumnPosition(CommonSelectors.tableHead(tableId), columns, columnID, headRowSelector).then(position => {
        cy.unpinColumn(position, tableId);
      })
    );
  },
});

/**
 * Generates the set of table validation functions (visibility, pin, sort, column content, etc.) for a given table.
 * @param tableId The table selector.
 * @param columns The array of column objects.
 * @param customColumnContent Optional handler to customize how each column's content is validated.
 * @param headRowSelector Optional selector to scope header lookups to a specific row (e.g. `'tr:eq(1)'`) for tables with multi-level headers.
 */
const generateTableValidationsFunctions = (tableId: string, columns: any[], customColumnContent?: (columnID: string, data: any, position: number) => void, headRowSelector?: string) => ({
  /**
   * Validates the value of the first row for a given column.
   * @param value The expected value (string or RegExp).
   * @param columnID The ID of the column to check.
   */
  shouldHaveFirstRowValue(value: string | RegExp, columnID: string) {
    cy.then(() =>
      getColumnPosition(CommonSelectors.tableHead(tableId), columns, columnID, headRowSelector).then(position => {
        cy.validateTableFirstRowContent(value, position);
      })
    );
  },
  /**
   * Validates the link in a specific table cell for a given cohort and column.
   * @param dataVariant The variant object.
   * @param columnID The ID of the column.
   */
  shouldHaveTableCellLink(dataVariant: any, columnID: string) {
    cy.then(() =>
      getColumnPosition(CommonSelectors.tableHead(tableId), columns, columnID, headRowSelector).then(position => {
        if (position !== -1) {
          cy.get(CommonSelectors.tableRow(tableId)).eq(0).find(CommonSelectors.tableCellData).eq(position).find(CommonSelectors.link).should('have.attr', 'href', getUrlLink(columnID, dataVariant));
        } else {
          cy.handleColumnNotFound(columnID);
        }
      })
    );
  },
  /**
   * Validates the default visibility of each column.
   */
  shouldMatchDefaultColumnVisibility() {
    columns.forEach(column => {
      const expectedExist = column.isVisibleByDefault ? 'exist' : 'not.exist';
      if (column.name.startsWith('[')) {
        cy.get(CommonSelectors.tableHead(tableId)).find(column.name).should(expectedExist);
      } else {
        cy.get(CommonSelectors.tableHead(tableId)).contains(stringToRegExp(column.name, true /*exact*/)).should(expectedExist);
      }
    });
  },
  /**
   * Validates the default pin state of each column.
   */
  shouldMatchDefaultPinnedColumns() {
    columns.forEach(column => {
      cy.then(() =>
        getColumnPosition(CommonSelectors.tableHead(tableId), columns, column.id).then(position => {
          if (position !== -1) {
            cy.get(CommonSelectors.tableHeadCell(tableId))
              .eq(position)
              .shouldBePinned(column.pinByDefault as 'right' | 'left' | null);
          } else {
            cy.handleColumnNotFound(column.id);
          }
        })
      );
    });
  },
  /**
   * Validates that all columns are displayed in the correct order in the table.
   */
  shouldShowAllColumns() {
    const baseSelector = headRowSelector ? `${CommonSelectors.tableHead(tableId)} ${headRowSelector} ${CommonSelectors.tableCellHead}` : `${CommonSelectors.tableHead(tableId)} ${CommonSelectors.tableCellHead}`;
    columns.forEach(column => {
      if (column.name.startsWith('[')) {
        cy.get(baseSelector).eq(column.position).find(column.name).should('exist');
      } else {
        cy.get(baseSelector).eq(column.position).contains(stringToRegExp(column.name, true /*exact*/)).should('exist');
      }
    });
  },
  /**
   * Validates the content of a specific column in the table for a given data.
   * @param columnID The ID of the column to validate.
   * @param data The data object containing the expected values.
   */
  shouldShowColumnContent(columnID: string, data: any) {
    getColumnPosition(CommonSelectors.tableHead(tableId), columns, columnID, headRowSelector).then(position => {
      if (position !== -1) {
        if (customColumnContent) {
          customColumnContent(columnID, data, position);
        } else {
          // Comportement par défaut
          cy.validateTableFirstRowContent(data[columnID], position, tableId);
        }
      } else {
        cy.handleColumnNotFound(columnID);
      }
    });
  },
  /**
   * Validates the tooltips on columns.
   */
  shouldShowColumnTooltips() {
    columns.forEach(column => {
      cy.then(() =>
        getColumnPosition(CommonSelectors.tableHead(tableId), columns, column.id).then(position => {
          if (position !== -1) {
            cy.get(CommonSelectors.tableHeadCell(tableId)).eq(position).shouldHaveTooltip(column);
          } else {
            cy.handleColumnNotFound(column.id);
          }
        })
      );
    });
  },
  /**
   * Validates that pinnable columns are correctly marked as pinnable.
   */
  shouldShowPinnableColumns() {
    columns.forEach(column => {
      cy.then(() =>
        getColumnPosition(CommonSelectors.tableHead(tableId), columns, column.id).then(position => {
          if (position !== -1) {
            const baseSelector = headRowSelector ? `${CommonSelectors.tableHead(tableId)} ${headRowSelector} ${CommonSelectors.tableCellHead}` : `${CommonSelectors.tableHead(tableId)} ${CommonSelectors.tableCellHead}`;
            cy.get(baseSelector).eq(position).shouldBePinnable(column.isPinnable);
          } else {
            cy.handleColumnNotFound(column.id);
          }
        })
      );
    });
  },
  /**
   * Validates that a specific column is pinned.
   * @param columnID The ID of the column to check.
   */
  shouldPinnedColumn(columnID: string) {
    cy.then(() =>
      getColumnPosition(CommonSelectors.tableHead(tableId), columns, columnID, headRowSelector).then(position => {
        cy.get(CommonSelectors.tableHeadCell(tableId)).eq(position).shouldBePinned('left');
      })
    );
  },
  /**
   * Validates that sortable columns are correctly marked as sortable.
   */
  shouldShowSortableColumns() {
    columns.forEach(column => {
      cy.then(() =>
        getColumnPosition(CommonSelectors.tableHead(tableId), columns, column.id).then(position => {
          if (position !== -1) {
            const baseSelector = headRowSelector ? `${CommonSelectors.tableHead(tableId)} ${headRowSelector} ${CommonSelectors.tableCellHead}` : `${CommonSelectors.tableHead(tableId)} ${CommonSelectors.tableCellHead}`;
            cy.get(baseSelector).eq(position).shouldBeSortable(column.isSortable);
          } else {
            cy.handleColumnNotFound(column.id);
          }
        })
      );
    });
  },
  /**
   * Validates that a specific column is unpinned.
   * @param columnID The ID of the column to check.
   */
  shouldUnpinnedColumn(columnID: string) {
    cy.then(() =>
      getColumnPosition(CommonSelectors.tableHead(tableId), columns, columnID, headRowSelector).then(position => {
        cy.get(CommonSelectors.tableHeadCell(tableId)).eq(position).shouldBePinned(null);
      })
    );
  },
  /**
   * Validates the sorting functionality of a column.
   * @param columnID The ID of the column to sort.
   * @param hasUniqueValues The data of the column to sort has unique values.
   * @param isReverseSorting The first sort of the column is Ascending (compare to Descending by default).
   */
  shouldSortColumn(columnID: string, hasUniqueValues: boolean, isReverseSorting: boolean, sortAction: () => void) {
    cy.then(() =>
      getColumnPosition(CommonSelectors.tableHead(tableId), columns, columnID, headRowSelector).then(position => {
        if (position !== -1) {
          sortAction();
          cy.get(CommonSelectors.tableRow(tableId))
            .eq(0)
            .find(CommonSelectors.tableCellData)
            .eq(position)
            .invoke('text')
            .then(biggestValue => {
              const biggest = biggestValue.trim() === '-' ? 'zzz' : biggestValue.trim();

              sortAction();
              cy.get(CommonSelectors.tableRow(tableId))
                .eq(0)
                .find(CommonSelectors.tableCellData)
                .eq(position)
                .invoke('text')
                .then(smallestValue => {
                  const smallest = smallestValue.trim();
                  if (hasUniqueValues) {
                    if (biggest.localeCompare(smallest) !== 0) {
                      throw new Error(`Error: "${biggest}" should be equal to "${smallest}" (unique values expected)`);
                    }
                  } else if (!isReverseSorting && biggest.localeCompare(smallest) <= 0) {
                    throw new Error(`Error: "${biggest}" should be > "${smallest}"`);
                    throw new Error(`Error: "${biggest}" should be > "${smallest}"`);
                  } else if (isReverseSorting && biggest.localeCompare(smallest) >= 0) {
                    throw new Error(`Error: "${biggest}" should be < "${smallest}"`);
                  }
                });
            });
        }
      })
    );
  },
});

const publicCohortsColumnContentHandler = (columnID: string, datapublicCohorts: any, position: number) => {
  const tableId = selectors.publicCohorts.tableId;
  switch (columnID) {
    default:
      cy.validateTableFirstRowContent(datapublicCohorts[columnID], position, tableId);
      break;
  }
};

const myNetworkColumnContentHandler = (columnID: string, dataMyNetwork: any, position: number) => {
  const tableId = selectors.myNetwork.tableId;
  switch (columnID) {
    case 'primary_condition':
      cy.validateTableFirstRowContent(dataMyNetwork.primary_condition_name, position);
      break;
    default:
      cy.validateTableFirstRowContent(dataMyNetwork[columnID], position, tableId);
      break;
  }
};

export const VariantEntity_Frequency = {
  validations: {
    /**
     * Checks that the tab is active.
     */
    shouldHaveActiveTab() {
      cy.get(selectors.tab).shouldBeActiveTab();
    },
    /**
     * Validates the title of the page.
     * @param dataVariant The variant object.
     */
    shouldHaveTitle(dataVariant: any) {
      cy.get(CommonSelectors.title).contains(dataVariant.variant).should('exist');
    },
  },

  publicCohorts: {
    actions: generateTableActionsFunctions(selectors.publicCohorts.tableId, tableColumns.publicCohorts),
    validations: (() => {
      const actions = generateTableActionsFunctions(selectors.publicCohorts.tableId, tableColumns.publicCohorts);
      const baseValidations = generateTableValidationsFunctions(selectors.publicCohorts.tableId, tableColumns.publicCohorts, publicCohortsColumnContentHandler);
      return {
        ...baseValidations,
        shouldShowColumnContent(columnID: string, data: any) {
          baseValidations.shouldShowColumnContent(columnID, data);
        },
        shouldSortColumn(columnID: string, hasUniqueValues: boolean, isReverseSorting: boolean) {
          baseValidations.shouldSortColumn(columnID, hasUniqueValues, isReverseSorting, () => actions.sortColumn(columnID));
        },
      };
    })(),
  },

  myNetwork: {
    actions: generateTableActionsFunctions(selectors.myNetwork.tableId, tableColumns.myNetwork, selectors.myNetwork.tableHeadRow),
    validations: (() => {
      const actions = generateTableActionsFunctions(selectors.myNetwork.tableId, tableColumns.myNetwork, selectors.myNetwork.tableHeadRow);
      const baseValidations = generateTableValidationsFunctions(selectors.myNetwork.tableId, tableColumns.myNetwork, myNetworkColumnContentHandler, selectors.myNetwork.tableHeadRow);
      return {
        ...baseValidations,
        shouldShowColumnContent(columnID: string, data: any) {
          baseValidations.shouldShowColumnContent(columnID, data);
        },
        shouldSortColumn(columnID: string, hasUniqueValues: boolean, isReverseSorting: boolean) {
          baseValidations.shouldSortColumn(columnID, hasUniqueValues, isReverseSorting, () => actions.sortColumn(columnID));
        },
      };
    })(),
  },
};
