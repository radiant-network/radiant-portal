/// <reference types="cypress"/>
import 'support/commands';
import { FilesTable } from 'pom/pages/FilesTable';

describe('CaseEntity - Files - Request Validation', () => {
  const setupTest = () => {
    cy.login();
    cy.visitFilesPage();
  };

  it('Sort', () => {
    setupTest();
    FilesTable.validations.shouldRequestOnSort('name');
  });
});
