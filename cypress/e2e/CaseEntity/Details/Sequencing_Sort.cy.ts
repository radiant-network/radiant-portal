/// <reference types="cypress"/>
import 'support/commands';
import { CaseEntity_Details } from 'pom/pages/CaseEntity_Details';
import { data } from 'pom/shared/Data';

describe('CaseEntity - Details - Sequencing - Sort', () => {
  const setupTest = () => {
    cy.login();
    cy.visitCaseDetailsPage(data.case.case);
  };

  it('Number', () => {
    setupTest();
    CaseEntity_Details.sequencingCard.validations.shouldSortColumn('seq_id');
  });

  it('Tag', () => {
    setupTest();
    CaseEntity_Details.sequencingCard.validations.shouldSortColumn('seq_status');
  });

  it('Date', () => {
    setupTest();
    CaseEntity_Details.sequencingCard.validations.shouldSortColumn('last_update');
  });

  it('Multiple [SJRA-1004]', () => {
    setupTest();
    CaseEntity_Details.sequencingCard.actions.sortColumn('sample_id');
    CaseEntity_Details.sequencingCard.actions.sortColumn('seq_id');
    CaseEntity_Details.sequencingCard.actions.sortColumn('seq_id');
    CaseEntity_Details.sequencingCard.validations.shouldHaveFirstRowValue('3', 'seq_id');
  });
});
