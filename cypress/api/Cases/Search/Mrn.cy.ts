/// <reference types="cypress"/>
import { data } from 'pom/shared/Data';

describe('Cases - Search - Mrn', () => {
  const mrn = data.case.mrn;
  let response: any;

  before(() => {
    const Auth = Cypress.env('globalData').Authorization;
    const body: string = `{
      "additional_fields": [
        "case_type"
      ],
      "search_criteria": [
        {
          "field": "mrn",
          "value": [
            "${mrn}"
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

  it('Request status [SJRA-987]', () => {
    expect(response.status).to.eq(200);
  });

  it('Return content [SJRA-987]', () => {
    expect(response.body.count).to.eq(1);
  });
});
