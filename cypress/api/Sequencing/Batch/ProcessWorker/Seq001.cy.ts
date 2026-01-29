/// <reference types="cypress"/>
import { apiMessages } from '@/apiMessages';

describe('Sequencing - Batch - Process worker - Seq001', () => {
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
          "experimental_strategy_code": "wgs",
          "sequencing_read_technology_code": "short_read",
          "platform_code": "illumina",
          "sequencing_lab_code": "CHUSJ",
          "capture_kit": "Cypress",
          "run_alias": "Cypress",
          "run_date": "2025-01-01T00:00:00Z",
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

  it('Validate summary [SJRA-1133]', () => {
    cy.validateSummary(response, 0 /*created*/, 0 /*updated*/, 1 /*skipped*/, 0 /*errors*/);
  });

  it('Validate report info count [SJRA-1133]', () => {
    expect(Object.keys(response.body.report.info)).to.have.lengthOf(1);
  });

  it('Validate report sequencing_experiment[0] [SJRA-1133]', () => {
    cy.validateReport(response, 'info', 'SEQ-001', apiMessages.ProcessWorkerError001('Sequencing', 'CQGC', 'S13224', 'NA12878_NA12878'), 'sequencing_experiment[0]');
  });
});
