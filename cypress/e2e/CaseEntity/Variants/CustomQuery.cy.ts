/// <reference types="cypress"/>
import '../../../support/commands';
import { data } from '../../../pom/shared/Data';

describe('Case Entity - Variants - Custom query', () => {
  const setupTest = () => {
    cy.login();
    cy.visitCaseVariantsPage('1', data.variantGermline.sqon);
  };

  it('Save icon', () => {
    setupTest();
    cy.get('[class*="QueryBar_selected"] [class*="anticon-save"]').should('not.exist');
  });
});
