/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { VariantEntity_Overview } from 'pom/pages/VariantEntity_Overview';
import { VariantEntity_EvidCond } from 'pom/pages/VariantEntity_EvidCond';
import { VariantEntity_Patients } from 'pom/pages/VariantEntity_Patients';

describe('VariantEntity - Overview - MostDeleteriousConsequence - Hyperlinks', () => {
  const setupTest = () => {
    cy.login();
    cy.visitVariantOverviewPage(data.variantGermline.locus_id);
  };

  it('Patients', () => {
    setupTest();
    VariantEntity_Overview.mostDeleterious.actions.clickLink('patients', data.variantGermline);
    VariantEntity_Patients.validations.shouldHaveActiveTab();
    VariantEntity_Patients.validations.shouldHaveTitle(data.variantGermline);
  });

  it('ClinVar', () => {
    setupTest();
    VariantEntity_Overview.mostDeleterious.actions.clickLink('clinvar_classifications', data.variantGermline);
    VariantEntity_EvidCond.validations.shouldHaveActiveTab();
    VariantEntity_EvidCond.validations.shouldHaveTitle(data.variantGermline);
  });
});
