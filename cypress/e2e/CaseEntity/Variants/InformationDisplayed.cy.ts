/// <reference types="cypress"/>
import '../../../support/commands';
import { data } from '../../../pom/shared/Data';
import { VariantsTable } from '../../../pom/pages/VariantsTable';

beforeEach(() => {
  cy.login();
  cy.visitCaseVariantsPage('1');
  VariantsTable.actions.showAllColumns();
});

describe('Case Entity - Variants - Information displayed', () => {
  it('Table data', () => {
    VariantsTable.validations.shouldShowTableContent(data.variantGermline);
  });
 
  it('Custom query save icon', () => {
    cy.get('[class*="QueryBar_selected"] [class*="anticon-save"]').should('not.exist');
  });
});
