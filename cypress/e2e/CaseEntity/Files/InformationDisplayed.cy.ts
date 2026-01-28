/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { CaseEntity_Files } from 'pom/pages/CaseEntity_Files';

describe('CaseEntity - Files - Information displayed', () => {
  const setupTest = () => {
    cy.login();
    cy.visitCaseFilesPage(data.file.case, data.file.search_criteria);
    CaseEntity_Files.actions.sortColumn('name');
    CaseEntity_Files.actions.sortColumn('name');
  };

  it('File Name', () => {
    setupTest();
    CaseEntity_Files.validations.shouldShowColumnContent('name', data.file);
  });

  it('Format', () => {
    setupTest();
    CaseEntity_Files.validations.shouldShowColumnContent('format', data.file);
  });

  it('Type', () => {
    setupTest();
    CaseEntity_Files.validations.shouldShowColumnContent('type', data.file);
  });

  it('Size', () => {
    setupTest();
    CaseEntity_Files.validations.shouldShowColumnContent('size', data.file);
  });

  it('Patient', () => {
    setupTest();
    CaseEntity_Files.validations.shouldShowColumnContent('patient', data.file);
  });

  it('Relationship', () => {
    setupTest();
    CaseEntity_Files.validations.shouldShowColumnContent('relationship', data.file);
  });

  it('Sample', () => {
    setupTest();
    CaseEntity_Files.validations.shouldShowColumnContent('sample', data.file);
  });

  it('Task', () => {
    setupTest();
    CaseEntity_Files.validations.shouldShowColumnContent('task', data.file);
  });

  it('Created On', () => {
    setupTest();
    CaseEntity_Files.validations.shouldShowColumnContent('created_on', data.file);
  });

  it('Sequencing', () => {
    setupTest();
    CaseEntity_Files.validations.shouldShowColumnContent('sequencing', data.file);
  });

  it('Hash', () => {
    setupTest();
    CaseEntity_Files.validations.shouldShowColumnContent('hash', data.file);
  });

  it('Run', () => {
    setupTest();
    CaseEntity_Files.validations.shouldShowColumnContent('run', data.file);
  });
});
