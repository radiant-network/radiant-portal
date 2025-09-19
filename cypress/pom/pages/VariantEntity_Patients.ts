/// <reference types="cypress"/>
import { CommonSelectors } from 'pom/shared/Selectors';
import { getColumnPosition, getStatusColor, getStatusIcon, stringToRegExp } from 'pom/shared/Utils';

const selectors = {
  tab: '[class*= "group-data-[active=true]"]:contains("Patients")',

  interpreted: {
    tableId: '[id="interpreted-cases"]',
  },
  uninterpreted: {
    tab: '[class*= "group-data-[active=true]"]:contains("Non-interpreted")',
    tableId: '[id="uninterpreted-cases"]',
  },
};

const tableColumns = {
  interpreted: [
    {
      id: 'expand',
      name: '',
      apiField: '',
      isVisibleByDefault: true,
      isSortable: false,
      position: 0,
      tooltip: null,
    },
    {
      id: 'case',
      name: 'Case',
      apiField: 'case_id',
      isVisibleByDefault: true,
      isSortable: false,
      position: 1,
      tooltip: null,
    },
    {
      id: 'date',
      name: 'Date',
      apiField: 'interpretation_updated_on',
      isVisibleByDefault: true,
      isSortable: true,
      position: 2,
      tooltip: 'Last intepretation date',
    },
    {
      id: 'condition_mondo',
      name: 'Condition (Mondo)',
      apiField: 'condition_name',
      isVisibleByDefault: true,
      isSortable: false,
      position: 3,
      tooltip: null,
    },
    {
      id: 'classification',
      name: 'Classification',
      apiField: 'classification',
      isVisibleByDefault: true,
      isSortable: true,
      position: 4,
      tooltip: null,
    },
    {
      id: 'zygosity',
      name: 'Zygosity',
      apiField: 'zygosity',
      isVisibleByDefault: true,
      isSortable: false,
      position: 5,
      tooltip: null,
    },
    {
      id: 'inheritance',
      name: 'Inheritance',
      apiField: 'inheritance_code',
      isVisibleByDefault: true,
      isSortable: false,
      position: 6,
      tooltip: null,
    },
    {
      id: 'diag_lab',
      name: 'Diagnostic Lab',
      apiField: 'performer_lab_code',
      isVisibleByDefault: true,
      isSortable: false,
      position: 7,
      tooltip: null,
    },
    {
      id: 'analysis',
      name: 'Analysis',
      apiField: 'case_analysis_code',
      isVisibleByDefault: true,
      isSortable: false,
      position: 8,
      tooltip: null,
    },
    {
      id: 'status',
      name: 'Status',
      apiField: 'status_code',
      isVisibleByDefault: true,
      isSortable: true,
      position: 9,
      tooltip: null,
    },
  ],
  uninterpreted: [
    {
      id: 'case',
      name: 'Case',
      apiField: 'case_id',
      isVisibleByDefault: true,
      isSortable: false,
      position: 0,
      tooltip: null,
    },
    {
      id: 'assay',
      name: 'Assay',
      apiField: 'seq_id',
      isVisibleByDefault: true,
      isSortable: false,
      position: 1,
      tooltip: null,
    },
    {
      id: 'patient',
      name: 'Patient',
      apiField: 'patient_id',
      isVisibleByDefault: true,
      isSortable: false,
      position: 2,
      tooltip: null,
    },
    {
      id: 'sample',
      name: 'Sample',
      apiField: 'submitter_sample_id',
      isVisibleByDefault: true,
      isSortable: false,
      position: 3,
      tooltip: null,
    },
    {
      id: 'aff_status',
      name: 'Aff. Status',
      apiField: 'affected_status',
      isVisibleByDefault: true,
      isSortable: false,
      position: 4,
      tooltip: null,
    },
    {
      id: 'hpo',
      name: 'Phenotype (HPO)',
      apiField: '',
      isVisibleByDefault: true,
      isSortable: false,
      position: 5,
      tooltip: null,
    },
    {
      id: 'zygosity',
      name: 'Zygosity',
      apiField: 'zygosity',
      isVisibleByDefault: true,
      isSortable: false,
      position: 6,
      tooltip: null,
    },
    {
      id: 'diag_lab',
      name: 'Diagnostic Lab',
      apiField: 'performer_lab_code',
      isVisibleByDefault: true,
      isSortable: false,
      position: 7,
      tooltip: null,
    },
    {
      id: 'analysis',
      name: 'Analysis',
      apiField: 'case_analysis_code',
      isVisibleByDefault: true,
      isSortable: false,
      position: 8,
      tooltip: null,
    },
    {
      id: 'date',
      name: 'Date',
      apiField: 'created_on',
      isVisibleByDefault: true,
      isSortable: true,
      position: 9,
      tooltip: 'Date received',
    },
    {
      id: 'status',
      name: 'Status',
      apiField: 'status_code',
      isVisibleByDefault: true,
      isSortable: true,
      position: 10,
      tooltip: null,
    },
  ],
};

const generateTableActionsFunctions = (tableId: string, columns: any[]) => ({
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
          cy.log(`Warning: Column ${columnID} not found`);
        }
      })
    );
  },
});

const generateTableValidationsFunctions = (tableId: string, columns: any[], customColumnContent?: (columnID: string, data: any, position: number) => void) => ({
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
        cy.log(`Warning: Column ${columnID} not found`);
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
            cy.get(CommonSelectors.tableHeadCell(tableId)).eq(position).shouldHaveTooltip(column.tooltip);
          } else {
            cy.log(`Warning: Column ${column.id} not found`);
          }
        })
      );
    });
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
            cy.log(`Warning: Column ${column.id} not found`);
          }
        })
      );
    });
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
      cy.validateTableFirstRowClass(CommonSelectors.tagLevel('secondary'), position, tableId);
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
