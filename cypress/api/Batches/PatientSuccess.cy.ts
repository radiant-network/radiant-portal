/// <reference types="cypress"/>

describe('Batches / Patient success', () => {
  let response: any;
  let batchId: any;

  before(() => {
    const globalData = Cypress.env('globalData');
    const Auth = globalData.Authorization;
    batchId = globalData.BatchesId.patientSuccess;

    cy.apiCall('GET', `batches/${batchId}`, '', Auth.token).then(res => {
      response = res;
    });
  });

  it('Request status', () => {
    expect(response.status).to.eq(200);
  });

  it('Return content', () => {
    cy.validateSuccessBatchProcessed(response, 'patient', batchId);
  });
});
