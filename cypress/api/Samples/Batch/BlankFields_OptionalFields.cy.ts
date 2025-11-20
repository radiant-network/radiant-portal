/// <reference types="cypress"/>

describe('Samples - Batch - Blank fields - Optional fields', () => {
  let response: any;

  before(() => {
    const Auth = Cypress.env('globalData').Authorization;
    const body: string = `{
      "samples": [
        {
          "organization_patient_id": "Cypress0001",
          "organization_code": "MR",
          "type_code": "a",
          "parent_submitter_sample_id": "",
          "tissue_site": "",
          "histology_code": "normal",
          "submitter_sample_id": "Cypress0001",
          "submitter_organization_code": "MR"
        }
      ]
    }`;

    cy.apiCall('POST', 'samples/batch?dry_run=true', body, Auth.token).then(res => {
      response = res;
    });
  });

  it('Request status', () => {
    expect(response.status).to.eq(202);
  });

  it('Return content', () => {
    cy.validateAcceptedPatientsBatchResponse(response, 'sample');
  });
});
