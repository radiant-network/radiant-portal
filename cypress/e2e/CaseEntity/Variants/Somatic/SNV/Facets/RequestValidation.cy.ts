/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { CaseEntity_Variants_Facets } from 'pom/pages/CaseEntity_Variants_Facets';
import { CaseEntity_Variants_SavedFilters } from 'pom/pages/CaseEntity_Variants_SavedFilters';

describe('Case Entity - Variants - Somatic - SNV - Facets - Request Validation', () => {
  const setupTest = () => {
    cy.login();
    cy.visitCaseVariantsPage(data.caseSomatic.case, data.caseSomatic.seq.seq_id, 'SNV');
    CaseEntity_Variants_SavedFilters.snv.actions.selectFilterInDropdown('Cypress_All_Variants'); // Apply a filter for a cleaner query builder
    CaseEntity_Variants_SavedFilters.snv.actions.clickNewFilterButton(); // Clean Query Builder
  };

  it('MultiSelect', () => {
    setupTest();
    CaseEntity_Variants_Facets.somatic.validations.shouldRequestOnApply('Variant', 'variant_type');
  });

  it('Numerical', () => {
    setupTest();
    CaseEntity_Variants_Facets.somatic.validations.shouldRequestOnApply('Variant', 'position');
  });
});
