/// <reference types="cypress"/>

describe('Cases - Batch - Blank fields - Optional fields', () => {
  let response: any;

  before(() => {
    const Auth = Cypress.env('globalData').Authorization;
    const body: string = `{
      "cases": [
        {
        "submitter_case_id": "",
        "type": "germline",
        "status_code": "completed",
        "project_code": "Cypress",
        "diagnostic_lab_code": "",
        "primary_condition_code_system": "",
        "primary_condition_value": "",
        "priority_code": "",
        "category_code": "postnatal",
        "analysis_code": "WGA",
        "resolution_status_code": "",
        "note": "",
        "ordering_physician": "",
        "ordering_organization_code": "",
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
                    "note": ""
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
                "hash": "",
                "name": "Cypress",
                "size": 123456,
                "url": "Cypress"
                }
            ],
            "pipeline_name": "",
            "pipeline_version": "Cypress",
            "genome_build": ""
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
