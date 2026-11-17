/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { CaseEntity_Files } from 'pom/pages/CaseEntity_Files';

// Read-only checks: set the page up once and share it between tests.
describe('CaseEntity - Files - Information displayed', { testIsolation: false }, () => {
  before(() => {
    cy.login();
    cy.visitCaseFilesPage(data.file.case, data.file.search_criteria);
    CaseEntity_Files.actions.sortColumn('name');
    CaseEntity_Files.actions.sortColumn('name');
    CaseEntity_Files.actions.showAllColumns();
  });

  it('File Name', () => {
    CaseEntity_Files.validations.shouldShowColumnContent('name', data.file, false);
  });

  it('Format', () => {
    CaseEntity_Files.validations.shouldShowColumnContent('format', data.file, false);
  });

  it('Type', () => {
    CaseEntity_Files.validations.shouldShowColumnContent('type', data.file, false);
  });

  it('Size', () => {
    CaseEntity_Files.validations.shouldShowColumnContent('size', data.file, false);
  });

  it('Patient', () => {
    CaseEntity_Files.validations.shouldShowColumnContent('patient', data.file, false);
  });

  it('Relationship', () => {
    CaseEntity_Files.validations.shouldShowColumnContent('relationship', data.file, false);
  });

  it('Sample', () => {
    CaseEntity_Files.validations.shouldShowColumnContent('sample', data.file, false);
  });

  it('Task', () => {
    CaseEntity_Files.validations.shouldShowColumnContent('task', data.file, false);
  });

  it('Created On', () => {
    CaseEntity_Files.validations.shouldShowColumnContent('created_on', data.file, false);
  });

  it('Sequencing', () => {
    CaseEntity_Files.validations.shouldShowColumnContent('sequencing', data.file, false);
  });

  it('Hash', () => {
    CaseEntity_Files.validations.shouldShowColumnContent('hash', data.file, false);
  });

  it('Run', () => {
    CaseEntity_Files.validations.shouldShowColumnContent('run', data.file, false);
  });
});
