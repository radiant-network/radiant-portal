/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { CaseEntity_Variants_Facets } from 'pom/pages/CaseEntity_Variants_Facets';
import { CaseEntity_Variants_SavedFilters } from 'pom/pages/CaseEntity_Variants_SavedFilters';
import { CaseEntity_Variants_SNV_Table } from 'pom/pages/CaseEntity_Variants_SNV_Table';

describe('Case Entity - Variants - Somatic - SNV - Facets - Search By', () => {
  const setupTest = () => {
    cy.login();
    cy.visitCaseVariantsPage(data.caseSomatic.case, data.caseSomatic.seq.seq_id, 'SNV');
    CaseEntity_Variants_SavedFilters.snv.actions.selectFilterInDropdown('Cypress_All_Variants'); // Apply a filter for a cleaner query builder
    CaseEntity_Variants_SavedFilters.snv.actions.clickNewFilterButton(); // Clean Query Builder
    CaseEntity_Variants_Facets.somatic.actions.clickSidebarSection('Gene');
  };

  it('Tooltip', () => {
    setupTest();
    CaseEntity_Variants_Facets.somatic.validations.shouldSearchByHaveTooltip();
  });

  it('Apply', () => {
    setupTest();
    const resultCount = CaseEntity_Variants_SNV_Table.somatic.actions.getResultsCount();
    CaseEntity_Variants_Facets.somatic.actions.searchGene(data.variantSomatic.gene);
    CaseEntity_Variants_Facets.somatic.validations.shouldHaveGeneSymbolPill([data.variantSomatic.gene]);
    CaseEntity_Variants_SNV_Table.somatic.validations.shouldShowResultsCount(resultCount, false /*beEqual*/);
  });
});
