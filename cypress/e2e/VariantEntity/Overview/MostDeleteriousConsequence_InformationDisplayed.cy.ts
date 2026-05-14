/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { VariantEntity_Overview } from 'pom/pages/VariantEntity_Overview';

describe('VariantEntity - Overview - MostDeleteriousConsequence - Information displayed', () => {
  const setupTest = () => {
    cy.login();
    cy.visitVariantOverviewPage(data.variantGermline.locus_id);
  };

  it('Gene', () => {
    setupTest();
    VariantEntity_Overview.mostDeleterious.validations.shouldShowField('gene', data.variantGermline);
  });

  it('AA change', () => {
    setupTest();
    VariantEntity_Overview.mostDeleterious.validations.shouldShowField('aa_change', data.variantGermline);
  });

  it('Consequence', () => {
    setupTest();
    VariantEntity_Overview.mostDeleterious.validations.shouldShowField('consequence', data.variantGermline);
  });

  it('ClinVar', () => {
    setupTest();
    VariantEntity_Overview.mostDeleterious.validations.shouldShowField('clinvar_classifications', data.variantGermline);
  });

  it('Patients', () => {
    setupTest();
    VariantEntity_Overview.mostDeleterious.validations.shouldShowField('patients', data.variantGermline);
  });

  it('gnomAD', () => {
    setupTest();
    VariantEntity_Overview.mostDeleterious.validations.shouldShowField('gnomad', data.variantGermline);
  });

  it('Transcript ID', () => {
    setupTest();
    VariantEntity_Overview.mostDeleterious.validations.shouldShowField('transcript_id', data.variantGermline);
  });

  it('Exon', () => {
    setupTest();
    VariantEntity_Overview.mostDeleterious.validations.shouldShowField('exon', data.variantGermline);
  });

  it('DNA change', () => {
    setupTest();
    VariantEntity_Overview.mostDeleterious.validations.shouldShowField('dna_change', data.variantGermline);
  });

  it('dbSNP', () => {
    setupTest();
    VariantEntity_Overview.mostDeleterious.validations.shouldShowField('dbsnp', data.variantGermline);
  });
});
