/// <reference types="cypress"/>
import 'support/commands';
import { setupOnce } from 'support/setupOnce';
import { data } from 'pom/shared/Data';
import { VariantEntity_Patients } from 'pom/pages/VariantEntity_Patients';

// The tests share one page: each one restores what it changes.
describe('VariantEntity - Patients - Interpreted - Columns', { testIsolation: false }, () => {
  setupOnce(() => {
    cy.login();
    cy.visitVariantPatientsPage(data.variantGermline.locus_id);
  });

  it('Default display', () => {
    VariantEntity_Patients.interpreted.validations.shouldMatchDefaultColumnVisibility();
  });

  describe('All columns shown', () => {
    setupOnce(() => {
      VariantEntity_Patients.interpreted.actions.showAllColumns();
    });

    it('Order', () => {
      VariantEntity_Patients.interpreted.validations.shouldShowAllColumns();
    });

    it('Pin', () => {
      VariantEntity_Patients.interpreted.validations.shouldShowPinnableColumns();
    });

    it('Default pin state', () => {
      VariantEntity_Patients.interpreted.validations.shouldMatchDefaultPinnedColumns();
    });

    it('Sort', () => {
      VariantEntity_Patients.interpreted.validations.shouldShowSortableColumns();
    });

    it('Tooltip', () => {
      VariantEntity_Patients.interpreted.validations.shouldShowColumnTooltips();
    });

    it('Pin and unpin column', () => {
      VariantEntity_Patients.interpreted.validations.shouldUnpinnedColumn('case');
      VariantEntity_Patients.interpreted.actions.pinColumn('case');
      VariantEntity_Patients.interpreted.validations.shouldPinnedColumn('case');
      VariantEntity_Patients.interpreted.actions.unpinColumn('case');
      VariantEntity_Patients.interpreted.validations.shouldUnpinnedColumn('case');
    });
  });
});
