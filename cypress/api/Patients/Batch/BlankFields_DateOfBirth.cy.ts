/// <reference types="cypress"/>
import { apiMessages } from '@/apiMessages';

describe('Patients - Batch - Blank fields - Date Of Birth', () => {
  let response: any;

  before(() => {
    const Auth = Cypress.env('globalData').Authorization;
    const body: string = `{
      "patients": [
        {
          "organization_patient_id": "Cypress0001",
          "organization_patient_id_type": "MR",
          "organization_code": "Cypress",
          "life_status_code": "alive",
          "sex_code": "male",
          "date_of_birth": ""
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
    cy.validateMessage(response, apiMessages.ParsingError('date of birth'));
  });
});
