/// <reference types="cypress"/>
import 'support/commands';
import { setupOnce } from 'support/setupOnce';
import { data } from 'pom/shared/Data';
import { CaseEntity_Variants_CNV_Table } from 'pom/pages/CaseEntity_Variants_CNV_Table';
import { CaseEntity_Variants_SavedFilters } from 'pom/pages/CaseEntity_Variants_SavedFilters';

// Read-only checks: set the page up once and share it between tests.
describe('Case Entity - Variants - Germline - CNV - Table - Information displayed', { testIsolation: false }, () => {
  setupOnce(() => {
    cy.login();
    cy.resetTablePreferences();
    cy.visitCaseVariantsPage(data.case.case, data.case.seq.seq_id, 'CNV', data.cnvGermline.sqon);
    CaseEntity_Variants_SavedFilters.cnv.actions.selectFilterInDropdown('Cypress_All_Variants'); // Clean Query Builder
    CaseEntity_Variants_CNV_Table.actions.showAllColumns();
  });

  it('Genes', () => {
    CaseEntity_Variants_CNV_Table.validations.shouldShowColumnContent('genes', data.cnvGermline);
  });

  it('Cytoband', () => {
    CaseEntity_Variants_CNV_Table.validations.shouldShowColumnContent('cytoband', data.cnvGermline);
  });

  it('# SNVs', () => {
    CaseEntity_Variants_CNV_Table.validations.shouldShowColumnContent('nb_snv', data.cnvGermline);
  });

  it('Variant', () => {
    CaseEntity_Variants_CNV_Table.validations.shouldShowColumnContent('cnv_variant', data.cnvGermline);
  });

  it('ClinGen', () => {
    CaseEntity_Variants_CNV_Table.validations.shouldShowColumnContent('clingen', data.cnvGermline);
  });

  it('Chr', () => {
    CaseEntity_Variants_CNV_Table.validations.shouldShowColumnContent('chromosome', data.cnvGermline);
  });

  it('Start', () => {
    CaseEntity_Variants_CNV_Table.validations.shouldShowColumnContent('start', data.cnvGermline);
  });

  it('End', () => {
    CaseEntity_Variants_CNV_Table.validations.shouldShowColumnContent('end', data.cnvGermline);
  });

  it('Type', () => {
    CaseEntity_Variants_CNV_Table.validations.shouldShowColumnContent('type', data.cnvGermline);
  });

  it('Length', () => {
    CaseEntity_Variants_CNV_Table.validations.shouldShowColumnContent('length', data.cnvGermline);
  });

  it('CN', () => {
    CaseEntity_Variants_CNV_Table.validations.shouldShowColumnContent('cn', data.cnvGermline);
  });

  it('gnomAD SF', () => {
    CaseEntity_Variants_CNV_Table.validations.shouldShowColumnContent('gnomad_sf', data.cnvGermline);
  });

  it('gnomAD AF', () => {
    CaseEntity_Variants_CNV_Table.validations.shouldShowColumnContent('gnomad_af', data.cnvGermline);
  });

  it('gnomAD AC', () => {
    CaseEntity_Variants_CNV_Table.validations.shouldShowColumnContent('gnomad_ac', data.cnvGermline);
  });

  it('gnomAD SC', () => {
    CaseEntity_Variants_CNV_Table.validations.shouldShowColumnContent('gnomad_sc', data.cnvGermline);
  });

  it('# Genes', () => {
    CaseEntity_Variants_CNV_Table.validations.shouldShowColumnContent('nb_genes', data.cnvGermline);
  });

  it('GT', () => {
    CaseEntity_Variants_CNV_Table.validations.shouldShowColumnContent('gt', data.cnvGermline);
  });

  it('Filter', () => {
    CaseEntity_Variants_CNV_Table.validations.shouldShowColumnContent('filter', data.cnvGermline);
  });

  it('Qual.', () => {
    CaseEntity_Variants_CNV_Table.validations.shouldShowColumnContent('quality', data.cnvGermline);
  });

  it('BC', () => {
    CaseEntity_Variants_CNV_Table.validations.shouldShowColumnContent('bc', data.cnvGermline);
  });

  it('PE', () => {
    CaseEntity_Variants_CNV_Table.validations.shouldShowColumnContent('pe', data.cnvGermline);
  });
});
