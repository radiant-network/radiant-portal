/// <reference types="cypress"/>
import '../../../support/commands';
import { VariantsTable } from '../../../pom/pages/VariantsTable';

describe('Case Entity - Variants - Columns', () => {
  const setupTest = () => {
    cy.login();
    cy.visitCaseVariantsPage('1');
  };

  it('Default display', () => {
    setupTest();
    VariantsTable.validations.shouldMatchDefaultColumnVisibility();
  });

  it('Order', () => {
    setupTest();
    VariantsTable.validations.shouldShowAllColumns();
  });

  it('Sort', () => {
    setupTest();
    VariantsTable.validations.shouldShowSortableColumns();
  });

  // TODO: Test no tooltip
  it.skip('Tooltip', () => {
    setupTest();
    VariantsTable.validations.shouldShowColumnTooltips();
  });

  it('Hide and show column', () => {
    setupTest();
    VariantsTable.validations.shouldDisplayColumn('type');
    VariantsTable.actions.hideColumn('type');
    VariantsTable.validations.shouldNotDisplayColumn('type');
    VariantsTable.actions.showColumn('type');
    VariantsTable.validations.shouldDisplayColumn('type');
  });
});
