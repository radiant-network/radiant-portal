/// <reference types="cypress"/>
import { CommonSelectors } from 'pom/shared/Selectors';
import { getColumnPosition, getStatusColor, getStatusIcon, stringToRegExp } from 'pom/shared/Utils';

const selectors = {
  tab: '[class*= "lucide-clipboard-list"]',

  assaysCard: {
    tableCell: (dataAssay: any) => `${CommonSelectors.tableRow(selectors.assaysCard.tableId)}:contains("${dataAssay.relationship}") ${CommonSelectors.tableCellData}`,
    tableId: '[id="sequencing-and-assays"]',
  },
};

const tableColumns = {
  assaysCard: [
    {
      id: 'assay_id',
      name: 'Assay ID',
      apiField: 'assay_id',
      isVisibleByDefault: true,
      pinByDefault: null,
      isSortable: true,
      isPinnable: true,
      position: 0,
      tooltip: null,
    },
    {
      id: 'sample_id',
      name: 'Sample ID',
      apiField: 'sample_id',
      isVisibleByDefault: true,
      pinByDefault: null,
      isSortable: true,
      isPinnable: true,
      position: 1,
      tooltip: null,
    },
    {
      id: 'sample_type',
      name: 'Sample Type',
      apiField: 'sample_type',
      isVisibleByDefault: true,
      pinByDefault: null,
      isSortable: true,
      isPinnable: true,
      position: 2,
      tooltip: null,
    },
    {
      id: 'histology',
      name: 'Histology',
      apiField: 'histology',
      isVisibleByDefault: true,
      pinByDefault: null,
      isSortable: true,
      isPinnable: true,
      position: 3,
      tooltip: null,
    },
    {
      id: 'exp_strat',
      name: 'Exp. Strat.',
      apiField: 'exp_strat',
      isVisibleByDefault: true,
      pinByDefault: null,
      isSortable: true,
      isPinnable: true,
      position: 4,
      tooltip: 'Experimental Strategy',
    },
    {
      id: 'assay_status',
      name: 'Assay Status',
      apiField: 'assay_status',
      isVisibleByDefault: true,
      pinByDefault: null,
      isSortable: true,
      isPinnable: true,
      position: 5,
      tooltip: null,
    },
    {
      id: 'last_update',
      name: 'Last Update',
      apiField: 'last_update',
      isVisibleByDefault: true,
      pinByDefault: null,
      isSortable: true,
      isPinnable: true,
      position: 6,
      tooltip: 'yyyy-mm-dd',
    },
    {
      id: 'actions',
      name: '',
      apiField: 'actions',
      isVisibleByDefault: true,
      pinByDefault: 'right',
      isSortable: false,
      isPinnable: true,
      position: 7,
      tooltip: null,
    },
  ],
};

export const CaseEntity_Details = {
  validations: {
    /**
     * Checks that the tab is active.
     * @param dataAssay The assay object.
     */
    shouldHaveActiveTab() {
      cy.get(selectors.tab).shouldBeActiveTab();
    },
    /**
     * Validates the title of the page.
     * @param dataAssay The assay object.
     */
    shouldHaveAssayDetailsModal(dataAssay: any) {
      cy.get(CommonSelectors.modal).contains(`Assay ${dataAssay.assay_id}`).should('exist');
    },
    /**
     * Validates the title of the page.
     * @param dataCase The case object.
     */
    shouldHaveTitle(dataCase: any) {
      cy.get(CommonSelectors.title).contains(`Case ${dataCase.case}`).should('exist');
    },
  },

  assaysCard: {
    actions: {
      /**
       * Select an object view with the table action button.
       * @param dataAssay The assay object.
       * @param object The object to view (Variants | Assay).
       */
      selectAction(dataAssay: any, object: string) {
        cy.then(() =>
          getColumnPosition(CommonSelectors.tableHead(selectors.assaysCard.tableId), tableColumns.assaysCard, 'actions').then(position => {
            if (position !== -1) {
              cy.get(selectors.assaysCard.tableCell(dataAssay)).eq(position).find('button').clickAndWait({ force: true });
              cy.get(`${CommonSelectors.menuPopper} ${CommonSelectors.menuItem(object)}`).clickAndWait({ force: true });
            } else {
              cy.handleColumnNotFound('actions');
            }
          })
        );
      },
      /**
       * Pins a column in the table by its ID.
       * @param columnID The ID of the column to pin.
       */
      pinColumn(columnID: string) {
        cy.then(() =>
          getColumnPosition(CommonSelectors.tableHead(selectors.assaysCard.tableId), tableColumns.assaysCard, columnID).then(position => {
            cy.pinColumn(position, selectors.assaysCard.tableId);
          })
        );
      },
      /**
       * Sorts a column, optionally using an intercept.
       * @param columnID The ID of the column to sort.
       */
      sortColumn(columnID: string) {
        cy.then(() =>
          getColumnPosition(CommonSelectors.tableHead(selectors.assaysCard.tableId), tableColumns.assaysCard, columnID).then(position => {
            if (position !== -1) {
              cy.sortTableAndWait(position, selectors.assaysCard.tableId);
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
          getColumnPosition(CommonSelectors.tableHead(selectors.assaysCard.tableId), tableColumns.assaysCard, columnID).then(position => {
            cy.unpinColumn(position, selectors.assaysCard.tableId);
          })
        );
      },
    },
    validations: {
      /**
       * Validates the value of the first row for a given column.
       * @param value The expected value (string or RegExp).
       * @param columnID The ID of the column to check.
       */
      shouldHaveFirstRowValue(value: string | RegExp, columnID: string) {
        cy.then(() =>
          getColumnPosition(CommonSelectors.tableHead(selectors.assaysCard.tableId), tableColumns.assaysCard, columnID).then(position => {
            cy.validateTableFirstRowContent(value, position);
          })
        );
      },
      /**
       * Validates the default visibility of each column.
       */
      shouldMatchDefaultColumnVisibility() {
        tableColumns.assaysCard.forEach(column => {
          const expectedExist = column.isVisibleByDefault ? 'exist' : 'not.exist';
          if (column.name.startsWith('[')) {
            cy.get(CommonSelectors.tableHead(selectors.assaysCard.tableId)).find(column.name).should(expectedExist);
          } else {
            cy.get(CommonSelectors.tableHead(selectors.assaysCard.tableId)).contains(stringToRegExp(column.name, true /*exact*/)).should(expectedExist);
          }
        });
      },
      /**
       * Validates the default pin state of each column.
       */
      shouldMatchDefaultPinnedColumns() {
        tableColumns.assaysCard.forEach(column => {
          cy.then(() =>
            getColumnPosition(CommonSelectors.tableHead(selectors.assaysCard.tableId), tableColumns.assaysCard, column.id).then(position => {
              if (position !== -1) {
                cy.get(CommonSelectors.tableHeadCell(selectors.assaysCard.tableId))
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
        tableColumns.assaysCard.forEach(column => {
          if (column.name.startsWith('[')) {
            cy.get(CommonSelectors.tableHeadCell(selectors.assaysCard.tableId)).eq(column.position).find(column.name).should('exist');
          } else {
            cy.get(CommonSelectors.tableHeadCell(selectors.assaysCard.tableId)).eq(column.position).contains(stringToRegExp(column.name, true /*exact*/)).should('exist');
          }
        });
      },
      /**
       * Validates the content of a specific column in the table for a given Assay.
       * @param columnID The ID of the column to validate.
       * @param dataAssay The Assay object containing the expected values.
       */
      shouldShowColumnContent(columnID: string, dataAssay: any) {
        CaseEntity_Details.assaysCard.actions.sortColumn('assay_id');
        CaseEntity_Details.assaysCard.actions.sortColumn('assay_id');
        getColumnPosition(CommonSelectors.tableHead(selectors.assaysCard.tableId), tableColumns.assaysCard, columnID).then(position => {
          if (position !== -1) {
            switch (columnID) {
              case 'sample_id':
                cy.validateTableFirstRowContent(dataAssay[columnID], position, selectors.assaysCard.tableId);
                cy.validateTableFirstRowContent(dataAssay.relationship, position, selectors.assaysCard.tableId);
                cy.validateTableFirstRowClass(CommonSelectors.tagBlank, position, selectors.assaysCard.tableId);
                break;
              case 'sample_type':
              case 'histology':
              case 'exp_strat':
                cy.validateTableFirstRowContent(dataAssay[columnID], position, selectors.assaysCard.tableId);
                cy.validateTableFirstRowClass(CommonSelectors.tagLevel('secondary'), position, selectors.assaysCard.tableId);
                break;
              case 'assay_status':
                cy.validateTableFirstRowContent(dataAssay[columnID], position, selectors.assaysCard.tableId);
                cy.validateTableFirstRowClass(CommonSelectors.statusIcon(getStatusIcon(dataAssay[columnID])), position, selectors.assaysCard.tableId);
                cy.validateTableFirstRowClass(CommonSelectors.tag(getStatusColor(dataAssay[columnID])), position, selectors.assaysCard.tableId);
                break;
              case 'actions':
                cy.validateTableFirstRowClass(CommonSelectors.actionButton, position, selectors.assaysCard.tableId);
                break;
              default:
                cy.validateTableFirstRowContent(dataAssay[columnID], position, selectors.assaysCard.tableId);
                break;
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
        tableColumns.assaysCard.forEach(column => {
          cy.then(() =>
            getColumnPosition(CommonSelectors.tableHead(selectors.assaysCard.tableId), tableColumns.assaysCard, column.id).then(position => {
              if (position !== -1) {
                cy.get(CommonSelectors.tableHeadCell(selectors.assaysCard.tableId)).eq(position).shouldHaveTooltip(column);
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
        tableColumns.assaysCard.forEach(column => {
          cy.then(() =>
            getColumnPosition(CommonSelectors.tableHead(selectors.assaysCard.tableId), tableColumns.assaysCard, column.id).then(position => {
              if (position !== -1) {
                cy.get(CommonSelectors.tableHeadCell(selectors.assaysCard.tableId)).eq(position).shouldBePinnable(column.isPinnable);
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
          getColumnPosition(CommonSelectors.tableHead(selectors.assaysCard.tableId), tableColumns.assaysCard, columnID).then(position => {
            cy.get(CommonSelectors.tableHeadCell(selectors.assaysCard.tableId)).eq(position).shouldBePinned('left');
          })
        );
      },
      /**
       * Validates that sortable columns are correctly marked as sortable.
       */
      shouldShowSortableColumns() {
        tableColumns.assaysCard.forEach(column => {
          cy.then(() =>
            getColumnPosition(CommonSelectors.tableHead(selectors.assaysCard.tableId), tableColumns.assaysCard, column.id).then(position => {
              if (position !== -1) {
                cy.get(CommonSelectors.tableHeadCell(selectors.assaysCard.tableId)).eq(position).shouldBeSortable(column.isSortable);
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
          getColumnPosition(CommonSelectors.tableHead(selectors.assaysCard.tableId), tableColumns.assaysCard, columnID).then(position => {
            cy.get(CommonSelectors.tableHeadCell(selectors.assaysCard.tableId)).eq(position).shouldBePinned(null);
          })
        );
      },
      /**
       * Validates the sorting functionality of a column.
       * @param columnID The ID of the column to sort.
       */
      shouldSortColumn(columnID: string) {
        cy.then(() =>
          getColumnPosition(CommonSelectors.tableHead(selectors.assaysCard.tableId), tableColumns.assaysCard, columnID).then(position => {
            if (position !== -1) {
              CaseEntity_Details.assaysCard.actions.sortColumn(columnID);
              cy.get(CommonSelectors.tableRow(selectors.assaysCard.tableId))
                .eq(0)
                .find(CommonSelectors.tableCellData)
                .eq(position)
                .invoke('text')
                .then(biggestValue => {
                  const biggest = biggestValue.trim();

                  CaseEntity_Details.assaysCard.actions.sortColumn(columnID);
                  cy.get(CommonSelectors.tableRow(selectors.assaysCard.tableId))
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
    },
  },
};
