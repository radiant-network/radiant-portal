/// <reference types="cypress"/>
import 'support/commands';
import { CaseEntity_Variants_CNV } from 'pom/pages/CaseEntity_Variants_CNV';
import { data } from 'pom/shared/Data';

describe('Case Entity - Variants - CNV - Information displayed', () => {
  const setupTest = () => {
    cy.login();
    cy.visitCaseVariantsPage('1', 'CNV', data.cnvGermline.sqon);
  };

  it('Genes', () => {
    setupTest();
    CaseEntity_Variants_CNV.validations.shouldShowColumnContent('genes', data.cnvGermline);
  });

  it('Cytoband', () => {
    setupTest();
    CaseEntity_Variants_CNV.validations.shouldShowColumnContent('cytoband', data.cnvGermline);
  });

  it('# SNVs', () => {
    setupTest();
    CaseEntity_Variants_CNV.validations.shouldShowColumnContent('nb_snv', data.cnvGermline);
  });

  it('Variant', () => {
    setupTest();
    CaseEntity_Variants_CNV.validations.shouldShowColumnContent('cnv_variant', data.cnvGermline);
  });

  it('ClinGen', () => {
    setupTest();
    CaseEntity_Variants_CNV.validations.shouldShowColumnContent('clingen', data.cnvGermline);
  });

  it('Chr', () => {
    setupTest();
    CaseEntity_Variants_CNV.validations.shouldShowColumnContent('chromosome', data.cnvGermline);
  });

  it('Start', () => {
    setupTest();
    CaseEntity_Variants_CNV.validations.shouldShowColumnContent('start', data.cnvGermline);
  });

  it('End', () => {
    setupTest();
    CaseEntity_Variants_CNV.validations.shouldShowColumnContent('end', data.cnvGermline);
  });

  it('Type', () => {
    setupTest();
    CaseEntity_Variants_CNV.validations.shouldShowColumnContent('type', data.cnvGermline);
  });

  it('Length', () => {
    setupTest();
    CaseEntity_Variants_CNV.validations.shouldShowColumnContent('length', data.cnvGermline);
  });

  it('CN', () => {
    setupTest();
    CaseEntity_Variants_CNV.validations.shouldShowColumnContent('cn', data.cnvGermline);
  });

  it('gnomAD', () => {
    setupTest();
    CaseEntity_Variants_CNV.validations.shouldShowColumnContent('gnomad', data.cnvGermline);
  });

  it('# Genes', () => {
    setupTest();
    CaseEntity_Variants_CNV.validations.shouldShowColumnContent('nb_genes', data.cnvGermline);
  });

  it('GT', () => {
    setupTest();
    CaseEntity_Variants_CNV.validations.shouldShowColumnContent('gt', data.cnvGermline);
  });

  it('Filter', () => {
    setupTest();
    CaseEntity_Variants_CNV.validations.shouldShowColumnContent('filter', data.cnvGermline);
  });

  it('Qual.', () => {
    setupTest();
    CaseEntity_Variants_CNV.validations.shouldShowColumnContent('quality', data.cnvGermline);
  });

  it('BC', () => {
    setupTest();
    CaseEntity_Variants_CNV.validations.shouldShowColumnContent('bc', data.cnvGermline);
  });

  it('PE', () => {
    setupTest();
    CaseEntity_Variants_CNV.validations.shouldShowColumnContent('pe', data.cnvGermline);
  });
});
