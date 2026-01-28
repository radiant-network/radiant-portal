/// <reference types="cypress"/>
import 'support/commands';
import { FilesTable } from 'pom/pages/FilesTable';

describe('Files - Request Validation', () => {
  const setupTest = () => {
    cy.login();
  };

  it('Sort', () => {
    setupTest();
    cy.visitFilesPage();
    FilesTable.validations.shouldRequestOnSort('name');
  });
    
  it('Paging', () => {
    setupTest();
    FilesTable.validations.shouldRequestOnPageChange();
  });
});
