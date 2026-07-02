/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { CaseEntity_Variants_SNV_Table } from 'pom/pages/CaseEntity_Variants_SNV_Table';
import { CaseEntity_Variants_SavedFilters } from 'pom/pages/CaseEntity_Variants_SavedFilters';

describe('Case Entity - Variants - Somatic - SNV - Table - Columns', () => {
  const setupTest = () => {
    cy.login();
    cy.resetTablePreferences();
    cy.visitCaseVariantsPage(data.caseSomatic.case, data.caseSomatic.seq.seq_id, 'SNV');
    CaseEntity_Variants_SavedFilters.snv.actions.selectFilterInDropdown('Cypress_All_Variants'); // Apply a filter for a cleaner query builder
    CaseEntity_Variants_SavedFilters.snv.actions.clickNewFilterButton(); // Clean Query Builder
  };

  it('Default display', () => {
    setupTest();
    CaseEntity_Variants_SNV_Table.somatic.validations.shouldMatchDefaultColumnVisibility();
  });

  it('Order', () => {
    setupTest();
    CaseEntity_Variants_SNV_Table.somatic.validations.shouldShowAllColumns();
  });

  it('Pin', () => {
    setupTest();
    CaseEntity_Variants_SNV_Table.somatic.validations.shouldShowPinnableColumns();
  });

  it('Default pin state', () => {
    setupTest();
    CaseEntity_Variants_SNV_Table.somatic.validations.shouldMatchDefaultPinnedColumns();
  });

  it('Sort', () => {
    setupTest();
    CaseEntity_Variants_SNV_Table.somatic.validations.shouldShowSortableColumns();
  });

  it('Tooltip', () => {
    setupTest();
    CaseEntity_Variants_SNV_Table.somatic.validations.shouldShowColumnTooltips();
  });

  it('Hide and show column', () => {
    setupTest();
    CaseEntity_Variants_SNV_Table.somatic.validations.shouldDisplayColumn('type');
    CaseEntity_Variants_SNV_Table.somatic.actions.hideColumn('type');
    CaseEntity_Variants_SNV_Table.somatic.validations.shouldNotDisplayColumn('type');
    CaseEntity_Variants_SNV_Table.somatic.actions.showColumn('type');
    CaseEntity_Variants_SNV_Table.somatic.validations.shouldDisplayColumn('type');
  });

  it('Pin and unpin column', () => {
    setupTest();
    CaseEntity_Variants_SNV_Table.somatic.validations.shouldUnpinnedColumn('type');
    CaseEntity_Variants_SNV_Table.somatic.actions.pinColumn('type');
    CaseEntity_Variants_SNV_Table.somatic.validations.shouldPinnedColumn('type');
    CaseEntity_Variants_SNV_Table.somatic.actions.unpinColumn('type');
    CaseEntity_Variants_SNV_Table.somatic.validations.shouldUnpinnedColumn('type');
  });
});
