/// <reference types="cypress"/>
import 'support/commands';
import { CasesTable_Filters } from 'pom/pages/CasesTable_Filters';

describe('Cases - Filters - Request Validation', () => {
  const setupTest = () => {
    cy.login();
    cy.visitCasesPage();
  };

  it('Filter criteria', () => {
    setupTest();
    CasesTable_Filters.validations.shouldRequestOnFilterSelect('priority_code');
  });

  it('Multiple filters', () => {
    setupTest();
    CasesTable_Filters.validations.shouldRequestMultipleFilters('priority_code', 'status_code');
  });

  it('Mapped field', () => {
    setupTest();
    CasesTable_Filters.actions.revealHiddenFilter('life_status_code');
    CasesTable_Filters.validations.shouldRequestOnFilterSelect('life_status_code');
  });
});
