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
          "sequencing_lab_code": "CQGC",
          "run_alias": "A00516_0169",
          "run_date": "2021-08-17T00:00:00Z",
          "run_name": "1617",
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
    cy.validateSummary(response, 0 /*created*/, 0 /*updated*/, 1 /*skipped*/, 0 /*errors*/);
  });

  it('Validate report info count', () => {
    expect(Object.keys(response.body.report.info)).to.have.lengthOf(1);
  });

  it('Validate report sequencing_experiment[0]', () => {
    cy.validateReport(response, 'info', 'SEQ-001', apiMessages.ProcessWorkerError001('Sequencing', 'CQGC', 'S13224', 'NA12878_NA12878'), 'sequencing_experiment[0]');
  });
});
