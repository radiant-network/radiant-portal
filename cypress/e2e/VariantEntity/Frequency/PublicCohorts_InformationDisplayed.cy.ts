/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { VariantEntity_Frequency } from 'pom/pages/VariantEntity_Frequency';

describe('VariantEntity - Frequency - PublicCohorts - Information displayed', () => {
  const setupTest = () => {
    cy.login();
    cy.visitVariantFrequencyPage(data.variantGermline.locus_id);
  };
  
  it('Cohort', () => {
    setupTest();
    VariantEntity_Frequency.publicCohorts.validations.shouldShowColumnContent('cohort', data.variantGermline.publicCohorts);
  });

  it('ALT Alleles', () => {
    setupTest();
    VariantEntity_Frequency.publicCohorts.validations.shouldShowColumnContent('alt', data.variantGermline.publicCohorts);
  });

  it('Alleles (ALT + REF)', () => {
    setupTest();
    VariantEntity_Frequency.publicCohorts.validations.shouldShowColumnContent('alt_ref', data.variantGermline.publicCohorts);
  });

  it('Homo', () => {
    setupTest();
    VariantEntity_Frequency.publicCohorts.validations.shouldShowColumnContent('homo', data.variantGermline.publicCohorts);
  });

  it('Frequency', () => {
    setupTest();
    VariantEntity_Frequency.publicCohorts.validations.shouldShowColumnContent('freq', data.variantGermline.publicCohorts);
  });
});
