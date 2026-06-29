/// <reference types="cypress"/>
import { CommonSelectors } from 'pom/shared/Selectors';
import { getColumnPosition, getUrlLink, oneMinute, stringToRegExp } from 'pom/shared/Utils';

const selectors = {
  tableId: '[id="overlapping-genes-table"]',
  tableHeadRow: 'tr:eq(1)',
  leafHeadCell: () => `${CommonSelectors.tableHead(selectors.tableId)} ${selectors.tableHeadRow} ${CommonSelectors.tableCellHead}`,
};

const tableColumns = [
  {
    id: 'gene',
    name: 'Gene',
    apiField: 'symbol',
    isVisibleByDefault: true,
    pinByDefault: null,
    isSortable: false,
    isPinnable: false,
    position: 0,
    tooltip: null,
  },
  {
    id: 'cytoband',
    name: 'Cytoband',
    apiField: 'cytoband',
    isVisibleByDefault: true,
    pinByDefault: null,
    isSortable: false,
    isPinnable: false,
    position: 1,
    tooltip: null,
  },
  {
    id: 'clingen',
    name: 'ClinGen',
    apiField: null,
    isVisibleByDefault: true,
    pinByDefault: null,
    isSortable: false,
    isPinnable: false,
    position: 2,
    tooltip: null,
  },
  {
    id: 'length',
    name: 'Length',
    apiField: 'gene_length',
    isVisibleByDefault: true,
    pinByDefault: null,
    isSortable: true,
    isPinnable: false,
    position: 3,
    tooltip: 'Gene base length',
  },
  {
    id: 'nb_overlap_bases',
    name: '# Bases',
    apiField: 'nb_overlap_bases',
    isVisibleByDefault: true,
    pinByDefault: null,
    isSortable: true,
    isPinnable: false,
    position: 4,
    tooltip: 'Overlap in bases',
  },
  {
    id: 'nb_exons',
    name: '# Exons',
    apiField: 'nb_exons',
    isVisibleByDefault: true,
    pinByDefault: null,
    isSortable: true,
    isPinnable: false,
    position: 5,
    tooltip: 'Overlapped exon number',
  },
  {
    id: 'overlapping_gene_percent',
    name: '% Gene',
    apiField: 'overlapping_gene_percent',
    isVisibleByDefault: true,
    pinByDefault: null,
    isSortable: true,
    isPinnable: false,
    position: 6,
    tooltip: '% overlapped gene length',
  },
  {
    id: 'overlapping_cnv_percent',
    name: '% CNV',
    apiField: 'overlapping_cnv_percent',
    isVisibleByDefault: true,
    pinByDefault: null,
    isSortable: true,
    isPinnable: false,
    position: 7,
    tooltip: '% overlapped CNV length',
  },
  {
    id: 'overlap_type',
    name: 'Type',
    apiField: 'overlap_type',
    isVisibleByDefault: true,
    pinByDefault: null,
    isSortable: true,
    isPinnable: false,
    position: 8,
    tooltip: 'Gene and CNV overlapping type',
  },
];

const columnContentHandler = (columnID: string, dataGene: any, position: number) => {
  const tableId = selectors.tableId;
  switch (columnID) {
    case 'clingen':
      cy.validateTableFirstRowClass(CommonSelectors.anchorIcon, position, tableId);
      break;
    case 'gene':
      cy.validateTableFirstRowContent(dataGene[columnID], position, tableId);
      cy.validateTableFirstRowClass(CommonSelectors.anchorIcon, position, tableId);
      break;
    case 'overlap_type':
      cy.validateTableFirstRowClass('svg', position, tableId);
      break;
    default:
      cy.validateTableFirstRowContent(dataGene[columnID], position, tableId);
      break;
  }
};

export const OverlappingGenesModal = {
  actions: {
    /**
     * Sorts a column.
     * @param columnID The ID of the column to sort.
     */
    sortColumn(columnID: string) {
      cy.then(() =>
        getColumnPosition(CommonSelectors.tableHead(selectors.tableId), tableColumns, columnID).then(position => {
          if (position !== -1) {
            cy.sortTableAndWait(position, selectors.tableId);
          } else {
            cy.handleColumnNotFound(columnID);
          }
        })
      );
    },
  },

  validations: {
    /**
     * Checks that the overlapping genes modal (and its table) is displayed.
     */
    shouldModalOpen() {
      cy.get(CommonSelectors.animateIn).contains('Overlapping Genes with CNV').should('exist');
    },
    /**
     * Validates the value of the first row for a given column.
     * @param value The expected value (string or RegExp).
     * @param columnID The ID of the column to check.
     */
    shouldHaveFirstRowValue(value: string | RegExp, columnID: string) {
      cy.then(() =>
        getColumnPosition(CommonSelectors.tableHead(selectors.tableId), tableColumns, columnID, selectors.tableHeadRow).then(position => {
          cy.validateTableFirstRowContent(value, position, selectors.tableId);
        })
      );
    },
    /**
     * Validates the link in a specific table cell for a given gene and column.
     * @param dataGene The overlapping gene object.
     * @param columnID The ID of the column.
     */
    shouldHaveTableCellLink(dataGene: any, columnID: string) {
      cy.then(() =>
        getColumnPosition(CommonSelectors.tableHead(selectors.tableId), tableColumns, columnID, selectors.tableHeadRow).then(position => {
          if (position !== -1) {
            cy.get(CommonSelectors.tableRow(selectors.tableId)).eq(0).find(CommonSelectors.tableCellData).eq(position).find(CommonSelectors.link).should('have.attr', 'href', getUrlLink(columnID, dataGene));
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
      tableColumns.forEach(column => {
        const expectedExist = column.isVisibleByDefault ? 'exist' : 'not.exist';
        cy.get(`${CommonSelectors.tableHead(selectors.tableId)} ${selectors.tableHeadRow}`).contains(stringToRegExp(column.name, true /*exact*/)).should(expectedExist);
      });
    },
    /**
     * Validates the default pin state of each column (none are pinnable).
     */
    shouldMatchDefaultPinnedColumns() {
      tableColumns.forEach(column => {
        cy.then(() =>
          getColumnPosition(CommonSelectors.tableHead(selectors.tableId), tableColumns, column.id, selectors.tableHeadRow).then(position => {
            if (position !== -1) {
              cy.get(selectors.leafHeadCell())
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
      tableColumns.forEach(column => {
        cy.get(selectors.leafHeadCell()).eq(column.position).contains(stringToRegExp(column.name, true /*exact*/)).should('exist');
      });
    },
    /**
     * Validates the content of a specific column in the table for a given data.
     * @param columnID The ID of the column to validate.
     * @param dataGene The overlapping gene object containing the expected values.
     */
    shouldShowColumnContent(columnID: string, dataGene: any) {
      getColumnPosition(CommonSelectors.tableHead(selectors.tableId), tableColumns, columnID, selectors.tableHeadRow).then(position => {
        if (position !== -1) {
          columnContentHandler(columnID, dataGene, position);
        } else {
          cy.handleColumnNotFound(columnID);
        }
      });
    },
    /**
     * Validates the tooltips on columns.
     */
    shouldShowColumnTooltips() {
      tableColumns.forEach(column => {
        cy.then(() =>
          getColumnPosition(CommonSelectors.tableHead(selectors.tableId), tableColumns, column.id, selectors.tableHeadRow).then(position => {
            if (position !== -1) {
              cy.get(selectors.leafHeadCell()).eq(position).invoke('css', 'width', '125px' /*Widen column for tooltip access*/).scrollIntoView().should('be.visible');
              if (column.tooltip) {
                cy.get(selectors.leafHeadCell()).eq(position).find(CommonSelectors.underlineHeader).should('be.visible').realHover();
                cy.get(CommonSelectors.tooltipPopper).contains(column.tooltip).first().should('exist');
                cy.get(`${CommonSelectors.tableHead(selectors.tableId)} tr`).eq(0).click(); // Close the popper
                cy.get(CommonSelectors.tooltipPopper).should('not.exist');
              } else {
                cy.get(selectors.leafHeadCell()).eq(position).realHover();
                cy.get(CommonSelectors.tooltipPopper).should('not.exist');
              }
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
      tableColumns.forEach(column => {
        cy.then(() =>
          getColumnPosition(CommonSelectors.tableHead(selectors.tableId), tableColumns, column.id, selectors.tableHeadRow).then(position => {
            if (position !== -1) {
              cy.get(selectors.leafHeadCell()).eq(position).shouldBePinnable(column.isPinnable);
            } else {
              cy.handleColumnNotFound(column.id);
            }
          })
        );
      });
    },
    /**
     * Validates that sortable columns are correctly marked as sortable.
     */
    shouldShowSortableColumns() {
      tableColumns.forEach(column => {
        cy.then(() =>
          getColumnPosition(CommonSelectors.tableHead(selectors.tableId), tableColumns, column.id, selectors.tableHeadRow).then(position => {
            if (position !== -1) {
              cy.get(selectors.leafHeadCell()).eq(position).shouldBeSortable(column.isSortable);
            } else {
              cy.handleColumnNotFound(column.id);
            }
          })
        );
      });
    },
    /**
     * Validates the client-side sorting functionality of a column.
     * @param columnID The ID of the column to sort.
     * @param hasUniqueValues The data of the column to sort has unique values.
     * @param isReverseSorting The first sort of the column is Ascending (compared to Descending by default).
     */
    shouldSortColumn(columnID: string, hasUniqueValues: boolean, isReverseSorting: boolean) {
      cy.then(() =>
        getColumnPosition(CommonSelectors.tableHead(selectors.tableId), tableColumns, columnID, selectors.tableHeadRow).then(position => {
          if (position !== -1) {
            OverlappingGenesModal.actions.sortColumn(columnID);
            cy.get(CommonSelectors.tableRow(selectors.tableId))
              .eq(0)
              .find(CommonSelectors.tableCellData)
              .eq(position)
              .invoke('text')
              .then(biggestValue => {
                const biggest = biggestValue.trim();

                OverlappingGenesModal.actions.sortColumn(columnID);
                cy.get(CommonSelectors.tableRow(selectors.tableId))
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
                    } else if (isReverseSorting && biggest.localeCompare(smallest) >= 0) {
                      throw new Error(`Error: "${biggest}" should be < "${smallest}"`);
                    }
                  });
              });
          }
        })
      );
    },
  },
};
