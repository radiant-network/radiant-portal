/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { VariantEntity_Patients } from 'pom/pages/VariantEntity_Patients';

describe('VariantEntity - Patients - Interpreted - Hyperlinks', () => {
  const setupTest = () => {
    cy.login();
    cy.visitVariantPatientsPage(data.variantGermline.locus_id);
  };

  it('Case', () => {
    setupTest();
    VariantEntity_Patients.interpreted.actions.clickTableCellLink('case');
    VariantEntity_Patients.interpreted.validations.shouldDrawerOpen(data.variantGermline);
  });

  it('Condition (Mondo)', () => {
    setupTest();
    VariantEntity_Patients.interpreted.validations.shouldHaveTableCellLink(data.variantGermline.interpreted, 'condition_mondo');
  });
});
