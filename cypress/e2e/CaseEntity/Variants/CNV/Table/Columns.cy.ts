/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { CaseEntity_Variants_CNV_Table } from 'pom/pages/CaseEntity_Variants_CNV_Table';

describe('Case Entity - Variants - CNV - Table - Columns', () => {
  const setupTest = () => {
    cy.login();
    cy.visitCaseVariantsPage(data.case.case, 'CNV');
  };

  it('Default display', () => {
    setupTest();
    CaseEntity_Variants_CNV_Table.validations.shouldMatchDefaultColumnVisibility();
  });

  it('Order', () => {
    setupTest();
    CaseEntity_Variants_CNV_Table.validations.shouldShowAllColumns();
  });

  it('Pin', () => {
    setupTest();
    CaseEntity_Variants_CNV_Table.validations.shouldShowPinnableColumns();
  });

  it('Default pin state', () => {
    setupTest();
    CaseEntity_Variants_CNV_Table.validations.shouldMatchDefaultPinnedColumns();
  });

  it('Sort', () => {
    setupTest();
    CaseEntity_Variants_CNV_Table.validations.shouldShowSortableColumns();
  });

  it('Tooltip', () => {
    setupTest();
    CaseEntity_Variants_CNV_Table.validations.shouldShowColumnTooltips();
  });

  it('Hide and show column', () => {
    setupTest();
    CaseEntity_Variants_CNV_Table.validations.shouldDisplayColumn('cnv_variant');
    CaseEntity_Variants_CNV_Table.actions.hideColumn('cnv_variant');
    CaseEntity_Variants_CNV_Table.validations.shouldNotDisplayColumn('cnv_variant');
    CaseEntity_Variants_CNV_Table.actions.showColumn('cnv_variant');
    CaseEntity_Variants_CNV_Table.validations.shouldDisplayColumn('cnv_variant');
  });

  it('Pin and unpin column', () => {
    setupTest();
    CaseEntity_Variants_CNV_Table.validations.shouldUnpinnedColumn('cnv_variant');
    CaseEntity_Variants_CNV_Table.actions.pinColumn('cnv_variant');
    CaseEntity_Variants_CNV_Table.validations.shouldPinnedColumn('cnv_variant');
    CaseEntity_Variants_CNV_Table.actions.unpinColumn('cnv_variant');
    CaseEntity_Variants_CNV_Table.validations.shouldUnpinnedColumn('cnv_variant');
  });
});
