/// <reference types="cypress"/>
import { CommonSelectors } from '../shared/Selectors';
import { getUrlLink, stringToRegExp } from '../shared/Utils';
import { getColumnName, getColumnPosition } from '../shared/Utils';

const selectorHead = CommonSelectors.tableHead;
const selectors = {
  tableCell: (dataVariant: any) => `${CommonSelectors.tableRow}:contains("${dataVariant.variant}") ${CommonSelectors.tableCellData}`,
  tableHeadCell: `${selectorHead} ${CommonSelectors.tableCellHead}`,
  tab: '[class*= "lucide-audio-waveform"]',
};

const tableColumns = [
  {
    id: 'interpretation',
    name: CommonSelectors.interpretationIcon,
    apiField: 'has_interpretation',
    isVisibleByDefault: true,
    isSortable: false,
    position: 1,
    tooltip: 'Clinical Interpretation',
  },
  {
    id: 'variant',
    name: 'Variant',
    apiField: 'hgvsg',
    isVisibleByDefault: true,
    isSortable: true,
    position: 2,
    tooltip: null,
  },
  {
    id: 'type',
    name: 'Type',
    apiField: 'variant_class',
    isVisibleByDefault: true,
    isSortable: true,
    position: 3,
    tooltip: null,
  },
  {
    id: 'dbsnp',
    name: 'dbSNP',
    apiField: 'rsnumber',
    isVisibleByDefault: true,
    isSortable: false,
    position: 4,
    tooltip: null,
  },
  {
    id: 'gene',
    name: 'Gene',
    apiField: 'symbol',
    isVisibleByDefault: true,
    isSortable: false,
    position: 5,
    tooltip: null,
  },
  {
    id: 'consequence',
    name: 'Consequence',
    apiField: 'picked_consequences',
    isVisibleByDefault: true,
    isSortable: false,
    position: 6,
    tooltip: 'Most deleterious consequence annotated using VEP',
  },
  {
    id: 'mane',
    name: 'MANE',
    apiField: 'is_canonical',
    isVisibleByDefault: true,
    isSortable: false,
    position: 7,
    tooltip: null,
  },
  {
    id: 'omim',
    name: 'OMIM',
    apiField: 'omim_inheritance_code',
    isVisibleByDefault: true,
    isSortable: false,
    position: 8,
    tooltip: 'MIM inheritance modes',
  },
  {
    id: 'clinvar',
    name: 'ClinVar',
    apiField: 'clinvar',
    isVisibleByDefault: true,
    isSortable: false,
    position: 9,
    tooltip: null,
  },
  {
    id: 'exomiser',
    name: 'Exo.',
    apiField: 'exomiser_gene_combined_score',
    isVisibleByDefault: true,
    isSortable: true,
    position: 10,
    tooltip: 'Exomiser score based on variant properties and patient phenotypes',
  },
  {
    id: 'acmg_exomiser',
    name: 'ACMG Exo.',
    apiField: 'exomiser_acmg_classification',
    isVisibleByDefault: true,
    isSortable: true,
    position: 11,
    tooltip: 'Exomiser ACMG',
  },
  {
    id: 'gnomad',
    name: 'gnomAD',
    apiField: 'gnomad_v3_af',
    isVisibleByDefault: true,
    isSortable: true,
    position: 12,
    tooltip: 'gnomAD Genome 3.1.2 (allele Frequency)',
  },
  {
    id: 'freq',
    name: 'Freq.',
    apiField: 'pf_wgs',
    isVisibleByDefault: true,
    isSortable: true,
    position: 13,
    tooltip: 'Number of germline genomes containing this variant and their frequency across this organization. Only occurrences with Filter = PASS and GQ ≥ 20 are taken into account for frequency calculations.',
  },
  {
    id: 'gq',
    name: 'GQ',
    apiField: 'genotype_quality',
    isVisibleByDefault: true,
    isSortable: true,
    position: 14,
    tooltip: 'Genotype quality. Only occurrences with GQ ≥ 20 are taken into account for frequency calculation.',
  },
  {
    id: 'zyg',
    name: 'Zyg.',
    apiField: 'zygosity',
    isVisibleByDefault: true,
    isSortable: false,
    position: 15,
    tooltip: 'Zygosity',
  },
  {
    id: 'ad_ratio',
    name: 'AD Ratio',
    apiField: 'ad_ratio',
    isVisibleByDefault: true,
    isSortable: true,
    position: 16,
    tooltip: null,
  },
];

export const CaseEntity_Variants = {
  actions: {
    /**
     * Clicks the link in a specific table cell for a given variant and column.
     * @param dataVariant The variant object.
     * @param columnID The ID of the column.
     * @param onPlusIcon Click on the plus icon (default: false).
     */
    clickTableCellLink(dataVariant: any, columnID: string, onPlusIcon: boolean = false) {
      cy.then(() =>
        getColumnPosition(selectorHead, tableColumns, columnID).then(position => {
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
            cy.log(`Warning: Column ${columnID} not found`);
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
        getColumnPosition(selectorHead, tableColumns, columnID).then(position => {
          if (position !== -1) {
            if (needIntercept) {
              cy.sortTableAndIntercept(position, 1);
            } else {
              cy.sortTableAndWait(position);
            }
          } else {
            cy.log(`Warning: Column ${columnID} not found`);
          }
        })
      );
    },
    /**
     * Unsort all columns of the table.
     */
    unsortAllColumns() {
      CaseEntity_Variants.actions.sortColumn('exomiser');
      CaseEntity_Variants.actions.sortColumn('exomiser');
      CaseEntity_Variants.actions.sortColumn('variant');
      CaseEntity_Variants.actions.sortColumn('variant');
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
     * Checks that the tab is active.
     */
    shouldHaveActiveTab() {
      cy.get(selectors.tab).shouldBeActiveTab();
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
        getColumnPosition(selectorHead, tableColumns, columnID).then(position => {
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
          cy.validatePillSelectedQuery('Gene Symbol', [dataVariant[columnID]]);
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
        getColumnPosition(selectorHead, tableColumns, columnID).then(position => {
          if (position !== -1) {
            cy.get(selectors.tableCell(dataVariant)).eq(position).find(CommonSelectors.link).should('have.attr', 'href', getUrlLink(columnID, dataVariant));
          } else {
            cy.log(`Warning: Column ${columnID} not found`);
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
          cy.get(selectorHead).find(column.name).should(expectedExist);
        } else {
          cy.get(selectorHead).contains(stringToRegExp(column.name, true /*exact*/)).should(expectedExist);
        }
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
      CaseEntity_Variants.actions.showAllColumns();
      tableColumns.forEach(column => {
        if (column.name.startsWith('[')) {
          cy.get(selectors.tableHeadCell).eq(column.position).find(column.name).should('exist');
        } else {
          cy.get(selectors.tableHeadCell).eq(column.position).contains(stringToRegExp(column.name, true /*exact*/)).should('exist');
        }
      });
    },
    /**
     * Validates the content of a specific column in the table for a given variant.
     * @param columnID The ID of the column to validate.
     * @param dataVariant The variant object containing the expected values.
     */
    shouldShowColumnContent(columnID: string, dataVariant: any) {
      CaseEntity_Variants.actions.showAllColumns();
      getColumnPosition(selectorHead, tableColumns, columnID).then(position => {
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
            case 'consequence':
              cy.validateTableFirstRowClass(dataVariant.consequenceImpact, position);
              cy.validateTableFirstRowContent(dataVariant[columnID], position);
              cy.validateTableFirstRowContent(dataVariant.aa_change, position);
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
              dataVariant[columnID].forEach((value: string | RegExp) => {
                cy.validateTableFirstRowContent(value, position);
              });
              cy.validateTableFirstRowClass(CommonSelectors.tagDefault, position);
              break;
            case 'clinvar':
              dataVariant[columnID].forEach((value: string | RegExp) => {
                cy.validateTableFirstRowContent(value, position);
              });
              cy.validateTableFirstRowClass(CommonSelectors.tag('green'), position);
              cy.validateTableFirstRowClass(CommonSelectors.tag('yellow'), position);
              break;
            case 'acmg_exomiser':
              dataVariant[columnID].forEach((value: string | RegExp) => {
                cy.validateTableFirstRowContent(value, position);
              });
              cy.validateTableFirstRowClass(CommonSelectors.tag('yellow'), position);
              break;
            case 'gnomad':
              cy.validateTableFirstRowContent(dataVariant[columnID], position);
              cy.validateTableFirstRowClass(CommonSelectors.gnomadRedIcon, position);
              break;
            default:
              cy.validateTableFirstRowContent(dataVariant[columnID], position);
              break;
          }
        } else {
          cy.log(`Warning: Column ${columnID} not found`);
        }
      });
    },
    /**
     * Validates the tooltips on columns.
     */
    shouldShowColumnTooltips() {
      CaseEntity_Variants.actions.showAllColumns();
      tableColumns.forEach(column => {
        cy.then(() =>
          getColumnPosition(selectorHead, tableColumns, column.id).then(position => {
            if (position !== -1) {
              cy.get(selectors.tableHeadCell).eq(position).shouldHaveTooltip(column.tooltip);
            } else {
              cy.log(`Warning: Column ${column.id} not found`);
            }
          })
        );
      });
    },
    /**
     * Validates that sortable columns are correctly marked as sortable.
     */
    shouldShowSortableColumns() {
      CaseEntity_Variants.actions.showAllColumns();
      CaseEntity_Variants.actions.unsortAllColumns();
      tableColumns.forEach(column => {
        cy.then(() =>
          getColumnPosition(selectorHead, tableColumns, column.id).then(position => {
            if (position !== -1) {
              cy.get(selectors.tableHeadCell).eq(position).shouldBeSortable(column.isSortable);
            } else {
              cy.log(`Warning: Column ${column.id} not found`);
            }
          })
        );
      });
    },
    /**
     * Validates the request sent to api on sorting functionality of a column.
     * @param columnID The ID of the column to sort.
     */
    shouldRequestOnSort(columnID: string) {
      CaseEntity_Variants.actions.showAllColumns();
      CaseEntity_Variants.actions.unsortAllColumns();
      cy.intercept('POST', '**/list', req => {
        expect(req.body.sort).to.have.length(1);
        expect(req.body.sort).to.deep.include({ field: tableColumns.find(col => col.id === columnID)?.apiField, order: 'asc' });
      }).as('sortRequest');
      CaseEntity_Variants.actions.sortColumn(columnID, false /*needIntercept*/);
      cy.wait('@sortRequest');
    },
    /**
     * Validates the sorting functionality of a column with mocked data.
     * @param columnID The ID of the column to sort.
     */
    shouldSortColumn(columnID: string) {
      CaseEntity_Variants.actions.showAllColumns();
      CaseEntity_Variants.actions.unsortAllColumns();
      const apiField = tableColumns.find(col => col.id === columnID)?.apiField!;

      cy.fixture('RequestBody/SortVariant.json').then(mockRequestBody => {
        cy.intercept('POST', '**/list', req => {
          const mockBody = { ...mockRequestBody };
          mockBody.sort.field = apiField;
          mockBody.sort.order = 'asc';
          req.alias = 'sortRequestAsc';
          req.body = mockBody;
        });
        CaseEntity_Variants.actions.sortColumn(columnID, false /*needIntercept*/);
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
            CaseEntity_Variants.actions.sortColumn(columnID, false /*needIntercept*/);
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
  },
};
