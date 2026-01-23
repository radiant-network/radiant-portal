/// <reference types="cypress"/>
import 'support/commands';
import { CaseEntity_Details } from 'pom/pages/CaseEntity_Details';
import { data } from 'pom/shared/Data';

describe('CaseEntity - Details - Bioinformatics - Columns', () => {
  const setupTest = () => {
    cy.login();
    cy.visitCaseDetailsPage(data.case.case);
  };

  it('Default display', () => {
    setupTest();
    CaseEntity_Details.bioinformaticsCard.validations.shouldMatchDefaultColumnVisibility();
  });

  it('Order', () => {
    setupTest();
    CaseEntity_Details.bioinformaticsCard.validations.shouldShowAllColumns();
  });

  it('Pin', () => {
    setupTest();
    CaseEntity_Details.bioinformaticsCard.validations.shouldShowPinnableColumns();
  });

  it('Default pin state', () => {
    setupTest();
    CaseEntity_Details.bioinformaticsCard.validations.shouldMatchDefaultPinnedColumns();
  });

  it('Sort', () => {
    setupTest();
    CaseEntity_Details.bioinformaticsCard.validations.shouldShowSortableColumns();
  });

  it('Tooltip', () => {
    setupTest();
    CaseEntity_Details.bioinformaticsCard.validations.shouldShowColumnTooltips();
  });
});
