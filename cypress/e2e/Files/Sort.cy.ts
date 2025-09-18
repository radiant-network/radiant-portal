/// <reference types="cypress"/>
import '../../support/commands';
import { FilesTable } from '../../pom/pages/FilesTable';

describe('Files - Sort', () => {
  const setupTest = () => {
    cy.login();
    cy.visitFilesPage();
  };

  it('Api request [SJRA-661]', () => {
    setupTest();
    FilesTable.validations.shouldRequestOnSort('name');
  });

  it('Alphanumeric', () => {
    setupTest();
    FilesTable.validations.shouldSortColumn('sample');
  });

  it('Number', () => {
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
