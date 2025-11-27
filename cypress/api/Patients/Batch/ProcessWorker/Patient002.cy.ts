/// <reference types="cypress"/>
import { apiMessages } from '@/apiMessages';

describe('Patients - Batch - Process worker - Patient002', () => {
  let response: any;
  let batch_id: string;

  before(() => {
    const Auth = Cypress.env('globalData').Authorization;
    const body: string = `{
      "patients": [
        {
          "submitter_patient_id": "MRN-283775",
          "submitter_patient_id_type": "MR",
          "patient_organization_code": "CHUSJ",
          "first_name": "Diff",
          "last_name": "Diff",
          "jhn": "Diff",
          "life_status_code": "deceased",
          "sex_code": "female",
          "date_of_birth": "1974-04-24"
        }
      ]
    }`;

    cy.apiCall('POST', 'patients/batch?dry_run=true', body, Auth.token)
      .then((postRes: any) => {
        batch_id = postRes.body.id;
        return batch_id;
      })
      .then(id => {
        cy.wait(1000);
        cy.apiCall('GET', `batches/${id}`, '', Auth.token);
      })
      .then((getRes: any) => {
        response = getRes;
      });
  });

  it('Request status', () => {
    expect(response.status).to.eq(200);
  });

  it('Validate summary', () => {
    cy.validateSummary(response, 0 /*created*/, 0 /*updated*/, 1 /*skipped*/, 0 /*errors*/);
  });

  it('Validate report warn count', () => {
    expect(Object.keys(response.body.report.warn)).to.have.lengthOf(6);
  });

  it('Validate report patient[0].sex_code', () => {
    cy.validateReport(response, 'warn', 'PATIENT-002', apiMessages.Patient002('CHUSJ', 'MRN-283775', 'sex_code', 'male', 'female'), 'patient[0].sex_code');
  });

  it('Validate report patient[0].life_status_code', () => {
    cy.validateReport(response, 'warn', 'PATIENT-002', apiMessages.Patient002('CHUSJ', 'MRN-283775', 'life_status_code', 'alive', 'deceased'), 'patient[0].life_status_code');
  });

  it('Validate report patient[0].date_of_birth', () => {
    cy.validateReport(response, 'warn', 'PATIENT-002', apiMessages.Patient002('CHUSJ', 'MRN-283775', 'date_of_birth', '1973-03-23 00:00:00 +0000 UTC', '1974-04-24 00:00:00 +0000 UTC'), 'patient[0].date_of_birth');
  });

  it('Validate report patient[0].last_name', () => {
    cy.validateReport(response, 'warn', 'PATIENT-002', apiMessages.Patient002('CHUSJ', 'MRN-283775', 'last_name', 'Lambert', 'Diff'), 'patient[0].last_name');
  });

  it('Validate report patient[0].first_name', () => {
    cy.validateReport(response, 'warn', 'PATIENT-002', apiMessages.Patient002('CHUSJ', 'MRN-283775', 'first_name', 'Marie', 'Diff'), 'patient[0].first_name');
  });

  it('Validate report patient[0].jhn', () => {
    cy.validateReport(response, 'warn', 'PATIENT-002', apiMessages.Patient002('CHUSJ', 'MRN-283775', 'jhn', 'LAM7303233380', 'Diff'), 'patient[0].jhn');
  });
});
