/// <reference types="cypress"/>
import 'support/commands';
import { FilesTable_Filters } from 'pom/pages/FilesTable_Filters';

describe('Files - Filters - Options', () => {
  const setupTest = () => {
    cy.login();
    cy.intercept('GET', '**/documents/filters*').as('getDocumentsFilters');
    cy.visitFilesPage();
  };

  it('Render options from API', () => {
    setupTest();
    FilesTable_Filters.validations.shouldRenderApiOptions('@getDocumentsFilters', 'format_code');
  });

  it('Key-label options', () => {
    setupTest();
    FilesTable_Filters.validations.shouldRenderKeyLabelOptions('diagnosis_lab_code');
  });
});
