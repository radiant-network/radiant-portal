/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { VariantEntity_Frequency } from 'pom/pages/VariantEntity_Frequency';

describe('VariantEntity - Frequency - MyNetwork - Information displayed', () => {
  const setupTest = () => {
    cy.login();
    cy.visitVariantFrequencyPage(data.variantGermline.locus_id);
  };

  it('Primary Condition', () => {
    setupTest();
    VariantEntity_Frequency.myNetwork.validations.shouldShowColumnContent('primary_condition', data.variantGermline.myNetwork);
  });

  it('Frequency (All Patients)', () => {
    setupTest();
    VariantEntity_Frequency.myNetwork.validations.shouldShowColumnContent('freq_all', data.variantGermline.myNetwork);
  });

  it('Homozygotes (All Patients)', () => {
    setupTest();
    VariantEntity_Frequency.myNetwork.validations.shouldShowColumnContent('homo_all', data.variantGermline.myNetwork);
  });

  it('Frequency (Affected Patients)', () => {
    setupTest();
    VariantEntity_Frequency.myNetwork.validations.shouldShowColumnContent('freq_affected', data.variantGermline.myNetwork);
  });

  it('Homozygotes (Affected Patients)', () => {
    setupTest();
    VariantEntity_Frequency.myNetwork.validations.shouldShowColumnContent('homo_affected', data.variantGermline.myNetwork);
  });

  it('Frequency (Non-Affected Patients)', () => {
    setupTest();
    VariantEntity_Frequency.myNetwork.validations.shouldShowColumnContent('freq_non_affected', data.variantGermline.myNetwork);
  });

  it('Homozygotes (Non-Affected Patients)', () => {
    setupTest();
    VariantEntity_Frequency.myNetwork.validations.shouldShowColumnContent('homo_non_affected', data.variantGermline.myNetwork);
  });
});
