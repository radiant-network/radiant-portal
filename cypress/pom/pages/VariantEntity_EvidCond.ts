/// <reference types="cypress"/>
import { CommonSelectors } from 'pom/shared/Selectors';
import { getColumnPosition, stringToRegExp } from 'pom/shared/Utils';

const selectors = {
  tab: '[class*= "group-data-[active=true]"]:contains("Evidence and conditions")',

  clinvarCard: {
    tableId: '[id="pathogenic-evidence"]',
  },
  condPhenCard: {
    omim: {
      tableId: '[id="HPSE2-condition-phenotype-table"]',
    },
    orphanet: {
      tab: '[id*="trigger-orphanet"]',
      tableId: '[id="HPSE2-condition-phenotype-table"]',
    },
    hpo: {
      tab: '[id*="trigger-hpo"]',
      tableId: '[id="HPSE2-condition-phenotype-table"]',
    },
  },
};

const tableColumns = {
  clinvarCard: [
    {
      id: 'evaluated',
      name: 'Evaluated',
      apiField: 'date_last_evaluated',
      isVisibleByDefault: true,
      isSortable: false,
      position: 0,
      tooltip: 'Latest submission for this variant/condition',
    },
    {
      id: 'condition',
      name: 'Condition',
      apiField: 'traits',
      isVisibleByDefault: true,
      isSortable: true,
      position: 1,
      tooltip: null,
    },
    {
      id: 'classification',
      name: 'Classification',
      apiField: 'clinical_significance',
      isVisibleByDefault: true,
      isSortable: true,
      position: 2,
      tooltip: null,
    },
    {
      id: 'submission_count',
      name: 'Submissions',
      apiField: 'submission_count',
      isVisibleByDefault: true,
      isSortable: true,
      position: 3,
      tooltip: 'Number of submitted interpretations for this variant/condition (RCV)',
    },
    {
      id: 'status',
      name: 'Status',
      apiField: 'review_status_stars',
      isVisibleByDefault: true,
      isSortable: true,
      position: 4,
      tooltip: null,
    },
    {
      id: 'origin',
      name: 'Origin',
      apiField: 'origins',
      isVisibleByDefault: true,
      isSortable: false,
      position: 5,
      tooltip: null,
    },
    {
      id: 'rcv_link',
      name: '',
      apiField: 'accession',
      isVisibleByDefault: true,
      isSortable: false,
      position: 6,
      tooltip: null,
    },
  ],
  condPhenCard: {
    omim: [
      {
        id: 'condition',
        name: 'Condition',
        apiField: 'panel_name',
        isVisibleByDefault: true,
        isSortable: true,
        position: 0,
        tooltip: null,
      },
      {
        id: 'inheritance',
        name: 'Inheritance',
        apiField: 'inheritance_code',
        isVisibleByDefault: true,
        isSortable: false,
        position: 1,
        tooltip: null,
      },
      {
        id: 'link',
        name: '',
        apiField: 'panel_id',
        isVisibleByDefault: true,
        isSortable: false,
        position: 2,
        tooltip: null,
      },
    ],
    orphanet: [
      {
        id: 'condition',
        name: 'Condition',
        apiField: 'panel_name',
        isVisibleByDefault: true,
        isSortable: true,
        position: 0,
        tooltip: null,
      },
      {
        id: 'inheritance',
        name: 'Inheritance',
        apiField: 'inheritance_code',
        isVisibleByDefault: true,
        isSortable: false,
        position: 1,
        tooltip: null,
      },
      {
        id: 'link',
        name: '',
        apiField: 'panel_id',
        isVisibleByDefault: true,
        isSortable: false,
        position: 2,
        tooltip: null,
      },
    ],
    hpo: [
      {
        id: 'condition',
        name: 'Condition',
        apiField: 'panel_name',
        isVisibleByDefault: true,
        isSortable: true,
        position: 0,
        tooltip: null,
      },
      {
        id: 'inheritance',
        name: 'Inheritance',
        apiField: 'inheritance_code',
        isVisibleByDefault: true,
        isSortable: false,
        position: 1,
        tooltip: null,
      },
      {
        id: 'link',
        name: '',
        apiField: 'panel_id',
        isVisibleByDefault: true,
        isSortable: false,
        position: 2,
        tooltip: null,
      },
    ],
  },
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

const clinvarColumnContentHandler = (columnID: string, dataClinVar: any, position: number) => {
  const tableId = selectors.clinvarCard.tableId;
  switch (columnID) {
    case 'classification':
      cy.validateTableFirstRowContent(dataClinVar.classification, position, tableId);
      cy.validateTableFirstRowClass(CommonSelectors.tag('lime'), position, tableId);
      break;
    case 'status':
      cy.get(CommonSelectors.tableRow(tableId))
        .eq(0)
        .find(CommonSelectors.starEmptyIcon)
        .should('have.length', 4 - dataClinVar[columnID]);
      cy.get(CommonSelectors.tableRow(tableId)).eq(0).find(CommonSelectors.starFillIcon).should('have.length', dataClinVar[columnID]);
      break;
    case 'origin':
      cy.validateTableFirstRowContent(dataClinVar[columnID], position, tableId);
      cy.validateTableFirstRowClass(CommonSelectors.tagBlank, position, tableId);
      break;
    case 'rcv_link':
      cy.validateTableFirstRowContent(dataClinVar[columnID], position, tableId);
      cy.validateTableFirstRowClass(CommonSelectors.anchorIcon, position, tableId);
      break;
    default:
      cy.validateTableFirstRowContent(dataClinVar[columnID], position, tableId);
      break;
  }
};

const omimColumnContentHandler = (columnID: string, dataOmim: any, position: number) => {
  const tableId = selectors.condPhenCard.omim.tableId;
  switch (columnID) {
    case 'inheritance':
      cy.validateTableFirstRowContent(dataOmim[columnID], position, tableId);
      cy.validateTableFirstRowClass(CommonSelectors.tagBlank, position, tableId);
      break;
    case 'link':
      cy.validateTableFirstRowContent(dataOmim.omim_id, position, tableId);
      cy.validateTableFirstRowClass(CommonSelectors.anchorIcon, position, tableId);
      break;
    default:
      cy.validateTableFirstRowContent(dataOmim[columnID], position, tableId);
      break;
  }
};

const orphanetColumnContentHandler = (columnID: string, dataOrphanet: any, position: number) => {
  const tableId = selectors.condPhenCard.orphanet.tableId;
  switch (columnID) {
    case 'inheritance':
      cy.validateTableFirstRowContent(dataOrphanet[columnID], position, tableId);
      cy.validateTableFirstRowClass(CommonSelectors.tagBlank, position, tableId);
      break;
    case 'link':
      cy.validateTableFirstRowContent(dataOrphanet.orphanet_id, position, tableId);
      cy.validateTableFirstRowClass(CommonSelectors.anchorIcon, position, tableId);
      break;
    default:
      cy.validateTableFirstRowContent(dataOrphanet[columnID], position, tableId);
      break;
  }
};

const hpoColumnContentHandler = (columnID: string, dataHpo: any, position: number) => {
  const tableId = selectors.condPhenCard.hpo.tableId;
  switch (columnID) {
    case 'link':
      cy.validateTableFirstRowContent(dataHpo.hpo_id, position, tableId);
      cy.validateTableFirstRowClass(CommonSelectors.anchorIcon, position, tableId);
      break;
    default:
      cy.validateTableFirstRowContent(dataHpo[columnID], position, tableId);
      break;
  }
};

export const VariantEntity_EvidCond = {
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

  clinvarCard: {
    actions: generateTableActionsFunctions(selectors.clinvarCard.tableId, tableColumns.clinvarCard),
    validations: (() => {
      const actions = generateTableActionsFunctions(selectors.clinvarCard.tableId, tableColumns.clinvarCard);
      const baseValidations = generateTableValidationsFunctions(selectors.clinvarCard.tableId, tableColumns.clinvarCard, clinvarColumnContentHandler);
      return {
        ...baseValidations,
        shouldSortColumn(columnID: string) {
          baseValidations.shouldSortColumn(columnID, () => actions.sortColumn(columnID));
        },
      };
    })(),
  },

  condPhenCard: {
    omim: {
      actions: generateTableActionsFunctions(selectors.condPhenCard.omim.tableId, tableColumns.condPhenCard.omim),
      validations: (() => {
        const actions = generateTableActionsFunctions(selectors.condPhenCard.omim.tableId, tableColumns.condPhenCard.omim);
        const baseValidations = generateTableValidationsFunctions(selectors.condPhenCard.omim.tableId, tableColumns.condPhenCard.omim, omimColumnContentHandler);
        return {
          ...baseValidations,
          shouldSortColumn(columnID: string) {
            baseValidations.shouldSortColumn(columnID, () => actions.sortColumn(columnID));
          },
        };
      })(),
    },
    orphanet: {
      actions: (() => {
        const baseActions = generateTableActionsFunctions(selectors.condPhenCard.orphanet.tableId, tableColumns.condPhenCard.orphanet);
        return {
          ...baseActions,
          /**
           * Select the tab to show the table.
           */
          selectTab() {
            cy.get(selectors.condPhenCard.orphanet.tab).click({ force: true });
          },
        };
      })(),
      validations: (() => {
        const actions = generateTableActionsFunctions(selectors.condPhenCard.orphanet.tableId, tableColumns.condPhenCard.orphanet);
        const baseValidations = generateTableValidationsFunctions(selectors.condPhenCard.orphanet.tableId, tableColumns.condPhenCard.orphanet, orphanetColumnContentHandler);
        return {
          ...baseValidations,
          shouldSortColumn(columnID: string) {
            baseValidations.shouldSortColumn(columnID, () => actions.sortColumn(columnID));
          },
        };
      })(),
    },
    hpo: {
      actions: (() => {
        const baseActions = generateTableActionsFunctions(selectors.condPhenCard.hpo.tableId, tableColumns.condPhenCard.hpo);
        return {
          ...baseActions,
          /**
           * Select the tab to show the table.
           */
          selectTab() {
            cy.get(selectors.condPhenCard.hpo.tab).click({ force: true });
          },
        };
      })(),
      validations: (() => {
        const actions = generateTableActionsFunctions(selectors.condPhenCard.hpo.tableId, tableColumns.condPhenCard.hpo);
        const baseValidations = generateTableValidationsFunctions(selectors.condPhenCard.hpo.tableId, tableColumns.condPhenCard.hpo, hpoColumnContentHandler);
        return {
          ...baseValidations,
          shouldSortColumn(columnID: string) {
            baseValidations.shouldSortColumn(columnID, () => actions.sortColumn(columnID));
          },
        };
      })(),
    },
  },
};
