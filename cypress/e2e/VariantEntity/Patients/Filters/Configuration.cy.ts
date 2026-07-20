/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { VariantEntity_Patients } from 'pom/pages/VariantEntity_Patients';
import { VariantEntity_UninterpretedCases_Filters } from 'pom/pages/VariantEntity_UninterpretedCases_Filters';

describe('VariantEntity - Patients - Uninterpreted - Filters - Configuration', () => {
  const setupTest = () => {
    cy.login();
    cy.visitVariantPatientsPage(data.variantGermline.locus_id);
    VariantEntity_Patients.uninterpreted.actions.selectTab();
  };

  it('Default filters', () => {
    setupTest();
    VariantEntity_UninterpretedCases_Filters.validations.shouldShowDefaultFilters();
  });

  it('More button', () => {
    setupTest();
    VariantEntity_UninterpretedCases_Filters.validations.shouldHaveMoreButton();
  });

  it('Reveal hidden filter', () => {
    setupTest();
    VariantEntity_UninterpretedCases_Filters.validations.shouldRevealHiddenFilter('analysis_catalog_code');
  });
});
