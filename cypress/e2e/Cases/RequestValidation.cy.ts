/// <reference types="cypress"/>
import 'support/commands';
import { CasesTable } from 'pom/pages/CasesTable';

describe('Cases - Request Validation', () => {
  const setupTest = () => {
    cy.login();
    cy.visitCasesPage();
  };

  it('Sort [SJRA-661]', () => {
    setupTest();
    CasesTable.validations.shouldRequestOnSort('case');
  });
});
