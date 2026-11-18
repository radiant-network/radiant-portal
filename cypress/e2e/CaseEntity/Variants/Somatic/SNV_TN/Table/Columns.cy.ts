/// <reference types="cypress"/>
import 'support/commands';
import { setupOnce } from 'support/setupOnce';
import { data } from 'pom/shared/Data';
import { CaseEntity_Variants_SNV_Table } from 'pom/pages/CaseEntity_Variants_SNV_Table';
import { CaseEntity_Variants_SavedFilters } from 'pom/pages/CaseEntity_Variants_SavedFilters';

// The tests share one page: each one restores what it changes.
describe('Case Entity - Variants - Somatic - SNV (TN) - Table - Columns', { testIsolation: false }, () => {
  // Cypress drops the intercepts before each test: keep the default table preferences on every test.
  beforeEach(() => {
    cy.resetTablePreferences();
  });

  setupOnce(() => {
    cy.login();
    cy.visitCaseVariantsPage(data.caseSomatic.case, data.caseSomatic.seq.seq_id, 'SNV', { cohort: 'TN' });
    CaseEntity_Variants_SavedFilters.snv.actions.selectFilterInDropdown('Cypress_All_Variants'); // Apply a filter for a cleaner query builder
    CaseEntity_Variants_SavedFilters.snv.actions.clickNewFilterButton(); // Clean Query Builder
  });

  it('Default display', () => {
    CaseEntity_Variants_SNV_Table.somatic.validations.shouldMatchDefaultColumnVisibility();
  });

  describe('All columns shown', () => {
    setupOnce(() => {
      CaseEntity_Variants_SNV_Table.somatic.actions.showAllColumns();
    });

    it('Order', () => {
      CaseEntity_Variants_SNV_Table.somatic.validations.shouldShowAllColumns();
    });

    it('Pin', () => {
      CaseEntity_Variants_SNV_Table.somatic.validations.shouldShowPinnableColumns();
    });

    it('Default pin state', () => {
      CaseEntity_Variants_SNV_Table.somatic.validations.shouldMatchDefaultPinnedColumns();
    });

    it('Sort', () => {
      CaseEntity_Variants_SNV_Table.somatic.validations.shouldShowSortableColumns();
    });

    it('Tooltip', () => {
      CaseEntity_Variants_SNV_Table.somatic.validations.shouldShowColumnTooltips();
    });

    it('Hide and show column', () => {
      CaseEntity_Variants_SNV_Table.somatic.validations.shouldDisplayColumn('type');
      CaseEntity_Variants_SNV_Table.somatic.actions.hideColumn('type');
      CaseEntity_Variants_SNV_Table.somatic.validations.shouldNotDisplayColumn('type');
      CaseEntity_Variants_SNV_Table.somatic.actions.showColumn('type');
      CaseEntity_Variants_SNV_Table.somatic.validations.shouldDisplayColumn('type');
    });

    it('Pin and unpin column', () => {
      CaseEntity_Variants_SNV_Table.somatic.validations.shouldUnpinnedColumn('type');
      CaseEntity_Variants_SNV_Table.somatic.actions.pinColumn('type');
      CaseEntity_Variants_SNV_Table.somatic.validations.shouldPinnedColumn('type');
      CaseEntity_Variants_SNV_Table.somatic.actions.unpinColumn('type');
      CaseEntity_Variants_SNV_Table.somatic.validations.shouldUnpinnedColumn('type');
    });
  });
});
