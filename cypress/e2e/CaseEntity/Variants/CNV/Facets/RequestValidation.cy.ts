/// <reference types="cypress"/>
import 'support/commands';
import { CaseEntity_Variants_Facets } from 'pom/pages/CaseEntity_Variants_Facets';

describe('Case Entity - Variants - CNV - Facets - Request Validation', () => {
  const setupTest = () => {
    cy.login();
    cy.visitCaseVariantsPage('1', 'CNV');
  };

  it('MultiSelect', () => {
    setupTest();
    CaseEntity_Variants_Facets.cnv.validations.shouldRequestOnApply('Variant', 'variant_type');
  });

  it('Numerical', () => {
    setupTest();
    CaseEntity_Variants_Facets.cnv.validations.shouldRequestOnApply('Variant', 'copy_number');
  });
});
