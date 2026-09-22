/// <reference types="cypress"/>
import { apiMessages } from '@/apiMessages';

describe('Cases - Assignment Candidates - Invalid case ID', () => {
  let response: any;

  before(() => {
    const Auth = Cypress.expose('globalData').Authorization;

    cy.apiCall('GET', 'cases/InvalidCaseID/assignment_candidates', '', Auth.token).then(res => {
      response = res;
    });
  });

  it('Request status', () => {
    expect(response.status).to.eq(403);
  });

  it('Return content', () => {
    expect(response.body).to.have.all.keys('status', 'message');
    expect(response.body).to.include({
      message: apiMessages.Forbidden,
    });
  });
});
