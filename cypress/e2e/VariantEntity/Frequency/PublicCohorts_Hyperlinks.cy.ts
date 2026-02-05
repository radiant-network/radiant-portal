/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { VariantEntity_Frequency } from 'pom/pages/VariantEntity_Frequency';

describe('VariantEntity - Frequency - PublicCohorts - Hyperlinks', () => {
  const setupTest = () => {
    cy.login();
    cy.visitVariantFrequencyPage(data.variantGermline.locus_id);
  };

  it('Cohort', () => {
    setupTest();
    VariantEntity_Frequency.publicCohorts.validations.shouldHaveTableCellLink(data.variantGermline, 'cohort');
  });
});
