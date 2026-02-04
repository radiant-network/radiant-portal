/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { CaseEntity_Files } from 'pom/pages/CaseEntity_Files';

describe('CaseEntity - Files - Sort', () => {
  const setupTest = () => {
    cy.login();
    cy.visitCaseFilesPage(data.case.case);
  };

  it('Alphanumeric', () => {
    setupTest();
    CaseEntity_Files.validations.shouldSortColumn('sample', false /*hasUniqueValues*/, true /*isReverseSorting*/);
  });

  it('Number', () => {
    setupTest();
    CaseEntity_Files.validations.shouldSortColumn('patient', false /*hasUniqueValues*/, false /*isReverseSorting*/);
  });

  it('Tag', () => {
    setupTest();
    CaseEntity_Files.validations.shouldSortColumn('format', false /*hasUniqueValues*/, true /*isReverseSorting*/);
  });

  it('Date', () => {
    setupTest();
    CaseEntity_Files.validations.shouldSortColumn('created_on', true /*hasUniqueValues*/, false /*isReverseSorting*/);
  });

  it('Size', () => {
    setupTest();
    CaseEntity_Files.actions.filterFormat('VCF File');
    CaseEntity_Files.validations.shouldSortColumn('size', false /*hasUniqueValues*/, false /*isReverseSorting*/);
  });

  it('Multiple', () => {
    setupTest();
    CaseEntity_Files.actions.sortColumn('name');
    CaseEntity_Files.actions.sortColumn('patient');
    CaseEntity_Files.actions.sortColumn('patient');
    CaseEntity_Files.validations.shouldHaveFirstRowValue('3', 'patient');
  });
});
