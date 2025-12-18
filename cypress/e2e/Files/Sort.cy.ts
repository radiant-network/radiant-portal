/// <reference types="cypress"/>
import 'support/commands';
import { FilesTable } from 'pom/pages/FilesTable';

describe('Files - Sort', () => {
  const setupTest = () => {
    cy.login();
    cy.visitFilesPage();
  };

  it('Alphanumeric', () => {
    setupTest();
    FilesTable.validations.shouldSortColumn('sample');
  });

  it('Number [SJRA-1004]', () => {
    setupTest();
    FilesTable.validations.shouldSortColumn('case');
  });

  it('Tag', () => {
    setupTest();
    FilesTable.validations.shouldSortColumn('format');
  });

  it('Date', () => {
    setupTest();
    FilesTable.validations.shouldSortColumn('created_on');
  });

  it('Size [SJRA-1004]', () => {
    setupTest();
    FilesTable.validations.shouldSortColumn('size');
  });

  it('Multiple', () => {
    setupTest();
    FilesTable.actions.sortColumn('name');
    FilesTable.actions.sortColumn('patient');
    FilesTable.actions.sortColumn('patient');
    FilesTable.validations.shouldHaveFirstRowValue('3', 'patient');
  });
});
