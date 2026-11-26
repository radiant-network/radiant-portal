/// <reference types="cypress"/>
import 'support/commands';
import { setupOnce } from 'support/setupOnce';
import { data } from 'pom/shared/Data';
import { CaseEntity_Variants_CNV_Table } from 'pom/pages/CaseEntity_Variants_CNV_Table';

// The tests share one page: each one restores what it changes.
describe('Case Entity - Variants - Germline - CNV - Table - Columns', { testIsolation: false }, () => {
  setupOnce(() => {
    cy.login();
    cy.visitCaseVariantsPage(data.case.case, data.case.seq.seq_id, 'CNV');
  });

  it('Default display', () => {
    CaseEntity_Variants_CNV_Table.validations.shouldMatchDefaultColumnVisibility();
  });

  describe('All columns shown', () => {
    setupOnce(() => {
      CaseEntity_Variants_CNV_Table.actions.showAllColumns();
    });

    it('Order', () => {
      CaseEntity_Variants_CNV_Table.validations.shouldShowAllColumns();
    });

    it('Pin', () => {
      CaseEntity_Variants_CNV_Table.validations.shouldShowPinnableColumns();
    });

    it('Default pin state', () => {
      CaseEntity_Variants_CNV_Table.validations.shouldMatchDefaultPinnedColumns();
    });

    it('Sort', () => {
      CaseEntity_Variants_CNV_Table.validations.shouldShowSortableColumns();
    });

    it('Tooltip', () => {
      CaseEntity_Variants_CNV_Table.validations.shouldShowColumnTooltips();
    });

    it('Hide and show column', () => {
      CaseEntity_Variants_CNV_Table.validations.shouldDisplayColumn('cnv_variant');
      CaseEntity_Variants_CNV_Table.actions.hideColumn('cnv_variant');
      CaseEntity_Variants_CNV_Table.validations.shouldNotDisplayColumn('cnv_variant');
      CaseEntity_Variants_CNV_Table.actions.showColumn('cnv_variant');
      CaseEntity_Variants_CNV_Table.validations.shouldDisplayColumn('cnv_variant');
    });

    it('Pin and unpin column', () => {
      CaseEntity_Variants_CNV_Table.validations.shouldUnpinnedColumn('cnv_variant');
      CaseEntity_Variants_CNV_Table.actions.pinColumn('cnv_variant');
      CaseEntity_Variants_CNV_Table.validations.shouldPinnedColumn('cnv_variant');
      CaseEntity_Variants_CNV_Table.actions.unpinColumn('cnv_variant');
      CaseEntity_Variants_CNV_Table.validations.shouldUnpinnedColumn('cnv_variant');
    });
  });
});
