/// <reference types="cypress"/>
import 'support/commands';
import { CaseEntity_Variants_SNV_Facets } from 'pom/pages/CaseEntity_Variants_SNV_Facets';

describe('Case Entity - Variants - SNV - Facets - Dictionary', () => {
  const setupTest = () => {
    cy.login();
    cy.visitCaseVariantsPage('1', 'SNV');
  };

  it('Non zero values', () => {
    setupTest();
    CaseEntity_Variants_SNV_Facets.validations.shouldDictionaryIncludeAllNonZeroValues();
  });

  it('Additional values', () => {
    setupTest();
    CaseEntity_Variants_SNV_Facets.validations.shouldDictionaryAdditionalValuesHaveZeroCount();
  });
});
