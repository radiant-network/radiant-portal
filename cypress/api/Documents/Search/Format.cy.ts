/// <reference types="cypress"/>
import { data } from 'pom/shared/Data';

describe('Documents - Search - Format', () => {
  const format = data.file.format;
  let response: any;

  before(() => {
    const Auth = Cypress.expose('globalData').Authorization;
    const body: string = `{
      "search_criteria": [
        {
          "field": "format_code",
          "value": [
            "${format}"
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
    response.body.list.forEach((document: { format_code: string }) => {
      expect(document.format_code).to.eq(format);
    });
  });
});
