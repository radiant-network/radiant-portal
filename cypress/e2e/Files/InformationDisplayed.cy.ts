/// <reference types="cypress"/>
import 'support/commands';
import { setupOnce } from 'support/setupOnce';
import { data } from 'pom/shared/Data';
import { FilesTable } from 'pom/pages/FilesTable';

// Read-only checks: set the page up once and share it between tests.
describe('Files - Information displayed', { testIsolation: false }, () => {
  setupOnce(() => {
    cy.login();
    cy.resetTablePreferences();
    cy.visitFilesPage(data.file.search_criteria);
    FilesTable.actions.sortColumn('case');
    FilesTable.actions.sortColumn('case');
    FilesTable.actions.sortColumn('name');
    FilesTable.actions.sortColumn('name');
    FilesTable.actions.showAllColumns();
  });

  it('File Name', () => {
    FilesTable.validations.shouldShowColumnContent('name', data.file);
  });

  it('Format', () => {
    FilesTable.validations.shouldShowColumnContent('format', data.file);
  });

  it('Type', () => {
    FilesTable.validations.shouldShowColumnContent('type', data.file);
  });

  it('Size', () => {
    FilesTable.validations.shouldShowColumnContent('size', data.file);
  });

  it('Case', () => {
    FilesTable.validations.shouldShowColumnContent('case', data.file);
  });

  it('Diag. Lab', () => {
    FilesTable.validations.shouldShowColumnContent('diag_lab', data.file);
  });

  it('Relationship', () => {
    FilesTable.validations.shouldShowColumnContent('relationship', data.file);
  });

  it('Patient', () => {
    FilesTable.validations.shouldShowColumnContent('patient', data.file);
  });

  it('Sample', () => {
    FilesTable.validations.shouldShowColumnContent('sample', data.file);
  });

  it('Task', () => {
    FilesTable.validations.shouldShowColumnContent('task', data.file);
  });

  it('Created On', () => {
    FilesTable.validations.shouldShowColumnContent('created_on', data.file);
  });

  it('Sequencing', () => {
    FilesTable.validations.shouldShowColumnContent('sequencing', data.file);
  });

  it('Hash', () => {
    FilesTable.validations.shouldShowColumnContent('hash', data.file);
  });

  it('Run', () => {
    FilesTable.validations.shouldShowColumnContent('run', data.file);
  });
});
