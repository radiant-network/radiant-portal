/// <reference types="cypress"/>
import { CommonSelectors } from '../shared/Selectors';
import { formatToK, getUrlLink, stringToRegExp } from '../shared/Utils';
import { getColumnName, getColumnPosition } from '../shared/Utils';

const selectorHead = CommonSelectors.tableHead;
const selectors = {
  pageTitle: '[data-cy="Title_Variants"]',
  proTableHeader: 'div[class*="ProTableHeader"]',
  tableCell: 'tr[data-row-key]',
  tableHeadCell: `${selectorHead} ${CommonSelectors.tableCell}`,
  tableID: 'variant-occurrence',
};

const tableColumns = [
  {
    id: 'interpretation',
    name: 'icon',
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
    name: 'Most Deleterious Consequence',
    isVisibleByDefault: true,
    isSortable: false,
    position: 6,
    tooltip: 'Functional consequences of genetic variations annotated using VEP',
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
    tooltip: null,
  },
  {
    id: 'gnomad',
    name: 'gnomAD',
    isVisibleByDefault: true,
    isSortable: true,
    position: 11,
    tooltip: 'gnomAD Genome 3.1.2 (allele frequency)',
  },
  {
    id: 'freq',
    name: 'Freq.',
    isVisibleByDefault: true,
    isSortable: true,
    position: 12,
    tooltip: 'gnomAD Genome 3.1.2 (# of alternative alleles)',
  },
  {
    id: 'gq',
    name: 'GQ',
    isVisibleByDefault: true,
    isSortable: true,
    position: 13,
    tooltip: 'Number and frequency of participant carriers in the CQDG cohorts (whole genomes only)',
  },
  {
    id: 'zyg',
    name: 'Zyg.',
    isVisibleByDefault: true,
    isSortable: false,
    position: 14,
    tooltip: '# of studies with affected participants',
  },
  {
    id: 'ad_ratio',
    name: 'AD Ratio',
    isVisibleByDefault: true,
    isSortable: true,
    position: 15,
    tooltip: 'Allelic frequency of the variant across CQDG cohorts (whole genomes only)',
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
        switch (columnID) {
          case 'variant':
            cy.get(selectors.tableCell).find(CommonSelectors.tableCell).contains(dataVariant.variant).invoke('removeAttr', 'target').clickAndWait({force: true});
          break;
          case 'gene':
            const selectorToClick = onPlusIcon ? CommonSelectors.plusIcon : CommonSelectors.link;
            cy.get(selectors.tableCell).find(CommonSelectors.tableCell).eq(getColumnPosition(tableColumns, columnID)).find(selectorToClick).clickAndWait({force: true});
          break;
          default:
            cy.get(selectors.tableCell).find(CommonSelectors.tableCell).eq(getColumnPosition(tableColumns, columnID)).find(CommonSelectors.link).clickAndWait({force: true});
          break;
        };
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
            cy.showColumn(stringToRegExp(column.name, true/*exact*/));
          };
        });
      },
      /**
       * Shows a specific column in the table.
       * @param columnID The ID of the column to show.
       */
      showColumn(columnID: string) {
        cy.showColumn(stringToRegExp(getColumnName(tableColumns, columnID), true/*exact*/));
      },
      /**
       * Sorts a column, optionally using an intercept.
       * @param columnID The ID of the column to sort.
       * @param needIntercept Whether to use an intercept (default: true).
       */
      sortColumn(columnID: string, needIntercept: boolean = true) {
        const columnName = getColumnName(tableColumns, columnID);
        if (needIntercept) {
          cy.sortTableAndIntercept(stringToRegExp(columnName, true/*exact*/), 1);
        }
        else {
          cy.sortTableAndWait(stringToRegExp(columnName, true/*exact*/));
        };
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
        cy.validateTableFirstRowContent(value, getColumnPosition(tableColumns, columnID), false/*hasCheckbox*/);
      },
      /**
       * Validates the pill in the selected query.
       * @param dataVariant The variant object.
       * @param columnID The ID of the column to check.
       */
      shouldHaveSelectedQueryPill(dataVariant: any, columnID: string) {
        cy.validatePillSelectedQuery(getColumnName(tableColumns, columnID), [dataVariant[columnID]]);
      },
      /**
       * Validates the link in a specific table cell for a given variant and column.
       * @param dataVariant The variant object.
       * @param url The expected url (string or RegExp).
       * @param columnID The ID of the column.
       */
      shouldHaveTableCellLink(dataVariant: any, columnID: string) {
        switch (columnID) {
          case 'participants':
            if (dataVariant.partN < 10)
            {
              cy.get(selectors.tableCell).find(CommonSelectors.tableCell).eq(getColumnPosition(tableColumns, columnID)).find(CommonSelectors.link).should('not.exist');
            } else
            {
              cy.get(selectors.tableCell).find(CommonSelectors.tableCell).eq(getColumnPosition(tableColumns, columnID)).find(CommonSelectors.link).should('have.attr', 'href', getUrlLink(columnID, dataVariant));
            };
            break;
          default:
            cy.get(selectors.tableCell).find(CommonSelectors.tableCell).eq(getColumnPosition(tableColumns, columnID)).find(CommonSelectors.link).should('have.attr', 'href', getUrlLink(columnID, dataVariant));
            break;
        };
      },
      /**
       * Validates the default visibility of each column.
       */
      shouldMatchDefaultColumnVisibility() {
        tableColumns.forEach((column) => {
          const expectedExist = column.isVisibleByDefault ? 'exist' : 'not.exist';
          cy.get(selectorHead).contains(stringToRegExp(column.name, true/*exact*/)).should(expectedExist);
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
        cy.get(selectors.tableHeadCell).eq(column.position).contains(stringToRegExp(column.name, true/*exact*/)).should('exist');
        });
      },
      /**
       * Validates the presence of tooltips on columns.
       */
      shouldShowColumnTooltips() {
        VariantsTable.actions.showAllColumns();
        tableColumns.forEach((column) => {
          if (column.tooltip) {
            cy.getColumnHeadCell(column.name).shouldHaveTooltip(column.tooltip);
          }
        });
      },
      /**
       * Checks that the "No Results" message is displayed.
       */
      shouldShowNoResultsMessage() {
        cy.get(selectors.proTableHeader).contains(/^No Results$/).should('exist');
      },
      /**
       * Validates the pagination functionality.
       */
      shouldShowPaging() {
        cy.validatePaging(selectors.tableID);
      },
      /**
       * Checks the displayed results count.
       * @param count The expected count (string, number, or RegExp).
       * @param shouldExist Whether the count should exist (default: true).
       */
      shouldShowResultsCount(count: string | number | RegExp, shouldExist: boolean = true) {
        const strPlural = count === '1' ? '' : 's';
        cy.validateTableResultsCount(`${count} Résultat${strPlural}`, selectors.tableID, shouldExist);
      },
      /**
       * Validates that sortable columns are correctly marked as sortable.
       */
      shouldShowSortableColumns() {
        VariantsTable.actions.showAllColumns();
        tableColumns.forEach((column) => {
          cy.getColumnHeadCell(column.name).shouldBeSortable(column.isSortable);
        });
      },
      /**
       * Validates the content of all columns in the table for a given variant.
       * @param dataVariant The variant object containing the expected values.
       */
      shouldShowTableContent(dataVariant: any) {
        tableColumns.forEach((column) => {
          switch (column.id) {
            case 'dbsnp':
              cy.validateTableFirstRowClass('anticon', column.position);
              break;
            case 'gene':
              cy.validateTableFirstRowContent(dataVariant[column.id], column.position);
              cy.validateTableFirstRowAttr('data-icon', 'plus', column.position);
              break;
            case 'consequence':
              cy.validateTableFirstRowClass(dataVariant.consequenceImpact, column.position);
              cy.validateTableFirstRowContent(dataVariant[column.id], column.position);
              cy.validateTableFirstRowContent(dataVariant.aa_change, column.position);
              break;
            case 'mane':
              const rowSelector = dataVariant.dataRowKey !== "*" ? `tr[data-row-key="${dataVariant.dataRowKey}"] td` : 'tr[class*="ant-table-row"]:first td';
              cy.get(rowSelector).eq(column.position).find('path[d*="M12.1872"]').should(dataVariant.maneC ? 'exist' : 'not.exist');
              cy.get(rowSelector).eq(column.position).find('path[d*="0C5.37258"]').should(dataVariant.maneM ? 'exist' : 'not.exist');
              break;
            case 'omim':
              dataVariant[column.id].forEach((value: string | RegExp) => {
                cy.validateTableFirstRowContent(value, column.position);
              });
              cy.validateTableFirstRowClass('ant-tag-blue', column.position);
              break;
            case 'clinvar':
              dataVariant[column.id].forEach((value: string | RegExp) => {
                cy.validateTableFirstRowContent(value, column.position);
              });
              cy.validateTableFirstRowClass('ant-tag-green', column.position);
              break;
            case 'gnomad':
              cy.validateTableFirstRowContent(dataVariant[column.id], column.position);
              cy.validateTableFirstRowClass('gnomadIndicatorDefault', column.position);
              break;
            default:
              cy.validateTableFirstRowContent(dataVariant[column.id], column.position);
              break;
          };
        });
      },
      /**
       * Validates the sorting functionality of a column.
       * @param columnID The ID of the column to sort.
       * @param needIntercept Whether to use an intercept for the sorting action (default: true).
       */
      shouldSortColumn(columnID: string, needIntercept: boolean = true) {
        const columnIndex = getColumnPosition(tableColumns, columnID);
        switch (columnID) {
          default:
            VariantsTable.actions.sortColumn(columnID, needIntercept);
            cy.get(CommonSelectors.tableRow).eq(0).find('td').eq(columnIndex).invoke('text').then((smallestValue) => {
              const smallest = smallestValue.trim();

              VariantsTable.actions.sortColumn(columnID);
              cy.get(CommonSelectors.tableRow).eq(0).find('td').eq(columnIndex).invoke('text').then((biggestValue) => {
                const biggest = biggestValue.trim();
                if (biggest.localeCompare(smallest) < 0) {
                  throw new Error(`Error: "${biggest}" should be >= "${smallest}"`);
                };
              });
            });
          break;
        };
      },
    },
  };
