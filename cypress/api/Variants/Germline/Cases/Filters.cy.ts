/// <reference types="cypress"/>
import { filters } from 'pom/pages/VariantEntity_UninterpretedCases_Filters';

describe('Variants - Germline - Cases - Filters', () => {
  // `filter_is_pass` options are hard-coded client-side, not returned by the API.
  const expectedFilterKeys = filters.filter(f => f.isVisibleByDefault && f.key !== 'filter_is_pass').map(f => f.key);
  let response: any;

  before(() => {
    const Auth = Cypress.expose('globalData').Authorization;

    cy.apiCall('GET', 'variants/germline/cases/filters', '', Auth.token).then(res => {
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
