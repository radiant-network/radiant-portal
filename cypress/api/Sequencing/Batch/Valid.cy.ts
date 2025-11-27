/// <reference types="cypress"/>

describe('Sequencing - Batch - Valid', () => {
  let response: any;

  before(() => {
    const Auth = Cypress.env('globalData').Authorization;
    const body: string = `{
      "sequencing_experiments": [
        {
          "aliquot": "/|(){}[]%?&#$!@*:;,.-_",
          "sample_organization_code": "Cypress",
          "submitter_sample_id": "Cypress0001",
          "experimental_strategy_code": "wgs",
          "sequencing_read_technology_code": "short_read",
          "platform_code": "Cypress",
          "sequencing_lab_code": "Cypress0001",
          "capture_kit": "Cypress",
          "run_alias": "Cypress",
          "run_date": "2025-01-01T00:00:00Z",
          "run_name": "Cypress",
          "status_code": "completed"
        }
      ]
    }`;

    cy.apiCall('POST', 'sequencing/batch?dry_run=true', body, Auth.token).then(res => {
      response = res;
    });
  });

  it('Request status', () => {
    expect(response.status).to.eq(202);
  });

  it('Return content', () => {
    cy.validateAcceptedBatchResponse(response, 'sequencing_experiment');
  });
});
