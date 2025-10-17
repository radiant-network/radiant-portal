/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { VariantEntity_EvidCond } from 'pom/pages/VariantEntity_EvidCond';

describe('VariantEntity - EvidCond - ClinVar - Columns', () => {
  const setupTest = () => {
    cy.login();
    cy.visitVariantEvidCondPage(data.variantGermline.locus_id);
  };

  it('Default display', () => {
    setupTest();
    VariantEntity_EvidCond.clinvarCard.validations.shouldMatchDefaultColumnVisibility();
  });

  it('Order', () => {
    setupTest();
    VariantEntity_EvidCond.clinvarCard.validations.shouldShowAllColumns();
  });

  it('Pin', () => {
    setupTest();
    VariantEntity_EvidCond.clinvarCard.validations.shouldShowPinnableColumns();
  });

  it('Default pin state', () => {
    setupTest();
    VariantEntity_EvidCond.clinvarCard.validations.shouldMatchDefaultPinnedColumns();
  });

  it('Sort', () => {
    setupTest();
    VariantEntity_EvidCond.clinvarCard.validations.shouldShowSortableColumns();
  });

  it('Tooltip', () => {
    setupTest();
    VariantEntity_EvidCond.clinvarCard.validations.shouldShowColumnTooltips();
  });

  it('Pin and unpin column', () => {
    setupTest();
    VariantEntity_EvidCond.clinvarCard.validations.shouldUnpinnedColumn('condition');
    VariantEntity_EvidCond.clinvarCard.actions.pinColumn('condition');
    VariantEntity_EvidCond.clinvarCard.validations.shouldPinnedColumn('condition');
    VariantEntity_EvidCond.clinvarCard.actions.unpinColumn('condition');
    VariantEntity_EvidCond.clinvarCard.validations.shouldUnpinnedColumn('condition');
  });
});
