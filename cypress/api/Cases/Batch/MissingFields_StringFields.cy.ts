/// <reference types="cypress"/>
import { apiMessages } from '@/apiMessages';

describe('Cases - Batch - Missing fields - String fields', () => {
  let response: any;

  before(() => {
    const Auth = Cypress.env('globalData').Authorization;
    const body: string = `{
      "cases": [
        {
        "type": "germline",
        "patients": [
            {
            "affected_status_code": "affected",
            "family_history": [
                {
                }
            ],
            "observations_categorical": [
                {
                    "interpretation_code": "positive"
                }
            ],
            "observations_text": [
                {
                }
            ],
            "relation_to_proband_code": "proband"
            }
        ],
        "sequencing_experiments": [
            {
            }
        ],
        "tasks": [
            {
            "input_documents": [
                {
                }
            ],
            "output_documents": [
                {
                "size": 123456
                }
            ]
            }
        ]
        }
      ]
    }`;

    cy.apiCall('POST', 'cases/batch?dry_run=true', body, Auth.token).then(res => {
      response = res;
    });
  });

  it('Request status', () => {
    expect(response.status).to.eq(400);
  });

  it('Message', () => {
    cy.validateMessage(response, apiMessages.ImmediateError('CreateCaseBatchBody.Cases[0]', 'StatusCode', 'required'));
    cy.validateMessage(response, apiMessages.ImmediateError('CreateCaseBatchBody.Cases[0]', 'ProjectCode', 'required'));
    cy.validateMessage(response, apiMessages.ImmediateError('CreateCaseBatchBody.Cases[0]', 'CategoryCode', 'required'));
    cy.validateMessage(response, apiMessages.ImmediateError('CreateCaseBatchBody.Cases[0]', 'AnalysisCode', 'required'));
    cy.validateMessage(response, apiMessages.ImmediateError('CreateCaseBatchBody.Cases[0].Patients[0].FamilyHistory[0]', 'FamilyMemberCode', 'required'));
    cy.validateMessage(response, apiMessages.ImmediateError('CreateCaseBatchBody.Cases[0].Patients[0].FamilyHistory[0]', 'Condition', 'required'));
    cy.validateMessage(response, apiMessages.ImmediateError('CreateCaseBatchBody.Cases[0].Patients[0].ObservationsCategorical[0]', 'Code', 'required'));
    cy.validateMessage(response, apiMessages.ImmediateError('CreateCaseBatchBody.Cases[0].Patients[0].ObservationsCategorical[0]', 'System', 'required'));
    cy.validateMessage(response, apiMessages.ImmediateError('CreateCaseBatchBody.Cases[0].Patients[0].ObservationsCategorical[0]', 'Value', 'required'));
    cy.validateMessage(response, apiMessages.ImmediateError('CreateCaseBatchBody.Cases[0].Patients[0].ObservationsCategorical[0]', 'OnsetCode', 'required'));
    cy.validateMessage(response, apiMessages.ImmediateError('CreateCaseBatchBody.Cases[0].Patients[0].ObservationsText[0]', 'Code', 'required'));
    cy.validateMessage(response, apiMessages.ImmediateError('CreateCaseBatchBody.Cases[0].Patients[0].ObservationsText[0]', 'Value', 'required'));
    cy.validateMessage(response, apiMessages.ImmediateError('CreateCaseBatchBody.Cases[0].Patients[0]', 'SubmitterPatientId', 'required'));
    cy.validateMessage(response, apiMessages.ImmediateError('CreateCaseBatchBody.Cases[0].Patients[0]', 'PatientOrganizationCode', 'required'));
    cy.validateMessage(response, apiMessages.ImmediateError('CreateCaseBatchBody.Cases[0].SequencingExperiments[0]', 'Aliquot', 'required'));
    cy.validateMessage(response, apiMessages.ImmediateError('CreateCaseBatchBody.Cases[0].SequencingExperiments[0]', 'SampleOrganizationCode', 'required'));
    cy.validateMessage(response, apiMessages.ImmediateError('CreateCaseBatchBody.Cases[0].SequencingExperiments[0]', 'SubmitterSampleId', 'required'));
    cy.validateMessage(response, apiMessages.ImmediateError('CreateCaseBatchBody.Cases[0].Tasks[0]', 'TypeCode', 'required'));
    cy.validateMessage(response, apiMessages.ImmediateError('CreateCaseBatchBody.Cases[0].Tasks[0].InputDocuments[0]', 'Url', 'required'));
    cy.validateMessage(response, apiMessages.ImmediateError('CreateCaseBatchBody.Cases[0].Tasks[0].OutputDocuments[0]', 'DataCategoryCode', 'required'));
    cy.validateMessage(response, apiMessages.ImmediateError('CreateCaseBatchBody.Cases[0].Tasks[0].OutputDocuments[0]', 'DataTypeCode', 'required'));
    cy.validateMessage(response, apiMessages.ImmediateError('CreateCaseBatchBody.Cases[0].Tasks[0].OutputDocuments[0]', 'FormatCode', 'required'));
    cy.validateMessage(response, apiMessages.ImmediateError('CreateCaseBatchBody.Cases[0].Tasks[0].OutputDocuments[0]', 'Name', 'required'));
    cy.validateMessage(response, apiMessages.ImmediateError('CreateCaseBatchBody.Cases[0].Tasks[0].OutputDocuments[0]', 'Url', 'required'));
    cy.validateMessage(response, apiMessages.ImmediateError('CreateCaseBatchBody.Cases[0].Tasks[0]', 'PipelineVersion', 'required'));
  });
});
