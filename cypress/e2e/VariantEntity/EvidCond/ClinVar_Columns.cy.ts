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

  it('Sort', () => {
    setupTest();
    VariantEntity_EvidCond.clinvarCard.validations.shouldShowSortableColumns();
  });

  it('Tooltip', () => {
    setupTest();
    VariantEntity_EvidCond.clinvarCard.validations.shouldShowColumnTooltips();
  });
});
