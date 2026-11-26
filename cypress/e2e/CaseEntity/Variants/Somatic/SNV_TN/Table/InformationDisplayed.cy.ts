/// <reference types="cypress"/>
import 'support/commands';
import { setupOnce } from 'support/setupOnce';
import { data } from 'pom/shared/Data';
import { CaseEntity_Variants_SNV_Table } from 'pom/pages/CaseEntity_Variants_SNV_Table';
import { CaseEntity_Variants_SavedFilters } from 'pom/pages/CaseEntity_Variants_SavedFilters';

// Read-only checks: set the page up once and share it between tests.
describe('Case Entity - Variants - Somatic - SNV (TN) - Table - Information displayed', { testIsolation: false }, () => {
  setupOnce(() => {
    cy.login();
    cy.visitCaseVariantsPage(data.caseSomatic.case, data.caseSomatic.seq.seq_id, 'SNV', {
      cohort: 'TN',
      sqon: data.variantSomatic.sqon,
    });
    CaseEntity_Variants_SavedFilters.snv.actions.clickNewFilterButton(); // Clean Query Builder
    CaseEntity_Variants_SNV_Table.somatic.actions.showAllColumns();
  });

  it('Variant', () => {
    CaseEntity_Variants_SNV_Table.somatic.validations.shouldShowColumnContent('variant', data.variantSomatic);
  });

  it('Type', () => {
    CaseEntity_Variants_SNV_Table.somatic.validations.shouldShowColumnContent('type', data.variantSomatic);
  });

  it('dbSNP', () => {
    CaseEntity_Variants_SNV_Table.somatic.validations.shouldShowColumnContent('dbsnp', data.variantSomatic);
  });

  it('Gene', () => {
    CaseEntity_Variants_SNV_Table.somatic.validations.shouldShowColumnContent('gene', data.variantSomatic);
  });

  it('AA', () => {
    CaseEntity_Variants_SNV_Table.somatic.validations.shouldShowColumnContent('aa_change', data.variantSomatic);
  });

  it('MANE', () => {
    CaseEntity_Variants_SNV_Table.somatic.validations.shouldShowColumnContent('mane', data.variantSomatic);
  });

  it('Consequence', () => {
    CaseEntity_Variants_SNV_Table.somatic.validations.shouldShowColumnContent('consequence', data.variantSomatic);
  });

  it('OMIM', () => {
    CaseEntity_Variants_SNV_Table.somatic.validations.shouldShowColumnContent('omim', data.variantSomatic);
  });

  it('Hotspot', () => {
    CaseEntity_Variants_SNV_Table.somatic.validations.shouldShowColumnContent('hotspot', data.variantSomatic);
  });

  it('Tier', () => {
    CaseEntity_Variants_SNV_Table.somatic.validations.shouldShowColumnContent('tier', data.variantSomatic);
  });

  it('CMC', () => {
    CaseEntity_Variants_SNV_Table.somatic.validations.shouldShowColumnContent('cmc', data.variantSomatic);
  });

  it('ClinVar', () => {
    CaseEntity_Variants_SNV_Table.somatic.validations.shouldShowColumnContent('clinvar', data.variantSomatic);
  });

  it('gnomAD', () => {
    CaseEntity_Variants_SNV_Table.somatic.validations.shouldShowColumnContent('gnomad', data.variantSomatic);
  });

  it('Freq. TO', () => {
    CaseEntity_Variants_SNV_Table.somatic.validations.shouldShowColumnContent('freq_to', data.variantSomatic);
  });

  it('Freq. TN', () => {
    CaseEntity_Variants_SNV_Table.somatic.validations.shouldShowColumnContent('freq_tn', data.variantSomatic);
  });

  it('Freq. G', () => {
    CaseEntity_Variants_SNV_Table.somatic.validations.shouldShowColumnContent('freq_g', data.variantSomatic);
  });

  it('SQ', () => {
    CaseEntity_Variants_SNV_Table.somatic.validations.shouldShowColumnContent('sq', data.variantSomatic);
  });

  it('AQ', () => {
    CaseEntity_Variants_SNV_Table.somatic.validations.shouldShowColumnContent('aq', data.variantSomatic);
  });

  it('AD Ratio', () => {
    CaseEntity_Variants_SNV_Table.somatic.validations.shouldShowColumnContent('ad_ratio', data.variantSomatic);
  });
});
