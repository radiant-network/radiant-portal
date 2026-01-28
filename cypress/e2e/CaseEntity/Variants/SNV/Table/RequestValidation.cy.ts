/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { CaseEntity_Variants_SNV_Table } from 'pom/pages/CaseEntity_Variants_SNV_Table';

describe('Case Entity - Variants - SNV - Table - Request Validation', () => {
  const setupTest = () => {
    cy.login();
  };

  it('Sort', () => {
    setupTest();
    cy.visitCaseVariantsPage(data.case.case, 'SNV');
    CaseEntity_Variants_SNV_Table.validations.shouldRequestOnSort('variant');
  });

  it('Paging', () => {
    setupTest();
    CaseEntity_Variants_SNV_Table.validations.shouldRequestOnPageChange(data.case);
  });
});
