/// <reference types="cypress"/>
import 'support/commands';
import { setupOnce } from 'support/setupOnce';
import { data } from 'pom/shared/Data';
import { CaseEntity_Files } from 'pom/pages/CaseEntity_Files';

// Read-only checks: set the page up once and share it between tests.
describe('CaseEntity - Files - Information displayed', { testIsolation: false }, () => {
  setupOnce(() => {
    cy.login();
    cy.visitCaseFilesPage(data.file.case, data.file.search_criteria);
    CaseEntity_Files.actions.sortColumn('name');
    CaseEntity_Files.actions.sortColumn('name');
    CaseEntity_Files.actions.showAllColumns();
  });

  it('File Name', () => {
    CaseEntity_Files.validations.shouldShowColumnContent('name', data.file);
  });

  it('Format', () => {
    CaseEntity_Files.validations.shouldShowColumnContent('format', data.file);
  });

  it('Type', () => {
    CaseEntity_Files.validations.shouldShowColumnContent('type', data.file);
  });

  it('Size', () => {
    CaseEntity_Files.validations.shouldShowColumnContent('size', data.file);
  });

  it('Patient', () => {
    CaseEntity_Files.validations.shouldShowColumnContent('patient', data.file);
  });

  it('Relationship', () => {
    CaseEntity_Files.validations.shouldShowColumnContent('relationship', data.file);
  });

  it('Sample', () => {
    CaseEntity_Files.validations.shouldShowColumnContent('sample', data.file);
  });

  it('Task', () => {
    CaseEntity_Files.validations.shouldShowColumnContent('task', data.file);
  });

  it('Created On', () => {
    CaseEntity_Files.validations.shouldShowColumnContent('created_on', data.file);
  });

  it('Sequencing', () => {
    CaseEntity_Files.validations.shouldShowColumnContent('sequencing', data.file);
  });

  it('Hash', () => {
    CaseEntity_Files.validations.shouldShowColumnContent('hash', data.file);
  });

  it('Run', () => {
    CaseEntity_Files.validations.shouldShowColumnContent('run', data.file);
  });
});
