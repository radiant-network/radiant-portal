/// <reference types="cypress"/>
import 'support/commands';
import { CaseEntity_Variants } from 'pom/pages/CaseEntity_Variants';

describe('Case Entity - Variants - Columns', () => {
  const setupTest = () => {
    cy.login();
    cy.visitCaseVariantsPage('1');
  };

  it('Default display', () => {
    setupTest();
    CaseEntity_Variants.validations.shouldMatchDefaultColumnVisibility();
  });

  it('Order', () => {
    setupTest();
    CaseEntity_Variants.validations.shouldShowAllColumns();
  });

  it('Sort', () => {
    setupTest();
    CaseEntity_Variants.validations.shouldShowSortableColumns();
  });

  it('Tooltip', () => {
    setupTest();
    CaseEntity_Variants.validations.shouldShowColumnTooltips();
  });

  it('Hide and show column', () => {
    setupTest();
    CaseEntity_Variants.validations.shouldDisplayColumn('type');
    CaseEntity_Variants.actions.hideColumn('type');
    CaseEntity_Variants.validations.shouldNotDisplayColumn('type');
    CaseEntity_Variants.actions.showColumn('type');
    CaseEntity_Variants.validations.shouldDisplayColumn('type');
  });
});
