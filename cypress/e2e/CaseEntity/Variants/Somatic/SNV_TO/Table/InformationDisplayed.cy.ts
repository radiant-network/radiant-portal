/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { CaseEntity_Variants_SNV_Table } from 'pom/pages/CaseEntity_Variants_SNV_Table';
import { CaseEntity_Variants_SavedFilters } from 'pom/pages/CaseEntity_Variants_SavedFilters';

// Read-only checks: set the page up once and share it between tests.
describe('Case Entity - Variants - Somatic - SNV (TO) - Table - Information displayed', { testIsolation: false }, () => {
  before(() => {
    cy.login();
    cy.resetTablePreferences();
    cy.visitCaseVariantsPage(data.caseSomatic.case, data.caseSomatic.seq.seq_id, 'SNV', {
      cohort: 'TO',
      sqon: data.variantSomaticTO.sqon,
    });
    CaseEntity_Variants_SavedFilters.snv.actions.clickNewFilterButton(); // Clean Query Builder
    CaseEntity_Variants_SNV_Table.somatic.actions.showAllColumns();
  });

  it('Variant', () => {
    CaseEntity_Variants_SNV_Table.somatic.validations.shouldShowColumnContent('variant', data.variantSomaticTO);
  });

  it('Type', () => {
    CaseEntity_Variants_SNV_Table.somatic.validations.shouldShowColumnContent('type', data.variantSomaticTO);
  });

  it('dbSNP', () => {
    CaseEntity_Variants_SNV_Table.somatic.validations.shouldShowColumnContent('dbsnp', data.variantSomaticTO);
  });

  it('Gene', () => {
    CaseEntity_Variants_SNV_Table.somatic.validations.shouldShowColumnContent('gene', data.variantSomaticTO);
  });

  it('AA', () => {
    CaseEntity_Variants_SNV_Table.somatic.validations.shouldShowColumnContent('aa_change', data.variantSomaticTO);
  });

  it('MANE', () => {
    CaseEntity_Variants_SNV_Table.somatic.validations.shouldShowColumnContent('mane', data.variantSomaticTO);
  });

  it('Consequence', () => {
    CaseEntity_Variants_SNV_Table.somatic.validations.shouldShowColumnContent('consequence', data.variantSomaticTO);
  });

  it('OMIM', () => {
    CaseEntity_Variants_SNV_Table.somatic.validations.shouldShowColumnContent('omim', data.variantSomaticTO);
  });

  it('Hotspot', () => {
    CaseEntity_Variants_SNV_Table.somatic.validations.shouldShowColumnContent('hotspot', data.variantSomaticTO);
  });

  it('Tier', () => {
    CaseEntity_Variants_SNV_Table.somatic.validations.shouldShowColumnContent('tier', data.variantSomaticTO);
  });

  it('CMC', () => {
    CaseEntity_Variants_SNV_Table.somatic.validations.shouldShowColumnContent('cmc', data.variantSomaticTO);
  });

  it('ClinVar', () => {
    CaseEntity_Variants_SNV_Table.somatic.validations.shouldShowColumnContent('clinvar', data.variantSomaticTO);
  });

  it('gnomAD', () => {
    CaseEntity_Variants_SNV_Table.somatic.validations.shouldShowColumnContent('gnomad', data.variantSomaticTO);
  });

  it('Freq. TO', () => {
    CaseEntity_Variants_SNV_Table.somatic.validations.shouldShowColumnContent('freq_to', data.variantSomaticTO);
  });

  it('Freq. TN', () => {
    CaseEntity_Variants_SNV_Table.somatic.validations.shouldShowColumnContent('freq_tn', data.variantSomaticTO);
  });

  it('Freq. G', () => {
    CaseEntity_Variants_SNV_Table.somatic.validations.shouldShowColumnContent('freq_g', data.variantSomaticTO);
  });

  it('SQ', () => {
    CaseEntity_Variants_SNV_Table.somatic.validations.shouldShowColumnContent('sq', data.variantSomaticTO);
  });

  it('AQ', () => {
    CaseEntity_Variants_SNV_Table.somatic.validations.shouldShowColumnContent('aq', data.variantSomaticTO);
  });

  it('AD Ratio', () => {
    CaseEntity_Variants_SNV_Table.somatic.validations.shouldShowColumnContent('ad_ratio', data.variantSomaticTO);
  });
});
