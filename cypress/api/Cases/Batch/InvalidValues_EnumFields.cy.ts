/// <reference types="cypress"/>
import { apiMessages } from '@/apiMessages';

describe('Cases - Batch - Invalid values - Enum fields', () => {
  let response: any;

  before(() => {
    const Auth = Cypress.env('globalData').Authorization;
    const body: string = `{
      "cases": [
        {
        "submitter_case_id": "Cypress0001",
        "type": "InvalidValue",
        "status_code": "completed",
        "project_code": "Cypress",
        "category_code": "InvalidValue",
        "patients": [
            {
            "affected_status_code": "InvalidValue",
            "family_history": [
                {
                    "family_member_code": "Cypress",
                    "condition": "Cypress"
                }
            ],
            "observations_categorical": [
                {
                    "code": "Cypress",
                    "system": "Cypress",
                    "value": "Cypress",
                    "onset_code": "Cypress",
                    "interpretation_code": "InvalidValue"
                }
            ],
            "observations_text": [
                {
                    "code": "Cypress",
                    "value": "Cypress"
                }
            ],
            "submitter_patient_id": "Cypress0001",
            "patient_organization_code": "Cypress",
            "relation_to_proband_code": "InvalidValue"
            }
        ],
        "sequencing_experiments": [
            {
            "aliquot": "Cypress0001",
            "sample_organization_code": "Cypress",
            "submitter_sample_id": "Cypress0001"
            }
        ],
        "tasks": [
            {
            "type_code": "Cypress",
            "aliquots": ["Cypress0001"],
            "input_documents": [
                {
                    "url": "Cypress"
                }
            ],
            "output_documents": [
                {
                "data_category_code": "Cypress",
                "data_type_code": "Cypress",
                "format_code": "Cypress",
                "hash": "Cypress",
                "name": "Cypress",
                "size": 123456,
                "url": "Cypress"
                }
            ],
            "pipeline_version": "Cypress"
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

  it('Return content', () => {
    cy.validateMessage(response, apiMessages.ImmediateError('CreateCaseBatchBody.Cases[0]', 'Type', 'oneof'));
    cy.validateMessage(response, apiMessages.ImmediateError('CreateCaseBatchBody.Cases[0]', 'CategoryCode', 'oneof'));
    cy.validateMessage(response, apiMessages.ImmediateError('CreateCaseBatchBody.Cases[0].Patients[0]', 'AffectedStatusCode', 'oneof'));
    cy.validateMessage(response, apiMessages.ImmediateError('CreateCaseBatchBody.Cases[0].Patients[0].ObservationsCategorical[0]', 'InterpretationCode', 'oneof'));
    cy.validateMessage(response, apiMessages.ImmediateError('CreateCaseBatchBody.Cases[0].Patients[0]', 'RelationToProbandCode', 'oneof'));
  });
});
