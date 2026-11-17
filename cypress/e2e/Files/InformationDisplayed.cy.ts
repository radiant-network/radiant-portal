/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { FilesTable } from 'pom/pages/FilesTable';

// Read-only checks: set the page up once and share it between tests.
describe('Files - Information displayed', { testIsolation: false }, () => {
  before(() => {
    cy.login();
    cy.visitFilesPage(data.file.search_criteria);
    FilesTable.actions.sortColumn('case');
    FilesTable.actions.sortColumn('case');
    FilesTable.actions.sortColumn('name');
    FilesTable.actions.sortColumn('name');
    FilesTable.actions.showAllColumns();
  });

  it('File Name', () => {
    FilesTable.validations.shouldShowColumnContent('name', data.file, false);
  });

  it('Format', () => {
    FilesTable.validations.shouldShowColumnContent('format', data.file, false);
  });

  it('Type', () => {
    FilesTable.validations.shouldShowColumnContent('type', data.file, false);
  });

  it('Size', () => {
    FilesTable.validations.shouldShowColumnContent('size', data.file, false);
  });

  it('Case', () => {
    FilesTable.validations.shouldShowColumnContent('case', data.file, false);
  });

  it('Diag. Lab', () => {
    FilesTable.validations.shouldShowColumnContent('diag_lab', data.file, false);
  });

  it('Relationship', () => {
    FilesTable.validations.shouldShowColumnContent('relationship', data.file, false);
  });

  it('Patient', () => {
    FilesTable.validations.shouldShowColumnContent('patient', data.file, false);
  });

  it('Sample', () => {
    FilesTable.validations.shouldShowColumnContent('sample', data.file, false);
  });

  it('Task', () => {
    FilesTable.validations.shouldShowColumnContent('task', data.file, false);
  });

  it('Created On', () => {
    FilesTable.validations.shouldShowColumnContent('created_on', data.file, false);
  });

  it('Sequencing', () => {
    FilesTable.validations.shouldShowColumnContent('sequencing', data.file, false);
  });

  it('Hash', () => {
    FilesTable.validations.shouldShowColumnContent('hash', data.file, false);
  });

  it('Run', () => {
    FilesTable.validations.shouldShowColumnContent('run', data.file, false);
  });
});
