/// <reference types="cypress"/>
import '../../../support/commands';
import { VariantsTable } from '../../../pom/pages/VariantsTable';

beforeEach(() => {
  cy.login();
  cy.visitCaseVariantsPage('1');
  VariantsTable.actions.showAllColumns();
});

describe('Case Entity - Variants - Columns', () => {
  it('Default display', () => {
    VariantsTable.validations.shouldMatchDefaultColumnVisibility();
  });

  it('Order', () => {
    VariantsTable.validations.shouldShowAllColumns();
  });

  it('Sort', () => {
    VariantsTable.validations.shouldShowSortableColumns();
  });

  it('Tooltip', () => {
    VariantsTable.validations.shouldShowColumnTooltips();
  });

  it('Hide a displayed column', () => {
    VariantsTable.validations.shouldDisplayColumn('type');
    VariantsTable.actions.hideColumn('type');
    VariantsTable.validations.shouldNotDisplayColumn('type');
  });

  it('Show a hidden column', () => {
    VariantsTable.validations.shouldNotDisplayColumn('cadd');
    VariantsTable.actions.showColumn('cadd');
    VariantsTable.validations.shouldDisplayColumn('cadd');
  });
});
