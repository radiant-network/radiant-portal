/// <reference types="cypress"/>
import 'support/commands';
import { CaseEntity_Variants_CNV } from 'pom/pages/CaseEntity_Variants_CNV';

describe('Case Entity - Variants - CNV - Columns', () => {
  const setupTest = () => {
    cy.login();
    cy.visitCaseVariantsPage('1', 'CNV');
  };

  it('Default display', () => {
    setupTest();
    CaseEntity_Variants_CNV.validations.shouldMatchDefaultColumnVisibility();
  });

  it('Order', () => {
    setupTest();
    CaseEntity_Variants_CNV.validations.shouldShowAllColumns();
  });

  it('Pin', () => {
    setupTest();
    CaseEntity_Variants_CNV.validations.shouldShowPinnableColumns();
  });

  it('Default pin state', () => {
    setupTest();
    CaseEntity_Variants_CNV.validations.shouldMatchDefaultPinnedColumns();
  });

  it('Sort', () => {
    setupTest();
    CaseEntity_Variants_CNV.validations.shouldShowSortableColumns();
  });

  it('Tooltip', () => {
    setupTest();
    CaseEntity_Variants_CNV.validations.shouldShowColumnTooltips();
  });

  it('Hide and show column', () => {
    setupTest();
    CaseEntity_Variants_CNV.validations.shouldDisplayColumn('cnv_variant');
    CaseEntity_Variants_CNV.actions.hideColumn('cnv_variant');
    CaseEntity_Variants_CNV.validations.shouldNotDisplayColumn('cnv_variant');
    CaseEntity_Variants_CNV.actions.showColumn('cnv_variant');
    CaseEntity_Variants_CNV.validations.shouldDisplayColumn('cnv_variant');
  });

  it('Pin and unpin column', () => {
    setupTest();
    CaseEntity_Variants_CNV.validations.shouldUnpinnedColumn('cnv_variant');
    CaseEntity_Variants_CNV.actions.pinColumn('cnv_variant');
    CaseEntity_Variants_CNV.validations.shouldPinnedColumn('cnv_variant');
    CaseEntity_Variants_CNV.actions.unpinColumn('cnv_variant');
    CaseEntity_Variants_CNV.validations.shouldUnpinnedColumn('cnv_variant');
  });
});
