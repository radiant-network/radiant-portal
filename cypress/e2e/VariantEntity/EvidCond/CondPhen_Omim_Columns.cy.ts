/// <reference types="cypress"/>
import 'support/commands';
import { setupOnce } from 'support/setupOnce';
import { data } from 'pom/shared/Data';
import { VariantEntity_EvidCond } from 'pom/pages/VariantEntity_EvidCond';

// The tests share one page: each one restores what it changes.
describe('VariantEntity - EvidCond - CondPhen - Omim - Columns', { testIsolation: false }, () => {
  // Cypress drops the intercepts before each test: keep the default table preferences on every test.
  beforeEach(() => {
    cy.resetTablePreferences();
  });

  setupOnce(() => {
    cy.login();
    cy.visitVariantEvidCondPage(data.variantGermline.locus_id);
  });

  it('Default display', () => {
    VariantEntity_EvidCond.condPhenCard.omim.validations.shouldMatchDefaultColumnVisibility();
  });

  it('Order', () => {
    VariantEntity_EvidCond.condPhenCard.omim.validations.shouldShowAllColumns();
  });

  it('Pin', () => {
    VariantEntity_EvidCond.condPhenCard.omim.validations.shouldShowPinnableColumns();
  });

  it('Default pin state', () => {
    VariantEntity_EvidCond.condPhenCard.omim.validations.shouldMatchDefaultPinnedColumns();
  });

  it('Sort', () => {
    VariantEntity_EvidCond.condPhenCard.omim.validations.shouldShowSortableColumns();
  });

  it('Tooltip', () => {
    VariantEntity_EvidCond.condPhenCard.omim.validations.shouldShowColumnTooltips();
  });

  it('Pin and unpin column', () => {
    VariantEntity_EvidCond.condPhenCard.omim.validations.shouldUnpinnedColumn('condition');
    VariantEntity_EvidCond.condPhenCard.omim.actions.pinColumn('condition');
    VariantEntity_EvidCond.condPhenCard.omim.validations.shouldPinnedColumn('condition');
    VariantEntity_EvidCond.condPhenCard.omim.actions.unpinColumn('condition');
    VariantEntity_EvidCond.condPhenCard.omim.validations.shouldUnpinnedColumn('condition');
  });
});
