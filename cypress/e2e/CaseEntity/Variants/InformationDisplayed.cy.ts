/// <reference types="cypress"/>
import '../../../support/commands';
import { data } from '../../../pom/shared/Data';
import { VariantsTable } from '../../../pom/pages/VariantsTable';

describe('Case Entity - Variants - Information displayed', () => {
  const setupTest = () => {
    cy.login();
    cy.visitCaseVariantsPage('1', data.variantGermline.sqon);
  };

  it('Table data', () => {
    setupTest();
    VariantsTable.validations.shouldShowTableContent(data.variantGermline);
  });

  it('Custom query save icon', () => {
    setupTest();
    cy.get('[class*="QueryBar_selected"] [class*="anticon-save"]').should('not.exist');
  });
});
