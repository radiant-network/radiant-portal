/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { CaseEntity_Variants_SNV_Table } from 'pom/pages/CaseEntity_Variants_SNV_Table';
import { CaseEntity_Variants_SavedFilters } from 'pom/pages/CaseEntity_Variants_SavedFilters';

describe('Case Entity - Variants - Somatic - SNV - Table - Information displayed', () => {
  const setupTest = () => {
    cy.login();
    cy.visitCaseVariantsPage(data.caseSomatic.case, data.caseSomatic.seq.seq_id, 'SNV', data.variantSomatic.sqon);
    CaseEntity_Variants_SavedFilters.snv.actions.clickNewFilterButton(); // Clean Query Builder
  };

  it('Variant', () => {
    setupTest();
    CaseEntity_Variants_SNV_Table.somatic.validations.shouldShowColumnContent('variant', data.variantSomatic);
  });

  it('Type', () => {
    setupTest();
    CaseEntity_Variants_SNV_Table.somatic.validations.shouldShowColumnContent('type', data.variantSomatic);
  });

  it('dbSNP', () => {
    setupTest();
    CaseEntity_Variants_SNV_Table.somatic.validations.shouldShowColumnContent('dbsnp', data.variantSomatic);
  });

  it('Gene', () => {
    setupTest();
    CaseEntity_Variants_SNV_Table.somatic.validations.shouldShowColumnContent('gene', data.variantSomatic);
  });

  it('AA', () => {
    setupTest();
    CaseEntity_Variants_SNV_Table.somatic.validations.shouldShowColumnContent('aa_change', data.variantSomatic);
  });

  it('MANE', () => {
    setupTest();
    CaseEntity_Variants_SNV_Table.somatic.validations.shouldShowColumnContent('mane', data.variantSomatic);
  });

  it('Consequence', () => {
    setupTest();
    CaseEntity_Variants_SNV_Table.somatic.validations.shouldShowColumnContent('consequence', data.variantSomatic);
  });

  it('OMIM', () => {
    setupTest();
    CaseEntity_Variants_SNV_Table.somatic.validations.shouldShowColumnContent('omim', data.variantSomatic);
  });

  it('ClinVar', () => {
    setupTest();
    CaseEntity_Variants_SNV_Table.somatic.validations.shouldShowColumnContent('clinvar', data.variantSomatic);
  });

  it('gnomAD', () => {
    setupTest();
    CaseEntity_Variants_SNV_Table.somatic.validations.shouldShowColumnContent('gnomad', data.variantSomatic);
  });

  it('Freq. TN', () => {
    setupTest();
    CaseEntity_Variants_SNV_Table.somatic.validations.shouldShowColumnContent('freq_tn', data.variantSomatic);
  });

  it('Freq. G', () => {
    setupTest();
    CaseEntity_Variants_SNV_Table.somatic.validations.shouldShowColumnContent('freq_g', data.variantSomatic);
  });
});
