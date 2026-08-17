/// <reference types="cypress"/>
import { data } from 'pom/shared/Data';

describe('MONDO - Autocomplete - Name', () => {
  const name = data.case.primary_condition_name;
  const mondoId = data.case.primary_condition_id;
  let response: any;

  before(() => {
    const Auth = Cypress.expose('globalData').Authorization;

    cy.apiCall('GET', `mondo/autocomplete?prefix=${encodeURIComponent(name)}&limit=1000`, '', Auth.token).then(res => {
      response = res;
    });
  });

  it('Request status', () => {
    expect(response.status).to.eq(200);
  });

  it('Return content', () => {
    const term = response.body.find((item: { source: { id: string } }) => item.source.id === mondoId);
    expect(term, `term "${mondoId}"`).to.exist;
    expect(term.source.name).to.eq(name);
  });
});
