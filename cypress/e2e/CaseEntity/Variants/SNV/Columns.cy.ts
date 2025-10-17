/// <reference types="cypress"/>
import 'support/commands';
import { CaseEntity_Variants_SNV } from 'pom/pages/CaseEntity_Variants_SNV';

describe('Case Entity - Variants - SNV - Columns', () => {
  const setupTest = () => {
    cy.login();
    cy.visitCaseVariantsPage('1', 'SNV');
  };

  it('Default display', () => {
    setupTest();
    CaseEntity_Variants_SNV.validations.shouldMatchDefaultColumnVisibility();
  });

  it('Order', () => {
    setupTest();
    CaseEntity_Variants_SNV.validations.shouldShowAllColumns();
  });

  it('Pin', () => {
    setupTest();
    CaseEntity_Variants_SNV.validations.shouldShowPinnableColumns();
  });

  it('Default pin state', () => {
    setupTest();
    CaseEntity_Variants_SNV.validations.shouldMatchDefaultPinnedColumns();
  });

  it('Sort', () => {
    setupTest();
    CaseEntity_Variants_SNV.validations.shouldShowSortableColumns();
  });

  it('Tooltip', () => {
    setupTest();
    CaseEntity_Variants_SNV.validations.shouldShowColumnTooltips();
  });

  it('Hide and show column', () => {
    setupTest();
    CaseEntity_Variants_SNV.validations.shouldDisplayColumn('type');
    CaseEntity_Variants_SNV.actions.hideColumn('type');
    CaseEntity_Variants_SNV.validations.shouldNotDisplayColumn('type');
    CaseEntity_Variants_SNV.actions.showColumn('type');
    CaseEntity_Variants_SNV.validations.shouldDisplayColumn('type');
  });

  it('Pin and unpin column', () => {
    setupTest();
    CaseEntity_Variants_SNV.validations.shouldUnpinnedColumn('type');
    CaseEntity_Variants_SNV.actions.pinColumn('type');
    CaseEntity_Variants_SNV.validations.shouldPinnedColumn('type');
    CaseEntity_Variants_SNV.actions.unpinColumn('type');
    CaseEntity_Variants_SNV.validations.shouldUnpinnedColumn('type');
  });
});
