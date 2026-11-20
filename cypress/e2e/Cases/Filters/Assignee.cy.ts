/// <reference types="cypress"/>
import 'support/commands';
import { CasesTable_Filters } from 'pom/pages/CasesTable_Filters';

describe('Cases - Filters - Assignee', () => {
  const setupTest = () => {
    cy.login();
    cy.intercept('GET', '**/cases/filters*').as('getCasesFilters');
    cy.visitCasesPage();
  };

  it('Unassigned option first', () => {
    setupTest();
    CasesTable_Filters.validations.shouldShowUnassignedFirst();
  });

  it('Request on select', () => {
    setupTest();
    CasesTable_Filters.validations.shouldRequestOnFilterSelect('assignee_id');
  });

  it('Clear filter', () => {
    setupTest();
    CasesTable_Filters.validations.shouldClearFilter('assignee_id');
  });

  it('My cases switch for assignable user', () => {
    setupTest();
    CasesTable_Filters.validations.shouldShowMyCasesForAssignableUser('@getCasesFilters');
  });
});
