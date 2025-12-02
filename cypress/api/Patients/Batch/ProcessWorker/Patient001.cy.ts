/// <reference types="cypress"/>
import { apiMessages } from '@/apiMessages';

describe('Patients - Batch - Process worker - Patient001', () => {
  let response: any;
  let batch_id: string;

  before(() => {
    const Auth = Cypress.env('globalData').Authorization;
    const body: string = `{
      "patients": [
        {
          "submitter_patient_id": "MRN-283775  ",
          "submitter_patient_id_type": "MR",
          "patient_organization_code": "CHUSJ",
          "first_name": "Marie",
          "last_name": "Lambert",
          "jhn": "LAM7303233380",
          "life_status_code": "alive",
          "sex_code": "male",
          "date_of_birth": "1973-03-23"
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

  it('Validate report info count', () => {
    expect(Object.keys(response.body.report.info)).to.have.lengthOf(1);
  });

  it('Validate report patient[0]', () => {
    cy.validateReport(response, 'info', 'PATIENT-001', apiMessages.Patient001('CHUSJ', 'MRN-283775'), 'patient[0]');
  });
});
