/// <reference types="cypress"/>
import 'support/commands';
import { setupOnce } from 'support/setupOnce';
import { CasesTable } from 'pom/pages/CasesTable';

// The tests share one page: each one restores what it changes.
describe('Cases - Columns', { testIsolation: false }, () => {
  setupOnce(() => {
    cy.login();
    cy.visitCasesPage();
  });

  it('Default display', () => {
    CasesTable.validations.shouldMatchDefaultColumnVisibility();
  });

  describe('All columns shown', () => {
    setupOnce(() => {
      CasesTable.actions.showAllColumns();
    });

    it('Order', () => {
      CasesTable.validations.shouldShowAllColumns();
    });

    it('Pin', () => {
      CasesTable.validations.shouldShowPinnableColumns();
    });

    it('Default pin state', () => {
      CasesTable.validations.shouldMatchDefaultPinnedColumns();
    });

    it('Sort', () => {
      CasesTable.validations.shouldShowSortableColumns();
    });

    it('Tooltip', () => {
      CasesTable.validations.shouldShowColumnTooltips();
    });

    it('Hide and show column', () => {
      CasesTable.validations.shouldDisplayColumn('case');
      CasesTable.actions.hideColumn('case');
      CasesTable.validations.shouldNotDisplayColumn('case');
      CasesTable.actions.showColumn('case');
      CasesTable.validations.shouldDisplayColumn('case');
    });

    it('Pin and unpin column', () => {
      CasesTable.validations.shouldUnpinnedColumn('status');
      CasesTable.actions.pinColumn('status');
      CasesTable.validations.shouldPinnedColumn('status');
      CasesTable.actions.unpinColumn('status');
      CasesTable.validations.shouldUnpinnedColumn('status');
    });
  });
});
