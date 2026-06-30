/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { CaseEntity_Variants_SNV_Table } from 'pom/pages/CaseEntity_Variants_SNV_Table';
import { CaseEntity_Variants_SavedFilters } from 'pom/pages/CaseEntity_Variants_SavedFilters';

describe('Case Entity - Variants - Germline - SNV - Table - Information displayed', () => {
  const setupTest = () => {
    cy.login();
    cy.visitCaseVariantsPage(data.case.case, data.case.seq.seq_id, 'SNV', data.variantGermline.sqon);
    CaseEntity_Variants_SavedFilters.snv.actions.selectFilterInDropdown('Cypress_All_Variants'); // Clean Query Builder
  };

  it('Variant', () => {
    setupTest();
    CaseEntity_Variants_SNV_Table.germline.validations.shouldShowColumnContent('variant', data.variantGermline);
  });

  it('Type', () => {
    setupTest();
    CaseEntity_Variants_SNV_Table.germline.validations.shouldShowColumnContent('type', data.variantGermline);
  });

  it('dbSNP', () => {
    setupTest();
    CaseEntity_Variants_SNV_Table.germline.validations.shouldShowColumnContent('dbsnp', data.variantGermline);
  });

  it('Gene', () => {
    setupTest();
    CaseEntity_Variants_SNV_Table.germline.validations.shouldShowColumnContent('gene', data.variantGermline);
  });

  it('AA', () => {
    setupTest();
    CaseEntity_Variants_SNV_Table.germline.validations.shouldShowColumnContent('aa_change', data.variantGermline);
  });

  it('Consequence', () => {
    setupTest();
    CaseEntity_Variants_SNV_Table.germline.validations.shouldShowColumnContent('consequence', data.variantGermline);
  });

  it('MANE', () => {
    setupTest();
    CaseEntity_Variants_SNV_Table.germline.validations.shouldShowColumnContent('mane', data.variantGermline);
  });

  it('OMIM', () => {
    setupTest();
    CaseEntity_Variants_SNV_Table.germline.validations.shouldShowColumnContent('omim', data.variantGermline);
  });

  it('ClinVar', () => {
    setupTest();
    CaseEntity_Variants_SNV_Table.germline.validations.shouldShowColumnContent('clinvar', data.variantGermline);
  });

  it('Exo.', () => {
    setupTest();
    CaseEntity_Variants_SNV_Table.germline.validations.shouldShowColumnContent('exomiser', data.variantGermline);
  });

  it('ACMG Exo.', () => {
    setupTest();
    CaseEntity_Variants_SNV_Table.germline.validations.shouldShowColumnContent('acmg_exomiser', data.variantGermline);
  });

  it('gnomAD', () => {
    setupTest();
    CaseEntity_Variants_SNV_Table.germline.validations.shouldShowColumnContent('gnomad', data.variantGermline);
  });

  it('Freq.', () => {
    setupTest();
    CaseEntity_Variants_SNV_Table.germline.validations.shouldShowColumnContent('freq', data.variantGermline);
  });

  it('GQ', () => {
    setupTest();
    CaseEntity_Variants_SNV_Table.germline.validations.shouldShowColumnContent('gq', data.variantGermline);
  });

  it('Zyg.', () => {
    setupTest();
    CaseEntity_Variants_SNV_Table.germline.validations.shouldShowColumnContent('zyg', data.variantGermline);
  });

  it('AD Ratio', () => {
    setupTest();
    CaseEntity_Variants_SNV_Table.germline.validations.shouldShowColumnContent('ad_ratio', data.variantGermline);
  });
});
