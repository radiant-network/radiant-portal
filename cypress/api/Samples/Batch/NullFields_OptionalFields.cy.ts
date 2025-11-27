/// <reference types="cypress"/>

describe('Samples - Batch - Null fields - Optional fields', () => {
  let response: any;

  before(() => {
    const Auth = Cypress.env('globalData').Authorization;
    const body: string = `{
      "samples": [
        {
          "submitter_patient_id": "Cypress0001",
          "patient_organization_code": "MR",
          "type_code": "a",
          "submitter_parent_sample_id": null,
          "tissue_site": null,
          "histology_code": "normal",
          "submitter_sample_id": "Cypress0001",
          "sample_organization_code": "MR"
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
    cy.validateAcceptedBatchResponse(response, 'sample');
  });
});
