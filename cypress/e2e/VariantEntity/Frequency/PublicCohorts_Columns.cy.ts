/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { VariantEntity_Frequency } from 'pom/pages/VariantEntity_Frequency';

describe('VariantEntity - Frequency - PublicCohorts - Columns', () => {
  const setupTest = () => {
    cy.login();
    cy.visitVariantFrequencyPage(data.variantGermline.locus_id);
  };

  it('Default display', () => {
    setupTest();
    VariantEntity_Frequency.publicCohorts.validations.shouldMatchDefaultColumnVisibility();
  });

  it('Order', () => {
    setupTest();
    VariantEntity_Frequency.publicCohorts.validations.shouldShowAllColumns();
  });

  it('Pin', () => {
    setupTest();
    VariantEntity_Frequency.publicCohorts.validations.shouldShowPinnableColumns();
  });

  it('Default pin state', () => {
    setupTest();
    VariantEntity_Frequency.publicCohorts.validations.shouldMatchDefaultPinnedColumns();
  });

  it('Sort', () => {
    setupTest();
    VariantEntity_Frequency.publicCohorts.validations.shouldShowSortableColumns();
  });

  it('Tooltip', () => {
    setupTest();
    VariantEntity_Frequency.publicCohorts.validations.shouldShowColumnTooltips();
  });

  it('Pin and unpin column', () => {
    setupTest();
    VariantEntity_Frequency.publicCohorts.validations.shouldUnpinnedColumn('homo');
    VariantEntity_Frequency.publicCohorts.actions.pinColumn('homo');
    VariantEntity_Frequency.publicCohorts.validations.shouldPinnedColumn('homo');
    VariantEntity_Frequency.publicCohorts.actions.unpinColumn('homo');
    VariantEntity_Frequency.publicCohorts.validations.shouldUnpinnedColumn('homo');
  });
});
