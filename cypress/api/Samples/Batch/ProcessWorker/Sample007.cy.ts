/// <reference types="cypress"/>
import { apiMessages } from '@/apiMessages';

describe('Samples - Batch - Process worker - Sample007', () => {
  let response: any;
  let batch_id: string;

  before(() => {
    const Auth = Cypress.env('globalData').Authorization;
    const body: string = `{
      "samples": [
        {
          "submitter_patient_id": "MRN-283775",
          "patient_organization_code": "CHUSJ",
          "type_code": "dna",
          "submitter_parent_sample_id": "S13227",
          "histology_code": "normal",
          "submitter_sample_id": "Cypress0001",
          "sample_organization_code": "CQGC"
        }
      ]
    }`;

    cy.apiCall('POST', 'samples/batch?dry_run=true', body, Auth.token)
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

  it('Validate report sample[0] submitter_parent_sample_id', () => {
    cy.validateReport(response, 'error', 'SAMPLE-007', apiMessages.ProcessWorkerErrorNotSamePatient('sample', 'submitter_parent_sample_id', 'CQGC', 'Cypress0001', 'S13227'), 'sample[0].submitter_parent_sample_id');
  });
});
