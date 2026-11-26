/// <reference types="cypress"/>
import 'support/commands';
import { CasesTable } from 'pom/pages/CasesTable';
import { CasesTable_Filters } from 'pom/pages/CasesTable_Filters';

describe('Cases - Filters - Case Type', () => {
  const setupTest = () => {
    cy.login();
    cy.visitCasesPage();
  };

  it('Request on select', () => {
    setupTest();
    CasesTable_Filters.validations.shouldRequestOnFilterSelect('case_type');
  });

  it('Family germline', () => {
    setupTest();
    CasesTable_Filters.actions.openFilter('case_type');
    CasesTable_Filters.actions.selectOption('case_type', 'germline_family');
    CasesTable.validations.shouldHaveValueOnEveryRow('Family germline', 'type');
  });

  it('Somatic', () => {
    setupTest();
    CasesTable_Filters.actions.openFilter('case_type');
    CasesTable_Filters.actions.selectOption('case_type', 'somatic');
    CasesTable.validations.shouldHaveValueOnEveryRow('Somatic', 'type');
  });
});
