/// <reference types="cypress"/>
import 'support/commands';
import { CasesTable_Filters } from 'pom/pages/CasesTable_Filters';

describe('Cases - Filters - Configuration', () => {
  const setupTest = () => {
    cy.login();
    cy.visitCasesPage();
  };

  it('Default filters', () => {
    setupTest();
    CasesTable_Filters.validations.shouldShowDefaultFilters();
  });

  it('More button', () => {
    setupTest();
    CasesTable_Filters.validations.shouldHaveMoreButton();
  });

  it('Reveal hidden filter', () => {
    setupTest();
    CasesTable_Filters.validations.shouldRevealHiddenFilter('project_code');
  });
});
