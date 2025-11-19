/// <reference types="cypress"/>
import 'support/commands';
import { FilesTable } from 'pom/pages/FilesTable';

describe('CaseEntity - Files - Sort [SJRA-853]', () => {
  const setupTest = () => {
    cy.login();
    cy.visitFilesPage();
  };

  it('Alphanumeric', () => {
    setupTest();
    FilesTable.validations.shouldSortColumn('sample');
  });

  // Activate after SJRA-661
  it.skip('Number', () => {
    setupTest();
    FilesTable.validations.shouldSortColumn('patient');
  });

  it('Tag', () => {
    setupTest();
    FilesTable.validations.shouldSortColumn('format');
  });

  it('Date', () => {
    setupTest();
    FilesTable.validations.shouldSortColumn('created_on');
  });

  it('Size', () => {
    setupTest();
    FilesTable.validations.shouldSortColumn('size');
  });

  it('Multiple [SJRA-661]', () => {
    setupTest();
    FilesTable.actions.sortColumn('name');
    FilesTable.actions.sortColumn('patient');
    FilesTable.actions.sortColumn('patient');
    FilesTable.validations.shouldHaveFirstRowValue('3', 'patient');
  });
});
