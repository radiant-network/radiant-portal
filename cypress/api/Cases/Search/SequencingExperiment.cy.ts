/// <reference types="cypress"/>
import { data } from 'pom/shared/Data';

describe('Cases - Search - Sequencing experiment', () => {
  const seqExpId = data.case.assay.assay_id;
  let response: any;

  before(() => {
    const Auth = Cypress.env('globalData').Authorization;
    const body: string = `{
      "additional_fields": [
        "case_type"
      ],
      "search_criteria": [
        {
          "field": "sequencing_experiment_id",
          "value": [
            "${seqExpId}"
          ]
        }
      ],
      "limit": 20,
      "page_index": 0,
      "sort": [
        {
          "field": "created_at",
          "order": "asc"
        }
      ]
    }`;

    cy.apiCall('POST', 'cases/search', body, Auth.token).then(res => {
      response = res;
    });
  });

  it('Request status', () => {
    expect(response.status).to.eq(200);
  });

  it('Return content', () => {
    expect(response.body.count).to.eq(1);
  });
});
