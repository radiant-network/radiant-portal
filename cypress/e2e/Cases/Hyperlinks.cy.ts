/// <reference types="cypress"/>
import '../../support/commands';
import { data } from '../../pom/shared/Data';
import { CasesTable } from '../../pom/pages/CasesTable';
import { CaseEntity_Details } from 'pom/pages/CaseEntity_Details';

describe('Cases - Hyperlinks', () => {
  const setupTest = () => {
    cy.login();
    cy.visitCasesPage(data.case.search_criteria);
    CasesTable.actions.showAllColumns();
  };

  it('Case', () => {
    setupTest();
    CasesTable.actions.clickTableCellLink(data.case, 'case');
    CaseEntity_Details.validations.shouldHaveTitle(data.case);
  });

  it('Primary Condition', () => {
    setupTest();
    CasesTable.validations.shouldHaveTableCellLink(data.case, 'primary_condition');
  });
});
