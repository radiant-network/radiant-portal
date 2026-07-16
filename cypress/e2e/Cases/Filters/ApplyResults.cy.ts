/// <reference types="cypress"/>
import 'support/commands';
import { CasesTable_Filters } from 'pom/pages/CasesTable_Filters';

describe('Cases - Filters - Apply Results', () => {
  const setupTest = () => {
    cy.login();
    cy.visitCasesPage();
  };

  it('Apply', () => {
    setupTest();
    CasesTable_Filters.validations.shouldChangeResultsOnApply('status_code');
  });

  it('Clear filter', () => {
    setupTest();
    CasesTable_Filters.validations.shouldClearFilter('status_code');
  });

  it('Clear all', () => {
    setupTest();
    CasesTable_Filters.validations.shouldClearAllFilters('status_code');
  });
});
