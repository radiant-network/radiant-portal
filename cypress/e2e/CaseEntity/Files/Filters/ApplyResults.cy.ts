/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { CaseEntity_Files_Filters } from 'pom/pages/CaseEntity_Files_Filters';

describe('CaseEntity - Files - Filters - Apply Results', () => {
  const setupTest = () => {
    cy.login();
    cy.visitCaseFilesPage(data.case.case);
  };

  it('Apply', () => {
    setupTest();
    CaseEntity_Files_Filters.validations.shouldChangeResultsOnApply('format_code');
  });

  it('Clear filter', () => {
    setupTest();
    CaseEntity_Files_Filters.validations.shouldClearFilter('format_code');
  });

  it('Clear all', () => {
    setupTest();
    CaseEntity_Files_Filters.validations.shouldClearAllFilters('format_code');
  });
});
