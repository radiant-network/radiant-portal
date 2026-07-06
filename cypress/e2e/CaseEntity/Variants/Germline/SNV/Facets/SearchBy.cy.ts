/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { CaseEntity_Variants_Facets } from 'pom/pages/CaseEntity_Variants_Facets';
import { CaseEntity_Variants_SavedFilters } from 'pom/pages/CaseEntity_Variants_SavedFilters';
import { CaseEntity_Variants_SNV_Table } from 'pom/pages/CaseEntity_Variants_SNV_Table';

describe('Case Entity - Variants - Germline - SNV - Facets - Search By', () => {
  const setupTest = () => {
    cy.login();
    cy.visitCaseVariantsPage(data.case.case, data.case.seq.seq_id, 'SNV');
    CaseEntity_Variants_SavedFilters.snv.actions.selectFilterInDropdown('Cypress_All_Variants'); // Apply a filter for a cleaner query builder
    CaseEntity_Variants_SavedFilters.snv.actions.clickNewFilterButton(); // Clean Query Builder
    CaseEntity_Variants_Facets.snv.actions.clickSidebarSection('Gene');
  };

  it('Tooltip', () => {
    setupTest();
    CaseEntity_Variants_Facets.snv.validations.shouldSearchByHaveTooltip();
  });

  it('Apply', () => {
    setupTest();
    const resultCount = CaseEntity_Variants_SNV_Table.germline.actions.getResultsCount();
    CaseEntity_Variants_Facets.snv.actions.searchGene(data.variantGermline.gene);
    CaseEntity_Variants_Facets.snv.validations.shouldHaveGeneSymbolPill([data.variantGermline.gene]);
    CaseEntity_Variants_SNV_Table.germline.validations.shouldShowResultsCount(resultCount, false /*beEqual*/);
  });
});
