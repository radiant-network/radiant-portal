/// <reference types="cypress"/>
import '../../../support/commands';
import { VariantsTable } from '../../../pom/pages/VariantsTable';

describe('Case Entity - Variants - Sort', () => {
  const setupTest = () => {
    cy.login();
    cy.visitCaseVariantsPage('1');
  };

  it.skip('Variant', () => {
    setupTest();
    VariantsTable.validations.shouldSortColumn('variant');
  });

  it.skip('Type', () => {
    setupTest();
    VariantsTable.validations.shouldSortColumn('type');
  });

  it.skip('Exo.', () => {
    setupTest();
    VariantsTable.validations.shouldSortColumn('exomiser');
  });

  it.skip('ACMG Exo.', () => {
    setupTest();
    VariantsTable.validations.shouldSortColumn('acmg_exomiser');
  });

  it.skip('gnomAD', () => {
    setupTest();
    VariantsTable.validations.shouldSortColumn('gnomad');
  });

  it.skip('Freq.', () => {
    setupTest();
    VariantsTable.validations.shouldSortColumn('freq');
  });

  it.skip('GQ', () => {
    setupTest();
    VariantsTable.validations.shouldSortColumn('gq');
  });

  it.skip('AD Ratio', () => {
    setupTest();
    VariantsTable.validations.shouldSortColumn('ad_ratio');
  });

  it('Multiple [SJRA-661]', () => {
    setupTest();
    VariantsTable.actions.unsortAllColumns();
    VariantsTable.actions.sortColumn('gnomad');
    VariantsTable.actions.sortColumn('type');
    VariantsTable.validations.shouldHaveFirstRowValue('Deletion', 'type');
  });
});
