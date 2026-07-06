/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { CaseEntity_Variants_Facets } from 'pom/pages/CaseEntity_Variants_Facets';
import { CaseEntity_Variants_SavedFilters } from 'pom/pages/CaseEntity_Variants_SavedFilters';
import { CaseEntity_Variants_CNV_Table } from 'pom/pages/CaseEntity_Variants_CNV_Table';

describe('Case Entity - Variants - Germline - CNV - Facets - Search By', () => {
  const setupTest = () => {
    cy.login();
    cy.visitCaseVariantsPage(data.case.case, data.case.seq.seq_id, 'CNV');
    CaseEntity_Variants_SavedFilters.cnv.actions.selectFilterInDropdown('Cypress_All_Variants'); // Apply a filter for a cleaner query builder
    CaseEntity_Variants_SavedFilters.cnv.actions.clickNewFilterButton(); // Clean Query Builder
    CaseEntity_Variants_Facets.cnv.actions.clickSidebarSection('Gene');
  };

  it('Tooltip', () => {
    setupTest();
    CaseEntity_Variants_Facets.cnv.validations.shouldSearchByHaveTooltip();
  });

  it('Apply', () => {
    setupTest();
    const resultCount = CaseEntity_Variants_CNV_Table.actions.getResultsCount();
    CaseEntity_Variants_Facets.cnv.actions.searchGene(data.cnvOverlappingGenes.gene);
    CaseEntity_Variants_Facets.cnv.validations.shouldHaveGeneSymbolPill([data.cnvOverlappingGenes.gene]);
    CaseEntity_Variants_CNV_Table.validations.shouldShowResultsCount(resultCount, false /*beEqual*/);
  });
});
