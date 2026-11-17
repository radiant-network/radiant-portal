/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { VariantEntity_EvidCond } from 'pom/pages/VariantEntity_EvidCond';

// Read-only checks: set the page up once and share it between tests.
describe('VariantEntity - EvidCond - ClinVar - Information displayed', { testIsolation: false }, () => {
  before(() => {
    cy.login();
    cy.visitVariantEvidCondPage(data.variantGermline.locus_id);
    VariantEntity_EvidCond.clinvarCard.actions.sortColumn('condition');
    VariantEntity_EvidCond.clinvarCard.actions.sortColumn('condition');
  });

  it('Evaluated', () => {
    VariantEntity_EvidCond.clinvarCard.validations.shouldShowColumnContent('evaluated', data.variantGermline.clinvar_evidence);
  });

  it('Condition', () => {
    VariantEntity_EvidCond.clinvarCard.validations.shouldShowColumnContent('condition', data.variantGermline.clinvar_evidence);
  });

  it('Classification', () => {
    VariantEntity_EvidCond.clinvarCard.validations.shouldShowColumnContent('classification', data.variantGermline.clinvar_evidence);
  });

  it('Submissions', () => {
    VariantEntity_EvidCond.clinvarCard.validations.shouldShowColumnContent('submission_count', data.variantGermline.clinvar_evidence);
  });

  it('Status', () => {
    VariantEntity_EvidCond.clinvarCard.validations.shouldShowColumnContent('status', data.variantGermline.clinvar_evidence);
  });

  it('Origin', () => {
    VariantEntity_EvidCond.clinvarCard.validations.shouldShowColumnContent('origin', data.variantGermline.clinvar_evidence);
  });

  it('RCV Link', () => {
    VariantEntity_EvidCond.clinvarCard.validations.shouldShowColumnContent('rcv_link', data.variantGermline.clinvar_evidence);
  });
});
