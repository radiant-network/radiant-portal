/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { CaseEntity_Variants_SNV } from 'pom/pages/CaseEntity_Variants_SNV';

describe('Case Entity - Variants - SNV - Custom query', () => {
  const setupTest = () => {
    cy.login();
    cy.visitCaseVariantsPage('1', 'SNV', data.variantGermline.sqon);
  };

  it('Save icon', () => {
    setupTest();
    CaseEntity_Variants_SNV.validations.shouldHaveCustomQuery();
  });
});
