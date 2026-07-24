/// <reference types="cypress"/>
import { data } from 'pom/shared/Data';

describe('Documents - Search - Relationship', () => {
  const relationship = data.file.relationship;
  let response: any;

  before(() => {
    const Auth = Cypress.expose('globalData').Authorization;
    const body: string = `{
      "search_criteria": [
        {
          "field": "relationship_to_proband_code",
          "value": [
            "${relationship}"
          ]
        }
      ],
      "limit": 20,
      "page_index": 0
    }`;

    cy.apiCall('POST', 'documents/search', body, Auth.token).then(res => {
      response = res;
    });
  });

  it('Request status', () => {
    expect(response.status).to.eq(200);
  });

  it('Return content', () => {
    expect(response.body.list).to.have.length.greaterThan(0);
    response.body.list.forEach((document: { relationship_to_proband_code: string }) => {
      expect(document.relationship_to_proband_code).to.eq(relationship);
    });
  });
});
