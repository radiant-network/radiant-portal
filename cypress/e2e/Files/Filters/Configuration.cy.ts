/// <reference types="cypress"/>
import 'support/commands';
import { FilesTable_Filters } from 'pom/pages/FilesTable_Filters';

describe('Files - Filters - Configuration', () => {
  const setupTest = () => {
    cy.login();
    cy.visitFilesPage();
  };

  it('Default filters', () => {
    setupTest();
    FilesTable_Filters.validations.shouldShowDefaultFilters();
  });
});
