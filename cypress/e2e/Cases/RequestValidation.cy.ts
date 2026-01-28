/// <reference types="cypress"/>
import 'support/commands';
import { CasesTable } from 'pom/pages/CasesTable';

describe('Cases - Request Validation', () => {
  const setupTest = () => {
    cy.login();
  };

  it('Autocomplete', () => {
    setupTest();
    cy.visitCasesPage();
    CasesTable.validations.shouldRequestOnSearchTyping();
  });

  it('Search', () => {
    setupTest();
    cy.visitCasesPage();
    CasesTable.validations.shouldRequestOnSearchSelect();
  });

  it('Sort', () => {
    setupTest();
    cy.visitCasesPage();
    CasesTable.validations.shouldRequestOnSort('case');
  });
      
  it('Paging', () => {
    setupTest();
    CasesTable.validations.shouldRequestOnPageChange();
  });
});
