/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { VariantEntity_Patients } from 'pom/pages/VariantEntity_Patients';

describe('VariantEntity - Patients - Interpreted - Columns', () => {
  const setupTest = () => {
    cy.login();
    cy.visitVariantPatientsPage(data.variantGermline.locus_id);
  };

  it('Default display', () => {
    setupTest();
    VariantEntity_Patients.interpreted.validations.shouldMatchDefaultColumnVisibility();
  });

  it('Order', () => {
    setupTest();
    VariantEntity_Patients.interpreted.validations.shouldShowAllColumns();
  });

  it('Pin', () => {
    setupTest();
    VariantEntity_Patients.interpreted.validations.shouldShowPinnableColumns();
  });

  it('Default pin state', () => {
    setupTest();
    VariantEntity_Patients.interpreted.validations.shouldMatchDefaultPinnedColumns();
  });

  it('Sort', () => {
    setupTest();
    VariantEntity_Patients.interpreted.validations.shouldShowSortableColumns();
  });

  it('Tooltip', () => {
    setupTest();
    VariantEntity_Patients.interpreted.validations.shouldShowColumnTooltips();
  });

  it('Pin and unpin column', () => {
    setupTest();
    VariantEntity_Patients.interpreted.validations.shouldUnpinnedColumn('case');
    VariantEntity_Patients.interpreted.actions.pinColumn('case');
    VariantEntity_Patients.interpreted.validations.shouldPinnedColumn('case');
    VariantEntity_Patients.interpreted.actions.unpinColumn('case');
    VariantEntity_Patients.interpreted.validations.shouldUnpinnedColumn('case');
  });
});
