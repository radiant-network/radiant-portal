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
          "submitter_patient_id": "mrn-283775  ",
          "submitter_patient_id_type": "MR",
          "patient_organization_code": "CHUSJ",
          "first_name": "Marie",
          "last_name": "Lambert",
          "jhn": "LAM7303233380",
          "life_status_code": "alive",
          "sex_code": "male",
          "date_of_birth": "1973-03-23"
        },
        {
          "submitter_patient_id": "Cypress0001",
          "submitter_patient_id_type": "MR",
          "patient_organization_code": "CHUSJ",
          "first_name": "Cypress",
          "last_name": "Test",
          "jhn": "Cypress0001",
          "life_status_code": "alive",
          "sex_code": "male",
          "date_of_birth": "1979-09-19"
        },
        {
          "submitter_patient_id": "Cypress0001",
          "submitter_patient_id_type": "MR",
          "patient_organization_code": "CHUSJ",
          "first_name": "Cypress",
          "last_name": "Test",
          "jhn": "Cypress0001",
          "life_status_code": "alive",
          "sex_code": "male",
          "date_of_birth": "1979-09-19"
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

  it('Validate summary [SJRA-883]', () => {
    cy.validateSummary(response, 0 /*created*/, 0 /*updated*/, 2 /*skipped*/, 0 /*errors*/);
  });

  it('Validate report info count [SJRA-882, SJRA-883]', () => {
    expect(Object.keys(response.body.report.info)).to.have.lengthOf(2);
  });

  it('Validate report patient[0] [SJRA-882]', () => {
    cy.validateReport(response, 'info', 'PATIENT-001', apiMessages.Patient001('CHUSJ', 'MRN-283775'), 'patient[0]');
  });

  it('Validate report patient[2] [SJRA-883]', () => {
    cy.validateReport(response, 'info', 'PATIENT-001', apiMessages.Patient001('CHUSJ', 'Cypress0001'), 'patient[2]');
  });
});
