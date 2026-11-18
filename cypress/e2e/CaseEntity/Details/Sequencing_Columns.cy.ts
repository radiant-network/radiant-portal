/// <reference types="cypress"/>
import 'support/commands';
import { setupOnce } from 'support/setupOnce';
import { CaseEntity_Details } from 'pom/pages/CaseEntity_Details';
import { data } from 'pom/shared/Data';

// The tests share one page: each one restores what it changes.
describe('CaseEntity - Details - Sequencing - Columns', { testIsolation: false }, () => {
  // Cypress drops the intercepts before each test: keep the default table preferences on every test.
  beforeEach(() => {
    cy.resetTablePreferences();
  });

  setupOnce(() => {
    cy.login();
    cy.visitCaseDetailsPage(data.case.case);
  });

  it('Default display', () => {
    CaseEntity_Details.sequencingCard.validations.shouldMatchDefaultColumnVisibility();
  });

  it('Order', () => {
    CaseEntity_Details.sequencingCard.validations.shouldShowAllColumns();
  });

  it('Pin', () => {
    CaseEntity_Details.sequencingCard.validations.shouldShowPinnableColumns();
  });

  it('Default pin state', () => {
    CaseEntity_Details.sequencingCard.validations.shouldMatchDefaultPinnedColumns();
  });

  it('Sort', () => {
    CaseEntity_Details.sequencingCard.validations.shouldShowSortableColumns();
  });

  it('Tooltip', () => {
    CaseEntity_Details.sequencingCard.validations.shouldShowColumnTooltips();
  });

  it('Pin and unpin column', () => {
    CaseEntity_Details.sequencingCard.validations.shouldUnpinnedColumn('seq_id');
    CaseEntity_Details.sequencingCard.actions.pinColumn('seq_id');
    CaseEntity_Details.sequencingCard.validations.shouldPinnedColumn('seq_id');
    CaseEntity_Details.sequencingCard.actions.unpinColumn('seq_id');
    CaseEntity_Details.sequencingCard.validations.shouldUnpinnedColumn('seq_id');
  });
});
