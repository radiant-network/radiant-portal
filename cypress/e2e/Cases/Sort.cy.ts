/// <reference types="cypress"/>
import 'support/commands';
import { CasesTable } from 'pom/pages/CasesTable';

describe('Cases - Sort', () => {
  const setupTest = () => {
    cy.login();
    cy.visitCasesPage();
  };

  it('Alphanumeric', () => {
    setupTest();
    CasesTable.validations.shouldSortColumn('mrn');
  });

  it('Number [SJRA-1018]', () => {
    setupTest();
    CasesTable.validations.shouldSortColumn('case');
  });

  it('Tag', () => {
    setupTest();
    CasesTable.validations.shouldSortColumn('status');
  });

  it('Date', () => {
    setupTest();
    CasesTable.validations.shouldSortColumn('updated_on');
  });

  it('Multiple', () => {
    setupTest();
    CasesTable.actions.sortColumn('analysis');
    CasesTable.actions.sortColumn('mrn');
    CasesTable.validations.shouldHaveFirstRowValue('MRN-283782', 'mrn');
  });
});
