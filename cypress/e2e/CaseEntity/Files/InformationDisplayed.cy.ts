/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { FilesTable } from 'pom/pages/FilesTable';

describe('CaseEntity - Files - Information displayed [SJRA-853]', () => {
  const setupTest = () => {
    cy.login();
    cy.visitCaseFilesPage(data.file.case, data.file.search_criteria);
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

  it('Assay [SJRA-850]', () => {
    setupTest();
    FilesTable.validations.shouldShowColumnContent('assay', data.file);
  });

  it('Hash [SJRA-850]', () => {
    setupTest();
    FilesTable.validations.shouldShowColumnContent('hash', data.file);
  });

  it('Run [SJRA-850]', () => {
    setupTest();
    FilesTable.validations.shouldShowColumnContent('run', data.file);
  });
});
