/// <reference types="cypress"/>
import { data } from 'pom/shared/Data';

describe('HPO - Autocomplete - ID', () => {
  const name = data.variantGermline.hpo.condition;
  const hpoId = data.variantGermline.hpo.hpo_id;
  let response: any;

  before(() => {
    const Auth = Cypress.expose('globalData').Authorization;

    cy.apiCall('GET', `hpo/autocomplete?prefix=${encodeURIComponent(hpoId)}&limit=10`, '', Auth.token).then(res => {
      response = res;
    });
  });

  it('Request status', () => {
    expect(response.status).to.eq(200);
  });

  it('Return content', () => {
    cy.validateItemCount(response, 1);
    expect(response.body[0].source).to.deep.eq({ id: hpoId, name: name });
  });
});
