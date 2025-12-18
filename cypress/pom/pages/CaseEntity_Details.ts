/// <reference types="cypress"/>
import { CommonSelectors } from 'pom/shared/Selectors';
import { getColumnPosition, getStatusColor, getStatusIcon, stringToRegExp } from 'pom/shared/Utils';

const selectors = {
  tab: '[class*= "lucide-clipboard-list"]',

  sequencingCard: {
    tableCell: (dataSeq: any) => `${CommonSelectors.tableRow(selectors.sequencingCard.tableId)}:contains("${dataSeq.relationship}") ${CommonSelectors.tableCellData}`,
    tableId: '[id="sequencing-and-assays"]',
  },
};

const tableColumns = {
  sequencingCard: [
    {
      id: 'seq_id',
      name: 'Seq. ID',
      apiField: 'seq_id',
      isVisibleByDefault: true,
      pinByDefault: null,
      isSortable: true,
      isPinnable: true,
      position: 0,
      tooltip: 'Sequencing Experiment ID',
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
      id: 'relationship',
      name: 'Patient',
      apiField: 'relationship_to_proband',
      isVisibleByDefault: true,
      pinByDefault: null,
      isSortable: true,
      isPinnable: true,
      position: 2,
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
      position: 3,
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
      position: 4,
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
      position: 5,
      tooltip: 'Experimental Strategy',
    },
    {
      id: 'seq_status',
      name: 'Seq. Status',
      apiField: 'seq_status',
      isVisibleByDefault: true,
      pinByDefault: null,
      isSortable: true,
      isPinnable: true,
      position: 6,
      tooltip: 'Sequencing Experiment Status',
    },
    {
      id: 'last_update',
      name: 'Last Update',
      apiField: 'last_update',
      isVisibleByDefault: true,
      pinByDefault: null,
      isSortable: true,
      isPinnable: true,
      position: 7,
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
      position: 8,
      tooltip: null,
    },
  ],
};

export const CaseEntity_Details = {
  validations: {
    /**
     * Checks that the tab is active.
     * @param dataSeq The seq object.
     */
    shouldHaveActiveTab() {
      cy.get(selectors.tab).shouldBeActiveTab();
    },
    /**
     * Validates the title of the page.
     * @param dataSeq The seq object.
     */
    shouldHaveSeqDetailsModal(dataSeq: any) {
      cy.get(CommonSelectors.modal).contains(`Sequencing ${dataSeq.seq_id}`).should('exist');
    },
    /**
     * Validates the title of the page.
     * @param dataCase The case object.
     */
    shouldHaveTitle(dataCase: any) {
      cy.get(CommonSelectors.title).contains(`Case ${dataCase.case}`).should('exist');
    },
  },

  sequencingCard: {
    actions: {
      /**
       * Select an object view with the table action button.
       * @param dataSeq The seq object.
       */
      clickDetailsButton(dataSeq: any) {
        cy.then(() =>
          getColumnPosition(CommonSelectors.tableHead(selectors.sequencingCard.tableId), tableColumns.sequencingCard, 'actions').then(position => {
            if (position !== -1) {
              cy.get(selectors.sequencingCard.tableCell(dataSeq)).eq(position).find(CommonSelectors.detailsButton).clickAndWait({ force: true });
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
          getColumnPosition(CommonSelectors.tableHead(selectors.sequencingCard.tableId), tableColumns.sequencingCard, columnID).then(position => {
            cy.pinColumn(position, selectors.sequencingCard.tableId);
          })
        );
      },
      /**
       * Sorts a column, optionally using an intercept.
       * @param columnID The ID of the column to sort.
       */
      sortColumn(columnID: string) {
        cy.then(() =>
          getColumnPosition(CommonSelectors.tableHead(selectors.sequencingCard.tableId), tableColumns.sequencingCard, columnID).then(position => {
            if (position !== -1) {
              cy.sortTableAndWait(position, selectors.sequencingCard.tableId);
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
          getColumnPosition(CommonSelectors.tableHead(selectors.sequencingCard.tableId), tableColumns.sequencingCard, columnID).then(position => {
            cy.unpinColumn(position, selectors.sequencingCard.tableId);
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
          getColumnPosition(CommonSelectors.tableHead(selectors.sequencingCard.tableId), tableColumns.sequencingCard, columnID).then(position => {
            cy.validateTableFirstRowContent(value, position, selectors.sequencingCard.tableId);
          })
        );
      },
      /**
       * Validates the default visibility of each column.
       */
      shouldMatchDefaultColumnVisibility() {
        tableColumns.sequencingCard.forEach(column => {
          const expectedExist = column.isVisibleByDefault ? 'exist' : 'not.exist';
          if (column.name.startsWith('[')) {
            cy.get(CommonSelectors.tableHead(selectors.sequencingCard.tableId)).find(column.name).should(expectedExist);
          } else {
            cy.get(CommonSelectors.tableHead(selectors.sequencingCard.tableId)).contains(stringToRegExp(column.name, true /*exact*/)).should(expectedExist);
          }
        });
      },
      /**
       * Validates the default pin state of each column.
       */
      shouldMatchDefaultPinnedColumns() {
        tableColumns.sequencingCard.forEach(column => {
          cy.then(() =>
            getColumnPosition(CommonSelectors.tableHead(selectors.sequencingCard.tableId), tableColumns.sequencingCard, column.id).then(position => {
              if (position !== -1) {
                cy.get(CommonSelectors.tableHeadCell(selectors.sequencingCard.tableId))
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
        tableColumns.sequencingCard.forEach(column => {
          if (column.name.startsWith('[')) {
            cy.get(CommonSelectors.tableHeadCell(selectors.sequencingCard.tableId)).eq(column.position).find(column.name).should('exist');
          } else {
            cy.get(CommonSelectors.tableHeadCell(selectors.sequencingCard.tableId)).eq(column.position).contains(stringToRegExp(column.name, true /*exact*/)).should('exist');
          }
        });
      },
      /**
       * Validates the content of a specific column in the table for a given Seq.
       * @param columnID The ID of the column to validate.
       * @param dataSeq The Seq object containing the expected values.
       */
      shouldShowColumnContent(columnID: string, dataSeq: any) {
        CaseEntity_Details.sequencingCard.actions.sortColumn('seq_id');
        CaseEntity_Details.sequencingCard.actions.sortColumn('seq_id');
        getColumnPosition(CommonSelectors.tableHead(selectors.sequencingCard.tableId), tableColumns.sequencingCard, columnID).then(position => {
          if (position !== -1) {
            switch (columnID) {
              case 'relationship':
              case 'histology':
                cy.validateTableFirstRowContent(dataSeq[columnID], position, selectors.sequencingCard.tableId);
                cy.validateTableFirstRowClass(CommonSelectors.tagBlank, position);
                break;
              case 'sample_type':
              case 'exp_strat':
                cy.validateTableFirstRowContent(dataSeq[columnID], position, selectors.sequencingCard.tableId);
                cy.validateTableFirstRowClass(CommonSelectors.tagLevel('secondary'), position, selectors.sequencingCard.tableId);
                break;
              case 'seq_status':
                cy.validateTableFirstRowContent(dataSeq[columnID], position, selectors.sequencingCard.tableId);
                cy.validateTableFirstRowClass(CommonSelectors.statusIcon(getStatusIcon(dataSeq[columnID])), position, selectors.sequencingCard.tableId);
                cy.validateTableFirstRowClass(CommonSelectors.tag(getStatusColor(dataSeq[columnID])), position, selectors.sequencingCard.tableId);
                break;
              case 'actions':
                cy.validateTableFirstRowClass(CommonSelectors.detailsButton, position, selectors.sequencingCard.tableId);
                break;
              default:
                cy.validateTableFirstRowContent(dataSeq[columnID], position, selectors.sequencingCard.tableId);
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
        tableColumns.sequencingCard.forEach(column => {
          cy.then(() =>
            getColumnPosition(CommonSelectors.tableHead(selectors.sequencingCard.tableId), tableColumns.sequencingCard, column.id).then(position => {
              if (position !== -1) {
                cy.get(CommonSelectors.tableHeadCell(selectors.sequencingCard.tableId)).eq(position).shouldHaveTooltip(column);
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
        tableColumns.sequencingCard.forEach(column => {
          cy.then(() =>
            getColumnPosition(CommonSelectors.tableHead(selectors.sequencingCard.tableId), tableColumns.sequencingCard, column.id).then(position => {
              if (position !== -1) {
                cy.get(CommonSelectors.tableHeadCell(selectors.sequencingCard.tableId)).eq(position).shouldBePinnable(column.isPinnable);
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
          getColumnPosition(CommonSelectors.tableHead(selectors.sequencingCard.tableId), tableColumns.sequencingCard, columnID).then(position => {
            cy.get(CommonSelectors.tableHeadCell(selectors.sequencingCard.tableId)).eq(position).shouldBePinned('left');
          })
        );
      },
      /**
       * Validates that sortable columns are correctly marked as sortable.
       */
      shouldShowSortableColumns() {
        tableColumns.sequencingCard.forEach(column => {
          cy.then(() =>
            getColumnPosition(CommonSelectors.tableHead(selectors.sequencingCard.tableId), tableColumns.sequencingCard, column.id).then(position => {
              if (position !== -1) {
                cy.get(CommonSelectors.tableHeadCell(selectors.sequencingCard.tableId)).eq(position).shouldBeSortable(column.isSortable);
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
          getColumnPosition(CommonSelectors.tableHead(selectors.sequencingCard.tableId), tableColumns.sequencingCard, columnID).then(position => {
            cy.get(CommonSelectors.tableHeadCell(selectors.sequencingCard.tableId)).eq(position).shouldBePinned(null);
          })
        );
      },
      /**
       * Validates the sorting functionality of a column.
       * @param columnID The ID of the column to sort.
       */
      shouldSortColumn(columnID: string) {
        cy.then(() =>
          getColumnPosition(CommonSelectors.tableHead(selectors.sequencingCard.tableId), tableColumns.sequencingCard, columnID).then(position => {
            if (position !== -1) {
              CaseEntity_Details.sequencingCard.actions.sortColumn(columnID);
              cy.get(CommonSelectors.tableRow(selectors.sequencingCard.tableId))
                .eq(0)
                .find(CommonSelectors.tableCellData)
                .eq(position)
                .invoke('text')
                .then(biggestValue => {
                  const biggest = biggestValue.trim();

                  CaseEntity_Details.sequencingCard.actions.sortColumn(columnID);
                  cy.get(CommonSelectors.tableRow(selectors.sequencingCard.tableId))
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
