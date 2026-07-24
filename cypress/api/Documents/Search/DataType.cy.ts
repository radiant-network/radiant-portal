/// <reference types="cypress"/>
import { data } from 'pom/shared/Data';

describe('Documents - Search - Data type', () => {
  const dataType = data.file.type;
  let response: any;

  before(() => {
    const Auth = Cypress.expose('globalData').Authorization;
    const body: string = `{
      "search_criteria": [
        {
          "field": "data_type_code",
          "value": [
            "${dataType}"
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
    response.body.list.forEach((document: { data_type_code: string }) => {
      expect(document.data_type_code).to.eq(dataType);
    });
  });
});
