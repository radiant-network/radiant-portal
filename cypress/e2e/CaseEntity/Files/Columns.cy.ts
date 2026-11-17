/// <reference types="cypress"/>
import 'support/commands';
import { setupOnce } from 'support/setupOnce';
import { CaseEntity_Files } from 'pom/pages/CaseEntity_Files';
import { data } from 'pom/shared/Data';

// The tests share one page: each one restores what it changes.
describe('CaseEntity - Files - Columns', { testIsolation: false }, () => {
  // Cypress drops the intercepts before each test: keep the default table preferences on every test.
  beforeEach(() => {
    cy.resetTablePreferences();
  });

  setupOnce(() => {
    cy.login();
    cy.visitCaseFilesPage(data.file.case);
  });

  it('Default display', () => {
    CaseEntity_Files.validations.shouldMatchDefaultColumnVisibility();
  });

  describe('All columns shown', () => {
    setupOnce(() => {
      CaseEntity_Files.actions.showAllColumns();
    });

    it('Order', () => {
      CaseEntity_Files.validations.shouldShowAllColumns();
    });

    it('Pin', () => {
      CaseEntity_Files.validations.shouldShowPinnableColumns();
    });

    it('Default pin state', () => {
      CaseEntity_Files.validations.shouldMatchDefaultPinnedColumns();
    });

    it('Sort', () => {
      CaseEntity_Files.validations.shouldShowSortableColumns();
    });

    it('Tooltip', () => {
      CaseEntity_Files.validations.shouldShowColumnTooltips();
    });

    it('Hide and show column', () => {
      CaseEntity_Files.validations.shouldDisplayColumn('name');
      CaseEntity_Files.actions.hideColumn('name');
      CaseEntity_Files.validations.shouldNotDisplayColumn('name');
      CaseEntity_Files.actions.showColumn('name');
      CaseEntity_Files.validations.shouldDisplayColumn('name');
    });

    it('Pin and unpin column', () => {
      CaseEntity_Files.validations.shouldUnpinnedColumn('type');
      CaseEntity_Files.actions.pinColumn('type');
      CaseEntity_Files.validations.shouldPinnedColumn('type');
      CaseEntity_Files.actions.unpinColumn('type');
      CaseEntity_Files.validations.shouldUnpinnedColumn('type');
    });
  });
});
