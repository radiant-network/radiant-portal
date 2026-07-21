/// <reference types="cypress"/>
import { apiMessages } from '@/apiMessages';

describe('Patients - Batch - Process worker - Patient004', () => {
  let response: any;
  let batch_id: string;

  before(() => {
    const Auth = Cypress.expose('globalData').Authorization;
    const body: string = `{
      "patients": [
        {
          "submitter_patient_id": "Cypress_0001",
          "submitter_patient_id_type": "MR",
          "patient_organization_code": "CHUSJ",
          "first_name": "Cypress_",
          "last_name": "Test!",
          "jhn": "1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890!",
          "life_status_code": "alive",
          "sex_code": "male",
          "date_of_birth": "1979-09-19"
        }
      ]
    }`;

    cy.apiCall('POST', 'patients/batch?dry_run=true', body, Auth.token)
      .then((postRes: any) => {
        batch_id = postRes.body.id;
        return cy.waitForBatchStatus(batch_id, Auth.token);
      })
      .then((getRes: any) => {
        response = getRes;
      });
  });

  it('Request status', () => {
    expect(response.status).to.eq(200);
  });

  it('Validate summary', () => {
    cy.validateSummary(response, 0 /*created*/, 0 /*updated*/, 0 /*skipped*/, 1 /*errors*/);
  });

  it('Validate report error count', () => {
    expect(Object.keys(response.body.report.error)).to.have.lengthOf(4);
  });

  it('Validate report create_patient[0] first_name', () => {
    cy.validateReport(response, 'error', 'PATIENT-004', apiMessages.ProcessWorkerErrorRegExp('create_patient', 'first_name', 'CHUSJ', 'Cypress_0001'), 'create_patient[0].first_name');
  });

  it('Validate report create_patient[0] last_name', () => {
    cy.validateReport(response, 'error', 'PATIENT-004', apiMessages.ProcessWorkerErrorRegExp('create_patient', 'last_name', 'CHUSJ', 'Cypress_0001'), 'create_patient[0].last_name');
  });

  it('Validate report create_patient[0] jhn 1', () => {
    cy.validateReport(response, 'error', 'PATIENT-004', apiMessages.ProcessWorkerErrorTooLong('create_patient', 'jhn', 'CHUSJ', 'Cypress_0001'), 'create_patient[0].jhn');
  });

  it('Validate report create_patient[0] jhn 2', () => {
    cy.validateReport(response, 'error', 'PATIENT-004', apiMessages.ProcessWorkerErrorRegExpId('create_patient', 'jhn', 'CHUSJ', 'Cypress_0001'), 'create_patient[0].jhn');
  });
});
