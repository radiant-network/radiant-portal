/// <reference types="cypress"/>
import { CommonSelectors } from 'pom/shared/Selectors';
import { getColumnPosition, getStatusColor, getStatusIcon, stringToRegExp } from 'pom/shared/Utils';

const selectors = {
  tab: '[data-cy="details-tab"]',

  bioinformaticsCard: {
    tableCell: (bioinfoSeq: any) => `${CommonSelectors.tableRow(selectors.bioinformaticsCard.tableId)}:contains("${bioinfoSeq.type}") ${CommonSelectors.tableCellData}`,
    tableId: '[data-cy="bioinformatics-table"]',
  },
  sequencingCard: {
    tableCell: (dataSeq: any) => `${CommonSelectors.tableRow(selectors.sequencingCard.tableId)}:contains("${dataSeq.relationship}") ${CommonSelectors.tableCellData}`,
    tableId: '[id="sequencing-experiments"]',
  },
};

const tableColumns = {
  bioinformaticsCard: [
    {
      id: 'task_id',
      name: 'Task ID',
      apiField: 'task_id',
      isVisibleByDefault: true,
      pinByDefault: null,
      isSortable: false,
      isPinnable: false,
      position: 0,
      tooltip: null,
    },
    {
      id: 'type',
      name: 'Type',
      apiField: 'type_name',
      isVisibleByDefault: true,
      pinByDefault: null,
      isSortable: false,
      isPinnable: false,
      position: 1,
      tooltip: null,
    },
    {
      id: 'patient',
      name: 'Patient',
      apiField: 'patients',
      isVisibleByDefault: true,
      pinByDefault: null,
      isSortable: false,
      isPinnable: false,
      position: 2,
      tooltip: null,
    },
    {
      id: 'created_on',
      name: 'Created On',
      apiField: 'created_on',
      isVisibleByDefault: true,
      pinByDefault: null,
      isSortable: false,
      isPinnable: false,
      position: 3,
      tooltip: 'yyyy-mm-dd',
    },
  ],
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

const generateTableActionsFunctions = (tableId: string, columns: any[]) => ({
  /**
   * Select an object view with the table action button.
   * @param data The data object.
   * @param tableCellSelector Function that returns the table cell selector.
   */
  clickDetailsButton(data: any, tableCellSelector: (data: any) => string) {
    cy.then(() =>
      getColumnPosition(CommonSelectors.tableHead(tableId), columns, 'actions').then(position => {
        if (position !== -1) {
          cy.get(tableCellSelector(data)).eq(position).find(CommonSelectors.detailsButton).clickAndWait({ force: true });
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
   * Validates the value of the first row for a given column.
   * @param value The expected value (string or RegExp).
   * @param columnID The ID of the column to check.
   */
  shouldHaveFirstRowValue(value: string | RegExp, columnID: string) {
    cy.then(() =>
      getColumnPosition(CommonSelectors.tableHead(tableId), columns, columnID).then(position => {
        cy.validateTableFirstRowContent(value, position, tableId);
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
   * Validates the content of a specific column in the table for a given Seq.
   * @param columnID The ID of the column to validate.
   * @param data The data object containing the expected values.
   */
  shouldShowColumnContent(columnID: string, data: any, sortAction: () => void) {
    sortAction();
    sortAction();
    getColumnPosition(CommonSelectors.tableHead(tableId), columns, columnID).then(position => {
      if (position !== -1) {
        if (customColumnContent) {
          customColumnContent(columnID, data, position);
        } else {
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
   * @param hasUniqueValues The data of the column to sort has unique values.
   */
  shouldSortColumn(columnID: string, hasUniqueValues: boolean, sortAction: () => void) {
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
                  if (hasUniqueValues) {
                    if (biggest.localeCompare(smallest) !== 0) {
                      throw new Error(`Error: "${biggest}" should be equal to "${smallest}" (unique values expected)`);
                    }
                  } else {
                    if (biggest.localeCompare(smallest) <= 0) {
                      throw new Error(`Error: "${biggest}" should be > "${smallest}"`);
                    }
                  }
                });
            });
        }
      })
    );
  },
});

const bioinformaticsColumnContentHandler = (columnID: string, data: any, position: number) => {
  const tableId = selectors.bioinformaticsCard.tableId;
    switch (columnID) {
      case 'patient':
        cy.validateTableFirstRowContent(data[columnID], position, tableId);
        cy.validateTableFirstRowClass(CommonSelectors.tagBlank, position);
        break;
      case 'type':
        cy.validateTableFirstRowContent(data[columnID], position, tableId);
        cy.validateTableFirstRowClass(CommonSelectors.tagLevel('secondary'), position, tableId);
        break;
      default:
        cy.validateTableFirstRowContent(data[columnID], position, tableId);
        break;
    }
};

const sequencingColumnContentHandler = (columnID: string, data: any, position: number) => {
  const tableId = selectors.sequencingCard.tableId;
    switch (columnID) {
      case 'relationship':
      case 'histology':
        cy.validateTableFirstRowContent(data[columnID], position, tableId);
        cy.validateTableFirstRowClass(CommonSelectors.tagBlank, position);
        break;
      case 'sample_type':
      case 'exp_strat':
        cy.validateTableFirstRowContent(data[columnID], position, tableId);
        cy.validateTableFirstRowClass(CommonSelectors.tagLevel('secondary'), position, tableId);
        break;
      case 'seq_status':
        cy.validateTableFirstRowContent(data[columnID], position, tableId);
        cy.validateTableFirstRowClass(CommonSelectors.statusIcon(getStatusIcon(data[columnID])), position, tableId);
        cy.validateTableFirstRowClass(CommonSelectors.tag(getStatusColor(data[columnID])), position, tableId);
        break;
      case 'actions':
        cy.validateTableFirstRowClass(CommonSelectors.detailsButton, position, tableId);
        break;
      default:
        cy.validateTableFirstRowContent(data[columnID], position, tableId);
        break;
    }
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


  bioinformaticsCard: {
    actions: (() => {
      const baseActions = generateTableActionsFunctions(selectors.bioinformaticsCard.tableId, tableColumns.bioinformaticsCard);
      return {
        ...baseActions,
        clickDetailsButton(data: any) {
          baseActions.clickDetailsButton(data, (data) => selectors.bioinformaticsCard.tableCell(data));
        },
      };
    })(),
    validations: (() => {
      const actions = generateTableActionsFunctions(selectors.bioinformaticsCard.tableId, tableColumns.bioinformaticsCard);
      const baseValidations = generateTableValidationsFunctions(selectors.bioinformaticsCard.tableId, tableColumns.bioinformaticsCard, bioinformaticsColumnContentHandler);
      return {
        ...baseValidations,
        shouldShowColumnContent(columnID: string, data: any) {
          baseValidations.shouldShowColumnContent(columnID, data, () => null);
        },
        shouldSortColumn(columnID: string, hasUniqueValues: boolean) {
          baseValidations.shouldSortColumn(columnID, hasUniqueValues, () => actions.sortColumn(columnID));
        },
      };
    })(),
  },
  sequencingCard: {
    actions: (() => {
      const baseActions = generateTableActionsFunctions(selectors.sequencingCard.tableId, tableColumns.sequencingCard);
      return {
        ...baseActions,
        clickDetailsButton(data: any) {
          baseActions.clickDetailsButton(data, (data) => selectors.sequencingCard.tableCell(data));
        },
      };
    })(),
    validations: (() => {
      const actions = generateTableActionsFunctions(selectors.sequencingCard.tableId, tableColumns.sequencingCard);
      const baseValidations = generateTableValidationsFunctions(selectors.sequencingCard.tableId, tableColumns.sequencingCard, sequencingColumnContentHandler);
      return {
        ...baseValidations,
        shouldShowColumnContent(columnID: string, data: any) {
          baseValidations.shouldShowColumnContent(columnID, data, () => actions.sortColumn('seq_id'));
        },
        shouldSortColumn(columnID: string, hasUniqueValues: boolean) {
          baseValidations.shouldSortColumn(columnID, hasUniqueValues, () => actions.sortColumn(columnID));
        },
      };
    })(),
  },
};
