/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { CaseEntity_Details } from 'pom/pages/CaseEntity_Details';

// Read-only checks: set the page up once and share it between tests.
describe('CaseEntity - Details - Bioinformatics - Information displayed', { testIsolation: false }, () => {
  before(() => {
    cy.login();
    cy.visitCaseDetailsPage(data.case.case);
  });

  it('Task ID', () => {
    CaseEntity_Details.bioinformaticsCard.validations.shouldShowColumnContent('task_id', data.case.task);
  });

  it('Type', () => {
    CaseEntity_Details.bioinformaticsCard.validations.shouldShowColumnContent('type', data.case.task);
  });

  it('Patient', () => {
    CaseEntity_Details.bioinformaticsCard.validations.shouldShowColumnContent('patient', data.case.task);
  });

  it('Created On', () => {
    CaseEntity_Details.bioinformaticsCard.validations.shouldShowColumnContent('created_on', data.case.task);
  });
});
