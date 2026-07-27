/// <reference types="cypress"/>
import { filters } from 'pom/pages/FilesTable_Filters';

describe('Documents - Filters', () => {
  const expectedFilterKeys = filters.filter(f => f.isVisibleByDefault).map(f => f.key);
  let response: any;

  before(() => {
    const Auth = Cypress.expose('globalData').Authorization;

    cy.apiCall('GET', 'documents/filters', '', Auth.token).then(res => {
      response = res;
    });
  });

  it('Request status', () => {
    expect(response.status).to.eq(200);
  });

  it('Return content', () => {
    expectedFilterKeys.forEach(key => {
      expect(response.body[key], `filter "${key}"`).to.be.an('array');
    });
  });
});
