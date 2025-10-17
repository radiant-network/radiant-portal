/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { VariantEntity_EvidCond } from 'pom/pages/VariantEntity_EvidCond';

describe('VariantEntity - CondPhen - Orphanet - Columns', () => {
  const setupTest = () => {
    cy.login();
    cy.visitVariantEvidCondPage(data.variantGermline.locus_id);
    VariantEntity_EvidCond.condPhenCard.orphanet.actions.selectTab();
  };

  it('Default display', () => {
    setupTest();
    VariantEntity_EvidCond.condPhenCard.orphanet.validations.shouldMatchDefaultColumnVisibility();
  });

  it('Order', () => {
    setupTest();
    VariantEntity_EvidCond.condPhenCard.orphanet.validations.shouldShowAllColumns();
  });

  it('Pin', () => {
    setupTest();
    VariantEntity_EvidCond.condPhenCard.orphanet.validations.shouldShowPinnableColumns();
  });

  it('Default pin state', () => {
    setupTest();
    VariantEntity_EvidCond.condPhenCard.orphanet.validations.shouldMatchDefaultPinnedColumns();
  });

  it('Sort', () => {
    setupTest();
    VariantEntity_EvidCond.condPhenCard.orphanet.validations.shouldShowSortableColumns();
  });

  it('Tooltip', () => {
    setupTest();
    VariantEntity_EvidCond.condPhenCard.orphanet.validations.shouldShowColumnTooltips();
  });

  it('Pin and unpin column', () => {
    setupTest();
    VariantEntity_EvidCond.condPhenCard.orphanet.validations.shouldUnpinnedColumn('condition');
    VariantEntity_EvidCond.condPhenCard.orphanet.actions.pinColumn('condition');
    VariantEntity_EvidCond.condPhenCard.orphanet.validations.shouldPinnedColumn('condition');
    VariantEntity_EvidCond.condPhenCard.orphanet.actions.unpinColumn('condition');
    VariantEntity_EvidCond.condPhenCard.orphanet.validations.shouldUnpinnedColumn('condition');
  });
});
