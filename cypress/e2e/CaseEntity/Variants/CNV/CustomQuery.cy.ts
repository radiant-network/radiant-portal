/// <reference types="cypress"/>
import 'support/commands';
import { CaseEntity_Variants_CNV } from 'pom/pages/CaseEntity_Variants_CNV';

describe('Case Entity - Variants - CNV - Custom query', () => {
  const setupTest = () => {
    cy.login();
    cy.visitCaseVariantsPage('1', 'CNV');
  };

  it('Save icon', () => {
    setupTest();
    CaseEntity_Variants_CNV.validations.shouldHaveCustomQuery();
  });
});
