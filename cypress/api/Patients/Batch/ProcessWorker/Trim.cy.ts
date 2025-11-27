/// <reference types="cypress"/>

describe('Patients - Batch - Process worker - Trim', () => {
  let response: any;
  let batch_id: string;

  before(() => {
    const Auth = Cypress.env('globalData').Authorization;
    const body: string = `{
      "patients": [
        {
          "submitter_patient_id": "  Cypress0001  ",
          "submitter_patient_id_type": "  MR  ",
          "patient_organization_code": "CHUSJ",
          "first_name": "  Cypress  ",
          "last_name": "  Test  ",
          "jhn": "  Cypress0001  ",
          "life_status_code": "alive",
          "sex_code": "male",
          "date_of_birth": "1979-09-19"
        }
      ]
    }`;

    cy.apiCall('POST', 'patients/batch?dry_run=true', body, Auth.token)
      .then((postRes: any) => {
        batch_id = postRes.body.id;
        return batch_id;
      })
      .then(id => {
        cy.wait(1000);
        cy.apiCall('GET', `batches/${id}`, '', Auth.token);
      })
      .then((getRes: any) => {
        response = getRes;
      });
  });

  it('Request status', () => {
    expect(response.status).to.eq(200);
  });

  it('Return content', () => {
    cy.validateSuccessBatchProcessed(response, 'patient', batch_id);
  });
});
