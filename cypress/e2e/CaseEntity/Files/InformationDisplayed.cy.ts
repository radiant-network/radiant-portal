/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { FilesTable } from 'pom/pages/FilesTable';

describe('CaseEntity - Files - Information displayed', () => {
  const setupTest = () => {
    cy.login();
    cy.visitCaseFilesPage(data.file.case, data.file.search_criteria);
    FilesTable.actions.sortColumn('name');
    FilesTable.actions.sortColumn('name');
  };

  it('File Name', () => {
    setupTest();
    FilesTable.validations.shouldShowColumnContent('name', data.file);
  });

  it('Format', () => {
    setupTest();
    FilesTable.validations.shouldShowColumnContent('format', data.file);
  });

  it('Type', () => {
    setupTest();
    FilesTable.validations.shouldShowColumnContent('type', data.file);
  });

  it('Size', () => {
    setupTest();
    FilesTable.validations.shouldShowColumnContent('size', data.file);
  });

  it('Patient', () => {
    setupTest();
    FilesTable.validations.shouldShowColumnContent('patient', data.file);
  });

  it('Relationship', () => {
    setupTest();
    FilesTable.validations.shouldShowColumnContent('relationship', data.file);
  });

  it('Sample', () => {
    setupTest();
    FilesTable.validations.shouldShowColumnContent('sample', data.file);
  });

  it('Task', () => {
    setupTest();
    FilesTable.validations.shouldShowColumnContent('task', data.file);
  });

  it('Created On', () => {
    setupTest();
    FilesTable.validations.shouldShowColumnContent('created_on', data.file);
  });

  it('Sequencing', () => {
    setupTest();
    FilesTable.validations.shouldShowColumnContent('sequencing', data.file);
  });

  it('Hash', () => {
    setupTest();
    FilesTable.validations.shouldShowColumnContent('hash', data.file);
  });

  it('Run', () => {
    setupTest();
    FilesTable.validations.shouldShowColumnContent('run', data.file);
  });
});
