/// <reference types="cypress"/>
import 'support/commands';
import { setupOnce } from 'support/setupOnce';
import { data } from 'pom/shared/Data';
import { VariantEntity_Patients } from 'pom/pages/VariantEntity_Patients';

// The tests share one page: each one restores what it changes.
describe('VariantEntity - Patients - Uninterpreted - Columns', { testIsolation: false }, () => {
  setupOnce(() => {
    cy.login();
    cy.visitVariantPatientsPage(data.variantGermline.locus_id);
    VariantEntity_Patients.uninterpreted.actions.selectTab();
    cy.resetColumns();
  });

  it('Default display', () => {
    VariantEntity_Patients.uninterpreted.validations.shouldMatchDefaultColumnVisibility();
  });

  describe('All columns shown', () => {
    setupOnce(() => {
      VariantEntity_Patients.uninterpreted.actions.showAllColumns();
    });

    it('Order', () => {
      VariantEntity_Patients.uninterpreted.validations.shouldShowAllColumns();
    });

    it('Pin', () => {
      VariantEntity_Patients.uninterpreted.validations.shouldShowPinnableColumns();
    });

    it('Default pin state', () => {
      VariantEntity_Patients.uninterpreted.validations.shouldMatchDefaultPinnedColumns();
    });

    it('Sort', () => {
      VariantEntity_Patients.uninterpreted.validations.shouldShowSortableColumns();
    });

    it('Tooltip', () => {
      VariantEntity_Patients.uninterpreted.validations.shouldShowColumnTooltips();
    });

    it('Pin and unpin column', () => {
      VariantEntity_Patients.uninterpreted.validations.shouldUnpinnedColumn('case');
      VariantEntity_Patients.uninterpreted.actions.pinColumn('case');
      VariantEntity_Patients.uninterpreted.validations.shouldPinnedColumn('case');
      VariantEntity_Patients.uninterpreted.actions.unpinColumn('case');
      VariantEntity_Patients.uninterpreted.validations.shouldUnpinnedColumn('case');
    });
  });
});
