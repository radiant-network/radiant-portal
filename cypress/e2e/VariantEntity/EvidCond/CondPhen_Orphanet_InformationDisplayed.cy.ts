/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { VariantEntity_EvidCond } from 'pom/pages/VariantEntity_EvidCond';

describe('VariantEntity - CondPhen - Orphanet - Information displayed', () => {
  const setupTest = () => {
    cy.login();
    cy.visitVariantEvidCondPage(data.variantGermline.locus_id);
    VariantEntity_EvidCond.condPhenCard.orphanet.actions.selectTab();
  };

  it('Condition', () => {
    setupTest();
    VariantEntity_EvidCond.condPhenCard.orphanet.validations.shouldShowColumnContent('condition', data.variantGermline.orphanet);
  });

  it('Inheritance', () => {
    setupTest();
    VariantEntity_EvidCond.condPhenCard.orphanet.validations.shouldShowColumnContent('inheritance', data.variantGermline.orphanet);
  });

  it('Link', () => {
    setupTest();
    VariantEntity_EvidCond.condPhenCard.orphanet.validations.shouldShowColumnContent('link', data.variantGermline.orphanet);
  });
});
