/// <reference types="cypress"/>
import { apiMessages } from '@/apiMessages';

describe('Samples - Batch - Process worker - Sample002', () => {
  let response: any;
  let batch_id: string;

  before(() => {
    const Auth = Cypress.env('globalData').Authorization;
    const body: string = `{
      "samples": [
        {
          "submitter_patient_id": "MRN-283775",
          "patient_organization_code": "CHUSJ",
          "type_code": "rna",
          "submitter_parent_sample_id": "S13224",
          "tissue_site": "rna",
          "histology_code": "tumoral",
          "submitter_sample_id": "S13224",
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
    cy.validateSummary(response, 0 /*created*/, 0 /*updated*/, 1 /*skipped*/, 0 /*errors*/);
  });

  it('Validate report warn count', () => {
    expect(Object.keys(response.body.report.warn)).to.have.lengthOf(3);
  });

  it('Validate report sample[0].type_code', () => {
    cy.validateReport(response, 'warn', 'SAMPLE-002', apiMessages.ProcessWorkerErrorDiffField('sample', 'type_code', 'dna', 'rna', 'CQGC', 'S13224'), 'sample[0].type_code');
  });

  it('Validate report sample[0].tissue_site', () => {
    cy.validateReport(response, 'warn', 'SAMPLE-002', apiMessages.ProcessWorkerErrorDiffField('sample', 'tissue_site', '', 'rna', 'CQGC', 'S13224'), 'sample[0].tissue_site');
  });

  it('Validate report sample[0].histology_code', () => {
    cy.validateReport(response, 'warn', 'SAMPLE-002', apiMessages.ProcessWorkerErrorDiffField('sample', 'histology_code', 'normal', 'tumoral', 'CQGC', 'S13224'), 'sample[0].histology_code');
  });
});
