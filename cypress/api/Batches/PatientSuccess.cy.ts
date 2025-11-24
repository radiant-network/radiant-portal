/// <reference types="cypress"/>

describe('Batches / Patient success', () => {
  let response: any;
  let batchId: any;

  before(() => {
    const globalData = Cypress.env('globalData');
    const Auth = globalData.Authorization;
    batchId = globalData.BatchesId.patientPending;

    cy.apiCall('GET', `batches/${batchId}`, '', Auth.token).then(res => {
      response = res;
    });
  });

  it('Request status', () => {
    expect(response.status).to.eq(200);
  });

  it('Return content', () => {
    expect(response.body).to.have.all.keys('id', 'dry_run', 'batch_type', 'status', 'created_on', 'started_on', 'finished_on', 'username', 'summary', 'report');
    expect(response.body).to.include({
      id: batchId,
      dry_run: true,
      batch_type: 'patient',
      status: 'SUCCESS',
      username: 'cypress',
    });
    expect(response.body.created_on)
      .to.be.a('string')
      .and.match(/^\d{4}-\d{2}-\d{2}T/);
    expect(response.body.started_on)
      .to.be.a('string')
      .and.match(/^\d{4}-\d{2}-\d{2}T/);
    expect(response.body.finished_on)
      .to.be.a('string')
      .and.match(/^\d{4}-\d{2}-\d{2}T/);
    expect(response.body.summary).to.deep.equal({
      created: 0,
      updated: 0,
      skipped: 0,
      errors: 0,
    });
    expect(response.body.report).to.be.empty;
  });
});
