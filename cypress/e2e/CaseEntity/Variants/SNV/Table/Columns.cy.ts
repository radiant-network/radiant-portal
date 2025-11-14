/// <reference types="cypress"/>
import 'support/commands';
import { CaseEntity_Variants_SNV_Table } from 'pom/pages/CaseEntity_Variants_SNV_Table';

describe('Case Entity - Variants - SNV - Table - Columns', () => {
  const setupTest = () => {
    cy.login();
    cy.visitCaseVariantsPage('1', 'SNV');
  };

  it('Default display', () => {
    setupTest();
    CaseEntity_Variants_SNV_Table.validations.shouldMatchDefaultColumnVisibility();
  });

  it('Order', () => {
    setupTest();
    CaseEntity_Variants_SNV_Table.validations.shouldShowAllColumns();
  });

  it('Pin', () => {
    setupTest();
    CaseEntity_Variants_SNV_Table.validations.shouldShowPinnableColumns();
  });

  it('Default pin state', () => {
    setupTest();
    CaseEntity_Variants_SNV_Table.validations.shouldMatchDefaultPinnedColumns();
  });

  it('Sort', () => {
    setupTest();
    CaseEntity_Variants_SNV_Table.validations.shouldShowSortableColumns();
  });

  it('Tooltip', () => {
    setupTest();
    CaseEntity_Variants_SNV_Table.validations.shouldShowColumnTooltips();
  });

  it('Hide and show column', () => {
    setupTest();
    CaseEntity_Variants_SNV_Table.validations.shouldDisplayColumn('type');
    CaseEntity_Variants_SNV_Table.actions.hideColumn('type');
    CaseEntity_Variants_SNV_Table.validations.shouldNotDisplayColumn('type');
    CaseEntity_Variants_SNV_Table.actions.showColumn('type');
    CaseEntity_Variants_SNV_Table.validations.shouldDisplayColumn('type');
  });

  it('Pin and unpin column', () => {
    setupTest();
    CaseEntity_Variants_SNV_Table.validations.shouldUnpinnedColumn('type');
    CaseEntity_Variants_SNV_Table.actions.pinColumn('type');
    CaseEntity_Variants_SNV_Table.validations.shouldPinnedColumn('type');
    CaseEntity_Variants_SNV_Table.actions.unpinColumn('type');
    CaseEntity_Variants_SNV_Table.validations.shouldUnpinnedColumn('type');
  });
});
