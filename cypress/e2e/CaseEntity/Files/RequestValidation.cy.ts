/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { CaseEntity_Files } from 'pom/pages/CaseEntity_Files';

describe('CaseEntity - Files - Request Validation', () => {
  const setupTest = () => {
    cy.login();
    cy.visitCaseFilesPage(data.case.case);
  };

  it('Sort', () => {
    setupTest();
    CaseEntity_Files.validations.shouldRequestOnSort('name');
  });
});
