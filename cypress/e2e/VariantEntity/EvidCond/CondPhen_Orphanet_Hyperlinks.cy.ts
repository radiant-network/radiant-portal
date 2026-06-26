/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { VariantEntity_EvidCond } from 'pom/pages/VariantEntity_EvidCond';

describe('VariantEntity - EvidCond - CondPhen - Orphanet - Hyperlinks', () => {
  const setupTest = () => {
    cy.login();
    cy.visitVariantEvidCondPage(data.variantGermline.locus_id);
    VariantEntity_EvidCond.condPhenCard.orphanet.actions.selectTab();
  };

  it('Link', () => {
    setupTest();
    VariantEntity_EvidCond.condPhenCard.orphanet.validations.shouldHaveTableCellLink(data.variantGermline.orphanet, 'link');
  });
});
