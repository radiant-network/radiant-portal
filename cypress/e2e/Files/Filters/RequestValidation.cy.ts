/// <reference types="cypress"/>
import 'support/commands';
import { FilesTable_Filters } from 'pom/pages/FilesTable_Filters';

describe('Files - Filters - Request Validation', () => {
  const setupTest = () => {
    cy.login();
    cy.visitFilesPage();
  };

  it('Filter criteria', () => {
    setupTest();
    FilesTable_Filters.validations.shouldRequestOnFilterSelect('project_code');
  });

  it('Multiple filters', () => {
    setupTest();
    FilesTable_Filters.validations.shouldRequestMultipleFilters('project_code', 'format_code');
  });
});
