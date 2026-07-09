/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { CaseEntity_Variants_Facets } from 'pom/pages/CaseEntity_Variants_Facets';
import { CaseEntity_Variants_SavedFilters } from 'pom/pages/CaseEntity_Variants_SavedFilters';
import { CaseEntity_Variants_SNV_Table } from 'pom/pages/CaseEntity_Variants_SNV_Table';

describe('Case Entity - Variants - Somatic - SNV - Facets - Apply Results', () => {
  const setupTest = () => {
    cy.login();
    cy.visitCaseVariantsPage(data.caseSomatic.case, data.caseSomatic.seq.seq_id, 'SNV');
    CaseEntity_Variants_SavedFilters.snv.actions.selectFilterInDropdown('Cypress_All_Variants'); // Apply a filter for a cleaner query builder
    CaseEntity_Variants_SavedFilters.snv.actions.clickNewFilterButton(); // Clean Query Builder
  };

  it('Apply multiselect', () => {
    setupTest();
    const resultCount = CaseEntity_Variants_SNV_Table.somatic.actions.getResultsCount();
    CaseEntity_Variants_Facets.somatic.actions.applyMultiselectFacetFilter('Variant', 'chromosome');
    CaseEntity_Variants_SNV_Table.somatic.validations.shouldShowResultsCount(resultCount, false /*beEqual*/);
  });

  it('Apply numerical', () => {
    setupTest();
    const resultCount = CaseEntity_Variants_SNV_Table.somatic.actions.getResultsCount();
    CaseEntity_Variants_Facets.somatic.actions.applyNumericalFacetFilter('Variant', 'position');
    CaseEntity_Variants_SNV_Table.somatic.validations.shouldShowResultsCount(resultCount, false /*beEqual*/);
  });

  it('Search', () => {
    setupTest();
    CaseEntity_Variants_Facets.somatic.validations.shouldSearchInFacet('Variant', 'chromosome');
  });

  it('Show more and less', () => {
    setupTest();
    CaseEntity_Variants_Facets.somatic.validations.shouldShowMoreAndLess('Variant', 'chromosome');
  });

  it('Select all and none', () => {
    setupTest();
    CaseEntity_Variants_Facets.somatic.validations.shouldSelectAllAndNone('Variant', 'chromosome');
  });

  it('Reset', () => {
    setupTest();
    CaseEntity_Variants_Facets.somatic.validations.shouldResetFacet('Variant', 'chromosome');
  });
});
