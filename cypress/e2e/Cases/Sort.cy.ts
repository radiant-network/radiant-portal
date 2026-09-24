/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { CasesTable } from 'pom/pages/CasesTable';

describe('Cases - Sort', () => {
  const setupTest = () => {
    cy.login();
    cy.visitCasesPage();
  };

  it('Alphanumeric', () => {
    setupTest();
    CasesTable.validations.shouldSortColumn('mrn', false /*hasUniqueValues*/, true /*isReverseSorting*/);
  });

  it('Number', () => {
    setupTest();
    CasesTable.validations.shouldSortColumn('case', false /*hasUniqueValues*/, false /*isReverseSorting*/);
  });

  it('Tag', () => {
    setupTest();
    CasesTable.validations.shouldSortColumn('status', false /*hasUniqueValues*/, true /*isReverseSorting*/);
  });

  it('Date', () => {
    setupTest();
    CasesTable.validations.shouldSortColumn('updated_on', true /*hasUniqueValues*/, true /*isReverseSorting*/);
  });

  it('Multiple', () => {
    setupTest();
    CasesTable.actions.sortColumn('analysis');
    CasesTable.actions.sortColumn('mrn');
    CasesTable.actions.sortColumn('mrn');
    CasesTable.validations.shouldHaveFirstRowValue(data.caseSomatic.mrn, 'mrn');
  });
});
