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

  it('Pin', () => {
    setupTest();
    CaseEntity_Variants.validations.shouldShowPinnableColumns();
  });

  it('Default pin state', () => {
    setupTest();
    CaseEntity_Variants.validations.shouldMatchDefaultPinnedColumns();
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

  it('Pin and unpin column', () => {
    setupTest();
    CaseEntity_Variants.validations.shouldUnpinnedColumn('type');
    CaseEntity_Variants.actions.pinColumn('type');
    CaseEntity_Variants.validations.shouldPinnedColumn('type');
    CaseEntity_Variants.actions.unpinColumn('type');
    CaseEntity_Variants.validations.shouldUnpinnedColumn('type');
  });
});
