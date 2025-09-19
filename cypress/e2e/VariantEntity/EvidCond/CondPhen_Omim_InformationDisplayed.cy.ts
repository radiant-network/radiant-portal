/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { VariantEntity_EvidCond } from 'pom/pages/VariantEntity_EvidCond';

describe('VariantEntity - CondPhen - Omim - Information displayed', () => {
  const setupTest = () => {
    cy.login();
    cy.visitVariantEvidCondPage(data.variantGermline.locus_id);
  };

  it('Condition', () => {
    setupTest();
    VariantEntity_EvidCond.condPhenCard.omim.validations.shouldShowColumnContent('condition', data.variantGermline.omim);
  });

  it('Inheritance', () => {
    setupTest();
    VariantEntity_EvidCond.condPhenCard.omim.validations.shouldShowColumnContent('inheritance', data.variantGermline.omim);
  });

  it('Link', () => {
    setupTest();
    VariantEntity_EvidCond.condPhenCard.omim.validations.shouldShowColumnContent('link', data.variantGermline.omim);
  });
});
