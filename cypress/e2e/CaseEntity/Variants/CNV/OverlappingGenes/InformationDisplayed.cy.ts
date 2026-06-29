/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { CaseEntity_Variants_CNV_Table } from 'pom/pages/CaseEntity_Variants_CNV_Table';
import { OverlappingGenesModal } from 'pom/pages/OverlappingGenesModal';

describe('Case Entity - Variants - CNV - Overlapping Genes - Information displayed', () => {
  const setupTest = () => {
    cy.login();
    cy.visitCaseVariantsPage(data.case.case, data.case.seq.seq_id, 'CNV', data.cnvGermline.sqon);
    CaseEntity_Variants_CNV_Table.actions.clickTableCellLink(data.cnvGermline, 'nb_genes');
    OverlappingGenesModal.validations.shouldModalOpen();
  };

  it('Gene', () => {
    setupTest();
    OverlappingGenesModal.validations.shouldShowColumnContent('gene', data.cnvOverlappingGenes);
  });

  it('Cytoband', () => {
    setupTest();
    OverlappingGenesModal.validations.shouldShowColumnContent('cytoband', data.cnvOverlappingGenes);
  });

  it('ClinGen', () => {
    setupTest();
    OverlappingGenesModal.validations.shouldShowColumnContent('clingen', data.cnvOverlappingGenes);
  });

  it('Length', () => {
    setupTest();
    OverlappingGenesModal.validations.shouldShowColumnContent('length', data.cnvOverlappingGenes);
  });

  it('# Bases', () => {
    setupTest();
    OverlappingGenesModal.validations.shouldShowColumnContent('nb_overlap_bases', data.cnvOverlappingGenes);
  });

  it('# Exons', () => {
    setupTest();
    OverlappingGenesModal.validations.shouldShowColumnContent('nb_exons', data.cnvOverlappingGenes);
  });

  it('% Gene', () => {
    setupTest();
    OverlappingGenesModal.validations.shouldShowColumnContent('overlapping_gene_percent', data.cnvOverlappingGenes);
  });

  it('% CNV', () => {
    setupTest();
    OverlappingGenesModal.validations.shouldShowColumnContent('overlapping_cnv_percent', data.cnvOverlappingGenes);
  });

  it('Type', () => {
    setupTest();
    OverlappingGenesModal.validations.shouldShowColumnContent('overlap_type', data.cnvOverlappingGenes);
  });
});
