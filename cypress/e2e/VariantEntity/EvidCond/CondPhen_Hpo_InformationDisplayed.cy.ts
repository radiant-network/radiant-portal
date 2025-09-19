/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { VariantEntity_EvidCond } from 'pom/pages/VariantEntity_EvidCond';

describe('VariantEntity - CondPhen - Hpo - Information displayed', () => {
  const setupTest = () => {
    cy.login();
    cy.visitVariantEvidCondPage(data.variantGermline.locus_id);
    VariantEntity_EvidCond.condPhenCard.hpo.actions.selectTab();
  };

  it('Condition', () => {
    setupTest();
    VariantEntity_EvidCond.condPhenCard.hpo.validations.shouldShowColumnContent('condition', data.variantGermline.hpo);
  });

  it('Inheritance', () => {
    setupTest();
    VariantEntity_EvidCond.condPhenCard.hpo.validations.shouldShowColumnContent('inheritance', data.variantGermline.hpo);
  });

  it('Link', () => {
    setupTest();
    VariantEntity_EvidCond.condPhenCard.hpo.validations.shouldShowColumnContent('link', data.variantGermline.hpo);
  });
});
