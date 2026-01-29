/// <reference types="cypress"/>
import { apiMessages } from '@/apiMessages';

describe('Sequencing - Batch - Process worker - Seq002', () => {
  let response: any;
  let batch_id: string;

  before(() => {
    const Auth = Cypress.env('globalData').Authorization;
    const body: string = `{
      "sequencing_experiments": [
        {
          "aliquot": "1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890!",
          "sample_organization_code": "CQGC",
          "submitter_sample_id": "S13224",
          "experimental_strategy_code": "wgs",
          "sequencing_read_technology_code": "short_read",
          "platform_code": "1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890!",
          "sequencing_lab_code": "CHUSJ",
          "capture_kit": "Cypress",
          "run_alias": "Cypress",
          "run_date": "9999-01-01T00:00:00Z",
          "run_name": "Cypress",
          "status_code": "completed"
        }
      ]
    }`;

    cy.apiCall('POST', 'sequencing/batch?dry_run=true', body, Auth.token)
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

  it('Validate summary', () => {
    cy.validateSummary(response, 0 /*created*/, 0 /*updated*/, 0 /*skipped*/, 1 /*errors*/);
  });

  it('Validate report error count', () => {
    expect(Object.keys(response.body.report.error)).to.have.lengthOf(6);
  });

  it('Validate report sequencing_experiment[0] aliquot 1', () => {
    cy.validateReport(response, 'error', 'SEQ-002', apiMessages.ProcessWorkerErrorTooLong('sequencing_experiment', 'aliquot', 'CQGC', 'S13224', '1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890!'), 'sequencing_experiment[0].aliquot');
  });

  it('Validate report sequencing_experiment[0] aliquot 2', () => {
    cy.validateReport(response, 'error', 'SEQ-002', apiMessages.ProcessWorkerErrorRegExpAliquot('sequencing_experiment', 'aliquot', 'CQGC', 'S13224', '1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890!'), 'sequencing_experiment[0].aliquot');
  });

  it('Validate report sequencing_experiment[0] platform_code 1', () => {
    cy.validateReport(response, 'error', 'SEQ-002', apiMessages.ProcessWorkerErrorTooLong('sequencing_experiment', 'platform_code', 'CQGC', 'S13224', '1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890!'), 'sequencing_experiment[0].platform_code');
  });

  it('Validate report sequencing_experiment[0] platform_code 2', () => {
    cy.validateReport(response, 'error', 'SEQ-002', apiMessages.ProcessWorkerErrorRegExpPlatform('sequencing_experiment', 'platform_code', 'CQGC', 'S13224', '1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890!'), 'sequencing_experiment[0].platform_code');
  });

  it('Validate report sequencing_experiment[0] platform_code 3', () => {
    cy.validateReport(response, 'error', 'SEQ-002', apiMessages.ProcessWorkerErrorValueNotAllowed('sequencing_experiment', 'platform_code', 'CQGC', 'S13224', '1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890!'), 'sequencing_experiment[0].platform_code');
  });

  it('Validate report sequencing_experiment[0] run_date', () => {
    cy.validateReport(response, 'error', 'SEQ-002', apiMessages.ProcessWorkerErrorPastDate('sequencing_experiment', 'run_date', 'CQGC', 'S13224', '1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890!'), 'sequencing_experiment[0].run_date');
  });
});
