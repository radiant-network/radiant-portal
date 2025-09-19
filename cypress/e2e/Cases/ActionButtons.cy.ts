/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { CasesTable } from 'pom/pages/CasesTable';
import { CaseEntity_Variants } from 'pom/pages/CaseEntity_Variants';
import { CaseEntity_Details } from 'pom/pages/CaseEntity_Details';

describe('Cases - Action Buttons', () => {
  const setupTest = () => {
    cy.login();
    cy.visitCasesPage(data.case.search_criteria);
    CasesTable.actions.showAllColumns();
  };

  it('View Case', () => {
    setupTest();
    CasesTable.actions.selectAction(data.case, 'Case');
    CaseEntity_Details.validations.shouldHaveTitle(data.case);
  });

  it('View Variants', () => {
    setupTest();
    CasesTable.actions.selectAction(data.case, 'Variants');
    CaseEntity_Variants.validations.shouldHaveTitle(data.case);
    CaseEntity_Variants.validations.shouldHaveActiveTab();
  });
});
