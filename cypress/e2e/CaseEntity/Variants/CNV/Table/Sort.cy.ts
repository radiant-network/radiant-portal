/// <reference types="cypress"/>
import { CaseEntity_Variants_CNV_Table } from 'pom/pages/CaseEntity_Variants_CNV_Table';
import 'support/commands';

describe('Case Entity - Variants - CNV - Table - Sort [SJRA-843]', () => {
  const setupTest = () => {
    cy.login();
    cy.visitCaseVariantsPage('1', 'CNV');
  };

  it('Alphanumeric [SJRA-819]', () => {
    setupTest();
    CaseEntity_Variants_CNV_Table.validations.shouldSortColumn('cnv_variant');
  });

  // Activate after SJRA-661
  it.skip('Number', () => {
    setupTest();
    CaseEntity_Variants_CNV_Table.validations.shouldSortColumn('nb_snv');
  });

  // Activate after SJRA-661
  it.skip('Scientific number', () => {
    setupTest();
    CaseEntity_Variants_CNV_Table.validations.shouldSortColumn('gnomad');
  });

  it('Multiple [SJRA-661]', () => {
    setupTest();
    CaseEntity_Variants_CNV_Table.actions.unsortAllColumns();
    CaseEntity_Variants_CNV_Table.actions.sortColumn('type');
    CaseEntity_Variants_CNV_Table.actions.sortColumn('length');
    CaseEntity_Variants_CNV_Table.actions.sortColumn('length');
    CaseEntity_Variants_CNV_Table.validations.shouldHaveFirstRowValue('1008.0 kb', 'length');
  });
});
