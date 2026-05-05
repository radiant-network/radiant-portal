/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { VariantEntity_Frequency } from 'pom/pages/VariantEntity_Frequency';

describe('VariantEntity - Frequency - MyNetwork - Columns', () => {
  const setupTest = () => {
    cy.login();
    cy.visitVariantFrequencyPage(data.variantGermline.locus_id);
  };

  it('Default display', () => {
    setupTest();
    VariantEntity_Frequency.myNetwork.validations.shouldMatchDefaultColumnVisibility();
  });

  it('Order', () => {
    setupTest();
    VariantEntity_Frequency.myNetwork.validations.shouldShowAllColumns();
  });

  it('Pin', () => {
    setupTest();
    VariantEntity_Frequency.myNetwork.validations.shouldShowPinnableColumns();
  });

  it('Default pin state', () => {
    setupTest();
    VariantEntity_Frequency.myNetwork.validations.shouldMatchDefaultPinnedColumns();
  });

  it('Sort', () => {
    setupTest();
    VariantEntity_Frequency.myNetwork.validations.shouldShowSortableColumns();
  });

  it('Tooltip', () => {
    setupTest();
    VariantEntity_Frequency.myNetwork.validations.shouldShowColumnTooltips();
  });
});
