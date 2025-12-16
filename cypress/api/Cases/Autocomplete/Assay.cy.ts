/// <reference types="cypress"/>
import { data } from 'pom/shared/Data';

describe('Cases - Autocomplete - Assay', () => {
  const assayId = data.case.assay.assay_id;
  let response: any;

  before(() => {
    const Auth = Cypress.env('globalData').Authorization;

    cy.apiCall('GET', `cases/autocomplete?prefix=${assayId}&limit=10`, '', Auth.token).then(res => {
      response = res;
    });
  });

  it('Request status', () => {
    expect(response.status).to.eq(200);
  });

  it('Return content [SJRA-913]', () => {
    expect(response.body.find((item: { type: string }) => item.type === 'assay_id')?.value).to.eq(assayId);
  });
});
