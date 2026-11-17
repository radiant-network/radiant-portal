/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { VariantEntity_EvidCond } from 'pom/pages/VariantEntity_EvidCond';

// Read-only checks: set the page up once and share it between tests.
describe('VariantEntity - EvidCond - CondPhen - Hpo - Information displayed', { testIsolation: false }, () => {
  before(() => {
    cy.login();
    cy.visitVariantEvidCondPage(data.variantGermline.locus_id);
    VariantEntity_EvidCond.condPhenCard.hpo.actions.selectTab();
  });

  it('Condition', () => {
    VariantEntity_EvidCond.condPhenCard.hpo.validations.shouldShowColumnContent('condition', data.variantGermline.hpo);
  });

  it('Inheritance', () => {
    VariantEntity_EvidCond.condPhenCard.hpo.validations.shouldShowColumnContent('inheritance', data.variantGermline.hpo);
  });

  it('Link', () => {
    VariantEntity_EvidCond.condPhenCard.hpo.validations.shouldShowColumnContent('link', data.variantGermline.hpo);
  });
});
