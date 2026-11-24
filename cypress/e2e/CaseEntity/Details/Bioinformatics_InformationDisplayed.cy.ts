/// <reference types="cypress"/>
import 'support/commands';
import { setupOnce } from 'support/setupOnce';
import { data } from 'pom/shared/Data';
import { CaseEntity_Details } from 'pom/pages/CaseEntity_Details';

// Read-only checks: set the page up once and share it between tests.
describe('CaseEntity - Details - Bioinformatics - Information displayed', { testIsolation: false }, () => {
  setupOnce(() => {
    cy.login();
    cy.visitCaseDetailsPage(data.case.case);
  });

  it('Task', () => {
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
