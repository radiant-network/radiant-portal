/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { CaseEntity_Files_Filters } from 'pom/pages/CaseEntity_Files_Filters';

describe('CaseEntity - Files - Filters - Configuration', () => {
  const setupTest = () => {
    cy.login();
    cy.visitCaseFilesPage(data.case.case);
  };

  it('Default filters', () => {
    setupTest();
    CaseEntity_Files_Filters.validations.shouldShowDefaultFilters();
  });
});
