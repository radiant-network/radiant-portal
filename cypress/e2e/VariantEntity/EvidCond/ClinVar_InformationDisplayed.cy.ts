/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { VariantEntity_EvidCond } from 'pom/pages/VariantEntity_EvidCond';

describe('VariantEntity - EvidCond - ClinVar - Information displayed', () => {
  const setupTest = () => {
    cy.login();
    cy.visitVariantEvidCondPage(data.variantGermline.locus_id);
  };

  it('Evaluated', () => {
    setupTest();
    VariantEntity_EvidCond.clinvarCard.validations.shouldShowColumnContent('evaluated', data.variantGermline.clinvar);
  });

  it('Condition', () => {
    setupTest();
    VariantEntity_EvidCond.clinvarCard.validations.shouldShowColumnContent('condition', data.variantGermline.clinvar);
  });

  it('Classification', () => {
    setupTest();
    VariantEntity_EvidCond.clinvarCard.validations.shouldShowColumnContent('classification', data.variantGermline.clinvar);
  });

  it('Submissions', () => {
    setupTest();
    VariantEntity_EvidCond.clinvarCard.validations.shouldShowColumnContent('submission_count', data.variantGermline.clinvar);
  });

  it('Status', () => {
    setupTest();
    VariantEntity_EvidCond.clinvarCard.validations.shouldShowColumnContent('status', data.variantGermline.clinvar);
  });

  it('Origin', () => {
    setupTest();
    VariantEntity_EvidCond.clinvarCard.validations.shouldShowColumnContent('origin', data.variantGermline.clinvar);
  });

  it('RCV Link', () => {
    setupTest();
    VariantEntity_EvidCond.clinvarCard.validations.shouldShowColumnContent('rcv_link', data.variantGermline.clinvar);
  });
});
