/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { VariantEntity_Patients } from 'pom/pages/VariantEntity_Patients';
import { CaseEntity_Details } from 'pom/pages/CaseEntity_Details';
import { CaseEntity_Variants_SNV_Table } from 'pom/pages/CaseEntity_Variants_SNV_Table';

describe('VariantEntity - Patients - Uninterpreted - Action Buttons', () => {
  const setupTest = () => {
    cy.login();
    cy.visitVariantPatientsPage(data.variantGermline.locus_id);
    VariantEntity_Patients.uninterpreted.actions.selectTab();
  };

  it('View Case', () => {
    setupTest();
    VariantEntity_Patients.uninterpreted.actions.selectAction('case');
    CaseEntity_Details.validations.shouldHaveTitle(data.variantGermline.uninterpreted);
  });

  it('View Variants', () => {
    setupTest();
    VariantEntity_Patients.uninterpreted.actions.selectAction('variants');
    CaseEntity_Variants_SNV_Table.germline.validations.shouldHaveTitle(data.variantGermline.uninterpreted);
    CaseEntity_Variants_SNV_Table.germline.validations.shouldHaveActiveTabAndToggle();
  });
});
