/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { VariantEntity_Patients } from 'pom/pages/VariantEntity_Patients';
import { VariantEntity_UninterpretedCases_Filters } from 'pom/pages/VariantEntity_UninterpretedCases_Filters';

describe('VariantEntity - Patients - Uninterpreted - Filters - Request Validation', () => {
  const setupTest = () => {
    cy.login();
    cy.visitVariantPatientsPage(data.variantGermline.locus_id);
    VariantEntity_Patients.uninterpreted.actions.selectTab();
  };

  it('Filter criteria', () => {
    setupTest();
    VariantEntity_UninterpretedCases_Filters.validations.shouldRequestOnFilterSelect('diagnosis_lab_code');
  });

  it('Multiple filters', () => {
    setupTest();
    VariantEntity_UninterpretedCases_Filters.validations.shouldRequestMultipleFilters('diagnosis_lab_code', 'zygosity');
  });
});
