/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { CaseEntity_Details } from 'pom/pages/CaseEntity_Details';

describe('CaseEntity - Details - Sequencing - Action Buttons', () => {
  const setupTest = () => {
    cy.login();
    cy.visitCaseDetailsPage(data.case.case);
  };

  it('Details', () => {
    setupTest();
    CaseEntity_Details.sequencingCard.actions.clickDetailsButton(data.case.seq);
    CaseEntity_Details.validations.shouldHaveSeqDetailsModal(data.case.seq);
  });
});
