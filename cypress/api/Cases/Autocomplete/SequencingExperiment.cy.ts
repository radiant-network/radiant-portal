/// <reference types="cypress"/>
import { data } from 'pom/shared/Data';

describe('Cases - Autocomplete - Sequencing experiment', () => {
  const seqExpId = data.case.seq.seq_id;
  let response: any;

  before(() => {
    const Auth = Cypress.env('globalData').Authorization;

    cy.apiCall('GET', `cases/autocomplete?prefix=${seqExpId}&limit=10`, '', Auth.token).then(res => {
      response = res;
    });
  });

  it('Request status', () => {
    expect(response.status).to.eq(200);
  });

  it('Return content', () => {
    expect(response.body.find((item: { type: string }) => item.type === 'sequencing_experiment_id')?.value).to.eq(seqExpId);
  });
});
