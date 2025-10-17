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

  it('Pin', () => {
    setupTest();
    CaseEntity_Details.assaysCard.validations.shouldShowPinnableColumns();
  });

  it('Default pin state', () => {
    setupTest();
    CaseEntity_Details.assaysCard.validations.shouldMatchDefaultPinnedColumns();
  });

  it('Sort', () => {
    setupTest();
    CaseEntity_Details.assaysCard.validations.shouldShowSortableColumns();
  });

  it('Tooltip', () => {
    setupTest();
    CaseEntity_Details.assaysCard.validations.shouldShowColumnTooltips();
  });

  it('Pin and unpin column', () => {
    setupTest();
    CaseEntity_Details.assaysCard.validations.shouldUnpinnedColumn('assay_id');
    CaseEntity_Details.assaysCard.actions.pinColumn('assay_id');
    CaseEntity_Details.assaysCard.validations.shouldPinnedColumn('assay_id');
    CaseEntity_Details.assaysCard.actions.unpinColumn('assay_id');
    CaseEntity_Details.assaysCard.validations.shouldUnpinnedColumn('assay_id');
  });
});
