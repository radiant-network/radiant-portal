/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { CaseEntity_Variants_SNV } from 'pom/pages/CaseEntity_Variants_SNV';

describe('Case Entity - Variants - SNV - Information displayed', () => {
  const setupTest = () => {
    cy.login();
    cy.visitCaseVariantsPage('1', 'SNV', data.variantGermline.sqon);
  };

  it('Variant', () => {
    setupTest();
    CaseEntity_Variants_SNV.validations.shouldShowColumnContent('variant', data.variantGermline);
  });

  it('Type', () => {
    setupTest();
    CaseEntity_Variants_SNV.validations.shouldShowColumnContent('type', data.variantGermline);
  });

  it('dbSNP', () => {
    setupTest();
    CaseEntity_Variants_SNV.validations.shouldShowColumnContent('dbsnp', data.variantGermline);
  });

  it('Gene', () => {
    setupTest();
    CaseEntity_Variants_SNV.validations.shouldShowColumnContent('gene', data.variantGermline);
  });

  it('AA', () => {
    setupTest();
    CaseEntity_Variants_SNV.validations.shouldShowColumnContent('aa_change', data.variantGermline);
  });

  it('Consequence', () => {
    setupTest();
    CaseEntity_Variants_SNV.validations.shouldShowColumnContent('consequence', data.variantGermline);
  });

  it('MANE', () => {
    setupTest();
    CaseEntity_Variants_SNV.validations.shouldShowColumnContent('mane', data.variantGermline);
  });

  it('OMIM', () => {
    setupTest();
    CaseEntity_Variants_SNV.validations.shouldShowColumnContent('omim', data.variantGermline);
  });

  it('ClinVar', () => {
    setupTest();
    CaseEntity_Variants_SNV.validations.shouldShowColumnContent('clinvar', data.variantGermline);
  });

  it('Exo.', () => {
    setupTest();
    CaseEntity_Variants_SNV.validations.shouldShowColumnContent('exomiser', data.variantGermline);
  });

  it('ACMG Exo.', () => {
    setupTest();
    CaseEntity_Variants_SNV.validations.shouldShowColumnContent('acmg_exomiser', data.variantGermline);
  });

  it('gnomAD', () => {
    setupTest();
    CaseEntity_Variants_SNV.validations.shouldShowColumnContent('gnomad', data.variantGermline);
  });

  it('Freq.', () => {
    setupTest();
    CaseEntity_Variants_SNV.validations.shouldShowColumnContent('freq', data.variantGermline);
  });

  it('GQ', () => {
    setupTest();
    CaseEntity_Variants_SNV.validations.shouldShowColumnContent('gq', data.variantGermline);
  });

  it('Zyg.', () => {
    setupTest();
    CaseEntity_Variants_SNV.validations.shouldShowColumnContent('zyg', data.variantGermline);
  });

  it('AD Ratio', () => {
    setupTest();
    CaseEntity_Variants_SNV.validations.shouldShowColumnContent('ad_ratio', data.variantGermline);
  });
});
