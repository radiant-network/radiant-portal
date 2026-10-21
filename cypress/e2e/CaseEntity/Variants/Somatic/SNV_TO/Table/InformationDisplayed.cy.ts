/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { CaseEntity_Variants_SNV_Table } from 'pom/pages/CaseEntity_Variants_SNV_Table';
import { CaseEntity_Variants_SavedFilters } from 'pom/pages/CaseEntity_Variants_SavedFilters';

describe('Case Entity - Variants - Somatic - SNV (TO) - Table - Information displayed', () => {
  const setupTest = () => {
    cy.login();
    cy.visitCaseVariantsPage(data.caseSomatic.case, data.caseSomatic.seq.seq_id, 'SNV', {
      cohort: 'TO',
      sqon: data.variantSomaticTO.sqon,
    });
    CaseEntity_Variants_SavedFilters.snv.actions.clickNewFilterButton(); // Clean Query Builder
  };

  it('Variant', () => {
    setupTest();
    CaseEntity_Variants_SNV_Table.somatic.validations.shouldShowColumnContent('variant', data.variantSomaticTO);
  });

  it('Type', () => {
    setupTest();
    CaseEntity_Variants_SNV_Table.somatic.validations.shouldShowColumnContent('type', data.variantSomaticTO);
  });

  it('dbSNP', () => {
    setupTest();
    CaseEntity_Variants_SNV_Table.somatic.validations.shouldShowColumnContent('dbsnp', data.variantSomaticTO);
  });

  it('Gene', () => {
    setupTest();
    CaseEntity_Variants_SNV_Table.somatic.validations.shouldShowColumnContent('gene', data.variantSomaticTO);
  });

  it('AA', () => {
    setupTest();
    CaseEntity_Variants_SNV_Table.somatic.validations.shouldShowColumnContent('aa_change', data.variantSomaticTO);
  });

  it('MANE', () => {
    setupTest();
    CaseEntity_Variants_SNV_Table.somatic.validations.shouldShowColumnContent('mane', data.variantSomaticTO);
  });

  it('Consequence', () => {
    setupTest();
    CaseEntity_Variants_SNV_Table.somatic.validations.shouldShowColumnContent('consequence', data.variantSomaticTO);
  });

  it('OMIM', () => {
    setupTest();
    CaseEntity_Variants_SNV_Table.somatic.validations.shouldShowColumnContent('omim', data.variantSomaticTO);
  });

  it('Hotspot', () => {
    setupTest();
    CaseEntity_Variants_SNV_Table.somatic.validations.shouldShowColumnContent('hotspot', data.variantSomaticTO);
  });

  it('Tier', () => {
    setupTest();
    CaseEntity_Variants_SNV_Table.somatic.validations.shouldShowColumnContent('tier', data.variantSomaticTO);
  });

  it('CMC', () => {
    setupTest();
    CaseEntity_Variants_SNV_Table.somatic.validations.shouldShowColumnContent('cmc', data.variantSomaticTO);
  });

  it('ClinVar', () => {
    setupTest();
    CaseEntity_Variants_SNV_Table.somatic.validations.shouldShowColumnContent('clinvar', data.variantSomaticTO);
  });

  it('gnomAD', () => {
    setupTest();
    CaseEntity_Variants_SNV_Table.somatic.validations.shouldShowColumnContent('gnomad', data.variantSomaticTO);
  });

  it('Freq. TO [RAD-112]', () => {
    setupTest();
    CaseEntity_Variants_SNV_Table.somatic.validations.shouldShowColumnContent('freq_to', data.variantSomaticTO);
  });

  it('Freq. TN', () => {
    setupTest();
    CaseEntity_Variants_SNV_Table.somatic.validations.shouldShowColumnContent('freq_tn', data.variantSomaticTO);
  });

  it('Freq. G', () => {
    setupTest();
    CaseEntity_Variants_SNV_Table.somatic.validations.shouldShowColumnContent('freq_g', data.variantSomaticTO);
  });

  it('SQ', () => {
    setupTest();
    CaseEntity_Variants_SNV_Table.somatic.validations.shouldShowColumnContent('sq', data.variantSomaticTO);
  });

  it('AQ', () => {
    setupTest();
    CaseEntity_Variants_SNV_Table.somatic.validations.shouldShowColumnContent('aq', data.variantSomaticTO);
  });

  it('AD Ratio', () => {
    setupTest();
    CaseEntity_Variants_SNV_Table.somatic.validations.shouldShowColumnContent('ad_ratio', data.variantSomaticTO);
  });
});
