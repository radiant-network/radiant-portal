/// <reference types="cypress"/>
import { apiMessages } from '@/apiMessages';

describe('Batches / Invalid UUID', () => {
  let response: any;

  before(() => {
    const globalData = Cypress.env('globalData');
    const Auth = globalData.Authorization;

    cy.apiCall('GET', `batches/InvalidUUID`, '', Auth.token).then(res => {
      response = res;
    });
  });

  it('Request status', () => {
    expect(response.status).to.eq(500);
  });

  it('Return content', () => {
    expect(response.body).to.have.all.keys('status', 'message', 'detail');
    expect(response.body).to.include({
      message: apiMessages.InternalServerError,
      detail: apiMessages.InvalidBatchUUID('InvalidUUID'),
    });
  });
});
