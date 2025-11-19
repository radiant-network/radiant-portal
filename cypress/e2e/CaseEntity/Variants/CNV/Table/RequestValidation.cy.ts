/// <reference types="cypress"/>
import 'support/commands';
import { CaseEntity_Variants_CNV_Table } from 'pom/pages/CaseEntity_Variants_CNV_Table';

describe('Case Entity - Variants - CNV - Table - Request Validation', () => {
  const setupTest = () => {
    cy.login();
    cy.visitCaseVariantsPage('1', 'CNV');
  };

  it('Sort [SJRA-661]', () => {
    setupTest();
    CaseEntity_Variants_CNV_Table.validations.shouldRequestOnSort('start');
  });
});
