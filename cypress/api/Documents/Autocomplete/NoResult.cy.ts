/// <reference types="cypress"/>

describe('Documents - Autocomplete - No Result', () => {
  let response: any;

  before(() => {
    const Auth = Cypress.expose('globalData').Authorization;

    cy.apiCall('GET', 'documents/autocomplete?prefix=unknownDoc&limit=10', '', Auth.token).then(res => {
      response = res;
    });
  });

  it('Request status', () => {
    expect(response.status).to.eq(200);
  });

  it('Return content', () => {
    cy.validateItemCount(response, 0);
  });
});
