/// <reference types="cypress"/>
import 'support/commands';
import { CaseEntity_Variants_CNV } from 'pom/pages/CaseEntity_Variants_CNV';

describe('Case Entity - Variants - CNV - Sort', () => {
  const setupTest = () => {
    cy.login();
    cy.visitCaseVariantsPage('1', 'CNV');
  };

  it('Api request [SJRA-661]', () => {
    setupTest();
    CaseEntity_Variants_CNV.validations.shouldRequestOnSort('start');
  });

  it('Alphanumeric [SJRA-819]', () => {
    setupTest();
    CaseEntity_Variants_CNV.validations.shouldSortColumn('cnv_variant');
  });

  // Activate after SJRA-661
  it.skip('Number', () => {
    setupTest();
    CaseEntity_Variants_CNV.validations.shouldSortColumn('nb_snv');
  });

  // Activate after SJRA-661
  it.skip('Scientific number', () => {
    setupTest();
    CaseEntity_Variants_CNV.validations.shouldSortColumn('gnomad');
  });

  it('Multiple [SJRA-661]', () => {
    setupTest();
    CaseEntity_Variants_CNV.actions.unsortAllColumns();
    CaseEntity_Variants_CNV.actions.sortColumn('type');
    CaseEntity_Variants_CNV.actions.sortColumn('length');
    CaseEntity_Variants_CNV.actions.sortColumn('length');
    CaseEntity_Variants_CNV.validations.shouldHaveFirstRowValue('1008.0 kb', 'length');
  });
});
