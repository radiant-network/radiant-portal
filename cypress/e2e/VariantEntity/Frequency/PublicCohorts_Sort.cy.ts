/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { VariantEntity_Frequency } from 'pom/pages/VariantEntity_Frequency';

describe('VariantEntity - Frequency - PublicCohorts - Sort', () => {
  const setupTest = () => {
    cy.login();
    cy.visitVariantFrequencyPage(data.variantGermline.locus_id);
  };

  it('Alphanumeric', () => {
    setupTest();
    VariantEntity_Frequency.publicCohorts.validations.shouldSortColumn('cohort', false /*hasUniqueValues*/, true /*isReverseSorting*/);
  });

  it('Number', () => {
    setupTest();
    VariantEntity_Frequency.publicCohorts.validations.shouldSortColumn('alt', false /*hasUniqueValues*/, false /*isReverseSorting*/);
  });

  it('Scientific number', () => {
    setupTest();
    VariantEntity_Frequency.publicCohorts.validations.shouldSortColumn('freq', false /*hasUniqueValues*/, false /*isReverseSorting*/);
  });
  
  it('Multiple', () => {
    setupTest();
    VariantEntity_Frequency.publicCohorts.actions.sortColumn('cohort');
    VariantEntity_Frequency.publicCohorts.actions.sortColumn('alt');
    VariantEntity_Frequency.publicCohorts.actions.sortColumn('alt');
    VariantEntity_Frequency.publicCohorts.validations.shouldHaveFirstRowValue('1000 Genomes', 'cohort');
  });
});
