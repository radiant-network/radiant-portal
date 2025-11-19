/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { CaseEntity_Variants_CNV_Table } from 'pom/pages/CaseEntity_Variants_CNV_Table';

describe('Case Entity - Variants - CNV - Table - Information displayed', () => {
  const setupTest = () => {
    cy.login();
    cy.visitCaseVariantsPage('1', 'CNV', data.cnvGermline.sqon);
  };

  it('Genes', () => {
    setupTest();
    CaseEntity_Variants_CNV_Table.validations.shouldShowColumnContent('genes', data.cnvGermline);
  });

  it('Cytoband', () => {
    setupTest();
    CaseEntity_Variants_CNV_Table.validations.shouldShowColumnContent('cytoband', data.cnvGermline);
  });

  it('# SNVs', () => {
    setupTest();
    CaseEntity_Variants_CNV_Table.validations.shouldShowColumnContent('nb_snv', data.cnvGermline);
  });

  it('Variant', () => {
    setupTest();
    CaseEntity_Variants_CNV_Table.validations.shouldShowColumnContent('cnv_variant', data.cnvGermline);
  });

  it('ClinGen', () => {
    setupTest();
    CaseEntity_Variants_CNV_Table.validations.shouldShowColumnContent('clingen', data.cnvGermline);
  });

  it('Chr', () => {
    setupTest();
    CaseEntity_Variants_CNV_Table.validations.shouldShowColumnContent('chromosome', data.cnvGermline);
  });

  it('Start', () => {
    setupTest();
    CaseEntity_Variants_CNV_Table.validations.shouldShowColumnContent('start', data.cnvGermline);
  });

  it('End', () => {
    setupTest();
    CaseEntity_Variants_CNV_Table.validations.shouldShowColumnContent('end', data.cnvGermline);
  });

  it('Type', () => {
    setupTest();
    CaseEntity_Variants_CNV_Table.validations.shouldShowColumnContent('type', data.cnvGermline);
  });

  it('Length', () => {
    setupTest();
    CaseEntity_Variants_CNV_Table.validations.shouldShowColumnContent('length', data.cnvGermline);
  });

  it('CN', () => {
    setupTest();
    CaseEntity_Variants_CNV_Table.validations.shouldShowColumnContent('cn', data.cnvGermline);
  });

  it('gnomAD', () => {
    setupTest();
    CaseEntity_Variants_CNV_Table.validations.shouldShowColumnContent('gnomad', data.cnvGermline);
  });

  it('# Genes', () => {
    setupTest();
    CaseEntity_Variants_CNV_Table.validations.shouldShowColumnContent('nb_genes', data.cnvGermline);
  });

  it('GT', () => {
    setupTest();
    CaseEntity_Variants_CNV_Table.validations.shouldShowColumnContent('gt', data.cnvGermline);
  });

  it('Filter', () => {
    setupTest();
    CaseEntity_Variants_CNV_Table.validations.shouldShowColumnContent('filter', data.cnvGermline);
  });

  it('Qual.', () => {
    setupTest();
    CaseEntity_Variants_CNV_Table.validations.shouldShowColumnContent('quality', data.cnvGermline);
  });

  it('BC', () => {
    setupTest();
    CaseEntity_Variants_CNV_Table.validations.shouldShowColumnContent('bc', data.cnvGermline);
  });

  it('PE', () => {
    setupTest();
    CaseEntity_Variants_CNV_Table.validations.shouldShowColumnContent('pe', data.cnvGermline);
  });
});
