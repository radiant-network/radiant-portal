/// <reference types="cypress"/>
import { CaseEntity_Variants_CNV_Table } from 'pom/pages/CaseEntity_Variants_CNV_Table';
import 'support/commands';

describe('Case Entity - Variants - CNV - Table - Custom query [SJRA-843]', () => {
  const setupTest = () => {
    cy.login();
    cy.visitCaseVariantsPage('1', 'CNV');
  };

  it('Save icon', () => {
    setupTest();
    CaseEntity_Variants_CNV_Table.validations.shouldHaveCustomQuery();
  });
});
