/// <reference types="cypress"/>
import { apiMessages } from '@/apiMessages';

describe('Cases - Batch - Blank fields - String fields', () => {
  let response: any;

  before(() => {
    const Auth = Cypress.env('globalData').Authorization;
    const body: string = `{
      "cases": [
        {
        "submitter_case_id": "",
        "type": "germline",
        "status_code": "",
        "project_code": "",
        "category_code": "",
        "patients": [
            {
            "affected_status_code": "affected",
            "family_history": [
                {
                    "family_member_code": "",
                    "condition": ""
                }
            ],
            "observations_categorical": [
                {
                    "code": "",
                    "system": "",
                    "value": "",
                    "onset_code": "",
                    "interpretation_code": "positive"
                }
            ],
            "observations_text": [
                {
                    "code": "",
                    "value": ""
                }
            ],
            "submitter_patient_id": "",
            "patient_organization_code": "",
            "relation_to_proband_code": "proband"
            }
        ],
        "sequencing_experiments": [
            {
            "aliquot": "",
            "sample_organization_code": "",
            "submitter_sample_id": ""
            }
        ],
        "tasks": [
            {
            "type_code": "",
            "input_documents": [
                {
                    "url": ""
                }
            ],
            "output_documents": [
                {
                "data_category_code": "",
                "data_type_code": "",
                "format_code": "",
                "name": "",
                "size": 123456,
                "url": ""
                }
            ],
            "pipeline_version": ""
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
    cy.validateMessage(response, apiMessages.ImmediateError('CreateCaseBatchBody.Cases[0]', 'SubmitterCaseId', 'required'));
    cy.validateMessage(response, apiMessages.ImmediateError('CreateCaseBatchBody.Cases[0]', 'StatusCode', 'required'));
    cy.validateMessage(response, apiMessages.ImmediateError('CreateCaseBatchBody.Cases[0]', 'ProjectCode', 'required'));
    cy.validateMessage(response, apiMessages.ImmediateError('CreateCaseBatchBody.Cases[0]', 'CategoryCode', 'required'));
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
