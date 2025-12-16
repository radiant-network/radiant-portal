/// <reference types="cypress"/>
import 'support/commands';
import { CasesTable } from 'pom/pages/CasesTable';

describe('Cases - Autocomplete', () => {
  const setupTest = () => {
    cy.login();
    cy.visitCasesPage();
  };

  it('Suggestion list', () => {
    setupTest();
    CasesTable.validations.shouldShowSuggestionListFromMock();
  });
});
