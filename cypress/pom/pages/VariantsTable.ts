/// <reference types="cypress"/>
import { CommonSelectors } from '../shared/Selectors';
import { getUrlLink, stringToRegExp } from '../shared/Utils';
import { getColumnName, getColumnPosition } from '../shared/Utils';

const selectorHead = CommonSelectors.tableHead;
const selectors = {
  tableCell: (dataVariant: any) => `${CommonSelectors.tableRow}:contains("${dataVariant.variant}") ${CommonSelectors.tableCellData}`,
  tableHeadCell: `${selectorHead} ${CommonSelectors.tableCellHead}`,
};

const tableColumns = [
  {
    id: 'interpretation',
    name: '[class*="lucide-zap"]',
    isVisibleByDefault: true,
    isSortable: false,
    position: 1,
    tooltip: null,
  },
  {
    id: 'variant',
    name: 'Variant',
    isVisibleByDefault: true,
    isSortable: true,
    position: 2,
    tooltip: null,
  },
  {
    id: 'type',
    name: 'Type',
    isVisibleByDefault: true,
    isSortable: true,
    position: 3,
    tooltip: null,
  },
  {
    id: 'dbsnp',
    name: 'dbSNP',
    isVisibleByDefault: true,
    isSortable: false,
    position: 4,
    tooltip: null,
  },
  {
    id: 'gene',
    name: 'Gene',
    isVisibleByDefault: true,
    isSortable: false,
    position: 5,
    tooltip: null,
  },
  {
    id: 'consequence',
    name: 'Consequence',
    isVisibleByDefault: true,
    isSortable: false,
    position: 6,
    tooltip: 'Most deleterious consequence annotated using VEP',
  },
  {
    id: 'mane',
    name: 'MANE',
    isVisibleByDefault: true,
    isSortable: false,
    position: 7,
    tooltip: null,
  },
  {
    id: 'omim',
    name: 'OMIM',
    isVisibleByDefault: true,
    isSortable: false,
    position: 8,
    tooltip: 'MIM inheritance modes',
  },
  {
    id: 'clinvar',
    name: 'ClinVar',
    isVisibleByDefault: true,
    isSortable: false,
    position: 9,
    tooltip: null,
  },
  {
    id: 'exomiser',
    name: 'Exo.',
    isVisibleByDefault: true,
    isSortable: true,
    position: 10,
    tooltip: 'Exomiser score based on variant properties and patient phenotypes',
  },
  {
    id: 'acmg_exomiser',
    name: 'ACMG Exo.',
    isVisibleByDefault: true,
    isSortable: true,
    position: 11,
    tooltip: 'Exomiser ACMG',
  },
  {
    id: 'gnomad',
    name: 'gnomAD',
    isVisibleByDefault: true,
    isSortable: true,
    position: 12,
    tooltip: 'gnomAD Genome 3.1.2 (allele Frequency)',
  },
  {
    id: 'freq',
    name: 'Freq.',
    isVisibleByDefault: true,
    isSortable: true,
    position: 13,
    tooltip: 'Number of germline genomes containing this variant and their frequency across this organization. Only occurrences with Filter = PASS and GQ ≥ 20 are taken into account for frequency calculations.',
  },
  {
    id: 'gq',
    name: 'GQ',
    isVisibleByDefault: true,
    isSortable: true,
    position: 14,
    tooltip: 'Genotype quality. Only occurrences with GQ ≥ 20 are taken into account for frequency calculation.',
  },
  {
    id: 'zyg',
    name: 'Zyg.',
    isVisibleByDefault: true,
    isSortable: false,
    position: 15,
    tooltip: 'Zygosity',
  },
  {
    id: 'ad_ratio',
    name: 'AD Ratio',
    isVisibleByDefault: true,
    isSortable: true,
    position: 16,
    tooltip: null,
  }
];

export const VariantsTable = {
  actions: {
    /**
     * Clicks the link in a specific table cell for a given variant and column.
     * @param dataVariant The variant object.
     * @param columnID The ID of the column.
     * @param onPlusIcon Click on the plus icon (default: false).
     */
    clickTableCellLink(dataVariant: any, columnID: string, onPlusIcon: boolean = false) {
      cy.then(() => getColumnPosition(selectorHead, tableColumns, columnID).then((position) => {
        if (position !== -1) {
          switch (columnID) {
            case 'variant':
            case 'freq':
              cy.get(selectors.tableCell(dataVariant)).eq(position).find(CommonSelectors.link).invoke('removeAttr', 'target').clickAndWait({ force: true });
            break;
            case 'gene':
              if (onPlusIcon) {
                cy.get(selectors.tableCell(dataVariant)).eq(position).find('[class*="lucide-plus"]').clickAndWait({ force: true });
              } else {
                cy.get(selectors.tableCell(dataVariant)).eq(position).find(CommonSelectors.link).clickAndWait({ force: true });
              }
            break;
            default:
              cy.get(selectors.tableCell(dataVariant)).eq(position).find(CommonSelectors.link).clickAndWait({ force: true });
            break;
          };
        } else {
          cy.log(`Warning: Column ${columnID} not found`);
        };
      }));
    },
    /**
     * Hides a specific column in the table.
     * @param columnID The ID of the column to hide.
     */
    hideColumn(columnID: string) {
      cy.hideColumn(getColumnName(tableColumns, columnID));
    },
    /**
     * Shows all columns in the table.
     */
    showAllColumns() {
      tableColumns.forEach((column) => {
        if (!column.isVisibleByDefault) {
          cy.showColumn(column.name);
        };
      });
    },
    /**
     * Shows a specific column in the table.
     * @param columnID The ID of the column to show.
     */
    showColumn(columnID: string) {
      cy.showColumn(getColumnName(tableColumns, columnID));
    },
    /**
     * Sorts a column, optionally using an intercept.
     * @param columnID The ID of the column to sort.
     * @param needIntercept Whether to use an intercept (default: true).
     */
    sortColumn(columnID: string, needIntercept: boolean = true) {
      cy.then(() =>
        getColumnPosition(selectorHead, tableColumns, columnID).then((position) => {
          if (position !== -1) {
            if (needIntercept) {
              cy.sortTableAndIntercept(position, 1);
            } else {
              cy.sortTableAndWait(position);
            };
          } else {
            cy.log(`Warning: Column ${columnID} not found`);
          };
        }),
      );
    },
    /**
     * Unsort all columns of the table.
     */
    unsortAllColumns() {
      VariantsTable.actions.sortColumn('exomiser');
      VariantsTable.actions.sortColumn('exomiser');
      VariantsTable.actions.sortColumn('variant');
      VariantsTable.actions.sortColumn('variant');
    },
  },

  validations: {
    /**
     * Checks that a specific column is displayed.
     * @param columnID The ID of the column to check.
     */
    shouldDisplayColumn(columnID: string) {
      cy.get(selectorHead).contains(getColumnName(tableColumns, columnID)).should('exist');
    },
    /**
     * Validates the value of the first row for a given column.
     * @param value The expected value (string or RegExp).
     * @param columnID The ID of the column to check.
     */
    shouldHaveFirstRowValue(value: string | RegExp, columnID: string) {
      cy.then(() =>
        getColumnPosition(selectorHead, tableColumns, columnID).then((position) => {
          cy.validateTableFirstRowContent(value, position);
        }),
      );
    },
    /**
     * Validates the pill in the selected query.
     * @param dataVariant The variant object.
     * @param columnID The ID of the column to check.
     */
    shouldHaveSelectedQueryPill(dataVariant: any, columnID: string) {
      switch (columnID) {
        case 'gene':
          cy.validatePillSelectedQuery('Gene Symbol', [dataVariant[columnID]]);
        break;
        default:
          cy.validatePillSelectedQuery(getColumnName(tableColumns, columnID), [dataVariant[columnID]]);
        break;
      };
    },
    /**
     * Validates the link in a specific table cell for a given variant and column.
     * @param dataVariant The variant object.
     * @param url The expected url (string or RegExp).
     * @param columnID The ID of the column.
     */
    shouldHaveTableCellLink(dataVariant: any, columnID: string) {
      cy.then(() =>
        getColumnPosition(selectorHead, tableColumns, columnID).then((position) => {
          if (position !== -1) {
            cy.get(selectors.tableCell(dataVariant)).eq(position).find(CommonSelectors.link).should('have.attr', 'href', getUrlLink(columnID, dataVariant));
          } else {
            cy.log(`Warning: Column ${columnID} not found`);
          };
        }),
      );
    },
    /**
     * Validates the default visibility of each column.
     */
    shouldMatchDefaultColumnVisibility() {
      tableColumns.forEach((column) => {
        const expectedExist = column.isVisibleByDefault ? 'exist' : 'not.exist';
        if (column.name.startsWith('[')) {
          cy.get(selectorHead).find(column.name).should(expectedExist);
        } else {
          cy.get(selectorHead).contains(stringToRegExp(column.name, true /*exact*/)).should(expectedExist);
        };
      });
    },
    /**
     * Checks that a specific column is not displayed.
     * @param columnID The ID of the column to check.
     */
    shouldNotDisplayColumn(columnID: string) {
      cy.get(selectorHead).contains(getColumnName(tableColumns, columnID)).should('not.exist');
    },
    /**
     * Validates that all columns are displayed in the correct order in the table.
     */
    shouldShowAllColumns() {
      VariantsTable.actions.showAllColumns();
      tableColumns.forEach((column) => {
        if (column.name.startsWith('[')) {
          cy.get(selectors.tableHeadCell).eq(column.position).find(column.name).should('exist');
        } else {
          cy.get(selectors.tableHeadCell)
            .eq(column.position)
            .contains(stringToRegExp(column.name, true /*exact*/))
            .should('exist');
        };
      });
    },
    /**
     * Validates the presence of tooltips on columns.
     */
    shouldShowColumnTooltips() {
      VariantsTable.actions.showAllColumns();
      tableColumns.forEach((column) => {
        cy.then(() =>
          getColumnPosition(selectorHead, tableColumns, column.id).then((position) => {
            if (position !== -1) {
              if (column.tooltip) {
                cy.get(selectors.tableHeadCell).eq(position).shouldHaveTooltip(column.tooltip);
              };
            } else {
            cy.log(`Warning: Column ${column.id} not found`);
          };
          }),
        );
      });
    },
    /**
     * Validates that sortable columns are correctly marked as sortable.
     */
    shouldShowSortableColumns() {
      VariantsTable.actions.showAllColumns();
      VariantsTable.actions.unsortAllColumns();
      tableColumns.forEach((column) => {
        cy.then(() =>
          getColumnPosition(selectorHead, tableColumns, column.id).then((position) => {
            if (position !== -1) {
              cy.get(selectors.tableHeadCell).eq(position).shouldBeSortable(column.isSortable);
            } else {
            cy.log(`Warning: Column ${column.id} not found`);
          };
          }),
        );
      });
    },
      /**
       * Validates the content of all columns in the table for a given variant.
       * @param dataVariant The variant object containing the expected values.
       */
      shouldShowTableContent(dataVariant: any) {
        VariantsTable.actions.showAllColumns();
        tableColumns.forEach((column) => {
          cy.then(() =>
            getColumnPosition(selectorHead, tableColumns, column.id).then((position) => {
              if (position !== -1) {
                switch (column.id) {
                case 'interpretation':
                  cy.validateTableFirstRowClass('lucide-zap', position);
                  break;
                case 'dbsnp':
                  cy.validateTableFirstRowClass('lucide-arrow-up-right', position);
                  break;
                case 'gene':
                  cy.validateTableFirstRowContent(dataVariant[column.id], position);
                  cy.validateTableFirstRowClass('lucide-plus', position);
                  break;
                case 'consequence':
                  cy.validateTableFirstRowClass(dataVariant.consequenceImpact, position);
                  cy.validateTableFirstRowContent(dataVariant[column.id], position);
                  cy.validateTableFirstRowContent(dataVariant.aa_change, position);
                  break;
                case 'mane':
                  cy.get(selectors.tableCell(dataVariant)).eq(position).find('path[d*="0ZM16"]').should(dataVariant.maneC ? 'exist' : 'not.exist');
                  cy.get(selectors.tableCell(dataVariant)).eq(position).find('path[d*="0ZM8"]').should(dataVariant.maneM ? 'exist' : 'not.exist');
                  cy.get(selectors.tableCell(dataVariant)).eq(position).find('path[d*="0ZM10"]').should(dataVariant.maneP ? 'exist' : 'not.exist');
                  break;
                case 'omim':
                  dataVariant[column.id].forEach((value: string | RegExp) => {
                    cy.validateTableFirstRowContent(value, position);
                  });
                  cy.validateTableFirstRowClass('bg-primary text-primary-foreground', position);
                  break;
                case 'clinvar':
                  dataVariant[column.id].forEach((value: string | RegExp) => {
                    cy.validateTableFirstRowContent(value, position);
                  });
                  cy.validateTableFirstRowClass('bg-green/20 text-green-foreground', position);
                  cy.validateTableFirstRowClass('bg-yellow/20 text-yellow-foregroun', position);
                  break;
                case 'acmg_exomiser':
                  dataVariant[column.id].forEach((value: string | RegExp) => {
                    cy.validateTableFirstRowContent(value, position);
                  });
                  cy.validateTableFirstRowClass('bg-yellow/20 text-yellow-foregroun', position);
                  break;
                case 'gnomad':
                  cy.validateTableFirstRowContent(dataVariant[column.id], position);
                  cy.validateTableFirstRowClass('text-red-500 bg-red-500', position);
                  break;
                default:
                  cy.validateTableFirstRowContent(dataVariant[column.id], position);
                  break;
              };
            } else {
              cy.log(`Warning: Column ${column.id} not found`);
            };
          }));
        });
      },
    /**
     * Validates the sorting functionality of a column.
     * @param columnID The ID of the column to sort.
     * @param needIntercept Whether to use an intercept for the sorting action (default: true).
     */
    shouldSortColumn(columnID: string, needIntercept: boolean = true) {
      VariantsTable.actions.showAllColumns();
      VariantsTable.actions.unsortAllColumns();
      cy.then(() =>
        getColumnPosition(selectorHead, tableColumns, columnID).then((position) => {
          if (position !== -1) {
            switch (columnID) {
              default:
                VariantsTable.actions.sortColumn(columnID, needIntercept);
                cy.wait(2000);
                cy.get(CommonSelectors.tableRow)
                  .eq(0)
                  .find(CommonSelectors.tableCellData)
                  .eq(position)
                  .invoke('text')
                  .then((biggestValue) => {
                    const biggest = biggestValue.trim();

                    VariantsTable.actions.sortColumn(columnID);
                    cy.wait(2000);
                    cy.get(CommonSelectors.tableRow)
                      .eq(0)
                      .find(CommonSelectors.tableCellData)
                      .eq(position)
                      .invoke('text')
                      .then((smallestValue) => {
                        const smallest = smallestValue.trim();

                        if (biggest.localeCompare(smallest) < 0) {
                          throw new Error(`Error: "${biggest}" should be >= "${smallest}"`);
                        };
                      });
                  });
                break;
            };
          } else {
            cy.log(`Warning: Column ${columnID} not found`);
          };
        }),
      );
    },
  },
};
