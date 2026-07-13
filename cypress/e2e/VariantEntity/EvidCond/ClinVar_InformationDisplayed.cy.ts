/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { VariantEntity_EvidCond } from 'pom/pages/VariantEntity_EvidCond';

describe('VariantEntity - EvidCond - ClinVar - Information displayed [SJRA-1702]', () => {
  const setupTest = () => {
    cy.login();
    cy.visitVariantEvidCondPage(data.variantGermline.locus_id);
    VariantEntity_EvidCond.clinvarCard.actions.sortColumn('condition');
    VariantEntity_EvidCond.clinvarCard.actions.sortColumn('condition');
  };

  it('Evaluated', () => {
    setupTest();
    VariantEntity_EvidCond.clinvarCard.validations.shouldShowColumnContent('evaluated', data.variantGermline.clinvar_evidence);
  });

  it('Condition', () => {
    setupTest();
    VariantEntity_EvidCond.clinvarCard.validations.shouldShowColumnContent('condition', data.variantGermline.clinvar_evidence);
  });

  it('Classification', () => {
    setupTest();
    VariantEntity_EvidCond.clinvarCard.validations.shouldShowColumnContent('classification', data.variantGermline.clinvar_evidence);
  });

  it('Submissions', () => {
    setupTest();
    VariantEntity_EvidCond.clinvarCard.validations.shouldShowColumnContent('submission_count', data.variantGermline.clinvar_evidence);
  });

  it('Status', () => {
    setupTest();
    VariantEntity_EvidCond.clinvarCard.validations.shouldShowColumnContent('status', data.variantGermline.clinvar_evidence);
  });

  it('Origin', () => {
    setupTest();
    VariantEntity_EvidCond.clinvarCard.validations.shouldShowColumnContent('origin', data.variantGermline.clinvar_evidence);
  });

  it('RCV Link', () => {
    setupTest();
    VariantEntity_EvidCond.clinvarCard.validations.shouldShowColumnContent('rcv_link', data.variantGermline.clinvar_evidence);
  });
});
