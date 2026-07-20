/// <reference types="cypress"/>
import 'support/commands';
import { FilesTable_Filters } from 'pom/pages/FilesTable_Filters';

describe('Files - Filters - Apply Results', () => {
  const setupTest = () => {
    cy.login();
    cy.visitFilesPage();
  };

  it('Apply', () => {
    setupTest();
    FilesTable_Filters.validations.shouldChangeResultsOnApply('format_code');
  });

  it('Clear filter', () => {
    setupTest();
    FilesTable_Filters.validations.shouldClearFilter('format_code');
  });

  it('Clear all', () => {
    setupTest();
    FilesTable_Filters.validations.shouldClearAllFilters('format_code');
  });
});
