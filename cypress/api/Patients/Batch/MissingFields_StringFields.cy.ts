/// <reference types="cypress"/>
import { apiMessages } from '@/apiMessages';

describe('Patients - Batch - Missing fields - String fields', () => {
  let response: any;

  before(() => {
    const Auth = Cypress.env('globalData').Authorization;
    const body: string = `{
      "patients": [
        {
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
    cy.validateMessage(response, apiMessages.ImmediateError('CreatePatientBatchBody.Patients[0]', 'SubmitterPatientId', 'required'));
    cy.validateMessage(response, apiMessages.ImmediateError('CreatePatientBatchBody.Patients[0]', 'SubmitterPatientIdType', 'required'));
    cy.validateMessage(response, apiMessages.ImmediateError('CreatePatientBatchBody.Patients[0]', 'PatientOrganizationCode', 'required'));
    cy.validateMessage(response, apiMessages.ImmediateError('CreatePatientBatchBody.Patients[0]', 'LifeStatusCode', 'required'));
    cy.validateMessage(response, apiMessages.ImmediateError('CreatePatientBatchBody.Patients[0]', 'SexCode', 'required'));
  });
});
