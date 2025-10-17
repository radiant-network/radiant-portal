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

  it('Pin', () => {
    setupTest();
    CaseEntity_Files.validations.shouldShowPinnableColumns();
  });

  it('Default pin state', () => {
    setupTest();
    CaseEntity_Files.validations.shouldMatchDefaultPinnedColumns();
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

  it('Pin and unpin column', () => {
    setupTest();
    CaseEntity_Files.validations.shouldUnpinnedColumn('type');
    CaseEntity_Files.actions.pinColumn('type');
    CaseEntity_Files.validations.shouldPinnedColumn('type');
    CaseEntity_Files.actions.unpinColumn('type');
    CaseEntity_Files.validations.shouldUnpinnedColumn('type');
  });
});
