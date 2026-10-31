/// <reference types="cypress"/>
import { data } from 'pom/shared/Data';

describe('Cases - Autocomplete - Sample', () => {
  const sample = data.case.sample;
  let response: any;

  before(() => {
    const Auth = Cypress.expose('globalData').Authorization;

    cy.apiCall('GET', `cases/autocomplete?prefix=${sample.toLowerCase()}&limit=10`, '', Auth.token).then(res => {
      response = res;
    });
  });

  it('Request status', () => {
    expect(response.status).to.eq(200);
  });

  it('Return content', () => {
    expect(response.body.find((item: { type: string }) => item.type === 'proband_submitter_sample_ids')?.value).to.eq(sample);
  });
});
