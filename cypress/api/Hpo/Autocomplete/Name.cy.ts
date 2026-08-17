/// <reference types="cypress"/>
import { data } from 'pom/shared/Data';

describe('HPO - Autocomplete - Name', () => {
  const name = data.variantGermline.hpo.condition;
  const hpoId = data.variantGermline.hpo.hpo_id;
  let response: any;

  before(() => {
    const Auth = Cypress.expose('globalData').Authorization;

    cy.apiCall('GET', `hpo/autocomplete?prefix=${encodeURIComponent(name.split(' ').slice(1).join(' ')/*substring*/)}&limit=10`, '', Auth.token).then(res => {
      response = res;
    });
  });

  it('Request status', () => {
    expect(response.status).to.eq(200);
  });

  it('Return content', () => {
    const term = response.body.find((item: { source: { id: string } }) => item.source.id === hpoId);
    expect(term, `term "${hpoId}"`).to.exist;
    expect(term.source.name).to.eq(name);
  });
});
