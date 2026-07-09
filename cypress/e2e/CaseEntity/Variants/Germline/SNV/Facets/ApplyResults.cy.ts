/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { CaseEntity_Variants_Facets } from 'pom/pages/CaseEntity_Variants_Facets';
import { CaseEntity_Variants_SavedFilters } from 'pom/pages/CaseEntity_Variants_SavedFilters';
import { CaseEntity_Variants_SNV_Table } from 'pom/pages/CaseEntity_Variants_SNV_Table';

describe('Case Entity - Variants - Germline - SNV - Facets - Apply Results', () => {
  const setupTest = () => {
    cy.login();
    cy.visitCaseVariantsPage(data.case.case, data.case.seq.seq_id, 'SNV');
    CaseEntity_Variants_SavedFilters.snv.actions.selectFilterInDropdown('Cypress_All_Variants'); // Apply a filter for a cleaner query builder
    CaseEntity_Variants_SavedFilters.snv.actions.clickNewFilterButton(); // Clean Query Builder
  };

  it('Apply multiselect', () => {
    setupTest();
    const resultCount = CaseEntity_Variants_SNV_Table.germline.actions.getResultsCount();
    CaseEntity_Variants_Facets.snv.actions.applyMultiselectFacetFilter('Variant', 'chromosome');
    CaseEntity_Variants_SNV_Table.germline.validations.shouldShowResultsCount(resultCount, false /*beEqual*/);
  });

  it('Apply numerical', () => {
    setupTest();
    const resultCount = CaseEntity_Variants_SNV_Table.germline.actions.getResultsCount();
    CaseEntity_Variants_Facets.snv.actions.applyNumericalFacetFilter('Variant', 'position');
    CaseEntity_Variants_SNV_Table.germline.validations.shouldShowResultsCount(resultCount, false /*beEqual*/);
  });

  it('Search', () => {
    setupTest();
    CaseEntity_Variants_Facets.snv.validations.shouldSearchInFacet('Variant', 'chromosome');
  });

  it('Show more and less', () => {
    setupTest();
    CaseEntity_Variants_Facets.snv.validations.shouldShowMoreAndLess('Variant', 'chromosome');
  });

  it('Select all and none', () => {
    setupTest();
    CaseEntity_Variants_Facets.snv.validations.shouldSelectAllAndNone('Variant', 'chromosome');
  });

  it('Reset', () => {
    setupTest();
    CaseEntity_Variants_Facets.snv.validations.shouldResetFacet('Variant', 'chromosome');
  });
});
