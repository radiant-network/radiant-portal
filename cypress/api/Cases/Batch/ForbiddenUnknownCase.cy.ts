/// <reference types="cypress"/>
import { apiMessages } from '@/apiMessages';

// The lab and project of Valid.cy.ts, where the account may ingest: only the unknown case refuses the batch.
const body = `{
  "cases": [
    {
      "project_code": "Cypress",
      "submitter_case_id": "NotFoundCase",
      "diagnostic_lab_code": "CHUSJ"
    }
  ]
}`;

describe('Cases - Batch - Forbidden unknown case', () => {
  let responsePatch: any;
  let responsePut: any;

  before(() => {
    const Auth = Cypress.expose('globalData').Authorization;

    cy.apiCall('PATCH', 'cases/batch?dry_run=true', body, Auth.token).then(res => {
      responsePatch = res;
    });
    cy.apiCall('PUT', 'cases/batch?dry_run=true', body, Auth.token).then(res => {
      responsePut = res;
    });
  });

  it('Request status', () => {
    expect(responsePatch.status).to.eq(403);
    expect(responsePut.status).to.eq(403);
  });

  it('Return content', () => {
    expect(responsePatch.body).to.include({ message: apiMessages.Forbidden });
    expect(responsePut.body).to.include({ message: apiMessages.Forbidden });
  });
});

// Skipped: needs a case of a diagnostic lab where the account cannot ingest, and none is known in this tenant.
describe.skip('Cases - Batch - Forbidden case of another lab', () => {
  const caseOfAnotherLab = `{
    "cases": [
      {
        "project_code": "NO_PROJECT_OTHER_LAB",
        "submitter_case_id": "NO_CASE_OTHER_LAB",
        "diagnostic_lab_code": "CHUSJ"
      }
    ]
  }`;
  let response: any;

  before(() => {
    const Auth = Cypress.expose('globalData').Authorization;

    cy.apiCall('PATCH', 'cases/batch?dry_run=true', caseOfAnotherLab, Auth.token).then(res => {
      response = res;
    });
  });

  it('Request status', () => {
    expect(response.status).to.eq(403);
  });
});
