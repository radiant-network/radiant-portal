/// <reference types="cypress"/>

describe('HPO - Autocomplete - No Result', () => {
  let response: any;

  before(() => {
    const Auth = Cypress.expose('globalData').Authorization;

    cy.apiCall('GET', 'hpo/autocomplete?prefix=unknownHPO&limit=10', '', Auth.token).then(res => {
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
