/// <reference types="cypress"/>
import 'support/commands';
import { FilesTable } from 'pom/pages/FilesTable';

describe('Files - Columns [SJRA-853]', () => {
  const setupTest = () => {
    cy.login();
    cy.visitFilesPage();
  };

  it('Default display', () => {
    setupTest();
    FilesTable.validations.shouldMatchDefaultColumnVisibility();
  });

  it('Order', () => {
    setupTest();
    FilesTable.validations.shouldShowAllColumns();
  });

  it('Pin', () => {
    setupTest();
    FilesTable.validations.shouldShowPinnableColumns();
  });

  it('Default pin state', () => {
    setupTest();
    FilesTable.validations.shouldMatchDefaultPinnedColumns();
  });

  it('Sort', () => {
    setupTest();
    FilesTable.validations.shouldShowSortableColumns();
  });

  it('Tooltip', () => {
    setupTest();
    FilesTable.validations.shouldShowColumnTooltips();
  });

  it('Hide and show column', () => {
    setupTest();
    FilesTable.validations.shouldDisplayColumn('name');
    FilesTable.actions.hideColumn('name');
    FilesTable.validations.shouldNotDisplayColumn('name');
    FilesTable.actions.showColumn('name');
    FilesTable.validations.shouldDisplayColumn('name');
  });

  it('Pin and unpin column', () => {
    setupTest();
    FilesTable.validations.shouldUnpinnedColumn('type');
    FilesTable.actions.pinColumn('type');
    FilesTable.validations.shouldPinnedColumn('type');
    FilesTable.actions.unpinColumn('type');
    FilesTable.validations.shouldUnpinnedColumn('type');
  });
});
