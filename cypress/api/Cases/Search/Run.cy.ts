/// <reference types="cypress"/>
import { data } from 'pom/shared/Data';

describe('Cases - Search - Run', () => {
  const run = data.case.run;
  let response: any;

  before(() => {
    const Auth = Cypress.expose('globalData').Authorization;
    const body: string = `{
      "additional_fields": [
        "case_type"
      ],
      "search_criteria": [
        {
          "field": "run_name",
          "value": [
            "${run}"
          ]
        }
      ],
      "limit": 20,
      "page_index": 0
    }`;

    cy.apiCall('POST', 'cases/search', body, Auth.token).then(res => {
      response = res;
    });
  });

  it('Request status', () => {
    expect(response.status).to.eq(200);
  });

  it('Return content', () => {
    // A run can hold the samples of several cases: the case whose proband is on it is one of them.
    expect(response.body.count).to.be.greaterThan(0);
    expect(response.body.list.map((item: { case_id: number }) => String(item.case_id))).to.include(data.case.case);
  });
});
