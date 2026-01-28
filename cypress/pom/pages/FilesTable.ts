/// <reference types="cypress"/>
import { CommonSelectors } from '../shared/Selectors';
import { getUrlLink, stringToRegExp } from '../shared/Utils';
import { getColumnName, getColumnPosition } from '../shared/Utils';

const selectors = {
  tableCell: (dataFile: any) => `${CommonSelectors.tableRow()}:contains("${dataFile.name}") ${CommonSelectors.tableCellData}`,
};

const tableColumns = [
  {
    id: 'name',
    name: 'File Name',
    apiField: 'name',
    isVisibleByDefault: true,
    pinByDefault: null,
    isSortable: true,
    isPinnable: true,
    position: 0,
    tooltip: null,
  },
  {
    id: 'format',
    name: 'Format',
    apiField: 'format_code',
    isVisibleByDefault: true,
    pinByDefault: null,
    isSortable: true,
    isPinnable: true,
    position: 1,
    tooltip: null,
  },
  {
    id: 'type',
    name: 'Type',
    apiField: 'data_type_code',
    isVisibleByDefault: true,
    pinByDefault: null,
    isSortable: true,
    isPinnable: true,
    position: 2,
    tooltip: null,
  },
  {
    id: 'size',
    name: 'Size',
    apiField: 'size',
    isVisibleByDefault: true,
    pinByDefault: null,
    isSortable: true,
    isPinnable: true,
    position: 3,
    tooltip: null,
  },
  {
    id: 'case',
    name: 'Case',
    apiField: 'case_id',
    isVisibleByDefault: true,
    pinByDefault: null,
    isSortable: true,
    isPinnable: true,
    position: 4,
    tooltip: null,
  },
  {
    id: 'diag_lab',
    name: 'Diag. Lab',
    apiField: 'diagnosis_lab_code',
    isVisibleByDefault: true,
    pinByDefault: null,
    isSortable: false,
    isPinnable: true,
    position: 5,
    tooltip: null,
  },
  {
    id: 'relationship',
    name: 'Relationship',
    apiField: 'relationship_to_proband_code',
    isVisibleByDefault: true,
    pinByDefault: null,
    isSortable: true,
    isPinnable: true,
    position: 6,
    tooltip: null,
  },
  {
    id: 'patient',
    name: 'Patient',
    apiField: 'patient_id',
    isVisibleByDefault: true,
    pinByDefault: null,
    isSortable: true,
    isPinnable: true,
    position: 7,
    tooltip: null,
  },
  {
    id: 'sample',
    name: 'Sample',
    apiField: 'submitter_sample_id',
    isVisibleByDefault: true,
    pinByDefault: null,
    isSortable: true,
    isPinnable: true,
    position: 8,
    tooltip: null,
  },
  {
    id: 'task',
    name: 'Task',
    apiField: 'task_id',
    isVisibleByDefault: true,
    pinByDefault: null,
    isSortable: true,
    isPinnable: true,
    position: 9,
    tooltip: null,
  },
  {
    id: 'created_on',
    name: 'Created On',
    apiField: 'created_on',
    isVisibleByDefault: true,
    pinByDefault: null,
    isSortable: true,
    isPinnable: true,
    position: 10,
    tooltip: 'Date of case creation (yyyy-mm-dd)',
  },
  {
    id: 'sequencing',
    name: 'Sequencing',
    apiField: 'seq_id',
    isVisibleByDefault: false,
    pinByDefault: null,
    isSortable: true,
    isPinnable: true,
    position: 11,
    tooltip: null,
  },
  {
    id: 'hash',
    name: 'Hash',
    apiField: 'hash',
    isVisibleByDefault: false,
    pinByDefault: null,
    isSortable: true,
    isPinnable: true,
    position: 12,
    tooltip: null,
  },
  {
    id: 'run',
    name: 'Run',
    apiField: 'run_alias',
    isVisibleByDefault: false,
    pinByDefault: null,
    isSortable: true,
    isPinnable: true,
    position: 13,
    tooltip: null,
  },
];

export const FilesTable = {
  actions: {
    /**
     * Click the specific button to change table paging
     * @param buttonName The button name to click (First | Last | Previous | Next | Select)
     */
    clickPaginationButton(buttonName: string) {
      cy.get(CommonSelectors.paginationButton(buttonName)).clickAndWait({ force: true });
    },
    /**
     * Clicks the link in a specific table cell for a given file and column.
     * @param dataFile The file object.
     * @param columnID The ID of the column.
     */
    clickTableCellLink(dataFile: any, columnID: string) {
      cy.then(() =>
        getColumnPosition(CommonSelectors.tableHead(), tableColumns, columnID).then(position => {
          if (position !== -1) {
            switch (columnID) {
              default:
                cy.get(selectors.tableCell(dataFile)).eq(position).find(CommonSelectors.link).clickAndWait({ force: true });
                break;
            }
          } else {
            cy.handleColumnNotFound(columnID);
          }
        })
      );
    },
    /**
     * Hides a specific column in the table.
     * @param columnID The ID of the column to hide.
     */
    hideColumn(columnID: string) {
      cy.hideColumn(getColumnName(tableColumns, columnID));
    },
    /**
     * Pins a specific column in the table.
     * @param columnID The ID of the column to pin.
     */
    pinColumn(columnID: string) {
      cy.then(() =>
        getColumnPosition(CommonSelectors.tableHead(), tableColumns, columnID).then(position => {
          if (position !== -1) {
            cy.pinColumn(position);
          } else {
            cy.handleColumnNotFound(columnID);
          }
        })
      );
    },
    /**
     * Select an object view with the table action button.
     * @param dataFile The file object.
     * @param object The object to view (File | Variants).
     */
    selectAction(dataFile: any, object: string) {
      cy.then(() =>
        getColumnPosition(CommonSelectors.tableHead(), tableColumns, 'actions').then(position => {
          if (position !== -1) {
            cy.get(selectors.tableCell(dataFile)).eq(position).find('button').clickAndWait({ force: true });
            cy.get(`${CommonSelectors.menuPopper} ${CommonSelectors.menuItem(object)}`).clickAndWait({ force: true });
          } else {
            cy.handleColumnNotFound('actions');
          }
        })
      );
    },
    /**
     * Shows all columns in the table.
     */
    showAllColumns() {
      tableColumns.forEach(column => {
        if (!column.isVisibleByDefault) {
          cy.showColumn(column.name);
        }
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
        getColumnPosition(CommonSelectors.tableHead(), tableColumns, columnID).then(position => {
          if (position !== -1) {
            if (needIntercept) {
              cy.sortTableAndIntercept(position, '**/documents/search', 1);
            } else {
              cy.sortTableAndWait(position);
            }
          } else {
            cy.handleColumnNotFound(columnID);
          }
        })
      );
    },
    /**
     * Unpins a specific column in the table.
     * @param columnID The ID of the column to unpin.
     */
    unpinColumn(columnID: string) {
      cy.then(() =>
        getColumnPosition(CommonSelectors.tableHead(), tableColumns, columnID).then(position => {
          cy.unpinColumn(position);
        })
      );
    },
  },

  validations: {
    /**
     * Checks that a specific column is displayed.
     * @param columnID The ID of the column to check.
     */
    shouldDisplayColumn(columnID: string) {
      cy.get(CommonSelectors.tableHead()).contains(getColumnName(tableColumns, columnID)).should('exist');
    },
    /**
     * Validates the value of the first row for a given column.
     * @param value The expected value (string or RegExp).
     * @param columnID The ID of the column to check.
     */
    shouldHaveFirstRowValue(value: string | RegExp, columnID: string) {
      cy.then(() =>
        getColumnPosition(CommonSelectors.tableHead(), tableColumns, columnID).then(position => {
          cy.validateTableFirstRowContent(value, position);
        })
      );
    },
    /**
     * Validates the link in a specific table cell for a given file and column.
     * @param dataFile The file object.
     * @param columnID The ID of the column.
     */
    shouldHaveTableCellLink(dataFile: any, columnID: string) {
      cy.then(() =>
        getColumnPosition(CommonSelectors.tableHead(), tableColumns, columnID).then(position => {
          if (position !== -1) {
            cy.get(selectors.tableCell(dataFile)).eq(position).find(CommonSelectors.link).should('have.attr', 'href', getUrlLink(columnID, dataFile));
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
        if (column.name.startsWith('[')) {
          cy.get(CommonSelectors.tableHead()).find(column.name).should(expectedExist);
        } else {
          cy.get(CommonSelectors.tableHead()).contains(stringToRegExp(column.name, true /*exact*/)).should(expectedExist);
        }
      });
    },
    /**
     * Validates the default pin state of each column.
     */
    shouldMatchDefaultPinnedColumns() {
      FilesTable.actions.showAllColumns();
      tableColumns.forEach(column => {
        cy.then(() =>
          getColumnPosition(CommonSelectors.tableHead(), tableColumns, column.id).then(position => {
            if (position !== -1) {
              cy.get(CommonSelectors.tableHeadCell())
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
     * Checks that a specific column is not displayed.
     * @param columnID The ID of the column to check.
     */
    shouldNotDisplayColumn(columnID: string) {
      cy.get(CommonSelectors.tableHead()).contains(getColumnName(tableColumns, columnID)).should('not.exist');
    },
    /**
     * Validates that a specific column is pinned to the left side.
     * @param columnID The ID of the column to check.
     */
    shouldPinnedColumn(columnID: string) {
      cy.then(() =>
        getColumnPosition(CommonSelectors.tableHead(), tableColumns, columnID).then(position => {
          if (position !== -1) {
            cy.get(CommonSelectors.tableHeadCell()).eq(position).shouldBePinned('left');
          } else {
            cy.handleColumnNotFound(columnID);
          }
        })
      );
    },
    /**
     * Validates the sent requests to api on page change functionality.
     */
    shouldRequestOnPageChange() {
      cy.intercept('POST', '**/search', req => {
        expect(req.body.limit).to.deep.equal(20);
        expect(req.body.page_index).to.deep.equal(0);
        req.continue();
      }).as('searchRequest1');
      cy.visitFilesPage();
      cy.wait('@searchRequest1');
      cy.waitWhileLoad(60*1000);

      cy.intercept('POST', '**/search', req => {
        expect(req.body.limit).to.deep.equal(20);
        expect(req.body.page_index).to.deep.equal(1);
        req.continue();
      }).as('searchRequest2');
      FilesTable.actions.clickPaginationButton('Next');
      cy.wait('@searchRequest2');
      cy.waitWhileLoad(60*1000);

      cy.intercept('POST', '**/search', req => {
        expect(req.body.limit).to.deep.equal(20);
        expect(req.body.page_index).to.deep.equal(2);
        req.continue();
      }).as('searchRequest3');
      FilesTable.actions.clickPaginationButton('Next');
      cy.wait('@searchRequest3');
      cy.waitWhileLoad(60*1000);

      cy.intercept('POST', '**/search', req => {
        expect(req.body.limit).to.deep.equal(20);
        expect(req.body.page_index).to.deep.equal(1);
        req.continue();
      }).as('searchRequest4');
      FilesTable.actions.clickPaginationButton('Previous');
      cy.wait('@searchRequest4');
      cy.waitWhileLoad(60*1000);

      cy.intercept('POST', '**/search', req => {
        expect(req.body.limit).to.deep.equal(20);
        expect(req.body.page_index).to.deep.equal(0);
        req.continue();
      }).as('searchRequest5');
      FilesTable.actions.clickPaginationButton('First');
      cy.wait('@searchRequest5');
    },
    /**
     * Validates the sent request to api on sorting functionality of a column.
     * @param columnID The ID of the column to sort.
     */
    shouldRequestOnSort(columnID: string) {
      FilesTable.actions.showAllColumns();
      cy.intercept('POST', '**/documents/search', req => {
        expect(req.body.sort).to.have.length(1);
        expect(req.body.sort).to.deep.include({ field: tableColumns.find(col => col.id === columnID)?.apiField, order: 'asc' });
      }).as('sortRequest');
      FilesTable.actions.sortColumn(columnID, false /*needIntercept*/);
      cy.wait('@sortRequest');
    },
    /**
     * Validates that all columns are displayed in the correct order in the table.
     */
    shouldShowAllColumns() {
      FilesTable.actions.showAllColumns();
      tableColumns.forEach(column => {
        if (column.name.startsWith('[')) {
          cy.get(CommonSelectors.tableHeadCell()).eq(column.position).find(column.name).should('exist');
        } else {
          cy.get(CommonSelectors.tableHeadCell()).eq(column.position).contains(stringToRegExp(column.name, true /*exact*/)).should('exist');
        }
      });
    },
    /**
     * Validates the content of a specific column in the table for a given file.
     * @param columnID The ID of the column to validate.
     * @param dataFile The file object containing the expected values.
     */
    shouldShowColumnContent(columnID: string, dataFile: any) {
      FilesTable.actions.showAllColumns();
      getColumnPosition(CommonSelectors.tableHead(), tableColumns, columnID).then(position => {
        if (position !== -1) {
          switch (columnID) {
            case 'format':
            case 'type':
            case 'relationship':
              cy.validateTableFirstRowContent(dataFile[columnID], position);
              cy.validateTableFirstRowClass(CommonSelectors.tagBlank, position);
              break;
            default:
              cy.validateTableFirstRowContent(dataFile[columnID], position);
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
      FilesTable.actions.showAllColumns();
      tableColumns.forEach(column => {
        cy.then(() =>
          getColumnPosition(CommonSelectors.tableHead(), tableColumns, column.id).then(position => {
            if (position !== -1) {
              cy.get(CommonSelectors.tableHeadCell()).eq(position).shouldHaveTooltip(column);
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
      FilesTable.actions.showAllColumns();
      tableColumns.forEach(column => {
        cy.then(() =>
          getColumnPosition(CommonSelectors.tableHead(), tableColumns, column.id).then(position => {
            if (position !== -1) {
              cy.get(CommonSelectors.tableHeadCell()).eq(position).shouldBePinnable(column.isPinnable);
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
      FilesTable.actions.showAllColumns();
      tableColumns.forEach(column => {
        cy.then(() =>
          getColumnPosition(CommonSelectors.tableHead(), tableColumns, column.id).then(position => {
            if (position !== -1) {
              cy.get(CommonSelectors.tableHeadCell()).eq(position).shouldBeSortable(column.isSortable);
            } else {
              cy.handleColumnNotFound(column.id);
            }
          })
        );
      });
    },
    /**
     * Validates the sorting functionality of a column with mocked data.
     * @param columnID The ID of the column to sort.
     */
    shouldSortColumn(columnID: string) {
      FilesTable.actions.showAllColumns();
      const apiField = tableColumns.find(col => col.id === columnID)?.apiField!;

      cy.fixture('RequestBody/SortFile.json').then(mockRequestBody => {
        cy.intercept('POST', '**/documents/search', req => {
          const mockBody = { ...mockRequestBody };
          mockBody.sort.field = apiField;
          mockBody.sort.order = 'asc';
          req.alias = 'sortRequestAsc';
          req.body = mockBody;
        });
        FilesTable.actions.sortColumn(columnID, false /*needIntercept*/);
        cy.wait('@sortRequestAsc').then(interceptionAsc => {
          const smallest = interceptionAsc.response?.body.list[0][apiField];

          cy.fixture('RequestBody/SortFile.json').then(mockRequestBody => {
            cy.intercept('POST', '**/documents/search', req => {
              const mockBody = { ...mockRequestBody };
              mockBody.sort.field = apiField;
              mockBody.sort.order = 'desc';
              req.alias = 'sortRequestDesc';
              req.body = mockBody;
            });
            FilesTable.actions.sortColumn(columnID, false /*needIntercept*/);
            cy.wait('@sortRequestDesc').then(interceptionDesc => {
              const biggest = interceptionDesc.response?.body.list[0][apiField];
              if (typeof smallest === 'number' ? Number(biggest) - Number(smallest) : String(biggest).localeCompare(String(smallest)) < 0) {
                throw new Error(`Error: "${biggest}" should be >= "${smallest}"`);
              }
            });
          });
        });
      });
    },
    /**
     * Validates that a specific column is unpinned.
     * @param columnID The ID of the column to check.
     */
    shouldUnpinnedColumn(columnID: string) {
      cy.then(() =>
        getColumnPosition(CommonSelectors.tableHead(), tableColumns, columnID).then(position => {
          cy.get(CommonSelectors.tableHeadCell()).eq(position).shouldBePinned(null);
        })
      );
    },
  },
};
