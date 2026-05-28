/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { VariantEntity_Patients } from 'pom/pages/VariantEntity_Patients';

describe('VariantEntity - Patients - Uninterpreted - Hyperlinks', () => {
  const setupTest = () => {
    cy.login();
    cy.visitVariantPatientsPage(data.variantGermline.locus_id);
    VariantEntity_Patients.uninterpreted.actions.selectTab();
  };

  it('Case', () => {
    setupTest();
    VariantEntity_Patients.uninterpreted.actions.clickTableCellLink('case');
    VariantEntity_Patients.uninterpreted.validations.shouldDrawerOpen(data.variantGermline);
  });
});
