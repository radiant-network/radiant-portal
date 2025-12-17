/// <reference types="cypress"/>
import { apiMessages } from '@/apiMessages';

describe('Sequencing - Batch - Process worker - Seq005', () => {
  let response: any;
  let batch_id: string;

  before(() => {
    const Auth = Cypress.env('globalData').Authorization;
    const body: string = `{
      "sequencing_experiments": [
        {
          "aliquot": "Cypress0001",
          "sample_organization_code": "CHUSJ",
          "submitter_sample_id": "S13224",
          "experimental_strategy_code": "wgs",
          "sequencing_read_technology_code": "short_read",
          "platform_code": "Cypress",
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

  it('Validate summary', () => {
    cy.validateSummary(response, 0 /*created*/, 0 /*updated*/, 0 /*skipped*/, 1 /*errors*/);
  });

  it('Validate report error count', () => {
    expect(Object.keys(response.body.report.error)).to.have.lengthOf(1);
  });

  it('Validate report sequencing_experiment[0]', () => {
    cy.validateReport(response, 'error', 'SEQ-005', apiMessages.Sequencing005('CHUSJ', 'S13224'), 'sequencing_experiment[0]');
  });
});
