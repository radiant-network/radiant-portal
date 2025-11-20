/// <reference types="cypress"/>
import { apiMessages } from '@/apiMessages';

describe('Samples - Batch - Invalid values - Enum fields', () => {
  let response: any;

  before(() => {
    const Auth = Cypress.env('globalData').Authorization;
    const body: string = `{
      "samples": [
        {
          "organization_patient_id": "Cypress0001",
          "organization_code": "MR",
          "type_code": "a",
          "histology_code": "InvalidValue",
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
    expect(response.status).to.eq(400);
  });

  it('Message', () => {
    cy.validateMessage(response, apiMessages.ImmediateError('CreateSampleBatchBody.Samples[0]', 'HistologyCode', 'oneof'));
  });
});
