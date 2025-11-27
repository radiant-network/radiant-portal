/// <reference types="cypress"/>
import { apiMessages } from '@/apiMessages';

describe('Sequencing - Batch - Blank fields - String fields', () => {
  let response: any;

  before(() => {
    const Auth = Cypress.env('globalData').Authorization;
    const body: string = `{
      "sequencing_experiments": [
        {
          "aliquot": "",
          "sample_organization_code": "",
          "submitter_sample_id": "",
          "experimental_strategy_code": "",
          "sequencing_read_technology_code": "",
          "platform_code": "",
          "sequencing_lab_code": "",
          "run_name": "",
          "status_code": ""
        }
      ]
    }`;

    cy.apiCall('POST', 'sequencing/batch?dry_run=true', body, Auth.token).then(res => {
      response = res;
    });
  });

  it('Request status', () => {
    expect(response.status).to.eq(400);
  });

  it('Message', () => {
    cy.validateMessage(response, apiMessages.ImmediateError('CreateSequencingExperimentBatchBody.SequencingExperiments[0]', 'Aliquot', 'required'));
    cy.validateMessage(response, apiMessages.ImmediateError('CreateSequencingExperimentBatchBody.SequencingExperiments[0]', 'SampleOrganizationCode', 'required'));
    cy.validateMessage(response, apiMessages.ImmediateError('CreateSequencingExperimentBatchBody.SequencingExperiments[0]', 'SubmitterSampleId', 'required'));
    cy.validateMessage(response, apiMessages.ImmediateError('CreateSequencingExperimentBatchBody.SequencingExperiments[0]', 'ExperimentalStrategyCode', 'required'));
    cy.validateMessage(response, apiMessages.ImmediateError('CreateSequencingExperimentBatchBody.SequencingExperiments[0]', 'SequencingReadTechnologyCode', 'required'));
    cy.validateMessage(response, apiMessages.ImmediateError('CreateSequencingExperimentBatchBody.SequencingExperiments[0]', 'PlatformCode', 'required'));
    cy.validateMessage(response, apiMessages.ImmediateError('CreateSequencingExperimentBatchBody.SequencingExperiments[0]', 'SequencingLabCode', 'required'));
    cy.validateMessage(response, apiMessages.ImmediateError('CreateSequencingExperimentBatchBody.SequencingExperiments[0]', 'StatusCode', 'required'));
  });
});
