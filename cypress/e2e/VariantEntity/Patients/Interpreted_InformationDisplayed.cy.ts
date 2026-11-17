/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { VariantEntity_Patients } from 'pom/pages/VariantEntity_Patients';

// Read-only checks: set the page up once and share it between tests.
describe('VariantEntity - Patients - Interpreted - Information displayed', { testIsolation: false }, () => {
  before(() => {
    cy.login();
    cy.resetTablePreferences();
    cy.visitVariantPatientsPage(data.variantGermline.locus_id);
    VariantEntity_Patients.interpreted.actions.showAllColumns();
  });

  it('Case', () => {
    VariantEntity_Patients.interpreted.validations.shouldShowColumnContent('case', data.variantGermline.interpreted);
  });

  it('Date', () => {
    VariantEntity_Patients.interpreted.validations.shouldShowColumnContent('date', data.variantGermline.interpreted);
  });

  it('Condition (Mondo)', () => {
    VariantEntity_Patients.interpreted.validations.shouldShowColumnContent('condition_mondo', data.variantGermline.interpreted);
  });

  it('Classification', () => {
    VariantEntity_Patients.interpreted.validations.shouldShowColumnContent('classification', data.variantGermline.interpreted);
  });

  it('Zygosity', () => {
    VariantEntity_Patients.interpreted.validations.shouldShowColumnContent('zygosity', data.variantGermline.interpreted);
  });

  it('Inheritance', () => {
    VariantEntity_Patients.interpreted.validations.shouldShowColumnContent('inheritance', data.variantGermline.interpreted);
  });

  it('Diagnostic Lab', () => {
    VariantEntity_Patients.interpreted.validations.shouldShowColumnContent('diag_lab', data.variantGermline.interpreted);
  });

  it('Analysis', () => {
    VariantEntity_Patients.interpreted.validations.shouldShowColumnContent('analysis', data.variantGermline.interpreted);
  });

  it('Status', () => {
    VariantEntity_Patients.interpreted.validations.shouldShowColumnContent('status', data.variantGermline.interpreted);
  });
});
