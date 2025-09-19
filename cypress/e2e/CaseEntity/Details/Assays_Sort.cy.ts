/// <reference types="cypress"/>
import 'support/commands';
import { CaseEntity_Details } from 'pom/pages/CaseEntity_Details';
import { data } from 'pom/shared/Data';

describe('CaseEntity - Details - Assays - Sort', () => {
  const setupTest = () => {
    cy.login();
    cy.visitCaseDetailsPage(data.case.case);
  };

  it('Number', () => {
    setupTest();
    CaseEntity_Details.assaysCard.validations.shouldSortColumn('assay_id');
  });

  it('Tag', () => {
    setupTest();
    CaseEntity_Details.assaysCard.validations.shouldSortColumn('assay_status');
  });

  it('Date', () => {
    setupTest();
    CaseEntity_Details.assaysCard.validations.shouldSortColumn('last_update');
  });

  it('Multiple', () => {
    setupTest();
    CaseEntity_Details.assaysCard.actions.sortColumn('sample_id');
    CaseEntity_Details.assaysCard.actions.sortColumn('assay_id');
    CaseEntity_Details.assaysCard.actions.sortColumn('assay_id');
    CaseEntity_Details.assaysCard.validations.shouldHaveFirstRowValue('1', 'assay_id');
  });
});
