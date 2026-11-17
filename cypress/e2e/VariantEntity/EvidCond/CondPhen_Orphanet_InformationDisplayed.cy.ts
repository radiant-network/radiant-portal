/// <reference types="cypress"/>
import 'support/commands';
import { setupOnce } from 'support/setupOnce';
import { data } from 'pom/shared/Data';
import { VariantEntity_EvidCond } from 'pom/pages/VariantEntity_EvidCond';

// Read-only checks: set the page up once and share it between tests.
describe('VariantEntity - EvidCond - CondPhen - Orphanet - Information displayed', { testIsolation: false }, () => {
  setupOnce(() => {
    cy.login();
    cy.visitVariantEvidCondPage(data.variantGermline.locus_id);
    VariantEntity_EvidCond.condPhenCard.orphanet.actions.selectTab();
  });

  it('Condition', () => {
    VariantEntity_EvidCond.condPhenCard.orphanet.validations.shouldShowColumnContent('condition', data.variantGermline.orphanet);
  });

  it('Inheritance', () => {
    VariantEntity_EvidCond.condPhenCard.orphanet.validations.shouldShowColumnContent('inheritance', data.variantGermline.orphanet);
  });

  it('Link', () => {
    VariantEntity_EvidCond.condPhenCard.orphanet.validations.shouldShowColumnContent('link', data.variantGermline.orphanet);
  });
});
