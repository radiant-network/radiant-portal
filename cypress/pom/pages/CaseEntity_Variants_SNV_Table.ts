/// <reference types="cypress"/>
import { CommonSelectors } from '../shared/Selectors';
import { getUrlLink, stringToRegExp } from '../shared/Utils';
import { getColumnName, getColumnPosition } from '../shared/Utils';

const selectors = {
  tableCell: (dataVariant: any) => `${CommonSelectors.tableRow()}:contains("${dataVariant.variant}") ${CommonSelectors.tableCellData}`,
  tab: '[data-cy="variants-tab"]',
  toggle: '[data-cy="tabs-trigger-snv"]',
};

const tableColumns = [
  {
    id: 'interpretation',
    name: CommonSelectors.interpretationIcon,
    apiField: 'has_interpretation',
    isVisibleByDefault: true,
    pinByDefault: 'left',
    isSortable: false,
    isPinnable: false,
    position: 0,
    tooltip: 'Clinical Interpretation',
  },
  {
    id: 'variant',
    name: 'Variant',
    apiField: 'hgvsg',
    isVisibleByDefault: true,
    pinByDefault: 'left',
    isSortable: true,
    isPinnable: true,
    position: 1,
    tooltip: null,
  },
  {
    id: 'gene',
    name: 'Gene',
    apiField: 'symbol',
    isVisibleByDefault: true,
    pinByDefault: null,
    isSortable: false,
    isPinnable: true,
    position: 2,
    tooltip: null,
  },
  {
    id: 'aa_change',
    name: 'AA',
    apiField: 'aa_change',
    isVisibleByDefault: true,
    pinByDefault: null,
    isSortable: false,
    isPinnable: true,
    position: 3,
    tooltip: 'Amino acid change',
  },
  {
    id: 'type',
    name: 'Type',
    apiField: 'variant_class',
    isVisibleByDefault: true,
    pinByDefault: null,
    isSortable: true,
    isPinnable: true,
    position: 4,
    tooltip: null,
  },
  {
    id: 'consequence',
    name: 'Consequence',
    apiField: 'picked_consequences',
    isVisibleByDefault: true,
    pinByDefault: null,
    isSortable: true,
    isPinnable: true,
    position: 5,
    tooltip: 'Most deleterious consequence annotated using VEP',
  },
  {
    id: 'mane',
    name: 'MANE',
    apiField: 'is_canonical',
    isVisibleByDefault: true,
    pinByDefault: null,
    isSortable: false,
    isPinnable: true,
    position: 6,
    tooltip: null,
  },
  {
    id: 'dbsnp',
    name: 'dbSNP',
    apiField: 'rsnumber',
    isVisibleByDefault: true,
    pinByDefault: null,
    isSortable: false,
    isPinnable: true,
    position: 7,
    tooltip: null,
  },
  {
    id: 'omim',
    name: 'OMIM',
    apiField: 'omim_inheritance_code',
    isVisibleByDefault: true,
    pinByDefault: null,
    isSortable: false,
    isPinnable: true,
    position: 8,
    tooltip: 'MIM inheritance modes',
  },
  {
    id: 'clinvar',
    name: 'ClinVar',
    apiField: 'clinvar',
    isVisibleByDefault: true,
    pinByDefault: null,
    isSortable: false,
    isPinnable: true,
    position: 9,
    tooltip: null,
  },
  {
    id: 'exomiser',
    name: 'Exo.',
    apiField: 'exomiser_gene_combined_score',
    isVisibleByDefault: true,
    pinByDefault: null,
    isSortable: true,
    isPinnable: true,
    position: 10,
    tooltip: 'Exomiser score based on variant properties and patient phenotypes',
  },
  {
    id: 'acmg_exomiser',
    name: 'ACMG Exo.',
    apiField: 'exomiser_acmg_classification',
    isVisibleByDefault: true,
    pinByDefault: null,
    isSortable: true,
    isPinnable: true,
    position: 11,
    tooltip: 'Exomiser ACMG',
  },
  {
    id: 'gnomad',
    name: 'gnomAD',
    apiField: 'gnomad_v3_af',
    isVisibleByDefault: true,
    pinByDefault: null,
    isSortable: true,
    isPinnable: true,
    position: 12,
    tooltip: 'gnomAD Genome 3.1.2 (allele Frequency)',
  },
  {
    id: 'freq',
    name: 'Freq.',
    apiField: 'pf_wgs',
    isVisibleByDefault: true,
    pinByDefault: null,
    isSortable: true,
    isPinnable: true,
    position: 13,
    tooltip: 'Number of germline genomes containing this variant and their frequency across this network. Only occurrences with Filter = PASS and GQ ≥ 20 are taken into account for frequency calculation.',
  },
  {
    id: 'gq',
    name: 'GQ',
    apiField: 'genotype_quality',
    isVisibleByDefault: true,
    pinByDefault: null,
    isSortable: true,
    isPinnable: true,
    position: 14,
    tooltip: 'Genotype quality: only occurrences with GQ ≥ 20 are taken into account for frequency calculation.',
  },
  {
    id: 'zyg',
    name: 'Zyg.',
    apiField: 'zygosity',
    isVisibleByDefault: true,
    pinByDefault: null,
    isSortable: false,
    isPinnable: true,
    position: 15,
    tooltip: 'Zygosity',
  },
  {
    id: 'ad_ratio',
    name: 'AD Ratio',
    apiField: 'ad_ratio',
    isVisibleByDefault: true,
    pinByDefault: null,
    isSortable: true,
    isPinnable: true,
    position: 16,
    tooltip: null,
  },
  {
    id: 'actions',
    name: '',
    apiField: '',
    isVisibleByDefault: true,
    pinByDefault: 'right',
    isSortable: false,
    isPinnable: true,
    position: 17,
    tooltip: null,
  },
];

export const CaseEntity_Variants_SNV_Table = {
  actions: {
    /**
     * Clicks the link in a specific table cell for a given variant and column.
     * @param dataVariant The variant object.
     * @param columnID The ID of the column.
     * @param onPlusIcon Click on the plus icon (default: false).
     */
    clickTableCellLink(dataVariant: any, columnID: string, onPlusIcon: boolean = false) {
      cy.then(() =>
        getColumnPosition(CommonSelectors.tableHead(), tableColumns, columnID).then(position => {
          if (position !== -1) {
            switch (columnID) {
              case 'variant':
              case 'freq':
                cy.get(selectors.tableCell(dataVariant)).eq(position).find(CommonSelectors.link).invoke('removeAttr', 'target').clickAndWait({ force: true });
                break;
              case 'gene':
                if (onPlusIcon) {
                  cy.get(selectors.tableCell(dataVariant)).eq(position).find(CommonSelectors.plusIcon).clickAndWait({ force: true });
                } else {
                  cy.get(selectors.tableCell(dataVariant)).eq(position).find(CommonSelectors.link).clickAndWait({ force: true });
                }
                break;
              default:
                cy.get(selectors.tableCell(dataVariant)).eq(position).find(CommonSelectors.link).clickAndWait({ force: true });
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
     * Select an action with the table action button.
     * @param dataVariant The variant object.
     * @param action The action to do (Preview | Open Page | Open in IGV | UCSC | LitVar).
     */
    selectAction(dataVariant: any, action: string) {
      cy.then(() =>
        getColumnPosition(CommonSelectors.tableHead(), tableColumns, 'actions').then(position => {
          if (position !== -1) {
            cy.get(selectors.tableCell(dataVariant)).eq(position).find(CommonSelectors.actionButton).clickAndWait({ force: true });
            cy.get(`${CommonSelectors.menuPopper} ${CommonSelectors.menuItem(action)}`).clickAndWait({ force: true });
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
     * Shrink all columns in the table.
     */
    shrinkAllColumns() {
      cy.get(CommonSelectors.tableHeadCell()).invoke('css', 'width', '1px');
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
     * Checks that the drawer is displayed.
     * @param dataVariant The variant object.
     */
    shouldDrawerOpen(dataVariant: any) {
      cy.get(CommonSelectors.animateIn).contains(dataVariant.variant).should('exist');
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
     * @param dataVariant The variant object.
     * @param columnID The ID of the column to check.
     */
    shouldHaveSelectedQueryPill(dataVariant: any, columnID: string) {
      switch (columnID) {
        case 'gene':
          cy.validatePillSelectedQuery('Gene Symbol', [dataVariant[columnID].toLowerCase()]);
          break;
        default:
          cy.validatePillSelectedQuery(getColumnName(tableColumns, columnID), [dataVariant[columnID]]);
          break;
      }
    },
    /**
     * Validates the link in a specific table cell for a given variant and column.
     * @param dataVariant The variant object.
     * @param columnID The ID of the column.
     */
    shouldHaveTableCellLink(dataVariant: any, columnID: string) {
      cy.then(() =>
        getColumnPosition(CommonSelectors.tableHead(), tableColumns, columnID).then(position => {
          if (position !== -1) {
            cy.get(selectors.tableCell(dataVariant)).eq(position).find(CommonSelectors.link).should('have.attr', 'href', getUrlLink(columnID, dataVariant));
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
      CaseEntity_Variants_SNV_Table.actions.showAllColumns();
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
     * Validates the request sent to api on sorting functionality of a column.
     * @param columnID The ID of the column to sort.
     */
    shouldRequestOnSort(columnID: string) {
      CaseEntity_Variants_SNV_Table.actions.showAllColumns();
      cy.intercept('POST', '**/list', req => {
        expect(req.body.sort).to.have.length(1);
        expect(req.body.sort).to.deep.include({ field: tableColumns.find(col => col.id === columnID)?.apiField, order: 'asc' });
      }).as('sortRequest');
      CaseEntity_Variants_SNV_Table.actions.sortColumn(columnID, false /*needIntercept*/);
      cy.wait('@sortRequest');
    },
    /**
     * Validates that all columns are displayed in the correct order in the table.
     */
    shouldShowAllColumns() {
      CaseEntity_Variants_SNV_Table.actions.showAllColumns();
      tableColumns.forEach(column => {
        if (column.name.startsWith('[')) {
          cy.get(CommonSelectors.tableHeadCell()).eq(column.position).find(column.name).should('exist');
        } else {
          cy.get(CommonSelectors.tableHeadCell()).eq(column.position).contains(stringToRegExp(column.name, true /*exact*/)).should('exist');
        }
      });
    },
    /**
     * Validates the content of a specific column in the table for a given variant.
     * @param columnID The ID of the column to validate.
     * @param dataVariant The variant object containing the expected values.
     */
    shouldShowColumnContent(columnID: string, dataVariant: any) {
      CaseEntity_Variants_SNV_Table.actions.showAllColumns();
      getColumnPosition(CommonSelectors.tableHead(), tableColumns, columnID).then(position => {
        if (position !== -1) {
          switch (columnID) {
            case 'interpretation':
              cy.validateTableFirstRowClass(CommonSelectors.interpretationIcon, position);
              break;
            case 'dbsnp':
              cy.validateTableFirstRowClass(CommonSelectors.anchorIcon, position);
              break;
            case 'gene':
              cy.validateTableFirstRowContent(dataVariant[columnID], position);
              cy.validateTableFirstRowClass(CommonSelectors.plusIcon, position);
              break;
            case 'aa_change':
              cy.validateTableFirstRowContent(dataVariant.aa_change, position);
              break;
            case 'type':
              cy.validateTableFirstRowContent(dataVariant[columnID], position);
              cy.validateTableFirstRowClass(CommonSelectors.tagBlank, position);
              break;
            case 'consequence':
              cy.validateTableFirstRowClass(dataVariant.consequenceImpact, position);
              cy.validateTableFirstRowContent(dataVariant[columnID], position);
              break;
            case 'mane':
              cy.get(selectors.tableCell(dataVariant))
                .eq(position)
                .find(CommonSelectors.maneCPath)
                .should(dataVariant.maneC ? 'exist' : 'not.exist');
              cy.get(selectors.tableCell(dataVariant))
                .eq(position)
                .find(CommonSelectors.maneMPath)
                .should(dataVariant.maneM ? 'exist' : 'not.exist');
              cy.get(selectors.tableCell(dataVariant))
                .eq(position)
                .find(CommonSelectors.manePPath)
                .should(dataVariant.maneP ? 'exist' : 'not.exist');
              break;
            case 'omim':
              cy.validateTableFirstRowContent(dataVariant.omim.inheritance, position);
              cy.validateTableFirstRowClass(CommonSelectors.tagBlank, position);
              break;
            case 'clinvar':
              cy.validateTableFirstRowContent(dataVariant.clinvar.classification, position);
              cy.validateTableFirstRowClass(CommonSelectors.tag('lime'), position);
              break;
            case 'acmg_exomiser':
              dataVariant[columnID].forEach((value: string | RegExp) => {
                cy.validateTableFirstRowContent(value, position);
              });
              cy.validateTableFirstRowClass(CommonSelectors.tag('lime'), position);
              break;
            case 'gnomad':
              cy.validateTableFirstRowContent(dataVariant[columnID], position);
              cy.validateTableFirstRowClass(CommonSelectors.gnomadRedIcon, position);
              break;
            case 'actions':
              cy.validateTableFirstRowClass(CommonSelectors.anchorIcon, position);
              cy.validateTableFirstRowClass(CommonSelectors.actionButton, position);
              break;
            default:
              cy.validateTableFirstRowContent(dataVariant[columnID], position);
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
      CaseEntity_Variants_SNV_Table.actions.showAllColumns();
      tableColumns.forEach(column => {
        cy.then(() =>
          getColumnPosition(CommonSelectors.tableHead(), tableColumns, column.id).then(position => {
            if (position !== -1) {
              CaseEntity_Variants_SNV_Table.actions.shrinkAllColumns();
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
      CaseEntity_Variants_SNV_Table.actions.showAllColumns();
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
      CaseEntity_Variants_SNV_Table.actions.showAllColumns();
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
      CaseEntity_Variants_SNV_Table.actions.showAllColumns();
      const apiField = tableColumns.find(col => col.id === columnID)?.apiField!;

      cy.fixture('RequestBody/SortVariant.json').then(mockRequestBody => {
        cy.intercept('POST', '**/list', req => {
          const mockBody = { ...mockRequestBody };
          mockBody.sort.field = apiField;
          mockBody.sort.order = 'asc';
          req.alias = 'sortRequestAsc';
          req.body = mockBody;
        });
        CaseEntity_Variants_SNV_Table.actions.sortColumn(columnID, false /*needIntercept*/);
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
            CaseEntity_Variants_SNV_Table.actions.sortColumn(columnID, false /*needIntercept*/);
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
