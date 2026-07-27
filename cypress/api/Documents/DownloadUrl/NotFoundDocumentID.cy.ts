/// <reference types="cypress"/>
import { apiMessages } from '@/apiMessages';

describe('Documents - Download URL - Not found document ID', () => {
  let response: any;

  before(() => {
    const Auth = Cypress.expose('globalData').Authorization;

    cy.apiCall('GET', 'documents/999999999/download_url', '', Auth.token).then(res => {
      response = res;
    });
  });

  it('Request status', () => {
    expect(response.status).to.eq(404);
  });

  it('Return content', () => {
    expect(response.body).to.have.all.keys('status', 'message');
    expect(response.body).to.include({
      message: apiMessages.DocumentIdNotFound,
    });
  });
});
