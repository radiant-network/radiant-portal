/// <reference types="cypress"/>
import 'support/commands';
import { CaseEntity_Variants_SNV_Table } from 'pom/pages/CaseEntity_Variants_SNV_Table';

describe('Case Entity - Variants - SNV - Table - Request Validation', () => {
  const setupTest = () => {
    cy.login();
    cy.visitCaseVariantsPage('1', 'SNV');
  };

  it('Sort', () => {
    setupTest();
    CaseEntity_Variants_SNV_Table.validations.shouldRequestOnSort('variant');
  });
});
