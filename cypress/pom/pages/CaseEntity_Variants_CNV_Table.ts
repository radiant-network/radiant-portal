/// <reference types="cypress"/>
import { CommonSelectors } from '../shared/Selectors';
import { getUrlLink, stringToRegExp } from '../shared/Utils';
import { getColumnName, getColumnPosition } from '../shared/Utils';

const selectors = {
  tableCell: (dataCNV: any) => `${CommonSelectors.tableRow()}:contains("${dataCNV.cnv_variant}") ${CommonSelectors.tableCellData}`,
  tab: '[class*= "lucide-audio-waveform"]',
  toggle: 'button[id*= "trigger-cnv"]',
};

const tableColumns = [
  {
    id: 'genes',
    name: 'Genes',
    apiField: 'symbol',
    isVisibleByDefault: true,
    pinByDefault: null,
    isSortable: false,
    isPinnable: true,
    position: 0,
    tooltip: 'List of genes overlapped by CNV',
  },
  {
    id: 'cytoband',
    name: 'Cytoband',
    apiField: 'cytoband',
    isVisibleByDefault: true,
    pinByDefault: null,
    isSortable: false,
    isPinnable: true,
    position: 1,
    tooltip: null,
  },
  {
    id: 'nb_snv',
    name: '# SNVs',
    apiField: 'nb_snv',
    isVisibleByDefault: true,
    pinByDefault: null,
    isSortable: true,
    isPinnable: true,
    position: 2,
    tooltip: 'Number of SNVs included in the CNV',
  },
  {
    id: 'cnv_variant',
    name: 'Variant',
    apiField: 'name',
    isVisibleByDefault: true,
    pinByDefault: null,
    isSortable: true,
    isPinnable: true,
    position: 3,
    tooltip: null,
  },
  {
    id: 'clingen',
    name: 'ClinGen',
    apiField: null,
    isVisibleByDefault: true,
    pinByDefault: null,
    isSortable: false,
    isPinnable: true,
    position: 4,
    tooltip: null,
  },
  {
    id: 'chromosome',
    name: 'Chr',
    apiField: 'chromosome',
    isVisibleByDefault: true,
    pinByDefault: null,
    isSortable: true,
    isPinnable: true,
    position: 5,
    tooltip: 'Chromosome',
  },
  {
    id: 'start',
    name: 'Start',
    apiField: 'start',
    isVisibleByDefault: true,
    pinByDefault: null,
    isSortable: true,
    isPinnable: true,
    position: 6,
    tooltip: null,
  },
  {
    id: 'end',
    name: 'End',
    apiField: 'end',
    isVisibleByDefault: true,
    pinByDefault: null,
    isSortable: true,
    isPinnable: true,
    position: 7,
    tooltip: null,
  },
  {
    id: 'type',
    name: 'Type',
    apiField: 'type',
    isVisibleByDefault: true,
    pinByDefault: null,
    isSortable: true,
    isPinnable: true,
    position: 8,
    tooltip: null,
  },
  {
    id: 'length',
    name: 'Length',
    apiField: 'length',
    isVisibleByDefault: true,
    pinByDefault: null,
    isSortable: true,
    isPinnable: true,
    position: 9,
    tooltip: 'CNV bases length',
  },
  {
    id: 'cn',
    name: 'CN',
    apiField: 'cn',
    isVisibleByDefault: true,
    pinByDefault: null,
    isSortable: true,
    isPinnable: true,
    position: 10,
    tooltip: 'Estimated copy number',
  },
  {
    id: 'gnomad',
    name: 'gnomAD',
    apiField: 'gnomad_sf',
    isVisibleByDefault: true,
    pinByDefault: null,
    isSortable: true,
    isPinnable: true,
    position: 11,
    tooltip: 'gnomAD 4.1.0 (Allele Frequency)',
  },
  {
    id: 'nb_genes',
    name: '# Genes',
    apiField: 'nb_genes',
    isVisibleByDefault: true,
    pinByDefault: null,
    isSortable: true,
    isPinnable: true,
    position: 12,
    tooltip: 'Number of genes overlapped by CNV',
  },
  {
    id: 'gt',
    name: 'GT',
    apiField: 'gt',
    isVisibleByDefault: false,
    pinByDefault: null,
    isSortable: false,
    isPinnable: true,
    position: 13,
    tooltip: 'Genotype',
  },
  {
    id: 'filter',
    name: 'Filter',
    apiField: 'filter',
    isVisibleByDefault: false,
    pinByDefault: null,
    isSortable: false,
    isPinnable: true,
    position: 14,
    tooltip: null,
  },
  {
    id: 'quality',
    name: 'Qual.',
    apiField: 'quality',
    isVisibleByDefault: false,
    pinByDefault: null,
    isSortable: false,
    isPinnable: true,
    position: 15,
    tooltip: 'CNV Quality',
  },
  {
    id: 'bc',
    name: 'BC',
    apiField: 'bc',
    isVisibleByDefault: false,
    pinByDefault: null,
    isSortable: true,
    isPinnable: true,
    position: 16,
    tooltip: 'Number of bins in the region',
  },
  {
    id: 'pe',
    name: 'PE',
    apiField: 'pe',
    isVisibleByDefault: false,
    pinByDefault: null,
    isSortable: false,
    isPinnable: true,
    position: 17,
    tooltip: 'Number of improperly paired end reads at start and stop breakpoints',
  },
];

export const CaseEntity_Variants_CNV_Table = {
  actions: {
    /**
     * Clicks the link in a specific table cell for a given cnv and column.
     * @param dataCNV The cnv object.
     * @param columnID The ID of the column.
     */
    clickTableCellLink(dataCNV: any, columnID: string) {
      cy.then(() =>
        getColumnPosition(CommonSelectors.tableHead(), tableColumns, columnID).then(position => {
          if (position !== -1) {
            switch (columnID) {
              default:
                cy.get(selectors.tableCell(dataCNV)).eq(position).find(CommonSelectors.link).clickAndWait({ force: true });
                break;
            }
          } else {
            cy.handleColumnNotFound(columnID);
          }
        })
      );
    },
    /**
     * Click the toggle button to change variants type
     */
    clickToggle() {
      cy.get(selectors.toggle).clickAndWait({ force: true });
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
    /**
     * Shrink all columns in the table.
     */
    shrinkAllColumns() {
      tableColumns.forEach(column => {
        getColumnPosition(CommonSelectors.tableHead(), tableColumns, column.id).then(position => {
          if (position !== -1) {
            cy.get(CommonSelectors.tableHeadCell()).eq(position).invoke('css', 'width', '1px');
          } else {
            cy.handleColumnNotFound(column.id);
          }
        });
      });
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
  },

  validations: {
    /**
     * Checks that the drawer is displayed.
     * @param dataCNV The cnv object.
     */
    shouldDrawerOpen(dataCNV: any) {
      cy.get(CommonSelectors.animateIn).contains(dataCNV.cnv).should('exist');
    },
    /**
     * Checks that a specific column is displayed.
     * @param columnID The ID of the column to check.
     */
    shouldDisplayColumn(columnID: string) {
      cy.get(CommonSelectors.tableHead()).contains(getColumnName(tableColumns, columnID)).should('exist');
    },
    /**
     * Checks that the tab and toggle are active.
     */
    shouldHaveActiveTabAndToggle() {
      cy.get(selectors.tab).shouldBeActiveTab();
      cy.get(selectors.toggle).shouldBeDataState('active');
    },
    /**
     * Checks that custom query is not implemented for this page.
     */
    shouldHaveCustomQuery() {
      cy.get(`${CommonSelectors.querybarSelected} ${CommonSelectors.saveIcon}`).should('not.exist');
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
     * Validates the pill in the selected query.
     * @param dataCNV The cnv object.
     * @param columnID The ID of the column to check.
     */
    shouldHaveSelectedQueryPill(dataCNV: any, columnID: string) {
      switch (columnID) {
        case 'gene':
          cy.validatePillSelectedQuery('Gene Symbol', [dataCNV[columnID].toLowerCase()]);
          break;
        default:
          cy.validatePillSelectedQuery(getColumnName(tableColumns, columnID), [dataCNV[columnID]]);
          break;
      }
    },
    /**
     * Validates the link in a specific table cell for a given cnv and column.
     * @param dataCNV The cnv object.
     * @param columnID The ID of the column.
     */
    shouldHaveTableCellLink(dataCNV: any, columnID: string) {
      cy.then(() =>
        getColumnPosition(CommonSelectors.tableHead(), tableColumns, columnID).then(position => {
          if (position !== -1) {
            cy.get(selectors.tableCell(dataCNV)).eq(position).find(CommonSelectors.link).should('have.attr', 'href', getUrlLink(columnID, dataCNV));
          } else {
            cy.handleColumnNotFound(columnID);
          }
        })
      );
    },
    /**
     * Validates the title of the page.
     * @param dataCase The case object.
     */
    shouldHaveTitle(dataCase: any) {
      cy.get(CommonSelectors.title).contains(`Case ${dataCase.case}`).should('exist');
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
      CaseEntity_Variants_CNV_Table.actions.showAllColumns();
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
     * Checks that the overlapping modal is displayed.
     */
    shouldOverlappingModalOpen() {
      cy.get(CommonSelectors.animateIn).contains(`Overlapping Genes with CNV`).should('exist');
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
     * Validates the request sent to api on sorting functionality of a column.
     * @param columnID The ID of the column to sort.
     */
    shouldRequestOnSort(columnID: string) {
      CaseEntity_Variants_CNV_Table.actions.showAllColumns();
      cy.intercept('POST', '**/list', req => {
        expect(req.body.sort).to.have.length(1);
        expect(req.body.sort).to.deep.include({ field: tableColumns.find(col => col.id === columnID)?.apiField, order: 'desc' });
      }).as('sortRequest');
      CaseEntity_Variants_CNV_Table.actions.sortColumn(columnID, false /*needIntercept*/);
      cy.wait('@sortRequest');
    },
    /**
     * Validates that all columns are displayed in the correct order in the table.
     */
    shouldShowAllColumns() {
      CaseEntity_Variants_CNV_Table.actions.showAllColumns();
      tableColumns.forEach(column => {
        if (column.name.startsWith('[')) {
          cy.get(CommonSelectors.tableHeadCell()).eq(column.position).find(column.name).should('exist');
        } else {
          cy.get(CommonSelectors.tableHeadCell()).eq(column.position).contains(stringToRegExp(column.name, true /*exact*/)).should('exist');
        }
      });
    },
    /**
     * Validates the content of a specific column in the table for a given cnv.
     * @param columnID The ID of the column to validate.
     * @param dataCNV The cnv object containing the expected values.
     */
    shouldShowColumnContent(columnID: string, dataCNV: any) {
      CaseEntity_Variants_CNV_Table.actions.showAllColumns();
      getColumnPosition(CommonSelectors.tableHead(), tableColumns, columnID).then(position => {
        if (position !== -1) {
          switch (columnID) {
            case 'clingen':
              cy.validateTableFirstRowClass(CommonSelectors.anchorIcon, position);
              break;
            case 'gnomad':
              cy.validateTableFirstRowContent(dataCNV[columnID], position);
              cy.validateTableFirstRowClass(CommonSelectors.gnomadRedIcon, position);
              break;
            default:
              cy.validateTableFirstRowContent(dataCNV[columnID], position);
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
      CaseEntity_Variants_CNV_Table.actions.showAllColumns();
      tableColumns.forEach(column => {
        cy.then(() =>
          getColumnPosition(CommonSelectors.tableHead(), tableColumns, column.id).then(position => {
            if (position !== -1) {
              CaseEntity_Variants_CNV_Table.actions.shrinkAllColumns();
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
      CaseEntity_Variants_CNV_Table.actions.showAllColumns();
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
      CaseEntity_Variants_CNV_Table.actions.showAllColumns();
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
      CaseEntity_Variants_CNV_Table.actions.showAllColumns();
      const apiField = tableColumns.find(col => col.id === columnID)?.apiField!;

      cy.fixture('RequestBody/SortVariant.json').then(mockRequestBody => {
        cy.intercept('POST', '**/list', req => {
          const mockBody = { ...mockRequestBody };
          mockBody.sort.field = apiField;
          mockBody.sort.order = 'asc';
          req.alias = 'sortRequestAsc';
          req.body = mockBody;
        });
        CaseEntity_Variants_CNV_Table.actions.sortColumn(columnID, false /*needIntercept*/);
        cy.wait('@sortRequestAsc').then(interceptionAsc => {
          const smallest = interceptionAsc.response?.body[0][apiField];

          cy.fixture('RequestBody/SortVariant.json').then(mockRequestBody => {
            cy.intercept('POST', '**/list', req => {
              const mockBody = { ...mockRequestBody };
              mockBody.sort.field = apiField;
              mockBody.sort.order = 'desc';
              req.alias = 'sortRequestDesc';
              req.body = mockBody;
            });
            CaseEntity_Variants_CNV_Table.actions.sortColumn(columnID, false /*needIntercept*/);
            cy.wait('@sortRequestDesc').then(interceptionDesc => {
              const biggest = interceptionDesc.response?.body[0][apiField];
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
