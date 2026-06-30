/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { VariantEntity_Frequency } from 'pom/pages/VariantEntity_Frequency';

describe('VariantEntity - Frequency - MyNetwork - Sort', () => {
  const setupTest = () => {
    cy.login();
    cy.resetTablePreferences();
    cy.visitVariantFrequencyPage(data.variantGermline.locus_id);
  };

  it('Alphanumeric', () => {
    setupTest();
    VariantEntity_Frequency.myNetwork.validations.shouldSortColumn('primary_condition', false /*hasUniqueValues*/, true /*isReverseSorting*/);
  });

  it('Frequency', () => {
    setupTest();
    VariantEntity_Frequency.myNetwork.validations.shouldSortColumn('freq_all', false /*hasUniqueValues*/, false /*isReverseSorting*/);
  });

  it('Number', () => {
    setupTest();
    VariantEntity_Frequency.myNetwork.validations.shouldSortColumn('homo_all', true /*hasUniqueValues*/, true /*isReverseSorting*/);
  });
});
