/// <reference types="cypress"/>
import 'support/commands';
import { FilesTable } from 'pom/pages/FilesTable';

describe('Files - Request Validation', () => {
  const setupTest = () => {
    cy.login();
    cy.visitFilesPage();
  };

  it('Sort [SJRA-661]', () => {
    setupTest();
    FilesTable.validations.shouldRequestOnSort('name');
  });
});
