/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { VariantEntity_Patients } from 'pom/pages/VariantEntity_Patients';

describe('VariantEntity - Patients - Uninterpreted - Sort', () => {
  const setupTest = () => {
    cy.login();
    cy.visitVariantPatientsPage(data.variantGermline.locus_id);
    VariantEntity_Patients.uninterpreted.actions.selectTab();
  };

  it('Date', () => {
    setupTest();
    VariantEntity_Patients.uninterpreted.validations.shouldSortColumn('date');
  });

  it('Tag', () => {
    setupTest();
    VariantEntity_Patients.uninterpreted.validations.shouldSortColumn('status');
  });
});
