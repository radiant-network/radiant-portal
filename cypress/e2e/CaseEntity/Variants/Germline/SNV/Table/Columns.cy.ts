/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { CaseEntity_Variants_SNV_Table } from 'pom/pages/CaseEntity_Variants_SNV_Table';
import { CaseEntity_Variants_SavedFilters } from 'pom/pages/CaseEntity_Variants_SavedFilters';

describe('Case Entity - Variants - Germline - SNV - Table - Columns', () => {
  const setupTest = () => {
    cy.login();
    cy.resetTablePreferences();
    cy.visitCaseVariantsPage(data.case.case, data.case.seq.seq_id, 'SNV');
    CaseEntity_Variants_SavedFilters.snv.actions.selectFilterInDropdown('Cypress_All_Variants'); // Clean Query Builder
  };

  it('Default display', () => {
    setupTest();
    CaseEntity_Variants_SNV_Table.germline.validations.shouldMatchDefaultColumnVisibility();
  });

  it('Order', () => {
    setupTest();
    CaseEntity_Variants_SNV_Table.germline.validations.shouldShowAllColumns();
  });

  it('Pin', () => {
    setupTest();
    CaseEntity_Variants_SNV_Table.germline.validations.shouldShowPinnableColumns();
  });

  it('Default pin state', () => {
    setupTest();
    CaseEntity_Variants_SNV_Table.germline.validations.shouldMatchDefaultPinnedColumns();
  });

  it('Sort', () => {
    setupTest();
    CaseEntity_Variants_SNV_Table.germline.validations.shouldShowSortableColumns();
  });

  it('Tooltip', () => {
    setupTest();
    CaseEntity_Variants_SNV_Table.germline.validations.shouldShowColumnTooltips();
  });

  it('Hide and show column', () => {
    setupTest();
    CaseEntity_Variants_SNV_Table.germline.validations.shouldDisplayColumn('type');
    CaseEntity_Variants_SNV_Table.germline.actions.hideColumn('type');
    CaseEntity_Variants_SNV_Table.germline.validations.shouldNotDisplayColumn('type');
    CaseEntity_Variants_SNV_Table.germline.actions.showColumn('type');
    CaseEntity_Variants_SNV_Table.germline.validations.shouldDisplayColumn('type');
  });

  it('Pin and unpin column', () => {
    setupTest();
    CaseEntity_Variants_SNV_Table.germline.validations.shouldUnpinnedColumn('type');
    CaseEntity_Variants_SNV_Table.germline.actions.pinColumn('type');
    CaseEntity_Variants_SNV_Table.germline.validations.shouldPinnedColumn('type');
    CaseEntity_Variants_SNV_Table.germline.actions.unpinColumn('type');
    CaseEntity_Variants_SNV_Table.germline.validations.shouldUnpinnedColumn('type');
  });
});
