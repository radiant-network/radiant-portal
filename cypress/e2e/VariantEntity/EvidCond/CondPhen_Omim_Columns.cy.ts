/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { VariantEntity_EvidCond } from 'pom/pages/VariantEntity_EvidCond';

describe('VariantEntity - CondPhen - Omim - Columns', () => {
  const setupTest = () => {
    cy.login();
    cy.visitVariantEvidCondPage(data.variantGermline.locus_id);
  };

  it('Default display', () => {
    setupTest();
    VariantEntity_EvidCond.condPhenCard.omim.validations.shouldMatchDefaultColumnVisibility();
  });

  it('Order', () => {
    setupTest();
    VariantEntity_EvidCond.condPhenCard.omim.validations.shouldShowAllColumns();
  });

  it('Pin', () => {
    setupTest();
    VariantEntity_EvidCond.condPhenCard.omim.validations.shouldShowPinnableColumns();
  });

  it('Default pin state', () => {
    setupTest();
    VariantEntity_EvidCond.condPhenCard.omim.validations.shouldMatchDefaultPinnedColumns();
  });

  it('Sort', () => {
    setupTest();
    VariantEntity_EvidCond.condPhenCard.omim.validations.shouldShowSortableColumns();
  });

  it('Tooltip', () => {
    setupTest();
    VariantEntity_EvidCond.condPhenCard.omim.validations.shouldShowColumnTooltips();
  });

  it('Pin and unpin column', () => {
    setupTest();
    VariantEntity_EvidCond.condPhenCard.omim.validations.shouldUnpinnedColumn('condition');
    VariantEntity_EvidCond.condPhenCard.omim.actions.pinColumn('condition');
    VariantEntity_EvidCond.condPhenCard.omim.validations.shouldPinnedColumn('condition');
    VariantEntity_EvidCond.condPhenCard.omim.actions.unpinColumn('condition');
    VariantEntity_EvidCond.condPhenCard.omim.validations.shouldUnpinnedColumn('condition');
  });
});
