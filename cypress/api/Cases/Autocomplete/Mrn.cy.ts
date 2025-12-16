/// <reference types="cypress"/>
import { data } from 'pom/shared/Data';

describe('Cases - Autocomplete - Mrn', () => {
  const mrn = data.case.mrn;
  let response: any;

  before(() => {
    const Auth = Cypress.env('globalData').Authorization;

    cy.apiCall('GET', `cases/autocomplete?prefix=${mrn.toLowerCase()}&limit=10`, '', Auth.token).then(res => {
      response = res;
    });
  });

  it('Request status', () => {
    expect(response.status).to.eq(200);
  });

  it('Return content', () => {
    expect(response.body.find((item: { type: string }) => item.type === 'mrn')?.value).to.eq(mrn);
  });
});
