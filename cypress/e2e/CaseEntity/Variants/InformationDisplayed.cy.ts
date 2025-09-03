/// <reference types="cypress"/>
import '../../../support/commands';
import { data } from '../../../pom/shared/Data';
import { VariantsTable } from '../../../pom/pages/VariantsTable';

describe('Case Entity - Variants - Information displayed', () => {
  const setupTest = () => {
    cy.login();
    cy.visitCaseVariantsPage('1', data.variantGermline.sqon);
  };

  it('Variant', () => {
    setupTest();
    VariantsTable.validations.shouldShowColumnContent('variant', data.variantGermline);
  });

  it('Type', () => {
    setupTest();
    VariantsTable.validations.shouldShowColumnContent('type', data.variantGermline);
  });

  it('dbSNP', () => {
    setupTest();
    VariantsTable.validations.shouldShowColumnContent('dbsnp', data.variantGermline);
  });

  it('Gene', () => {
    setupTest();
    VariantsTable.validations.shouldShowColumnContent('gene', data.variantGermline);
  });

  it('Consequence', () => {
    setupTest();
    VariantsTable.validations.shouldShowColumnContent('consequence', data.variantGermline);
  });

  it('MANE', () => {
    setupTest();
    VariantsTable.validations.shouldShowColumnContent('mane', data.variantGermline);
  });

  it('OMIM', () => {
    setupTest();
    VariantsTable.validations.shouldShowColumnContent('omim', data.variantGermline);
  });

  it('ClinVar', () => {
    setupTest();
    VariantsTable.validations.shouldShowColumnContent('clinvar', data.variantGermline);
  });

  it('Exo.', () => {
    setupTest();
    VariantsTable.validations.shouldShowColumnContent('exomiser', data.variantGermline);
  });

  it('ACMG Exo.', () => {
    setupTest();
    VariantsTable.validations.shouldShowColumnContent('acmg_exomiser', data.variantGermline);
  });

  it('gnomAD', () => {
    setupTest();
    VariantsTable.validations.shouldShowColumnContent('gnomad', data.variantGermline);
  });

  it('Freq.', () => {
    setupTest();
    VariantsTable.validations.shouldShowColumnContent('freq', data.variantGermline);
  });

  it('GQ', () => {
    setupTest();
    VariantsTable.validations.shouldShowColumnContent('gq', data.variantGermline);
  });

  it('Zyg.', () => {
    setupTest();
    VariantsTable.validations.shouldShowColumnContent('zyg', data.variantGermline);
  });

  it('AD Ratio', () => {
    setupTest();
    VariantsTable.validations.shouldShowColumnContent('ad_ratio', data.variantGermline);
  });
});
