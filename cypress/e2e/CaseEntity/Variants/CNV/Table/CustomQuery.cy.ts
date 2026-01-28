/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { CaseEntity_Variants_CNV_Table } from 'pom/pages/CaseEntity_Variants_CNV_Table';

describe('Case Entity - Variants - CNV - Table - Custom query', () => {
  const setupTest = () => {
    cy.login();
    cy.visitCaseVariantsPage(data.case.case, 'CNV');
  };

  it('Save icon', () => {
    setupTest();
    CaseEntity_Variants_CNV_Table.validations.shouldHaveCustomQuery();
  });
});
