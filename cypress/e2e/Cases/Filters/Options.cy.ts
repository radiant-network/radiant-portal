/// <reference types="cypress"/>
import 'support/commands';
import { CasesTable_Filters } from 'pom/pages/CasesTable_Filters';

describe('Cases - Filters - Options', () => {
  const setupTest = () => {
    cy.login();
    cy.intercept('GET', '**/cases/filters*').as('getCasesFilters');
    cy.visitCasesPage();
  };

  it('Render options from API', () => {
    setupTest();
    CasesTable_Filters.validations.shouldRenderApiOptions('@getCasesFilters', 'priority_code');
  });

  it('Key-label options', () => {
    setupTest();
    CasesTable_Filters.actions.revealHiddenFilter('project_code');
    CasesTable_Filters.validations.shouldRenderKeyLabelOptions('project_code');
  });
});
