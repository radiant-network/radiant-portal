/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { VariantEntity_EvidCond } from 'pom/pages/VariantEntity_EvidCond';

describe('VariantEntity - CondPhen - Hpo - Columns', () => {
  const setupTest = () => {
    cy.login();
    cy.visitVariantEvidCondPage(data.variantGermline.locus_id);
    VariantEntity_EvidCond.condPhenCard.hpo.actions.selectTab();
  };

  it('Default display', () => {
    setupTest();
    VariantEntity_EvidCond.condPhenCard.hpo.validations.shouldMatchDefaultColumnVisibility();
  });

  it('Order', () => {
    setupTest();
    VariantEntity_EvidCond.condPhenCard.hpo.validations.shouldShowAllColumns();
  });

  it('Pin', () => {
    setupTest();
    VariantEntity_EvidCond.condPhenCard.hpo.validations.shouldShowPinnableColumns();
  });

  it('Default pin state', () => {
    setupTest();
    VariantEntity_EvidCond.condPhenCard.hpo.validations.shouldMatchDefaultPinnedColumns();
  });

  it('Sort', () => {
    setupTest();
    VariantEntity_EvidCond.condPhenCard.hpo.validations.shouldShowSortableColumns();
  });

  it('Tooltip', () => {
    setupTest();
    VariantEntity_EvidCond.condPhenCard.hpo.validations.shouldShowColumnTooltips();
  });

  it('Pin and unpin column', () => {
    setupTest();
    VariantEntity_EvidCond.condPhenCard.hpo.validations.shouldUnpinnedColumn('condition');
    VariantEntity_EvidCond.condPhenCard.hpo.actions.pinColumn('condition');
    VariantEntity_EvidCond.condPhenCard.hpo.validations.shouldPinnedColumn('condition');
    VariantEntity_EvidCond.condPhenCard.hpo.actions.unpinColumn('condition');
    VariantEntity_EvidCond.condPhenCard.hpo.validations.shouldUnpinnedColumn('condition');
  });
});
