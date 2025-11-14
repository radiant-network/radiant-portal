/// <reference types="cypress"/>
import 'support/commands';
import { CasesTable } from 'pom/pages/CasesTable';

describe('Cases - Columns', () => {
  const setupTest = () => {
    cy.login();
    cy.visitCasesPage();
  };

  it('Default display', () => {
    setupTest();
    CasesTable.validations.shouldMatchDefaultColumnVisibility();
  });

  it('Order [SJRA-839]', () => {
    setupTest();
    CasesTable.validations.shouldShowAllColumns();
  });

  it('Pin', () => {
    setupTest();
    CasesTable.validations.shouldShowPinnableColumns();
  });

  it('Default pin state', () => {
    setupTest();
    CasesTable.validations.shouldMatchDefaultPinnedColumns();
  });

  it('Sort', () => {
    setupTest();
    CasesTable.validations.shouldShowSortableColumns();
  });

  it('Tooltip', () => {
    setupTest();
    CasesTable.validations.shouldShowColumnTooltips();
  });

  it('Hide and show column', () => {
    setupTest();
    CasesTable.validations.shouldDisplayColumn('case');
    CasesTable.actions.hideColumn('case');
    CasesTable.validations.shouldNotDisplayColumn('case');
    CasesTable.actions.showColumn('case');
    CasesTable.validations.shouldDisplayColumn('case');
  });

  it('Pin and unpin column', () => {
    setupTest();
    CasesTable.validations.shouldUnpinnedColumn('status');
    CasesTable.actions.pinColumn('status');
    CasesTable.validations.shouldPinnedColumn('status');
    CasesTable.actions.unpinColumn('status');
    CasesTable.validations.shouldUnpinnedColumn('status');
  });
});
