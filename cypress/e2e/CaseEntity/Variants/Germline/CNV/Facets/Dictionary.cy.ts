/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { CaseEntity_Variants_Facets } from 'pom/pages/CaseEntity_Variants_Facets';
import { CaseEntity_Variants_SavedFilters } from 'pom/pages/CaseEntity_Variants_SavedFilters';

describe('Case Entity - Variants - Germline - CNV - Facets - Dictionary', () => {
  const setupTest = () => {
    cy.login();
    cy.visitCaseVariantsPage(data.case.case, data.case.seq.seq_id, 'CNV');
    CaseEntity_Variants_SavedFilters.cnv.actions.selectFilterInDropdown('Cypress_All_Variants'); // Apply a filter for a cleaner query builder
    CaseEntity_Variants_SavedFilters.cnv.actions.clickNewFilterButton(); // Clean Query Builder
  };

  it('Non zero values', () => {
    setupTest();
    CaseEntity_Variants_Facets.cnv.validations.shouldDictionaryIncludeAllNonZeroValues();
  });

  it('Additional values', () => {
    setupTest();
    CaseEntity_Variants_Facets.cnv.validations.shouldDictionaryAdditionalValuesHaveZeroCount();
  });
});
