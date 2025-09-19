/// <reference types="cypress"/>
import 'support/commands';
import { CaseEntity_Files } from 'pom/pages/CaseEntity_Files';
import { data } from 'pom/shared/Data';

describe('CaseEntity - Files - Columns', () => {
  const setupTest = () => {
    cy.login();
    cy.visitCaseFilesPage(data.file.case);
  };

  it('Default display', () => {
    setupTest();
    CaseEntity_Files.validations.shouldMatchDefaultColumnVisibility();
  });

  it('Order', () => {
    setupTest();
    CaseEntity_Files.validations.shouldShowAllColumns();
  });

  it('Sort', () => {
    setupTest();
    CaseEntity_Files.validations.shouldShowSortableColumns();
  });

  it('Tooltip', () => {
    setupTest();
    CaseEntity_Files.validations.shouldShowColumnTooltips();
  });

  it('Hide and show column', () => {
    setupTest();
    CaseEntity_Files.validations.shouldDisplayColumn('name');
    CaseEntity_Files.actions.hideColumn('name');
    CaseEntity_Files.validations.shouldNotDisplayColumn('name');
    CaseEntity_Files.actions.showColumn('name');
    CaseEntity_Files.validations.shouldDisplayColumn('name');
  });
});
