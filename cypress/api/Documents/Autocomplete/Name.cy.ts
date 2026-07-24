/// <reference types="cypress"/>
import { data } from 'pom/shared/Data';

describe('Documents - Autocomplete - Name', () => {
  const name = data.file.name;
  let response: any;

  before(() => {
    const Auth = Cypress.expose('globalData').Authorization;

    cy.apiCall('GET', `documents/autocomplete?prefix=${encodeURIComponent(name)}&limit=10`, '', Auth.token).then(res => {
      response = res;
    });
  });

  it('Request status', () => {
    expect(response.status).to.eq(200);
  });

  it('Return content', () => {
    expect(response.body.find((item: { type: string }) => item.type === 'name')?.value).to.eq(name);
  });
});
