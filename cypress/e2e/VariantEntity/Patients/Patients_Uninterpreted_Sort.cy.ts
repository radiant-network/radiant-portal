/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { VariantEntity_Patients } from 'pom/pages/VariantEntity_Patients';

describe('VariantEntity - Patients - Uninterpreted - Sort [SJRA-1250]', () => {
  const setupTest = () => {
    cy.login();
    cy.visitVariantPatientsPage(data.variantGermline.locus_id);
    VariantEntity_Patients.uninterpreted.actions.selectTab();
  };

  it('Date [SJRA-1168]', () => {
    setupTest();
    VariantEntity_Patients.uninterpreted.validations.shouldSortColumn('date', false /*hasUniqueValues*/);
  });

  it('Tag', () => {
    setupTest();
    VariantEntity_Patients.uninterpreted.validations.shouldSortColumn('status', true /*hasUniqueValues*/);
  });
});
