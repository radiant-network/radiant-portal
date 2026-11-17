/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { CaseEntity_Variants_CNV_Table } from 'pom/pages/CaseEntity_Variants_CNV_Table';
import { OverlappingGenesModal } from 'pom/pages/OverlappingGenesModal';

// Read-only checks: set the page up once and share it between tests.
describe('Case Entity - Variants - Germline - CNV - Overlapping Genes - Information displayed', { testIsolation: false }, () => {
  before(() => {
    cy.login();
    cy.visitCaseVariantsPage(data.case.case, data.case.seq.seq_id, 'CNV', data.cnvGermline.sqon);
    CaseEntity_Variants_CNV_Table.actions.clickTableCellLink(data.cnvGermline, 'nb_genes');
    OverlappingGenesModal.validations.shouldModalOpen();
  });

  it('Gene', () => {
    OverlappingGenesModal.validations.shouldShowColumnContent('gene', data.cnvOverlappingGenes);
  });

  it('RefSeq', () => {
    OverlappingGenesModal.validations.shouldShowColumnContent('refseq_transcript_id', data.cnvOverlappingGenes);
  });

  it('Cytoband', () => {
    OverlappingGenesModal.validations.shouldShowColumnContent('cytoband', data.cnvOverlappingGenes);
  });

  it('ClinGen', () => {
    OverlappingGenesModal.validations.shouldShowColumnContent('clingen', data.cnvOverlappingGenes);
  });

  it('Length', () => {
    OverlappingGenesModal.validations.shouldShowColumnContent('length', data.cnvOverlappingGenes);
  });

  it('# Bases', () => {
    OverlappingGenesModal.validations.shouldShowColumnContent('nb_overlap_bases', data.cnvOverlappingGenes);
  });

  it('# Exons', () => {
    OverlappingGenesModal.validations.shouldShowColumnContent('nb_exons', data.cnvOverlappingGenes);
  });

  it('% Gene', () => {
    OverlappingGenesModal.validations.shouldShowColumnContent('overlapping_gene_percent', data.cnvOverlappingGenes);
  });

  it('% CNV', () => {
    OverlappingGenesModal.validations.shouldShowColumnContent('overlapping_cnv_percent', data.cnvOverlappingGenes);
  });

  it('Type', () => {
    OverlappingGenesModal.validations.shouldShowColumnContent('overlap_type', data.cnvOverlappingGenes);
  });
});
