/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { CaseEntity_Files_Filters } from 'pom/pages/CaseEntity_Files_Filters';

describe('CaseEntity - Files - Filters - Request Validation', () => {
  const setupTest = () => {
    cy.login();
    cy.visitCaseFilesPage(data.case.case);
  };

  it('Filter criteria', () => {
    setupTest();
    CaseEntity_Files_Filters.validations.shouldRequestOnFilterSelect('format_code');
  });

  it('Multiple filters', () => {
    setupTest();
    CaseEntity_Files_Filters.validations.shouldRequestMultipleFilters('format_code', 'data_type_code');
  });
});
