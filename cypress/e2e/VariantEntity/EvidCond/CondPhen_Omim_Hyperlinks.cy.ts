/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { VariantEntity_EvidCond } from 'pom/pages/VariantEntity_EvidCond';

describe('VariantEntity - EvidCond - CondPhen - Omim - Hyperlinks', () => {
  const setupTest = () => {
    cy.login();
    cy.visitVariantEvidCondPage(data.variantGermline.locus_id);
  };

  it('Link', () => {
    setupTest();
    VariantEntity_EvidCond.condPhenCard.omim.validations.shouldHaveTableCellLink(data.variantGermline.omim, 'link');
  });
});
