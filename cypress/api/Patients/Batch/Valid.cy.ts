/// <reference types="cypress"/>

describe('Patients - Batch - Valid', () => {
  let response: any;

  before(() => {
    const Auth = Cypress.env('globalData').Authorization;
    const body: string = `{
      "patients": [
        {
          "organization_patient_id": "Cypress0001",
          "organization_patient_id_type": "MR",
          "organization_code": "Cypress",
          "life_status_code": "alive",
          "sex_code": "male",
          "date_of_birth": "1979-09-19"
        }
      ]
    }`;

    cy.apiCall('POST', 'patients/batch?dry_run=true', body, Auth.token).then(res => {
      response = res;
    });
  });

  it('Request status', () => {
    expect(response.status).to.eq(202);
  });

  it('Return content', () => {
    expect(response.body).to.have.keys('id', 'dry_run', 'batch_type', 'status', 'created_on', 'username');
    expect(response.body).to.include({
      dry_run: true,
      batch_type: 'patient',
      status: 'PENDING',
      username: 'cypress',
    });
    expect(response.body.id)
      .to.be.a('string')
      .and.match(/^[0-9a-f-]{36}$/i);
    expect(response.body.created_on)
      .to.be.a('string')
      .and.match(/^\d{4}-\d{2}-\d{2}T/);
    expect(new Date(response.body.created_on).getTime()).to.be.closeTo(Date.now(), 60000); // ±60s
  });
});
