/// <reference types="cypress"/>

describe('Samples - Batch - Process worker - Trim', () => {
  let response: any;
  let batch_id: string;

  before(() => {
    const Auth = Cypress.env('globalData').Authorization;
    const body: string = `{
      "samples": [
        {
          "submitter_patient_id": "  MRN-283775  ",
          "patient_organization_code": "CHUSJ",
          "type_code": "dna",
          "submitter_parent_sample_id": "  S13224  ",
          "tissue_site": "  dna  ",
          "histology_code": "normal",
          "submitter_sample_id": "  Cypress0001  ",
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

  it('Return content', () => {
    cy.validateSuccessBatchProcessed(response, 'sample', batch_id);
  });
});
