/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { CaseEntity_Variants } from 'pom/pages/CaseEntity_Variants';

describe('Case Entity - Variants - Custom query', () => {
  const setupTest = () => {
    cy.login();
    cy.visitCaseVariantsPage('1', data.variantGermline.sqon);
  };

  it('Save icon', () => {
    setupTest();
    CaseEntity_Variants.validations.shouldHaveCustomQuery();
  });
});
