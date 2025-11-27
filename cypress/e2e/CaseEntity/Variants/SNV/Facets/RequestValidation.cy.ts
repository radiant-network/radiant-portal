/// <reference types="cypress"/>
import 'support/commands';
import { CaseEntity_Variants_SNV_Facets } from 'pom/pages/CaseEntity_Variants_SNV_Facets';

describe('Case Entity - Variants - SNV - Facets - Request Validation', () => {
  const setupTest = () => {
    cy.login();
    cy.visitCaseVariantsPage('1', 'SNV');
  };

  it('MultiSelect', () => {
    setupTest();
    CaseEntity_Variants_SNV_Facets.validations.shouldRequestOnApply('Variant', 'variant_type');
  });

  it('Numerical', () => {
    setupTest();
    CaseEntity_Variants_SNV_Facets.validations.shouldRequestOnApply('Variant', 'position');
  });
});
