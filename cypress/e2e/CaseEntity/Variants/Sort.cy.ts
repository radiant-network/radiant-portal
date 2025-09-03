/// <reference types="cypress"/>
import '../../../support/commands';
import { VariantsTable } from '../../../pom/pages/VariantsTable';

describe('Case Entity - Variants - Sort', () => {
  const setupTest = () => {
    cy.login();
    cy.visitCaseVariantsPage('1');
  };

  it('Api request [SJRA-661]', () => {
    setupTest();
    VariantsTable.validations.shouldRequestOnSort('variant');
  });

  it('Alphanumeric', () => {
    setupTest();
    VariantsTable.validations.shouldSortColumn('variant');
  });

  // Activate after SJRA-661
  it.skip('Number', () => {
    setupTest();
    VariantsTable.validations.shouldSortColumn('exomiser');
  });

  it('Tag', () => {
    setupTest();
    VariantsTable.validations.shouldSortColumn('acmg_exomiser');
  });

  // Activate after SJRA-661
  it.skip('Scientific number', () => {
    setupTest();
    VariantsTable.validations.shouldSortColumn('gnomad');
  });

  it('Multiple [SJRA-661]', () => {
    setupTest();
    VariantsTable.actions.unsortAllColumns();
    VariantsTable.actions.sortColumn('gnomad');
    VariantsTable.actions.sortColumn('type');
    VariantsTable.validations.shouldHaveFirstRowValue('Deletion', 'type');
  });
});
