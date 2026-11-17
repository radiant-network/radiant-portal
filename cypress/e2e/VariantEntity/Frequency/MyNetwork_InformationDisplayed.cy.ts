/// <reference types="cypress"/>
import 'support/commands';
import { setupOnce } from 'support/setupOnce';
import { data } from 'pom/shared/Data';
import { VariantEntity_Frequency } from 'pom/pages/VariantEntity_Frequency';

// Read-only checks: set the page up once and share it between tests.
describe('VariantEntity - Frequency - MyNetwork - Information displayed', { testIsolation: false }, () => {
  setupOnce(() => {
    cy.login();
    cy.visitVariantFrequencyPage(data.variantGermline.locus_id);
  });

  it('Primary Condition', () => {
    VariantEntity_Frequency.myNetwork.validations.shouldShowColumnContent('primary_condition', data.variantGermline.myNetwork);
  });

  it('Frequency (All Patients)', () => {
    VariantEntity_Frequency.myNetwork.validations.shouldShowColumnContent('freq_all', data.variantGermline.myNetwork);
  });

  it('Homozygotes (All Patients)', () => {
    VariantEntity_Frequency.myNetwork.validations.shouldShowColumnContent('homo_all', data.variantGermline.myNetwork);
  });

  it('Frequency (Affected Patients)', () => {
    VariantEntity_Frequency.myNetwork.validations.shouldShowColumnContent('freq_affected', data.variantGermline.myNetwork);
  });

  it('Homozygotes (Affected Patients)', () => {
    VariantEntity_Frequency.myNetwork.validations.shouldShowColumnContent('homo_affected', data.variantGermline.myNetwork);
  });

  it('Frequency (Non-Affected Patients)', () => {
    VariantEntity_Frequency.myNetwork.validations.shouldShowColumnContent('freq_non_affected', data.variantGermline.myNetwork);
  });

  it('Homozygotes (Non-Affected Patients)', () => {
    VariantEntity_Frequency.myNetwork.validations.shouldShowColumnContent('homo_non_affected', data.variantGermline.myNetwork);
  });
});
