/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { VariantEntity_Patients } from 'pom/pages/VariantEntity_Patients';

describe('VariantEntity - Patients - Uninterpreted - Information displayed', () => {
  const setupTest = () => {
    cy.login();
    cy.visitVariantPatientsPage(data.variantGermline.locus_id);
    VariantEntity_Patients.uninterpreted.actions.selectTab();
  };

  it('Case [SJRA-1168]', () => {
    setupTest();
    VariantEntity_Patients.uninterpreted.validations.shouldShowColumnContent('case', data.variantGermline.uninterpreted);
  });

  it('Sequencing [SJRA-1168]', () => {
    setupTest();
    VariantEntity_Patients.uninterpreted.validations.shouldShowColumnContent('sequencing', data.variantGermline.uninterpreted);
  });

  it('Patient [SJRA-1168]', () => {
    setupTest();
    VariantEntity_Patients.uninterpreted.validations.shouldShowColumnContent('patient', data.variantGermline.uninterpreted);
  });

  it('Sample [SJRA-1168]', () => {
    setupTest();
    VariantEntity_Patients.uninterpreted.validations.shouldShowColumnContent('sample', data.variantGermline.uninterpreted);
  });

  it('Aff. Status', () => {
    setupTest();
    VariantEntity_Patients.uninterpreted.validations.shouldShowColumnContent('aff_status', data.variantGermline.uninterpreted);
  });

  it('Phenotype (HPO)', () => {
    setupTest();
    VariantEntity_Patients.uninterpreted.validations.shouldShowColumnContent('hpo', data.variantGermline.uninterpreted);
  });

  it('Zygosity', () => {
    setupTest();
    VariantEntity_Patients.uninterpreted.validations.shouldShowColumnContent('zygosity', data.variantGermline.uninterpreted);
  });

  it('Diagnostic Lab [SJRA-1168]', () => {
    setupTest();
    VariantEntity_Patients.uninterpreted.validations.shouldShowColumnContent('diag_lab', data.variantGermline.uninterpreted);
  });

  it('Analysis', () => {
    setupTest();
    VariantEntity_Patients.uninterpreted.validations.shouldShowColumnContent('analysis', data.variantGermline.uninterpreted);
  });

  it('Date [SJRA-1168]', () => {
    setupTest();
    VariantEntity_Patients.uninterpreted.validations.shouldShowColumnContent('date', data.variantGermline.uninterpreted);
  });

  it('Status', () => {
    setupTest();
    VariantEntity_Patients.uninterpreted.validations.shouldShowColumnContent('status', data.variantGermline.uninterpreted);
  });
});
