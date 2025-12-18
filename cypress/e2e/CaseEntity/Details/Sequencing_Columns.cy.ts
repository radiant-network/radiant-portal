/// <reference types="cypress"/>
import 'support/commands';
import { CaseEntity_Details } from 'pom/pages/CaseEntity_Details';
import { data } from 'pom/shared/Data';

describe('CaseEntity - Details - Sequencing - Columns', () => {
  const setupTest = () => {
    cy.login();
    cy.visitCaseDetailsPage(data.case.case);
  };

  it('Default display', () => {
    setupTest();
    CaseEntity_Details.sequencingCard.validations.shouldMatchDefaultColumnVisibility();
  });

  it('Order', () => {
    setupTest();
    CaseEntity_Details.sequencingCard.validations.shouldShowAllColumns();
  });

  it('Pin', () => {
    setupTest();
    CaseEntity_Details.sequencingCard.validations.shouldShowPinnableColumns();
  });

  it('Default pin state', () => {
    setupTest();
    CaseEntity_Details.sequencingCard.validations.shouldMatchDefaultPinnedColumns();
  });

  it('Sort', () => {
    setupTest();
    CaseEntity_Details.sequencingCard.validations.shouldShowSortableColumns();
  });

  it('Tooltip', () => {
    setupTest();
    CaseEntity_Details.sequencingCard.validations.shouldShowColumnTooltips();
  });

  it('Pin and unpin column', () => {
    setupTest();
    CaseEntity_Details.sequencingCard.validations.shouldUnpinnedColumn('seq_id');
    CaseEntity_Details.sequencingCard.actions.pinColumn('seq_id');
    CaseEntity_Details.sequencingCard.validations.shouldPinnedColumn('seq_id');
    CaseEntity_Details.sequencingCard.actions.unpinColumn('seq_id');
    CaseEntity_Details.sequencingCard.validations.shouldUnpinnedColumn('seq_id');
  });
});
