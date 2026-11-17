/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { CaseEntity_Details } from 'pom/pages/CaseEntity_Details';

// Read-only checks: set the page up once and share it between tests.
describe('CaseEntity - Details - Sequencing - Information displayed', { testIsolation: false }, () => {
  before(() => {
    cy.login();
    cy.visitCaseDetailsPage(data.case.case);
    CaseEntity_Details.sequencingCard.actions.sortColumn('seq_id');
    CaseEntity_Details.sequencingCard.actions.sortColumn('seq_id');
  });

  it('Seq. ID', () => {
    CaseEntity_Details.sequencingCard.validations.shouldShowColumnContent('seq_id', data.case.seq, false);
  });

  it('Sample ID', () => {
    CaseEntity_Details.sequencingCard.validations.shouldShowColumnContent('sample_id', data.case.seq, false);
  });

  it('Sample Type', () => {
    CaseEntity_Details.sequencingCard.validations.shouldShowColumnContent('sample_type', data.case.seq, false);
  });

  it('Histology', () => {
    CaseEntity_Details.sequencingCard.validations.shouldShowColumnContent('histology', data.case.seq, false);
  });

  it('Exp. Strat.', () => {
    CaseEntity_Details.sequencingCard.validations.shouldShowColumnContent('exp_strat', data.case.seq, false);
  });

  it('Seq Status', () => {
    CaseEntity_Details.sequencingCard.validations.shouldShowColumnContent('seq_status', data.case.seq, false);
  });

  it('Last Update', () => {
    CaseEntity_Details.sequencingCard.validations.shouldShowColumnContent('last_update', data.case.seq, false);
  });

  it('Actions', () => {
    CaseEntity_Details.sequencingCard.validations.shouldShowColumnContent('actions', data.case.seq, false);
  });
});
