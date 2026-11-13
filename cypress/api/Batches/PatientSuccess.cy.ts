/// <reference types="cypress"/>

describe('Batches - Patient success', () => {
  let response: any;
  let batchId: any;

  before(() => {
    const globalData = Cypress.expose('globalData');
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
    // A reference batch, created once with the first account of the pool, whatever account runs
    cy.validateSuccessBatchProcessed(response, 'create_patient', batchId, 'cypress@email.me');
  });
});
