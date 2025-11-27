/// <reference types="cypress"/>

describe('Patients - Batch - Null fields - Optional fields', () => {
  let response: any;

  before(() => {
    const Auth = Cypress.env('globalData').Authorization;
    const body: string = `{
      "patients": [
        {
          "submitter_patient_id": "Cypress0001",
          "submitter_patient_id_type": "MR",
          "patient_organization_code": "Cypress",
          "first_name": null,
          "last_name": null,
          "jhn": null,
          "life_status_code": "alive",
          "sex_code": "male",
          "date_of_birth": "1979-09-19"
        }
      ]
    }`;

    cy.apiCall('POST', 'patients/batch?dry_run=true', body, Auth.token).then(res => {
      response = res;
    });
  });

  it('Request status', () => {
    expect(response.status).to.eq(202);
  });

  it('Return content', () => {
    cy.validateAcceptedBatchResponse(response, 'patient');
  });
});
