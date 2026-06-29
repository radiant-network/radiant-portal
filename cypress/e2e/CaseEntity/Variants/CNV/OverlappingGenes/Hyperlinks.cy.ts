/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { CaseEntity_Variants_CNV_Table } from 'pom/pages/CaseEntity_Variants_CNV_Table';
import { OverlappingGenesModal } from 'pom/pages/OverlappingGenesModal';

describe('Case Entity - Variants - CNV - Overlapping Genes - Hyperlinks', () => {
  const setupTest = () => {
    cy.login();
    cy.visitCaseVariantsPage(data.case.case, data.case.seq.seq_id, 'CNV', data.cnvGermline.sqon);
    CaseEntity_Variants_CNV_Table.actions.clickTableCellLink(data.cnvGermline, 'nb_genes');
    OverlappingGenesModal.validations.shouldModalOpen();
  };

  it('Gene', () => {
    setupTest();
    OverlappingGenesModal.validations.shouldHaveTableCellLink(data.cnvOverlappingGenes, 'gene');
  });

  it('ClinGen', () => {
    setupTest();
    OverlappingGenesModal.validations.shouldHaveTableCellLink(data.cnvOverlappingGenes, 'clingen');
  });
});
