/// <reference types="cypress"/>
import { CommonSelectors } from 'pom/shared/Selectors';
import { getColumnPosition, getStatusColor, getStatusIcon, stringToRegExp } from 'pom/shared/Utils';

const selectors = {
  tab: '[data-cy="cases-tab"]',

  interpreted: {
    tableId: '[id="interpreted-cases"]',
  },
  uninterpreted: {
    tab: '[data-cy="uninterpreted-tab"]',
    tableId: '[id="uninterpreted-cases"]',
  },
};

const tableColumns = {
  interpreted: [
    {
      id: 'case',
      name: 'Case',
      apiField: 'case_id',
      isVisibleByDefault: true,
      pinByDefault: null,
      isSortable: false,
      isPinnable: true,
      position: 0,
      tooltip: null,
    },
    {
      id: 'date',
      name: 'Date',
      apiField: 'interpretation_updated_on',
      isVisibleByDefault: true,
      pinByDefault: null,
      isSortable: true,
      isPinnable: true,
      position: 1,
      tooltip: 'Last intepretation date',
    },
    {
      id: 'condition_mondo',
      name: 'Condition (Mondo)',
      apiField: 'condition_name',
      isVisibleByDefault: true,
      pinByDefault: null,
      isSortable: false,
      isPinnable: true,
      position: 2,
      tooltip: null,
    },
    {
      id: 'classification',
      name: 'Classification',
      apiField: 'classification',
      isVisibleByDefault: true,
      pinByDefault: null,
      isSortable: true,
      isPinnable: true,
      position: 3,
      tooltip: null,
    },
    {
      id: 'zygosity',
      name: 'Zygosity',
      apiField: 'zygosity',
      isVisibleByDefault: true,
      pinByDefault: null,
      isSortable: false,
      isPinnable: true,
      position: 4,
      tooltip: null,
    },
    {
      id: 'inheritance',
      name: 'Inheritance',
      apiField: 'inheritance_code',
      isVisibleByDefault: true,
      pinByDefault: null,
      isSortable: false,
      isPinnable: true,
      position: 5,
      tooltip: null,
    },
    {
      id: 'diag_lab',
      name: 'Diagnostic Lab',
      apiField: 'diagnosis_lab_code',
      isVisibleByDefault: true,
      pinByDefault: null,
      isSortable: false,
      isPinnable: true,
      position: 6,
      tooltip: 'Molecular diagnostic laboratory',
    },
    {
      id: 'analysis',
      name: 'Analysis',
      apiField: 'analysis_catalog_code',
      isVisibleByDefault: true,
      pinByDefault: null,
      isSortable: false,
      isPinnable: true,
      position: 7,
      tooltip: null,
    },
    {
      id: 'status',
      name: 'Status',
      apiField: 'status_code',
      isVisibleByDefault: true,
      pinByDefault: null,
      isSortable: true,
      isPinnable: true,
      position: 8,
      tooltip: null,
    },
  ],
  uninterpreted: [
    {
      id: 'case',
      name: 'Case',
      apiField: 'case_id',
      isVisibleByDefault: true,
      pinByDefault: null,
      isSortable: false,
      isPinnable: true,
      position: 0,
      tooltip: null,
    },
    {
      id: 'sequencing',
      name: 'Sequencing',
      apiField: 'seq_id',
      isVisibleByDefault: true,
      pinByDefault: null,
      isSortable: false,
      isPinnable: true,
      position: 1,
      tooltip: null,
    },
    {
      id: 'patient',
      name: 'Patient',
      apiField: 'patient_id',
      isVisibleByDefault: true,
      pinByDefault: null,
      isSortable: false,
      isPinnable: true,
      position: 2,
      tooltip: null,
    },
    {
      id: 'sample',
      name: 'Sample',
      apiField: 'submitter_sample_id',
      isVisibleByDefault: true,
      pinByDefault: null,
      isSortable: false,
      isPinnable: true,
      position: 3,
      tooltip: null,
    },
    {
      id: 'aff_status',
      name: 'Aff. Status',
      apiField: 'affected_status',
      isVisibleByDefault: true,
      pinByDefault: null,
      isSortable: false,
      isPinnable: true,
      position: 4,
      tooltip: 'Affected status',
    },
    {
      id: 'hpo',
      name: 'Phenotype (HPO)',
      apiField: '',
      isVisibleByDefault: true,
      pinByDefault: null,
      isSortable: false,
      isPinnable: true,
      position: 5,
      tooltip: null,
    },
    {
      id: 'zygosity',
      name: 'Zygosity',
      apiField: 'zygosity',
      isVisibleByDefault: true,
      pinByDefault: null,
      isSortable: false,
      isPinnable: true,
      position: 6,
      tooltip: null,
    },
    {
      id: 'diag_lab',
      name: 'Diagnostic Lab',
      apiField: 'diagnosis_lab_code',
      isVisibleByDefault: true,
      pinByDefault: null,
      isSortable: false,
      isPinnable: true,
      position: 7,
      tooltip: 'Molecular diagnostic laboratory',
    },
    {
      id: 'analysis',
      name: 'Analysis',
      apiField: 'analysis_catalog_code',
      isVisibleByDefault: true,
      pinByDefault: null,
      isSortable: false,
      isPinnable: true,
      position: 8,
      tooltip: null,
    },
    {
      id: 'status',
      name: 'Status',
      apiField: 'status_code',
      isVisibleByDefault: true,
      pinByDefault: null,
      isSortable: true,
      isPinnable: true,
      position: 9,
      tooltip: null,
    },
    {
      id: 'date',
      name: 'Date',
      apiField: 'created_on',
      isVisibleByDefault: true,
      pinByDefault: null,
      isSortable: true,
      isPinnable: true,
      position: 10,
      tooltip: 'Date received',
    },
  ],
};

const generateTableActionsFunctions = (tableId: string, columns: any[]) => ({
  /**
   * Clicks the link in a specific table cell for a given column.
   * @param columnID The ID of the column.
   */
  clickTableCellLink(columnID: string) {
    getColumnPosition(CommonSelectors.tableHead(tableId), columns, columnID).then(position => {
      if (position !== -1) {
        switch (columnID) {
          default:
            cy.get(CommonSelectors.tableRow(tableId)).eq(0).find(CommonSelectors.tableCellData).eq(position).find(CommonSelectors.link).clickAndWait({ force: true });
            break;
        }
      } else {
        cy.handleColumnNotFound(columnID);
      }
    });
  },
  /**
   * Pins a column in the table by its ID.
   * @param columnID The ID of the column to pin.
   */
  pinColumn(columnID: string) {
    cy.then(() =>
      getColumnPosition(CommonSelectors.tableHead(tableId), columns, columnID).then(position => {
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
      getColumnPosition(CommonSelectors.tableHead(tableId), columns, columnID).then(position => {
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
      getColumnPosition(CommonSelectors.tableHead(tableId), columns, columnID).then(position => {
        cy.unpinColumn(position, tableId);
      })
    );
  },
});

const generateTableValidationsFunctions = (tableId: string, columns: any[], customColumnContent?: (columnID: string, data: any, position: number) => void) => ({
  /**
   * Checks that the drawer is displayed.
   * @param dataVariant The variant object.
   */
  shouldDrawerOpen(dataVariant: any) {
    cy.get(CommonSelectors.animateIn).contains(dataVariant.variant).should('exist');
  },
  /**
   * Validates the value of the first row for a given column.
   * @param value The expected value (string or RegExp).
   * @param columnID The ID of the column to check.
   */
  shouldHaveFirstRowValue(value: string | RegExp, columnID: string) {
    cy.then(() =>
      getColumnPosition(CommonSelectors.tableHead(tableId), columns, columnID).then(position => {
        cy.validateTableFirstRowContent(value, position);
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
    columns.forEach(column => {
      if (column.name.startsWith('[')) {
        cy.get(CommonSelectors.tableHeadCell(tableId)).eq(column.position).find(column.name).should('exist');
      } else {
        cy.get(CommonSelectors.tableHeadCell(tableId)).eq(column.position).contains(stringToRegExp(column.name, true /*exact*/)).should('exist');
      }
    });
  },
  /**
   * Validates the content of a specific column in the table for a given data.
   * @param columnID The ID of the column to validate.
   * @param data The data object containing the expected values.
   */
  shouldShowColumnContent(columnID: string, data: any) {
    getColumnPosition(CommonSelectors.tableHead(tableId), columns, columnID).then(position => {
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
            cy.get(CommonSelectors.tableHeadCell(tableId)).eq(position).shouldBePinnable(column.isPinnable);
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
      getColumnPosition(CommonSelectors.tableHead(tableId), columns, columnID).then(position => {
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
            cy.get(CommonSelectors.tableHeadCell(tableId)).eq(position).shouldBeSortable(column.isSortable);
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
      getColumnPosition(CommonSelectors.tableHead(tableId), columns, columnID).then(position => {
        cy.get(CommonSelectors.tableHeadCell(tableId)).eq(position).shouldBePinned(null);
      })
    );
  },
  /**
   * Validates the sorting functionality of a column.
   * @param columnID The ID of the column to sort.
   */
  shouldSortColumn(columnID: string, sortAction: () => void) {
    cy.then(() =>
      getColumnPosition(CommonSelectors.tableHead(tableId), columns, columnID).then(position => {
        if (position !== -1) {
          sortAction();
          cy.get(CommonSelectors.tableRow(tableId))
            .eq(0)
            .find(CommonSelectors.tableCellData)
            .eq(position)
            .invoke('text')
            .then(biggestValue => {
              const biggest = biggestValue.trim();

              sortAction();
              cy.get(CommonSelectors.tableRow(tableId))
                .eq(0)
                .find(CommonSelectors.tableCellData)
                .eq(position)
                .invoke('text')
                .then(smallestValue => {
                  const smallest = smallestValue.trim();
                  if (biggest.localeCompare(smallest) < 0) {
                    throw new Error(`Error: "${biggest}" should be >= "${smallest}"`);
                  }
                });
            });
        }
      })
    );
  },
});

const interpretedColumnContentHandler = (columnID: string, dataInterpreted: any, position: number) => {
  const tableId = selectors.interpreted.tableId;
  switch (columnID) {
    case 'expand':
      cy.validateTableFirstRowClass(CommonSelectors.expandIcon, position, tableId);
      break;
    case 'case':
      cy.validateTableFirstRowContent(dataInterpreted[columnID], position, tableId);
      cy.validateTableFirstRowContent(dataInterpreted.relationship, position, tableId);
      cy.validateTableFirstRowClass(CommonSelectors.tagBlank, position, tableId);
      break;
    case 'condition_mondo':
      cy.validateTableFirstRowContent(dataInterpreted[columnID], position, tableId);
      cy.validateTableFirstRowContent(dataInterpreted.mondo_id, position, tableId);
      break;
    case 'classification':
      cy.validateTableFirstRowContent(dataInterpreted[columnID], position, tableId);
      cy.validateTableFirstRowClass(CommonSelectors.tag('orange'), position, tableId);
      break;
    case 'zygosity':
      cy.validateTableFirstRowContent(dataInterpreted[columnID], position, tableId);
      cy.validateTableFirstRowClass(CommonSelectors.tagBlank, position, tableId);
      break;
    case 'status':
      cy.validateTableFirstRowContent(dataInterpreted[columnID], position);
      cy.validateTableFirstRowClass(CommonSelectors.statusIcon(getStatusIcon(dataInterpreted[columnID])), position, tableId);
      cy.validateTableFirstRowClass(CommonSelectors.tag(getStatusColor(dataInterpreted[columnID])), position, tableId);
      break;
    default:
      cy.validateTableFirstRowContent(dataInterpreted[columnID], position, tableId);
      break;
  }
};

const uninterpretedColumnContentHandler = (columnID: string, dataUninterpreted: any, position: number) => {
  const tableId = selectors.uninterpreted.tableId;
  switch (columnID) {
    case 'case':
      cy.validateTableFirstRowContent(dataUninterpreted[columnID], position, tableId);
      cy.validateTableFirstRowContent(dataUninterpreted.relationship, position, tableId);
      cy.validateTableFirstRowClass(CommonSelectors.tagBlank, position, tableId);
      break;
    case 'aff_status':
      cy.validateTableFirstRowContent(dataUninterpreted[columnID], position, tableId);
      cy.validateTableFirstRowClass(CommonSelectors.tag('red'), position, tableId);
      break;
    case 'zygosity':
      cy.validateTableFirstRowContent(dataUninterpreted[columnID], position, tableId);
      cy.validateTableFirstRowClass(CommonSelectors.tagBlank, position, tableId);
      break;
    case 'status':
      cy.validateTableFirstRowContent(dataUninterpreted[columnID], position, tableId);
      cy.validateTableFirstRowClass(CommonSelectors.statusIcon(getStatusIcon(dataUninterpreted[columnID])), position, tableId);
      cy.validateTableFirstRowClass(CommonSelectors.tag(getStatusColor(dataUninterpreted[columnID])), position, tableId);
      break;
    default:
      cy.validateTableFirstRowContent(dataUninterpreted[columnID], position, tableId);
      break;
  }
};

export const VariantEntity_Patients = {
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

  interpreted: {
    actions: generateTableActionsFunctions(selectors.interpreted.tableId, tableColumns.interpreted),
    validations: (() => {
      const actions = generateTableActionsFunctions(selectors.interpreted.tableId, tableColumns.interpreted);
      const baseValidations = generateTableValidationsFunctions(selectors.interpreted.tableId, tableColumns.interpreted, interpretedColumnContentHandler);
      return {
        ...baseValidations,
        shouldSortColumn(columnID: string) {
          baseValidations.shouldSortColumn(columnID, () => actions.sortColumn(columnID));
        },
      };
    })(),
  },
  uninterpreted: {
    actions: (() => {
      const baseActions = generateTableActionsFunctions(selectors.uninterpreted.tableId, tableColumns.uninterpreted);
      return {
        ...baseActions,
        /**
         * Select the tab to show the table.
         */
        selectTab() {
          cy.get(selectors.uninterpreted.tab).click({ force: true });
        },
      };
    })(),
    validations: (() => {
      const actions = generateTableActionsFunctions(selectors.uninterpreted.tableId, tableColumns.uninterpreted);
      const baseValidations = generateTableValidationsFunctions(selectors.uninterpreted.tableId, tableColumns.uninterpreted, uninterpretedColumnContentHandler);
      return {
        ...baseValidations,
        shouldSortColumn(columnID: string) {
          baseValidations.shouldSortColumn(columnID, () => actions.sortColumn(columnID));
        },
      };
    })(),
  },
};
