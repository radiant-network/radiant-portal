/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { VariantEntity_EvidCond } from 'pom/pages/VariantEntity_EvidCond';

describe('VariantEntity - CondPhen - Hpo - Sort', () => {
  const setupTest = () => {
    cy.login();
    cy.visitVariantEvidCondPage(data.variantGermline.locus_id);
    VariantEntity_EvidCond.condPhenCard.hpo.actions.selectTab();
  };

  it('Alphanumeric [SJRA-1168]', () => {
    setupTest();
    VariantEntity_EvidCond.condPhenCard.hpo.validations.shouldSortColumn('condition', false /*hasUniqueValues*/, true /*isReverseSorting*/);
  });
});
