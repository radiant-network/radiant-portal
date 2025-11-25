/// <reference types="cypress"/>
import { apiMessages } from '@/apiMessages';

describe('Patients - Batch - Invalid values - Enum fields', () => {
  let response: any;

  before(() => {
    const Auth = Cypress.env('globalData').Authorization;
    const body: string = `{
      "patients": [
        {
          "submitter_patient_id": "Cypress0001",
          "submitter_patient_id_type": "MR",
          "patient_organization_code": "Cypress",
          "life_status_code": "InvalidValue",
          "sex_code": "InvalidValue",
          "date_of_birth": "1979-09-19"
        }
      ]
    }`;

    cy.apiCall('POST', 'patients/batch?dry_run=true', body, Auth.token).then(res => {
      response = res;
    });
  });

  it('Request status', () => {
    expect(response.status).to.eq(400);
  });

  it('Message', () => {
    cy.validateMessage(response, apiMessages.ImmediateError('CreatePatientBatchBody.Patients[0]', 'LifeStatusCode', 'oneof'));
    cy.validateMessage(response, apiMessages.ImmediateError('CreatePatientBatchBody.Patients[0]', 'SexCode', 'oneof'));
  });
});
