/// <reference types="cypress"/>
import { apiMessages } from '@/apiMessages';

describe('Samples - Batch - Process worker - Sample006', () => {
  let response: any;
  let batch_id: string;

  before(() => {
    const Auth = Cypress.env('globalData').Authorization;
    const body: string = `{
      "samples": [
        {
          "submitter_patient_id": "MRN-283775",
          "patient_organization_code": "CHUSJ",
          "type_code": "Cypress",
          "tissue_site": "dna!",
          "histology_code": "normal",
          "submitter_sample_id": "1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890!",
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
    expect(Object.keys(response.body.report.error)).to.have.lengthOf(4);
  });

  it('Validate report sample[0] tissue_site', () => {
    cy.validateReport(response, 'error', 'SAMPLE-006', apiMessages.ProcessWorkerErrorRegExpTissue('sample', 'tissue_site', 'CQGC', '1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890!'), 'sample[0].tissue_site');
  });

  it('Validate report sample[0] submitter_sample_id 1', () => {
    cy.validateReport(response, 'error', 'SAMPLE-006', apiMessages.ProcessWorkerErrorRegExpId('sample', 'submitter_sample_id', 'CQGC', '1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890!'), 'sample[0].submitter_sample_id');
  });

  it('Validate report sample[0] submitter_sample_id 2', () => {
    cy.validateReport(response, 'error', 'SAMPLE-006', apiMessages.ProcessWorkerErrorTooLong('sample', 'submitter_sample_id', 'CQGC', '1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890!'), 'sample[0].submitter_sample_id');
  });

  it('Validate report sample[0] type_code', () => {
    cy.validateReport(response, 'error', 'SAMPLE-006', apiMessages.ProcessWorkerErrorOneOfTypeCode('sample', 'type_code', 'CQGC', '1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890!', 'Cypress'), 'sample[0].type_code');
  });
});
