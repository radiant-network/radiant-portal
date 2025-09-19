/// <reference types="cypress"/>
import 'support/commands';
import { FilesTable } from 'pom/pages/FilesTable';

describe('Files - Columns', () => {
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
});
