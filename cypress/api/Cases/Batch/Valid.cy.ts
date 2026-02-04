/// <reference types="cypress"/>

describe('Cases - Batch - Valid', () => {
  let response: any;

  before(() => {
    const Auth = Cypress.env('globalData').Authorization;
    const body: string = `{
      "cases": [
        {
        "submitter_case_id": "Cypress0001",
        "type": "germline",
        "status_code": "completed",
        "project_code": "Cypress",
        "diagnostic_lab_code": "CHUSJ",
        "primary_condition_code_system": "Cypress",
        "primary_condition_value": "Cypress",
        "priority_code": "Cypress",
        "category_code": "postnatal",
        "analysis_code": "Cypress",
        "resolution_status_code": "Cypress",
        "note": "Cypress",
        "ordering_physician": "Cypress",
        "ordering_organization_code": "Cypress",
        "patients": [
            {
            "affected_status_code": "affected",
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
                    "interpretation_code": "positive",
                    "note": "Cypress"
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
            "relation_to_proband_code": "proband"
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
            "pipeline_name": "Cypress",
            "pipeline_version": "Cypress",
            "genome_build": "Cypress"
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
    expect(response.status).to.eq(202);
  });

  it('Return content', () => {
    cy.validateAcceptedBatchResponse(response, 'case');
  });
});
