/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { CaseEntity_Variants_CNV_Table } from 'pom/pages/CaseEntity_Variants_CNV_Table';

describe('Case Entity - Variants - CNV - Table - Request Validation', () => {
  const setupTest = () => {
    cy.login();
  };

  it('Sort', () => {
    setupTest();
    cy.visitCaseVariantsPage(data.case.case, 'CNV');
    CaseEntity_Variants_CNV_Table.validations.shouldRequestOnSort('start');
  });
  
  it('Paging', () => {
    setupTest();
    CaseEntity_Variants_CNV_Table.validations.shouldRequestOnPageChange(data.case);
  });
});
