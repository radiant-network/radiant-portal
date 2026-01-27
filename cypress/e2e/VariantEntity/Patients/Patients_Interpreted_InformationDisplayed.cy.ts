/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { VariantEntity_Patients } from 'pom/pages/VariantEntity_Patients';

describe('VariantEntity - Patients - Interpreted - Information displayed', () => {
  const setupTest = () => {
    cy.login();
    cy.visitVariantPatientsPage(data.variantGermline.locus_id);
  };

  it('Case', () => {
    setupTest();
    VariantEntity_Patients.interpreted.validations.shouldShowColumnContent('case', data.variantGermline.interpreted);
  });

  it('Date', () => {
    setupTest();
    VariantEntity_Patients.interpreted.validations.shouldShowColumnContent('date', data.variantGermline.interpreted);
  });

  it('Condition (Mondo)', () => {
    setupTest();
    VariantEntity_Patients.interpreted.validations.shouldShowColumnContent('condition_mondo', data.variantGermline.interpreted);
  });

  it('Classification', () => {
    setupTest();
    VariantEntity_Patients.interpreted.validations.shouldShowColumnContent('classification', data.variantGermline.interpreted);
  });

  it('Zygosity', () => {
    setupTest();
    VariantEntity_Patients.interpreted.validations.shouldShowColumnContent('zygosity', data.variantGermline.interpreted);
  });

  it('Inheritance', () => {
    setupTest();
    VariantEntity_Patients.interpreted.validations.shouldShowColumnContent('inheritance', data.variantGermline.interpreted);
  });

  it('Diagnostic Lab', () => {
    setupTest();
    VariantEntity_Patients.interpreted.validations.shouldShowColumnContent('diag_lab', data.variantGermline.interpreted);
  });

  it('Analysis', () => {
    setupTest();
    VariantEntity_Patients.interpreted.validations.shouldShowColumnContent('analysis', data.variantGermline.interpreted);
  });

  it('Status', () => {
    setupTest();
    VariantEntity_Patients.interpreted.validations.shouldShowColumnContent('status', data.variantGermline.interpreted);
  });
});
