/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { CaseEntity_Details } from 'pom/pages/CaseEntity_Details';
import { CaseEntity_Variants } from 'pom/pages/CaseEntity_Variants';

describe('CaseEntity - Details - Assays - Action Buttons', () => {
  const setupTest = () => {
    cy.login();
    cy.visitCaseDetailsPage(data.case.case);
  };

  it('View Variants', () => {
    setupTest();
    CaseEntity_Details.assaysCard.actions.selectAction(data.case.assay, 'Variants');
    CaseEntity_Variants.validations.shouldHaveTitle(data.case);
    CaseEntity_Variants.validations.shouldHaveActiveTab();
  });

  it('Assay Details', () => {
    setupTest();
    CaseEntity_Details.assaysCard.actions.selectAction(data.case.assay, 'Assay');
    CaseEntity_Details.validations.shouldHaveAssayDetailsModal(data.case.assay);
  });
});
