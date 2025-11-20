/// <reference types="cypress"/>
import { apiMessages } from '@/apiMessages';

describe('Samples - Batch - Null fields - String fields', () => {
  let response: any;

  before(() => {
    const Auth = Cypress.env('globalData').Authorization;
    const body: string = `{
      "samples": [
        {
          "organization_patient_id": null,
          "organization_code": null,
          "type_code": null,
          "histology_code": null,
          "submitter_sample_id": null,
          "submitter_organization_code": null
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
    cy.validateMessage(response, apiMessages.ImmediateError('CreateSampleBatchBody.Samples[0]', 'OrganizationPatientId', 'required'));
    cy.validateMessage(response, apiMessages.ImmediateError('CreateSampleBatchBody.Samples[0]', 'OrganizationCode', 'required'));
    cy.validateMessage(response, apiMessages.ImmediateError('CreateSampleBatchBody.Samples[0]', 'TypeCode', 'required'));
    cy.validateMessage(response, apiMessages.ImmediateError('CreateSampleBatchBody.Samples[0]', 'HistologyCode', 'required'));
    cy.validateMessage(response, apiMessages.ImmediateError('CreateSampleBatchBody.Samples[0]', 'SubmitterSampleId', 'required'));
    cy.validateMessage(response, apiMessages.ImmediateError('CreateSampleBatchBody.Samples[0]', 'SubmitterOrganizationCode', 'required'));
  });
});
