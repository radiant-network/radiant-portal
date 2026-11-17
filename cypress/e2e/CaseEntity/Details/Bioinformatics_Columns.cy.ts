/// <reference types="cypress"/>
import 'support/commands';
import { setupOnce } from 'support/setupOnce';
import { CaseEntity_Details } from 'pom/pages/CaseEntity_Details';
import { data } from 'pom/shared/Data';

// The tests share one page: each one restores what it changes.
describe('CaseEntity - Details - Bioinformatics - Columns', { testIsolation: false }, () => {
  // Cypress drops the intercepts before each test: keep the default table preferences on every test.
  beforeEach(() => {
    cy.resetTablePreferences();
  });

  setupOnce(() => {
    cy.login();
    cy.visitCaseDetailsPage(data.case.case);
  });

  it('Default display', () => {
    CaseEntity_Details.bioinformaticsCard.validations.shouldMatchDefaultColumnVisibility();
  });

  it('Order', () => {
    CaseEntity_Details.bioinformaticsCard.validations.shouldShowAllColumns();
  });

  it('Pin', () => {
    CaseEntity_Details.bioinformaticsCard.validations.shouldShowPinnableColumns();
  });

  it('Default pin state', () => {
    CaseEntity_Details.bioinformaticsCard.validations.shouldMatchDefaultPinnedColumns();
  });

  it('Sort', () => {
    CaseEntity_Details.bioinformaticsCard.validations.shouldShowSortableColumns();
  });

  it('Tooltip', () => {
    CaseEntity_Details.bioinformaticsCard.validations.shouldShowColumnTooltips();
  });
});
