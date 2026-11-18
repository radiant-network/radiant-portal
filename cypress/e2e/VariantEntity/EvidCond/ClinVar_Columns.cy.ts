/// <reference types="cypress"/>
import 'support/commands';
import { setupOnce } from 'support/setupOnce';
import { data } from 'pom/shared/Data';
import { VariantEntity_EvidCond } from 'pom/pages/VariantEntity_EvidCond';

// The tests share one page: each one restores what it changes.
describe('VariantEntity - EvidCond - ClinVar - Columns', { testIsolation: false }, () => {
  // Cypress drops the intercepts before each test: keep the default table preferences on every test.
  beforeEach(() => {
    cy.resetTablePreferences();
  });

  setupOnce(() => {
    cy.login();
    cy.visitVariantEvidCondPage(data.variantGermline.locus_id);
  });

  it('Default display', () => {
    VariantEntity_EvidCond.clinvarCard.validations.shouldMatchDefaultColumnVisibility();
  });

  it('Order', () => {
    VariantEntity_EvidCond.clinvarCard.validations.shouldShowAllColumns();
  });

  it('Pin', () => {
    VariantEntity_EvidCond.clinvarCard.validations.shouldShowPinnableColumns();
  });

  it('Default pin state', () => {
    VariantEntity_EvidCond.clinvarCard.validations.shouldMatchDefaultPinnedColumns();
  });

  it('Sort', () => {
    VariantEntity_EvidCond.clinvarCard.validations.shouldShowSortableColumns();
  });

  it('Tooltip', () => {
    VariantEntity_EvidCond.clinvarCard.validations.shouldShowColumnTooltips();
  });

  it('Pin and unpin column', () => {
    VariantEntity_EvidCond.clinvarCard.validations.shouldUnpinnedColumn('condition');
    VariantEntity_EvidCond.clinvarCard.actions.pinColumn('condition');
    VariantEntity_EvidCond.clinvarCard.validations.shouldPinnedColumn('condition');
    VariantEntity_EvidCond.clinvarCard.actions.unpinColumn('condition');
    VariantEntity_EvidCond.clinvarCard.validations.shouldUnpinnedColumn('condition');
  });
});
