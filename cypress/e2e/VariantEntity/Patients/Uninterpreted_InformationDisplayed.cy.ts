/// <reference types="cypress"/>
import 'support/commands';
import { setupOnce } from 'support/setupOnce';
import { data } from 'pom/shared/Data';
import { VariantEntity_Patients } from 'pom/pages/VariantEntity_Patients';

// Read-only checks: set the page up once and share it between tests.
describe('VariantEntity - Patients - Uninterpreted - Information displayed', { testIsolation: false }, () => {
  setupOnce(() => {
    cy.login();
    cy.visitVariantPatientsPage(data.variantGermline.locus_id);
    VariantEntity_Patients.uninterpreted.actions.selectTab();
    VariantEntity_Patients.uninterpreted.actions.sortColumn('case');
    VariantEntity_Patients.uninterpreted.actions.sortColumn('case');
    VariantEntity_Patients.uninterpreted.actions.showAllColumns();
  });

  it('Case', () => {
    VariantEntity_Patients.uninterpreted.validations.shouldShowColumnContent('case', data.variantGermline.uninterpreted);
  });

  it('Aff. Status', () => {
    VariantEntity_Patients.uninterpreted.validations.shouldShowColumnContent('aff_status', data.variantGermline.uninterpreted);
  });

  it('Phenotype (HPO)', () => {
    VariantEntity_Patients.uninterpreted.validations.shouldShowColumnContent('hpo', data.variantGermline.uninterpreted);
  });

  it('Zygosity', () => {
    VariantEntity_Patients.uninterpreted.validations.shouldShowColumnContent('zygosity', data.variantGermline.uninterpreted);
  });

  it('Diagnostic Lab', () => {
    VariantEntity_Patients.uninterpreted.validations.shouldShowColumnContent('diag_lab', data.variantGermline.uninterpreted);
  });

  it('Sample', () => {
    VariantEntity_Patients.uninterpreted.validations.shouldShowColumnContent('sample', data.variantGermline.uninterpreted);
  });

  it('Date', () => {
    VariantEntity_Patients.uninterpreted.validations.shouldShowColumnContent('date', data.variantGermline.uninterpreted);
  });

  it('Analysis', () => {
    VariantEntity_Patients.uninterpreted.validations.shouldShowColumnContent('analysis', data.variantGermline.uninterpreted);
  });

  it('Patient', () => {
    VariantEntity_Patients.uninterpreted.validations.shouldShowColumnContent('patient', data.variantGermline.uninterpreted);
  });
});
