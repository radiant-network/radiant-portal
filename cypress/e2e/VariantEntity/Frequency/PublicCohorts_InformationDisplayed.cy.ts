/// <reference types="cypress"/>
import 'support/commands';
import { setupOnce } from 'support/setupOnce';
import { data } from 'pom/shared/Data';
import { VariantEntity_Frequency } from 'pom/pages/VariantEntity_Frequency';

// Read-only checks: set the page up once and share it between tests.
describe('VariantEntity - Frequency - PublicCohorts - Information displayed', { testIsolation: false }, () => {
  setupOnce(() => {
    cy.login();
    cy.visitVariantFrequencyPage(data.variantGermline.locus_id);
  });

  it('Cohort', () => {
    VariantEntity_Frequency.publicCohorts.validations.shouldShowColumnContent('cohort', data.variantGermline.publicCohorts);
  });

  it('ALT Alleles', () => {
    VariantEntity_Frequency.publicCohorts.validations.shouldShowColumnContent('alt', data.variantGermline.publicCohorts);
  });

  it('Alleles (ALT + REF)', () => {
    VariantEntity_Frequency.publicCohorts.validations.shouldShowColumnContent('alt_ref', data.variantGermline.publicCohorts);
  });

  it('Homo', () => {
    VariantEntity_Frequency.publicCohorts.validations.shouldShowColumnContent('homo', data.variantGermline.publicCohorts);
  });

  it('Frequency', () => {
    VariantEntity_Frequency.publicCohorts.validations.shouldShowColumnContent('freq', data.variantGermline.publicCohorts);
  });
});
