/// <reference types="cypress"/>
import 'support/commands';
import { setupOnce } from 'support/setupOnce';
import { FilesTable } from 'pom/pages/FilesTable';

// The tests share one page: each one restores what it changes.
describe('Files - Columns', { testIsolation: false }, () => {
  // Cypress drops the intercepts before each test: keep the default table preferences on every test.
  beforeEach(() => {
    cy.resetTablePreferences();
  });

  setupOnce(() => {
    cy.login();
    cy.visitFilesPage();
  });

  it('Default display', () => {
    FilesTable.validations.shouldMatchDefaultColumnVisibility();
  });

  describe('All columns shown', () => {
    setupOnce(() => {
      FilesTable.actions.showAllColumns();
    });

    it('Order', () => {
      FilesTable.validations.shouldShowAllColumns();
    });

    it('Pin', () => {
      FilesTable.validations.shouldShowPinnableColumns();
    });

    it('Default pin state', () => {
      FilesTable.validations.shouldMatchDefaultPinnedColumns();
    });

    it('Sort', () => {
      FilesTable.validations.shouldShowSortableColumns();
    });

    it('Tooltip', () => {
      FilesTable.validations.shouldShowColumnTooltips();
    });

    it('Hide and show column', () => {
      FilesTable.validations.shouldDisplayColumn('name');
      FilesTable.actions.hideColumn('name');
      FilesTable.validations.shouldNotDisplayColumn('name');
      FilesTable.actions.showColumn('name');
      FilesTable.validations.shouldDisplayColumn('name');
    });

    it('Pin and unpin column', () => {
      FilesTable.validations.shouldUnpinnedColumn('type');
      FilesTable.actions.pinColumn('type');
      FilesTable.validations.shouldPinnedColumn('type');
      FilesTable.actions.unpinColumn('type');
      FilesTable.validations.shouldUnpinnedColumn('type');
    });
  });
});
