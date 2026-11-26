/// <reference types="cypress"/>
import 'support/commands';
import { setupOnce } from 'support/setupOnce';
import { data } from 'pom/shared/Data';
import { VariantEntity_EvidCond } from 'pom/pages/VariantEntity_EvidCond';

// The tests share one page: each one restores what it changes.
describe('VariantEntity - EvidCond - CondPhen - Orphanet - Columns', { testIsolation: false }, () => {
  setupOnce(() => {
    cy.login();
    cy.visitVariantEvidCondPage(data.variantGermline.locus_id);
    VariantEntity_EvidCond.condPhenCard.orphanet.actions.selectTab();
  });

  it('Default display', () => {
    VariantEntity_EvidCond.condPhenCard.orphanet.validations.shouldMatchDefaultColumnVisibility();
  });

  it('Order', () => {
    VariantEntity_EvidCond.condPhenCard.orphanet.validations.shouldShowAllColumns();
  });

  it('Pin', () => {
    VariantEntity_EvidCond.condPhenCard.orphanet.validations.shouldShowPinnableColumns();
  });

  it('Default pin state', () => {
    VariantEntity_EvidCond.condPhenCard.orphanet.validations.shouldMatchDefaultPinnedColumns();
  });

  it('Sort', () => {
    VariantEntity_EvidCond.condPhenCard.orphanet.validations.shouldShowSortableColumns();
  });

  it('Tooltip', () => {
    VariantEntity_EvidCond.condPhenCard.orphanet.validations.shouldShowColumnTooltips();
  });

  it('Pin and unpin column', () => {
    VariantEntity_EvidCond.condPhenCard.orphanet.validations.shouldUnpinnedColumn('condition');
    VariantEntity_EvidCond.condPhenCard.orphanet.actions.pinColumn('condition');
    VariantEntity_EvidCond.condPhenCard.orphanet.validations.shouldPinnedColumn('condition');
    VariantEntity_EvidCond.condPhenCard.orphanet.actions.unpinColumn('condition');
    VariantEntity_EvidCond.condPhenCard.orphanet.validations.shouldUnpinnedColumn('condition');
  });
});
