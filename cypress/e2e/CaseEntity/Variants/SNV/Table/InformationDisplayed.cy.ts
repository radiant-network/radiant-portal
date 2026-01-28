/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { CaseEntity_Variants_SNV_Table } from 'pom/pages/CaseEntity_Variants_SNV_Table';

describe('Case Entity - Variants - SNV - Table - Information displayed', () => {
  const setupTest = () => {
    cy.login();
    cy.visitCaseVariantsPage(data.case.case, 'SNV', data.variantGermline.sqon);
  };

  it('Variant', () => {
    setupTest();
    CaseEntity_Variants_SNV_Table.validations.shouldShowColumnContent('variant', data.variantGermline);
  });

  it('Type', () => {
    setupTest();
    CaseEntity_Variants_SNV_Table.validations.shouldShowColumnContent('type', data.variantGermline);
  });

  it('dbSNP', () => {
    setupTest();
    CaseEntity_Variants_SNV_Table.validations.shouldShowColumnContent('dbsnp', data.variantGermline);
  });

  it('Gene', () => {
    setupTest();
    CaseEntity_Variants_SNV_Table.validations.shouldShowColumnContent('gene', data.variantGermline);
  });

  it('AA', () => {
    setupTest();
    CaseEntity_Variants_SNV_Table.validations.shouldShowColumnContent('aa_change', data.variantGermline);
  });

  it('Consequence', () => {
    setupTest();
    CaseEntity_Variants_SNV_Table.validations.shouldShowColumnContent('consequence', data.variantGermline);
  });

  it('MANE', () => {
    setupTest();
    CaseEntity_Variants_SNV_Table.validations.shouldShowColumnContent('mane', data.variantGermline);
  });

  it('OMIM', () => {
    setupTest();
    CaseEntity_Variants_SNV_Table.validations.shouldShowColumnContent('omim', data.variantGermline);
  });

  it('ClinVar', () => {
    setupTest();
    CaseEntity_Variants_SNV_Table.validations.shouldShowColumnContent('clinvar', data.variantGermline);
  });

  it('Exo.', () => {
    setupTest();
    CaseEntity_Variants_SNV_Table.validations.shouldShowColumnContent('exomiser', data.variantGermline);
  });

  it('ACMG Exo.', () => {
    setupTest();
    CaseEntity_Variants_SNV_Table.validations.shouldShowColumnContent('acmg_exomiser', data.variantGermline);
  });

  it('gnomAD', () => {
    setupTest();
    CaseEntity_Variants_SNV_Table.validations.shouldShowColumnContent('gnomad', data.variantGermline);
  });

  it('Freq.', () => {
    setupTest();
    CaseEntity_Variants_SNV_Table.validations.shouldShowColumnContent('freq', data.variantGermline);
  });

  it('GQ', () => {
    setupTest();
    CaseEntity_Variants_SNV_Table.validations.shouldShowColumnContent('gq', data.variantGermline);
  });

  it('Zyg.', () => {
    setupTest();
    CaseEntity_Variants_SNV_Table.validations.shouldShowColumnContent('zyg', data.variantGermline);
  });

  it('AD Ratio', () => {
    setupTest();
    CaseEntity_Variants_SNV_Table.validations.shouldShowColumnContent('ad_ratio', data.variantGermline);
  });
});
