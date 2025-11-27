/// <reference types="cypress"/>
import { apiMessages } from '@/apiMessages';

describe('Sequencing - Batch - Invalid values - Enum fields', () => {
  let response: any;

  before(() => {
    const Auth = Cypress.env('globalData').Authorization;
    const body: string = `{
      "sequencing_experiments": [
        {
          "aliquot": "Cypress0001",
          "sample_organization_code": "Cypress",
          "submitter_sample_id": "Cypress0001",
          "experimental_strategy_code": "InvalidValue",
          "sequencing_read_technology_code": "InvalidValue",
          "platform_code": "Cypress",
          "sequencing_lab_code": "Cypress0001",
          "run_name": "Cypress",
          "status_code": "InvalidValue"
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
    cy.validateMessage(response, apiMessages.ImmediateError('CreateSequencingExperimentBatchBody.SequencingExperiments[0]', 'ExperimentalStrategyCode', 'oneof'));
    cy.validateMessage(response, apiMessages.ImmediateError('CreateSequencingExperimentBatchBody.SequencingExperiments[0]', 'SequencingReadTechnologyCode', 'oneof'));
    cy.validateMessage(response, apiMessages.ImmediateError('CreateSequencingExperimentBatchBody.SequencingExperiments[0]', 'StatusCode', 'oneof'));
  });
});
