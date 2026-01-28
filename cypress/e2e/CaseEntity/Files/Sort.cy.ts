/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { CaseEntity_Files } from 'pom/pages/CaseEntity_Files';

describe('CaseEntity - Files - Sort', () => {
  const setupTest = () => {
    cy.login();
    cy.visitCaseFilesPage(data.case.case);
  };

  it('Alphanumeric', () => {
    setupTest();
    CaseEntity_Files.validations.shouldSortColumn('sample');
  });

  it('Number', () => {
    setupTest();
    CaseEntity_Files.validations.shouldSortColumn('patient');
  });

  it('Tag', () => {
    setupTest();
    CaseEntity_Files.validations.shouldSortColumn('format');
  });

  it('Date', () => {
    setupTest();
    CaseEntity_Files.validations.shouldSortColumn('created_on');
  });

  it('Size', () => {
    setupTest();
    CaseEntity_Files.validations.shouldSortColumn('size');
  });

  it('Multiple', () => {
    setupTest();
    CaseEntity_Files.actions.sortColumn('name');
    CaseEntity_Files.actions.sortColumn('patient');
    CaseEntity_Files.actions.sortColumn('patient');
    CaseEntity_Files.validations.shouldHaveFirstRowValue('3', 'patient');
  });
});
