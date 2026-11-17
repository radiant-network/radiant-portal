/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { CaseEntity_Variants_SNV_Table } from 'pom/pages/CaseEntity_Variants_SNV_Table';
import { CaseEntity_Variants_SavedFilters } from 'pom/pages/CaseEntity_Variants_SavedFilters';

// Read-only checks: set the page up once and share it between tests.
describe('Case Entity - Variants - Germline - SNV - Table - Information displayed', { testIsolation: false }, () => {
  before(() => {
    cy.login();
    cy.visitCaseVariantsPage(data.case.case, data.case.seq.seq_id, 'SNV', data.variantGermline.sqon);
    CaseEntity_Variants_SavedFilters.snv.actions.selectFilterInDropdown('Cypress_All_Variants'); // Clean Query Builder
    CaseEntity_Variants_SNV_Table.germline.actions.showAllColumns();
  });

  it('Variant', () => {
    CaseEntity_Variants_SNV_Table.germline.validations.shouldShowColumnContent('variant', data.variantGermline, false);
  });

  it('Type', () => {
    CaseEntity_Variants_SNV_Table.germline.validations.shouldShowColumnContent('type', data.variantGermline, false);
  });

  it('dbSNP', () => {
    CaseEntity_Variants_SNV_Table.germline.validations.shouldShowColumnContent('dbsnp', data.variantGermline, false);
  });

  it('Gene', () => {
    CaseEntity_Variants_SNV_Table.germline.validations.shouldShowColumnContent('gene', data.variantGermline, false);
  });

  it('AA', () => {
    CaseEntity_Variants_SNV_Table.germline.validations.shouldShowColumnContent('aa_change', data.variantGermline, false);
  });

  it('Consequence', () => {
    CaseEntity_Variants_SNV_Table.germline.validations.shouldShowColumnContent('consequence', data.variantGermline, false);
  });

  it('MANE', () => {
    CaseEntity_Variants_SNV_Table.germline.validations.shouldShowColumnContent('mane', data.variantGermline, false);
  });

  it('OMIM', () => {
    CaseEntity_Variants_SNV_Table.germline.validations.shouldShowColumnContent('omim', data.variantGermline, false);
  });

  it('Tier', () => {
    CaseEntity_Variants_SNV_Table.germline.validations.shouldShowColumnContent('tier', data.variantGermline, false);
  });

  it('CMC', () => {
    CaseEntity_Variants_SNV_Table.germline.validations.shouldShowColumnContent('cmc', data.variantGermline, false);
  });

  it('ClinVar', () => {
    CaseEntity_Variants_SNV_Table.germline.validations.shouldShowColumnContent('clinvar', data.variantGermline, false);
  });

  it('Exo.', () => {
    CaseEntity_Variants_SNV_Table.germline.validations.shouldShowColumnContent('exomiser', data.variantGermline, false);
  });

  it('ACMG Exo.', () => {
    CaseEntity_Variants_SNV_Table.germline.validations.shouldShowColumnContent('acmg_exomiser', data.variantGermline, false);
  });

  it('gnomAD', () => {
    CaseEntity_Variants_SNV_Table.germline.validations.shouldShowColumnContent('gnomad', data.variantGermline, false);
  });

  it('Freq.', () => {
    CaseEntity_Variants_SNV_Table.germline.validations.shouldShowColumnContent('freq', data.variantGermline, false);
  });

  it('GQ', () => {
    CaseEntity_Variants_SNV_Table.germline.validations.shouldShowColumnContent('gq', data.variantGermline, false);
  });

  it('Zyg.', () => {
    CaseEntity_Variants_SNV_Table.germline.validations.shouldShowColumnContent('zyg', data.variantGermline, false);
  });

  it('AD Ratio', () => {
    CaseEntity_Variants_SNV_Table.germline.validations.shouldShowColumnContent('ad_ratio', data.variantGermline, false);
  });
});
