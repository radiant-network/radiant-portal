/// <reference types="cypress"/>
import { data } from 'pom/shared/Data';
import { CommonSelectors } from '../shared/Selectors';
import { getPriorityColor, getStatusColor, getStatusIcon, getUrlLink, stringToRegExp } from '../shared/Utils';
import { getColumnName, getColumnPosition } from '../shared/Utils';

const selectors = {
  tableCell: (dataCase: any) => `${CommonSelectors.tableRow()}:contains("${dataCase.case}") ${CommonSelectors.tableCellData}`,
};

const tableColumns = [
  {
    id: 'case',
    name: 'Case',
    apiField: 'case_id',
    isVisibleByDefault: true,
    pinByDefault: null,
    isSortable: true,
    isPinnable: true,
    position: 0,
    tooltip: null,
  },
  {
    id: 'patient',
    name: 'Patient',
    apiField: 'proband_id',
    isVisibleByDefault: false,
    pinByDefault: null,
    isSortable: true,
    isPinnable: true,
    position: 1,
    tooltip: null,
  },
  {
    id: 'mrn',
    name: 'MRN',
    apiField: 'submitter_proband_id',
    isVisibleByDefault: true,
    pinByDefault: null,
    isSortable: true,
    isPinnable: true,
    position: 2,
    tooltip: `Patient's medical record number`,
  },
  {
    id: 'priority',
    name: 'Priority',
    apiField: 'priority_code',
    isVisibleByDefault: true,
    pinByDefault: null,
    isSortable: true,
    isPinnable: true,
    position: 3,
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
    position: 4,
    tooltip: null,
  },
  {
    id: 'type',
    name: 'Type',
    apiField: 'case_type',
    isVisibleByDefault: true,
    pinByDefault: null,
    isSortable: false,
    isPinnable: true,
    position: 5,
    tooltip: /(?=.*Somatic)(?=.*Solo germline)(?=.*Family germline)/, // RegExp that checks that all 3 are present (in any order)
  },
  {
    id: 'analysis',
    name: 'Analysis',
    apiField: 'analysis_catalog_code',
    isVisibleByDefault: true,
    pinByDefault: null,
    isSortable: true,
    isPinnable: true,
    position: 6,
    tooltip: null,
  },
  {
    id: 'primary_condition',
    name: 'Primary Condition',
    apiField: 'primary_condition_id',
    isVisibleByDefault: false,
    pinByDefault: null,
    isSortable: true,
    isPinnable: true,
    position: 7,
    tooltip: null,
  },
  {
    id: 'req_by',
    name: 'Req. By',
    apiField: 'ordering_organization_code',
    isVisibleByDefault: true,
    pinByDefault: null,
    isSortable: true,
    isPinnable: true,
    position: 8,
    tooltip: 'Requested by',
  },
  {
    id: 'project',
    name: 'Project',
    apiField: 'project_code',
    isVisibleByDefault: false,
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
    isVisibleByDefault: false,
    pinByDefault: null,
    isSortable: true,
    isPinnable: true,
    position: 10,
    tooltip: 'Date of case creation (yyyy-mm-dd)',
  },
  {
    id: 'updated_on',
    name: 'Updated',
    apiField: 'updated_on',
    isVisibleByDefault: true,
    pinByDefault: null,
    isSortable: true,
    isPinnable: true,
    position: 11,
    tooltip: 'Date of last case modification (yyyy-mm-dd)',
  },
  {
    id: 'prescriber',
    name: 'Prescriber',
    apiField: 'prescriber',
    isVisibleByDefault: false,
    pinByDefault: null,
    isSortable: true,
    isPinnable: true,
    position: 12,
    tooltip: 'Prescribing doctor',
  },
  {
    id: 'diagnostic_lab',
    name: 'Diagnostic Lab',
    apiField: 'diagnosis_lab_code',
    isVisibleByDefault: false,
    pinByDefault: null,
    isSortable: true,
    isPinnable: true,
    position: 13,
    tooltip: 'Molecular diagnostic laboratory',
  },
  {
    id: 'managing_org',
    name: 'Managing Org.',
    apiField: 'organization_code',
    isVisibleByDefault: false,
    pinByDefault: null,
    isSortable: true,
    isPinnable: true,
    position: 14,
    tooltip: 'Organization managing the patient’s file',
  },
  {
    id: 'actions',
    name: '',
    apiField: 'has_variants',
    isVisibleByDefault: true,
    pinByDefault: 'right',
    isSortable: false,
    isPinnable: true,
    position: 15,
    tooltip: null,
  },
];

export const CasesTable = {
  actions: {
    /**
     * Click the specific button to change table paging
     * @param buttonName The button name to click (First | Last | Previous | Next | Select)
     */
    clickPaginationButton(buttonName: string) {
      cy.get(CommonSelectors.paginationButton(buttonName)).clickAndWait({ force: true });
    },
    /**
     * Clicks the link in a specific table cell for a given case and column.
     * @param dataCase The case object.
     * @param columnID The ID of the column.
     */
    clickTableCellLink(dataCase: any, columnID: string) {
      cy.then(() =>
        getColumnPosition(CommonSelectors.tableHead(), tableColumns, columnID).then(position => {
          if (position !== -1) {
            switch (columnID) {
              default:
                cy.get(selectors.tableCell(dataCase)).eq(position).find(CommonSelectors.link).clickAndWait({ force: true });
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
     * @param dataCase The case object.
     * @param object The object to view (Case | Variants).
     */
    selectAction(dataCase: any, object: string) {
      cy.then(() =>
        getColumnPosition(CommonSelectors.tableHead(), tableColumns, 'actions').then(position => {
          if (position !== -1) {
            cy.get(selectors.tableCell(dataCase)).eq(position).find('button').clickAndWait({ force: true });
            cy.get(`${CommonSelectors.menuPopper} ${CommonSelectors.menuItem(object)}`).clickAndWait({ force: true });
          } else {
            cy.handleColumnNotFound('actions');
          }
        })
      );
    },
    /**
     * Select a suggestion in the list.
     * @param field The field of the suggestion to select.
     * @param value The value of the suggestion to select.
     */
    selectSuggestion(field: string, value: string) {
      cy.get(CommonSelectors.suggestionItem(field, value)).clickAndWait({ force: true });
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
              cy.sortTableAndIntercept(position, '**/list', 1);
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
     * Types in the search input.
     * @param text The text to search.
     * @param needIntercept Whether to use an intercept (default: true).
     */
    typeSearch(text: string, needIntercept: boolean = true) {
      if (needIntercept) {
        cy.intercept('GET', `**/cases/autocomplete?prefix=${text}**`).as('autocompleteRequest');
        cy.get(CommonSelectors.searchInput).type(text);
        cy.wait('@autocompleteRequest');
      } else {
        cy.get(CommonSelectors.searchInput).type(text);
      }
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
     * Validates the link in a specific table cell for a given case and column.
     * @param dataCase The case object.
     * @param columnID The ID of the column.
     */
    shouldHaveTableCellLink(dataCase: any, columnID: string) {
      cy.then(() =>
        getColumnPosition(CommonSelectors.tableHead(), tableColumns, columnID).then(position => {
          if (position !== -1) {
            cy.get(selectors.tableCell(dataCase)).eq(position).find(CommonSelectors.link).should('have.attr', 'href', getUrlLink(columnID, dataCase));
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
      CasesTable.actions.showAllColumns();
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
      cy.visitCasesPage();
      cy.wait('@searchRequest1');
      cy.waitWhileLoad(60*1000);

      cy.intercept('POST', '**/search', req => {
        expect(req.body.limit).to.deep.equal(20);
        expect(req.body.page_index).to.deep.equal(1);
        req.continue();
      }).as('searchRequest2');
      CasesTable.actions.clickPaginationButton('Next');
      cy.wait('@searchRequest2');
      cy.waitWhileLoad(60*1000);

      cy.intercept('POST', '**/search', req => {
        expect(req.body.limit).to.deep.equal(20);
        expect(req.body.page_index).to.deep.equal(0);
        req.continue();
      }).as('searchRequest3');
      CasesTable.actions.clickPaginationButton('Previous');
      cy.wait('@searchRequest3');
      cy.waitWhileLoad(60*1000);

      cy.intercept('POST', '**/search', req => {
        expect(req.body.limit).to.deep.equal(20);
        expect(req.body.page_index).to.deep.equal(1);
        req.continue();
      }).as('searchRequest4');
      CasesTable.actions.clickPaginationButton('Next');
      cy.wait('@searchRequest4');
      cy.waitWhileLoad(60*1000);

      cy.intercept('POST', '**/search', req => {
        expect(req.body.limit).to.deep.equal(20);
        expect(req.body.page_index).to.deep.equal(0);
        req.continue();
      }).as('searchRequest5');
      CasesTable.actions.clickPaginationButton('First');
      cy.wait('@searchRequest5');
    },
    /**
     * Validates the sent request to api on search selecting functionality.
     */
    shouldRequestOnSearchSelect() {
      const caseField = tableColumns.find(col => col.id === 'case')?.apiField || '';
      const caseValue = data.case.case;
      CasesTable.actions.typeSearch(caseValue);
      cy.intercept('POST', '**/cases/search', req => {
        expect(req.body.search_criteria).to.have.length(1);
        expect(req.body.search_criteria).to.deep.include({ field: caseField, value: [caseValue] });
      }).as('searchRequest');
      CasesTable.actions.selectSuggestion(caseField, caseValue);
      cy.wait('@searchRequest');
    },
    /**
     * Validates the sent request to api on search typing functionality.
     */
    shouldRequestOnSearchTyping() {
      const caseValue = data.case.case;
      cy.intercept('GET', `**/cases/autocomplete?prefix=${caseValue}**`).as('autocompleteRequest');
      CasesTable.actions.typeSearch(caseValue, false /*needIntercept*/);
      cy.wait('@autocompleteRequest');
    },
    /**
     * Validates the sent request to api on sorting functionality of a column.
     * @param columnID The ID of the column to sort.
     */
    shouldRequestOnSort(columnID: string) {
      CasesTable.actions.showAllColumns();
      cy.intercept('POST', '**/cases/search', req => {
        expect(req.body.sort).to.have.length(1);
        expect(req.body.sort).to.deep.include({ field: tableColumns.find(col => col.id === columnID)?.apiField, order: 'desc' });
      }).as('sortRequest');
      CasesTable.actions.sortColumn(columnID, false /*needIntercept*/);
      cy.wait('@sortRequest');
    },
    /**
     * Validates that all columns are displayed in the correct order in the table.
     */
    shouldShowAllColumns() {
      CasesTable.actions.showAllColumns();
      tableColumns.forEach(column => {
        if (column.name.startsWith('[')) {
          cy.get(CommonSelectors.tableHeadCell()).eq(column.position).find(column.name).should('exist');
        } else {
          cy.get(CommonSelectors.tableHeadCell()).eq(column.position).contains(stringToRegExp(column.name, true /*exact*/)).should('exist');
        }
      });
    },
    /**
     * Validates the content of a specific column in the table for a given case.
     * @param columnID The ID of the column to validate.
     * @param dataCase The case object containing the expected values.
     */
    shouldShowColumnContent(columnID: string, dataCase: any) {
      CasesTable.actions.showAllColumns();
      getColumnPosition(CommonSelectors.tableHead(), tableColumns, columnID).then(position => {
        if (position !== -1) {
          switch (columnID) {
            case 'priority':
              cy.validateTableFirstRowContent(dataCase[columnID], position);
              cy.validateTableFirstRowClass(CommonSelectors.colorIndicator(getPriorityColor(dataCase[columnID])), position);
              break;
            case 'status':
              cy.validateTableFirstRowContent(dataCase[columnID], position);
              cy.validateTableFirstRowClass(CommonSelectors.statusIcon(getStatusIcon(dataCase[columnID])), position);
              cy.validateTableFirstRowClass(CommonSelectors.tag(getStatusColor(dataCase[columnID])), position);
              break;
            case 'type':
              cy.validateTableFirstRowClass(dataCase[columnID], position);
              break;
            case 'primary_condition':
              cy.validateTableFirstRowContent(dataCase.primary_condition_name, position);
              cy.validateTableFirstRowContent(dataCase.primary_condition_id, position);
              break;
            case 'actions':
              cy.validateTableFirstRowClass(CommonSelectors.actionButton, position);
              break;
            default:
              cy.validateTableFirstRowContent(dataCase[columnID], position);
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
      CasesTable.actions.showAllColumns();
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
      CasesTable.actions.showAllColumns();
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
      CasesTable.actions.showAllColumns();
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
     * Validates the content of the suggestion list from mock api response.
     */
    shouldShowSuggestionListFromMock() {
      cy.fixture('ResponseBody/AutocompleteCase.json').then(mockResponseBody => {
        cy.intercept('GET', `**/cases/autocomplete?prefix=1**`, req => {
          req.alias = 'autocompleteResponse';
          req.reply(mockResponseBody);
        });

        CasesTable.actions.typeSearch('1', false /*needIntercept*/);
        cy.wait('@autocompleteResponse');

        mockResponseBody.forEach((item: any) => {
          cy.get(CommonSelectors.suggestionItem(item.type, item.value)).should('exist');
        });
      });
    },
    /**
     * Validates the sorting functionality of a column with mocked data.
     * @param columnID The ID of the column to sort.
     */
    shouldSortColumn(columnID: string) {
      CasesTable.actions.showAllColumns();
      const apiField = tableColumns.find(col => col.id === columnID)?.apiField!;

      cy.fixture('RequestBody/SortCase.json').then(mockRequestBody => {
        cy.intercept('POST', '**/cases/search', req => {
          const mockBody = { ...mockRequestBody };
          mockBody.sort.field = apiField;
          mockBody.sort.order = 'asc';
          req.alias = 'sortRequestAsc';
          req.body = mockBody;
        });
        CasesTable.actions.sortColumn(columnID, false /*needIntercept*/);
        cy.wait('@sortRequestAsc').then(interceptionAsc => {
          const smallest = interceptionAsc.response?.body.list[0][apiField];

          cy.fixture('RequestBody/SortCase.json').then(mockRequestBody => {
            cy.intercept('POST', '**/cases/search', req => {
              const mockBody = { ...mockRequestBody };
              mockBody.sort.field = apiField;
              mockBody.sort.order = 'desc';
              req.alias = 'sortRequestDesc';
              req.body = mockBody;
            });
            CasesTable.actions.sortColumn(columnID, false /*needIntercept*/);
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
