/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { CaseEntity_Variants_Facets } from 'pom/pages/CaseEntity_Variants_Facets';

describe('Case Entity - Variants - SNV - Facets - Dictionary', () => {
  const setupTest = () => {
    cy.login();
    cy.visitCaseVariantsPage(data.case.case, 'SNV');
  };

  it('Non zero values', () => {
    setupTest();
    CaseEntity_Variants_Facets.snv.validations.shouldDictionaryIncludeAllNonZeroValues();
  });

  it('Additional values', () => {
    setupTest();
    CaseEntity_Variants_Facets.snv.validations.shouldDictionaryAdditionalValuesHaveZeroCount();
  });
});
