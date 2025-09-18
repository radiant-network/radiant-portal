/// <reference types="cypress"/>
import '../../support/commands';
import { data } from '../../pom/shared/Data';
import { FilesTable } from '../../pom/pages/FilesTable';

describe('Files - Information displayed', () => {
  const setupTest = () => {
    cy.login();
    cy.visitFilesPage(data.file.search_criteria);
  };

  it('name', () => {
    setupTest();
    FilesTable.validations.shouldShowColumnContent('name', data.file);
  });

  it('format', () => {
    setupTest();
    FilesTable.validations.shouldShowColumnContent('format', data.file);
  });

  it('type', () => {
    setupTest();
    FilesTable.validations.shouldShowColumnContent('type', data.file);
  });

  it('size', () => {
    setupTest();
    FilesTable.validations.shouldShowColumnContent('size', data.file);
  });

  it('case', () => {
    setupTest();
    FilesTable.validations.shouldShowColumnContent('case', data.file);
  });

  it('diag_lab', () => {
    setupTest();
    FilesTable.validations.shouldShowColumnContent('diag_lab', data.file);
  });

  it('relationship', () => {
    setupTest();
    FilesTable.validations.shouldShowColumnContent('relationship', data.file);
  });

  it('patient', () => {
    setupTest();
    FilesTable.validations.shouldShowColumnContent('patient', data.file);
  });

  it('sample', () => {
    setupTest();
    FilesTable.validations.shouldShowColumnContent('sample', data.file);
  });

  it('task', () => {
    setupTest();
    FilesTable.validations.shouldShowColumnContent('task', data.file);
  });

  it('created_on', () => {
    setupTest();
    FilesTable.validations.shouldShowColumnContent('created_on', data.file);
  });

  it('assay', () => {
    setupTest();
    FilesTable.validations.shouldShowColumnContent('assay', data.file);
  });

  it('hash', () => {
    setupTest();
    FilesTable.validations.shouldShowColumnContent('hash', data.file);
  });

  it('run', () => {
    setupTest();
    FilesTable.validations.shouldShowColumnContent('run', data.file);
  });
});
