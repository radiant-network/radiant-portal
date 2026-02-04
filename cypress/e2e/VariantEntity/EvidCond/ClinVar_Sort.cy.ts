/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { VariantEntity_EvidCond } from 'pom/pages/VariantEntity_EvidCond';

describe('VariantEntity - EvidCond - ClinVar - Sort', () => {
  const setupTest = () => {
    cy.login();
    cy.visitVariantEvidCondPage(data.variantGermline.locus_id);
  };

  it('Number', () => {
    setupTest();
    VariantEntity_EvidCond.clinvarCard.validations.shouldSortColumn('submission_count', false /*hasUniqueValues*/, false /*isReverseSorting*/);
  });

  it('Tag', () => {
    setupTest();
    VariantEntity_EvidCond.clinvarCard.validations.shouldSortColumn('classification', false /*hasUniqueValues*/, false /*isReverseSorting*/);
  });

  it('Multiple [SJRA-719]', () => {
    setupTest();
    VariantEntity_EvidCond.clinvarCard.actions.sortColumn('classification');
    VariantEntity_EvidCond.clinvarCard.actions.sortColumn('condition');
    VariantEntity_EvidCond.clinvarCard.validations.shouldHaveFirstRowValue('Urofacial syndrome type 1', 'condition');
  });
});
