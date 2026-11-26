/// <reference types="cypress"/>
import 'support/commands';
import { setupOnce } from 'support/setupOnce';
import { data } from 'pom/shared/Data';
import { VariantEntity_Frequency } from 'pom/pages/VariantEntity_Frequency';

// The tests share one page: each one restores what it changes.
describe('VariantEntity - Frequency - PublicCohorts - Columns', { testIsolation: false }, () => {
  setupOnce(() => {
    cy.login();
    cy.visitVariantFrequencyPage(data.variantGermline.locus_id);
  });

  it('Default display', () => {
    VariantEntity_Frequency.publicCohorts.validations.shouldMatchDefaultColumnVisibility();
  });

  it('Order', () => {
    VariantEntity_Frequency.publicCohorts.validations.shouldShowAllColumns();
  });

  it('Pin', () => {
    VariantEntity_Frequency.publicCohorts.validations.shouldShowPinnableColumns();
  });

  it('Default pin state', () => {
    VariantEntity_Frequency.publicCohorts.validations.shouldMatchDefaultPinnedColumns();
  });

  it('Sort', () => {
    VariantEntity_Frequency.publicCohorts.validations.shouldShowSortableColumns();
  });

  it('Tooltip', () => {
    VariantEntity_Frequency.publicCohorts.validations.shouldShowColumnTooltips();
  });
});
