/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { CaseEntity_Variants_CNV_Table } from 'pom/pages/CaseEntity_Variants_CNV_Table';

describe('Case Entity - Variants - CNV - Table - Hyperlinks', () => {
  const setupTest = () => {
    cy.login();
    cy.visitCaseVariantsPage(data.case.case, 'CNV', data.cnvGermline.sqon);
    CaseEntity_Variants_CNV_Table.actions.showAllColumns();
  };

  it('Genes', () => {
    setupTest();
    CaseEntity_Variants_CNV_Table.actions.clickTableCellLink(data.cnvGermline, 'genes');
    CaseEntity_Variants_CNV_Table.validations.shouldOverlappingModalOpen();
  });

  it('Cytoband', () => {
    setupTest();
    CaseEntity_Variants_CNV_Table.actions.clickTableCellLink(data.cnvGermline, 'cytoband');
    CaseEntity_Variants_CNV_Table.validations.shouldOverlappingModalOpen();
  });

  it('Variant', () => {
    setupTest();
    CaseEntity_Variants_CNV_Table.validations.shouldHaveTableCellLink(data.cnvGermline, 'cnv_variant');
  });

  it('ClinGen', () => {
    setupTest();
    CaseEntity_Variants_CNV_Table.validations.shouldHaveTableCellLink(data.cnvGermline, 'clingen');
  });

  it('# Genes', () => {
    setupTest();
    CaseEntity_Variants_CNV_Table.actions.clickTableCellLink(data.cnvGermline, 'nb_genes');
    CaseEntity_Variants_CNV_Table.validations.shouldOverlappingModalOpen();
  });
});
