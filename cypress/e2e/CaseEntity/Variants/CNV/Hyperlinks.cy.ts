/// <reference types="cypress"/>
import 'support/commands';
import { CaseEntity_Variants_CNV } from 'pom/pages/CaseEntity_Variants_CNV';
import { data } from 'pom/shared/Data';

describe('Case Entity - Variants - CNV - Hyperlinks', () => {
  const setupTest = () => {
    cy.login();
    cy.visitCaseVariantsPage('1', 'CNV', data.cnvGermline.sqon);
    CaseEntity_Variants_CNV.actions.showAllColumns();
  };

  it('Genes', () => {
    setupTest();
    CaseEntity_Variants_CNV.actions.clickTableCellLink(data.cnvGermline, 'genes');
    CaseEntity_Variants_CNV.validations.shouldOverlappingModalOpen();
  });

  it('Cytoband', () => {
    setupTest();
    CaseEntity_Variants_CNV.actions.clickTableCellLink(data.cnvGermline, 'cytoband');
    CaseEntity_Variants_CNV.validations.shouldOverlappingModalOpen();
  });

  it('Variant', () => {
    setupTest();
    CaseEntity_Variants_CNV.validations.shouldHaveTableCellLink(data.cnvGermline, 'cnv_variant');
  });

  it('ClinGen', () => {
    setupTest();
    CaseEntity_Variants_CNV.validations.shouldHaveTableCellLink(data.cnvGermline, 'clingen');
  });

  it('# Genes', () => {
    setupTest();
    CaseEntity_Variants_CNV.actions.clickTableCellLink(data.cnvGermline, 'nb_genes');
    CaseEntity_Variants_CNV.validations.shouldOverlappingModalOpen();
  });
});
