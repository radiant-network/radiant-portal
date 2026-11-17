/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { VariantEntity_Overview } from 'pom/pages/VariantEntity_Overview';

// Read-only checks: set the page up once and share it between tests.
describe('VariantEntity - Overview - MostDeleteriousConsequence - Information displayed', { testIsolation: false }, () => {
  before(() => {
    cy.login();
    cy.visitVariantOverviewPage(data.variantGermline.locus_id);
  });

  it('Gene', () => {
    VariantEntity_Overview.mostDeleterious.validations.shouldShowField('gene', data.variantGermline);
  });

  it('AA change', () => {
    VariantEntity_Overview.mostDeleterious.validations.shouldShowField('aa_change', data.variantGermline);
  });

  it('Consequence', () => {
    VariantEntity_Overview.mostDeleterious.validations.shouldShowField('consequence', data.variantGermline);
  });

  it('ClinVar', () => {
    VariantEntity_Overview.mostDeleterious.validations.shouldShowField('clinvar_classifications', data.variantGermline);
  });

  it('Patients', () => {
    VariantEntity_Overview.mostDeleterious.validations.shouldShowField('patients', data.variantGermline);
  });

  it('gnomAD', () => {
    VariantEntity_Overview.mostDeleterious.validations.shouldShowField('gnomad', data.variantGermline);
  });

  it('Transcript ID', () => {
    VariantEntity_Overview.mostDeleterious.validations.shouldShowField('transcript_id', data.variantGermline);
  });

  it('Exon', () => {
    VariantEntity_Overview.mostDeleterious.validations.shouldShowField('exon', data.variantGermline);
  });

  it('DNA change', () => {
    VariantEntity_Overview.mostDeleterious.validations.shouldShowField('dna_change', data.variantGermline);
  });

  it('dbSNP', () => {
    VariantEntity_Overview.mostDeleterious.validations.shouldShowField('dbsnp', data.variantGermline);
  });
});
