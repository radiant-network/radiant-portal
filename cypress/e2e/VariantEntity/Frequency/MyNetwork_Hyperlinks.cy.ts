/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { VariantEntity_Frequency } from 'pom/pages/VariantEntity_Frequency';

describe('VariantEntity - Frequency - MyNetwork - Hyperlinks', () => {
  const setupTest = () => {
    cy.login();
    cy.visitVariantFrequencyPage(data.variantGermline.locus_id);
  };

  it('Primary Condition', () => {
    setupTest();
    VariantEntity_Frequency.myNetwork.validations.shouldHaveTableCellLink(data.variantGermline.myNetwork, 'primary_condition');
  });
});
