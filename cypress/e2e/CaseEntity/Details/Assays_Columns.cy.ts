/// <reference types="cypress"/>
import 'support/commands';
import { CaseEntity_Details } from 'pom/pages/CaseEntity_Details';
import { data } from 'pom/shared/Data';

describe('CaseEntity - Details - Assays - Columns', () => {
  const setupTest = () => {
    cy.login();
    cy.visitCaseDetailsPage(data.case.case);
  };

  it('Default display', () => {
    setupTest();
    CaseEntity_Details.assaysCard.validations.shouldMatchDefaultColumnVisibility();
  });

  it('Order', () => {
    setupTest();
    CaseEntity_Details.assaysCard.validations.shouldShowAllColumns();
  });

  it('Sort', () => {
    setupTest();
    CaseEntity_Details.assaysCard.validations.shouldShowSortableColumns();
  });

  it('Tooltip', () => {
    setupTest();
    CaseEntity_Details.assaysCard.validations.shouldShowColumnTooltips();
  });
});
