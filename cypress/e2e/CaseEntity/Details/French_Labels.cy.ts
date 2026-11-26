/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { CaseEntity_Details } from 'pom/pages/CaseEntity_Details';

describe('CaseEntity - Details - French labels', () => {
  const setupTest = () => {
    cy.login();
    cy.visitCaseDetailsPage(data.case.case);
  };

  it('Labels switch to French', () => {
    setupTest();
    CaseEntity_Details.clinicalCard.validations.shouldShowField('ethnicity', data.case.labels.ethnicity.en);
    CaseEntity_Details.clinicalCard.validations.shouldShowField('exam_name', data.case.labels.exam_name.en);

    cy.setLang('FR');
    CaseEntity_Details.clinicalCard.validations.shouldShowField('ethnicity', data.case.labels.ethnicity.fr);
    CaseEntity_Details.clinicalCard.validations.shouldShowField('exam_name', data.case.labels.exam_name.fr);
  });
});
