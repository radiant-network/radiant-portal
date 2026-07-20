/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { CaseEntity_Files_Filters } from 'pom/pages/CaseEntity_Files_Filters';

describe('CaseEntity - Files - Filters - Options', () => {
  const setupTest = () => {
    cy.login();
    cy.intercept('GET', '**/documents/filters*').as('getDocumentsFilters');
    cy.visitCaseFilesPage(data.case.case);
  };

  it('Render options from API', () => {
    setupTest();
    CaseEntity_Files_Filters.validations.shouldRenderApiOptions('@getDocumentsFilters', 'format_code');
  });
});
