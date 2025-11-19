/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { VariantEntity_Patients } from 'pom/pages/VariantEntity_Patients';

describe('VariantEntity - Patients - Interpreted - Sort [SJRA-854]', () => {
  const setupTest = () => {
    cy.login();
    cy.visitVariantPatientsPage(data.variantGermline.locus_id);
  };

  it('Date', () => {
    setupTest();
    VariantEntity_Patients.interpreted.validations.shouldSortColumn('date');
  });

  it('Tag', () => {
    setupTest();
    VariantEntity_Patients.interpreted.validations.shouldSortColumn('classification');
  });
});
