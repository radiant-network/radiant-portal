/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { VariantEntity_Patients } from 'pom/pages/VariantEntity_Patients';
import { VariantEntity_UninterpretedCases_Filters } from 'pom/pages/VariantEntity_UninterpretedCases_Filters';

describe('VariantEntity - Patients - Uninterpreted - Filters - Special Types', () => {
  const setupTest = () => {
    cy.login();
    cy.visitVariantPatientsPage(data.variantGermline.locus_id);
    VariantEntity_Patients.uninterpreted.actions.selectTab();
  };

  it('Boolean options', () => {
    setupTest();
    VariantEntity_UninterpretedCases_Filters.validations.shouldRenderFixedOptions('filter_is_pass', ['true', 'false']);
  });

  it('Boolean filter criteria', () => {
    setupTest();
    VariantEntity_UninterpretedCases_Filters.validations.shouldRequestOnFilterSelect('filter_is_pass');
  });

  it('Phenotype filter criteria', () => {
    setupTest();
    VariantEntity_UninterpretedCases_Filters.validations.shouldRequestPhenotypeFilter('seizure');
  });
});
