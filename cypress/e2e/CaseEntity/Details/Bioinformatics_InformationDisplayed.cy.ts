/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { CaseEntity_Details } from 'pom/pages/CaseEntity_Details';

describe('CaseEntity - Details - Bioinformatics - Information displayed', () => {
  const setupTest = () => {
    cy.login();
    cy.visitCaseDetailsPage(data.case.case);
  };

  it('Task ID', () => {
    setupTest();
    CaseEntity_Details.bioinformaticsCard.validations.shouldShowColumnContent('task_id', data.case.task);
  });

  it('Type', () => {
    setupTest();
    CaseEntity_Details.bioinformaticsCard.validations.shouldShowColumnContent('type', data.case.task);
  });

  it('Patient', () => {
    setupTest();
    CaseEntity_Details.bioinformaticsCard.validations.shouldShowColumnContent('patient', data.case.task);
  });

  it('Created On', () => {
    setupTest();
    CaseEntity_Details.bioinformaticsCard.validations.shouldShowColumnContent('created_on', data.case.task);
  });
});
