/// <reference types="cypress"/>
import { apiMessages } from '@/apiMessages';

describe('Batches / Not found batch ID', () => {
  let response: any;
  let batchId: any;

  before(() => {
    const globalData = Cypress.env('globalData');
    const Auth = globalData.Authorization;
    batchId = globalData.BatchesId.patientNotFound;

    cy.apiCall('GET', `batches/${batchId}`, '', Auth.token).then(res => {
      response = res;
    });
  });

  it('Request status', () => {
    expect(response.status).to.eq(404);
  });

  it('Return content', () => {
    expect(response.body).to.have.all.keys('status', 'message');
    expect(response.body).to.include({
      message: apiMessages.BatchIdNotFound,
    });
  });
});
