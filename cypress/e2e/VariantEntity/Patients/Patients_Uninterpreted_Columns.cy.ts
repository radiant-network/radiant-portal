/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { VariantEntity_Patients } from 'pom/pages/VariantEntity_Patients';

describe('VariantEntity - Patients - Uninterpreted - Columns', () => {
  const setupTest = () => {
    cy.login();
    cy.visitVariantPatientsPage(data.variantGermline.locus_id);
    VariantEntity_Patients.uninterpreted.actions.selectTab();
  };

  it('Default display', () => {
    setupTest();
    VariantEntity_Patients.uninterpreted.validations.shouldMatchDefaultColumnVisibility();
  });

  it('Order', () => {
    setupTest();
    VariantEntity_Patients.uninterpreted.validations.shouldShowAllColumns();
  });

  it('Pin', () => {
    setupTest();
    VariantEntity_Patients.uninterpreted.validations.shouldShowPinnableColumns();
  });

  it('Default pin state', () => {
    setupTest();
    VariantEntity_Patients.uninterpreted.validations.shouldMatchDefaultPinnedColumns();
  });

  it('Sort', () => {
    setupTest();
    VariantEntity_Patients.uninterpreted.validations.shouldShowSortableColumns();
  });

  it('Tooltip', () => {
    setupTest();
    VariantEntity_Patients.uninterpreted.validations.shouldShowColumnTooltips();
  });

  it('Pin and unpin column', () => {
    setupTest();
    VariantEntity_Patients.uninterpreted.validations.shouldUnpinnedColumn('case');
    VariantEntity_Patients.uninterpreted.actions.pinColumn('case');
    VariantEntity_Patients.uninterpreted.validations.shouldPinnedColumn('case');
    VariantEntity_Patients.uninterpreted.actions.unpinColumn('case');
    VariantEntity_Patients.uninterpreted.validations.shouldUnpinnedColumn('case');
  });
});
