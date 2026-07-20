/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { VariantEntity_Patients } from 'pom/pages/VariantEntity_Patients';
import { VariantEntity_UninterpretedCases_Filters } from 'pom/pages/VariantEntity_UninterpretedCases_Filters';

describe('VariantEntity - Patients - Uninterpreted - Filters - Options', () => {
  const setupTest = () => {
    cy.login();
    cy.intercept('GET', '**/cases/filters*').as('getCasesFilters');
    cy.visitVariantPatientsPage(data.variantGermline.locus_id);
    VariantEntity_Patients.uninterpreted.actions.selectTab();
  };

  it('Render options from API', () => {
    setupTest();
    VariantEntity_UninterpretedCases_Filters.validations.shouldRenderApiOptions('@getCasesFilters', 'diagnosis_lab_code');
  });
});
