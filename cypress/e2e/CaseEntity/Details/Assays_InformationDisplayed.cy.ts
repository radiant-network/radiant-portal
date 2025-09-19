/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { CaseEntity_Details } from 'pom/pages/CaseEntity_Details';

describe('CaseEntity - Details - Assays - Information displayed', () => {
  const setupTest = () => {
    cy.login();
    cy.visitCaseDetailsPage(data.case.case);
  };

  it('Assay ID', () => {
    setupTest();
    CaseEntity_Details.assaysCard.validations.shouldShowColumnContent('assay_id', data.case.assay);
  });

  it('Sample ID', () => {
    setupTest();
    CaseEntity_Details.assaysCard.validations.shouldShowColumnContent('sample_id', data.case.assay);
  });

  it('Sample Type', () => {
    setupTest();
    CaseEntity_Details.assaysCard.validations.shouldShowColumnContent('sample_type', data.case.assay);
  });

  it('Histology', () => {
    setupTest();
    CaseEntity_Details.assaysCard.validations.shouldShowColumnContent('histology', data.case.assay);
  });

  it('Exp. Strat.', () => {
    setupTest();
    CaseEntity_Details.assaysCard.validations.shouldShowColumnContent('exp_strat', data.case.assay);
  });

  it('Assay Status', () => {
    setupTest();
    CaseEntity_Details.assaysCard.validations.shouldShowColumnContent('assay_status', data.case.assay);
  });

  it('Last Update', () => {
    setupTest();
    CaseEntity_Details.assaysCard.validations.shouldShowColumnContent('last_update', data.case.assay);
  });

  it('Actions', () => {
    setupTest();
    CaseEntity_Details.assaysCard.validations.shouldShowColumnContent('actions', data.case.assay);
  });
});
