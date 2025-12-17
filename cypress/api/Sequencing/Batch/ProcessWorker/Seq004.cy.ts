/// <reference types="cypress"/>
import { apiMessages } from '@/apiMessages';

describe('Sequencing - Batch - Process worker - Seq004', () => {
  let response: any;
  let batch_id: string;

  before(() => {
    const Auth = Cypress.env('globalData').Authorization;
    const body: string = `{
      "sequencing_experiments": [
        {
          "aliquot": "NA12878_NA12878",
          "sample_organization_code": "CQGC",
          "submitter_sample_id": "S13224",
          "experimental_strategy_code": "wxs",
          "sequencing_read_technology_code": "long_read",
          "platform_code": "Cypress",
          "sequencing_lab_code": "CQGC",
          "capture_kit": "Cypress",
          "run_alias": "Cypress",
          "run_date": "2025-01-01T00:00:00Z",
          "run_name": "Cypress",
          "status_code": "submitted"
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
    cy.validateSummary(response, 0 /*created*/, 0 /*updated*/, 1 /*skipped*/, 0 /*errors*/);
  });

  it('Validate report warn count', () => {
    expect(Object.keys(response.body.report.warn)).to.have.lengthOf(8);
  });

  it('Validate report sequencing_experiment[0] status_code', () => {
    cy.validateReport(response, 'warn', 'SEQ-004', apiMessages.ProcessWorkerErrorDiffField('sequencing', 'status_code', 'completed', 'submitted', 'CQGC', 'S13224', 'NA12878_NA12878'), 'sequencing_experiment[0]');
  });

  it('Validate report sequencing_experiment[0] experimental_strategy_code', () => {
    cy.validateReport(response, 'warn', 'SEQ-004', apiMessages.ProcessWorkerErrorDiffField('sequencing', 'experimental_strategy_code', 'wgs', 'wxs', 'CQGC', 'S13224', 'NA12878_NA12878'), 'sequencing_experiment[0]');
  });

  it('Validate report sequencing_experiment[0] sequencing_read_technology_code', () => {
    cy.validateReport(response, 'warn', 'SEQ-004', apiMessages.ProcessWorkerErrorDiffField('sequencing', 'sequencing_read_technology_code', 'short_read', 'long_read', 'CQGC', 'S13224', 'NA12878_NA12878'), 'sequencing_experiment[0]');
  });

  it('Validate report sequencing_experiment[0] platform_code', () => {
    cy.validateReport(response, 'warn', 'SEQ-004', apiMessages.ProcessWorkerErrorDiffField('sequencing', 'platform_code', 'illumina', 'Cypress', 'CQGC', 'S13224', 'NA12878_NA12878'), 'sequencing_experiment[0]');
  });

  it('Validate report sequencing_experiment[0] run_name', () => {
    cy.validateReport(response, 'warn', 'SEQ-004', apiMessages.ProcessWorkerErrorDiffField('sequencing', 'run_name', '1617', 'Cypress', 'CQGC', 'S13224', 'NA12878_NA12878'), 'sequencing_experiment[0]');
  });

  it('Validate report sequencing_experiment[0] run_alias', () => {
    cy.validateReport(response, 'warn', 'SEQ-004', apiMessages.ProcessWorkerErrorDiffField('sequencing', 'run_alias', 'A00516_0169', 'Cypress', 'CQGC', 'S13224', 'NA12878_NA12878'), 'sequencing_experiment[0]');
  });

  it('Validate report sequencing_experiment[0] capture_kit', () => {
    cy.validateReport(response, 'warn', 'SEQ-004', apiMessages.ProcessWorkerErrorDiffField('sequencing', 'capture_kit', '', 'Cypress', 'CQGC', 'S13224', 'NA12878_NA12878'), 'sequencing_experiment[0]');
  });

  it('Validate report sequencing_experiment[0] run_date [SJRA-1064]', () => {
    cy.validateReport(response, 'warn', 'SEQ-004', apiMessages.ProcessWorkerErrorDiffField('sequencing', 'run_date', '2025-01-01 00:00:00 +0000 UTC', '2021-08-17 00:00:00 +0000 UTC', 'CQGC', 'S13224', 'NA12878_NA12878'), 'sequencing_experiment[0]');
  });
});
