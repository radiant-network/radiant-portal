/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { CasesTable } from 'pom/pages/CasesTable';
import { CaseEntity_Variants_SNV } from 'pom/pages/CaseEntity_Variants_SNV';
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
    CaseEntity_Variants_SNV.validations.shouldHaveTitle(data.case);
    CaseEntity_Variants_SNV.validations.shouldHaveActiveTabAndToggle();
  });
});
