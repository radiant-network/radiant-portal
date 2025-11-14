/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { CaseEntity_Details } from 'pom/pages/CaseEntity_Details';
import { CaseEntity_Variants_SNV_Table } from 'pom/pages/CaseEntity_Variants_SNV_Table';

describe('CaseEntity - Details - Assays - Action Buttons', () => {
  const setupTest = () => {
    cy.login();
    cy.visitCaseDetailsPage(data.case.case);
  };

  it('View Variants', () => {
    setupTest();
    CaseEntity_Details.assaysCard.actions.selectAction(data.case.assay, 'Variants');
    CaseEntity_Variants_SNV_Table.validations.shouldHaveTitle(data.case);
    CaseEntity_Variants_SNV_Table.validations.shouldHaveActiveTabAndToggle();
  });

  it('Assay Details', () => {
    setupTest();
    CaseEntity_Details.assaysCard.actions.selectAction(data.case.assay, 'Assay');
    CaseEntity_Details.validations.shouldHaveAssayDetailsModal(data.case.assay);
  });
});
