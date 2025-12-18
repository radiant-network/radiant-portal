/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { CaseEntity_Details } from 'pom/pages/CaseEntity_Details';

describe('CaseEntity - Details - Sequencing - Information displayed', () => {
  const setupTest = () => {
    cy.login();
    cy.visitCaseDetailsPage(data.case.case);
  };

  it('Seq. ID', () => {
    setupTest();
    CaseEntity_Details.sequencingCard.validations.shouldShowColumnContent('seq_id', data.case.seq);
  });

  it('Sample ID', () => {
    setupTest();
    CaseEntity_Details.sequencingCard.validations.shouldShowColumnContent('sample_id', data.case.seq);
  });

  it('Sample Type', () => {
    setupTest();
    CaseEntity_Details.sequencingCard.validations.shouldShowColumnContent('sample_type', data.case.seq);
  });

  it('Histology', () => {
    setupTest();
    CaseEntity_Details.sequencingCard.validations.shouldShowColumnContent('histology', data.case.seq);
  });

  it('Exp. Strat.', () => {
    setupTest();
    CaseEntity_Details.sequencingCard.validations.shouldShowColumnContent('exp_strat', data.case.seq);
  });

  it('Seq Status', () => {
    setupTest();
    CaseEntity_Details.sequencingCard.validations.shouldShowColumnContent('seq_status', data.case.seq);
  });

  it('Last Update', () => {
    setupTest();
    CaseEntity_Details.sequencingCard.validations.shouldShowColumnContent('last_update', data.case.seq);
  });

  it('Actions', () => {
    setupTest();
    CaseEntity_Details.sequencingCard.validations.shouldShowColumnContent('actions', data.case.seq);
  });
});
