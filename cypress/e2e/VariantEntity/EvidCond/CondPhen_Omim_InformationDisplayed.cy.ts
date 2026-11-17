/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { VariantEntity_EvidCond } from 'pom/pages/VariantEntity_EvidCond';

// Read-only checks: set the page up once and share it between tests.
describe('VariantEntity - EvidCond - CondPhen - Omim - Information displayed', { testIsolation: false }, () => {
  before(() => {
    cy.login();
    cy.visitVariantEvidCondPage(data.variantGermline.locus_id);
  });

  it('Condition', () => {
    VariantEntity_EvidCond.condPhenCard.omim.validations.shouldShowColumnContent('condition', data.variantGermline.omim);
  });

  it('Inheritance', () => {
    VariantEntity_EvidCond.condPhenCard.omim.validations.shouldShowColumnContent('inheritance', data.variantGermline.omim);
  });

  it('Link', () => {
    VariantEntity_EvidCond.condPhenCard.omim.validations.shouldShowColumnContent('link', data.variantGermline.omim);
  });
});
