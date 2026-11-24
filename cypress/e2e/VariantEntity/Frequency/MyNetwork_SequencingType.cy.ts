/// <reference types="cypress"/>
import 'support/commands';
import { setupOnce } from 'support/setupOnce';
import { data } from 'pom/shared/Data';
import { VariantEntity_Frequency } from 'pom/pages/VariantEntity_Frequency';

// Read-only checks: set the page up once and share it between tests.
describe('VariantEntity - Frequency - MyNetwork - Sequencing type', { testIsolation: false }, () => {
  setupOnce(() => {
    cy.login();
    cy.visitVariantFrequencyPage(data.variantGermline.locus_id);
  });

  it('Selected type when the default one has no carrier', () => {
    VariantEntity_Frequency.myNetwork.validations.shouldHaveSelectedSequencingType(data.variantGermline.myNetwork.sequencing_type);
  });

  it('Disabled type', () => {
    VariantEntity_Frequency.myNetwork.validations.shouldHaveDisabledSequencingType(data.variantGermline.myNetwork.disabled_sequencing_type);
  });

  it('Group headers', () => {
    VariantEntity_Frequency.myNetwork.validations.shouldShowGroupHeaders(data.variantGermline.myNetwork.sequencing_type);
  });
});
