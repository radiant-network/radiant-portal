/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { VariantEntity_Overview } from 'pom/pages/VariantEntity_Overview';
import { VariantEntity_Patients } from 'pom/pages/VariantEntity_Patients';

describe('VariantEntity - Overview - Interpretation - Hyperlinks', () => {
  const setupTest = () => {
    cy.login();
    cy.visitVariantOverviewPage(data.variantGermline.locus_id);
  };

  it('MyNetwork', () => {
    setupTest();
    VariantEntity_Overview.interpretation.actions.clickLink('my_network');
    VariantEntity_Patients.validations.shouldHaveActiveTab();
    VariantEntity_Patients.validations.shouldHaveTitle(data.variantGermline);
  });
});
