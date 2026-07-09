/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { CaseEntity_Variants_Facets } from 'pom/pages/CaseEntity_Variants_Facets';
import { CaseEntity_Variants_SavedFilters } from 'pom/pages/CaseEntity_Variants_SavedFilters';
import { CaseEntity_Variants_CNV_Table } from 'pom/pages/CaseEntity_Variants_CNV_Table';

describe('Case Entity - Variants - Germline - CNV - Facets - Apply Results', () => {
  const setupTest = () => {
    cy.login();
    cy.visitCaseVariantsPage(data.case.case, data.case.seq.seq_id, 'CNV');
    CaseEntity_Variants_SavedFilters.cnv.actions.selectFilterInDropdown('Cypress_All_Variants'); // Apply a filter for a cleaner query builder
    CaseEntity_Variants_SavedFilters.cnv.actions.clickNewFilterButton(); // Clean Query Builder
  };

  it('Apply multiselect', () => {
    setupTest();
    const resultCount = CaseEntity_Variants_CNV_Table.actions.getResultsCount();
    CaseEntity_Variants_Facets.cnv.actions.applyMultiselectFacetFilter('Variant', 'chromosome');
    CaseEntity_Variants_CNV_Table.validations.shouldShowResultsCount(resultCount, false /*beEqual*/);
  });

  it('Apply numerical', () => {
    setupTest();
    const resultCount = CaseEntity_Variants_CNV_Table.actions.getResultsCount();
    CaseEntity_Variants_Facets.cnv.actions.applyNumericalFacetFilter('Variant', 'start');
    CaseEntity_Variants_CNV_Table.validations.shouldShowResultsCount(resultCount, false /*beEqual*/);
  });

  it('Search', () => {
    setupTest();
    CaseEntity_Variants_Facets.cnv.validations.shouldSearchInFacet('Variant', 'chromosome');
  });

  it('Show more and less', () => {
    setupTest();
    CaseEntity_Variants_Facets.cnv.validations.shouldShowMoreAndLess('Variant', 'chromosome');
  });

  it('Select all and none', () => {
    setupTest();
    CaseEntity_Variants_Facets.cnv.validations.shouldSelectAllAndNone('Variant', 'chromosome');
  });

  it('Reset', () => {
    setupTest();
    CaseEntity_Variants_Facets.cnv.validations.shouldResetFacet('Variant', 'chromosome');
  });
});
