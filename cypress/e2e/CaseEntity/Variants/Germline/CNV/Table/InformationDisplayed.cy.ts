/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { CaseEntity_Variants_CNV_Table } from 'pom/pages/CaseEntity_Variants_CNV_Table';
import { CaseEntity_Variants_SavedFilters } from 'pom/pages/CaseEntity_Variants_SavedFilters';

// Read-only checks: set the page up once and share it between tests.
describe('Case Entity - Variants - Germline - CNV - Table - Information displayed', { testIsolation: false }, () => {
  before(() => {
    cy.login();
    cy.visitCaseVariantsPage(data.case.case, data.case.seq.seq_id, 'CNV', data.cnvGermline.sqon);
    CaseEntity_Variants_SavedFilters.cnv.actions.selectFilterInDropdown('Cypress_All_Variants'); // Clean Query Builder
    CaseEntity_Variants_CNV_Table.actions.showAllColumns();
  });

  it('Genes', () => {
    CaseEntity_Variants_CNV_Table.validations.shouldShowColumnContent('genes', data.cnvGermline, false);
  });

  it('Cytoband', () => {
    CaseEntity_Variants_CNV_Table.validations.shouldShowColumnContent('cytoband', data.cnvGermline, false);
  });

  it('# SNVs', () => {
    CaseEntity_Variants_CNV_Table.validations.shouldShowColumnContent('nb_snv', data.cnvGermline, false);
  });

  it('Variant', () => {
    CaseEntity_Variants_CNV_Table.validations.shouldShowColumnContent('cnv_variant', data.cnvGermline, false);
  });

  it('ClinGen', () => {
    CaseEntity_Variants_CNV_Table.validations.shouldShowColumnContent('clingen', data.cnvGermline, false);
  });

  it('Chr', () => {
    CaseEntity_Variants_CNV_Table.validations.shouldShowColumnContent('chromosome', data.cnvGermline, false);
  });

  it('Start', () => {
    CaseEntity_Variants_CNV_Table.validations.shouldShowColumnContent('start', data.cnvGermline, false);
  });

  it('End', () => {
    CaseEntity_Variants_CNV_Table.validations.shouldShowColumnContent('end', data.cnvGermline, false);
  });

  it('Type', () => {
    CaseEntity_Variants_CNV_Table.validations.shouldShowColumnContent('type', data.cnvGermline, false);
  });

  it('Length', () => {
    CaseEntity_Variants_CNV_Table.validations.shouldShowColumnContent('length', data.cnvGermline, false);
  });

  it('CN', () => {
    CaseEntity_Variants_CNV_Table.validations.shouldShowColumnContent('cn', data.cnvGermline, false);
  });

  it('gnomAD SF', () => {
    CaseEntity_Variants_CNV_Table.validations.shouldShowColumnContent('gnomad_sf', data.cnvGermline, false);
  });

  it('gnomAD AF', () => {
    CaseEntity_Variants_CNV_Table.validations.shouldShowColumnContent('gnomad_af', data.cnvGermline, false);
  });

  it('gnomAD AC', () => {
    CaseEntity_Variants_CNV_Table.validations.shouldShowColumnContent('gnomad_ac', data.cnvGermline, false);
  });

  it('gnomAD SC', () => {
    CaseEntity_Variants_CNV_Table.validations.shouldShowColumnContent('gnomad_sc', data.cnvGermline, false);
  });

  it('# Genes', () => {
    CaseEntity_Variants_CNV_Table.validations.shouldShowColumnContent('nb_genes', data.cnvGermline, false);
  });

  it('GT', () => {
    CaseEntity_Variants_CNV_Table.validations.shouldShowColumnContent('gt', data.cnvGermline, false);
  });

  it('Filter', () => {
    CaseEntity_Variants_CNV_Table.validations.shouldShowColumnContent('filter', data.cnvGermline, false);
  });

  it('Qual.', () => {
    CaseEntity_Variants_CNV_Table.validations.shouldShowColumnContent('quality', data.cnvGermline, false);
  });

  it('BC', () => {
    CaseEntity_Variants_CNV_Table.validations.shouldShowColumnContent('bc', data.cnvGermline, false);
  });

  it('PE', () => {
    CaseEntity_Variants_CNV_Table.validations.shouldShowColumnContent('pe', data.cnvGermline, false);
  });
});
