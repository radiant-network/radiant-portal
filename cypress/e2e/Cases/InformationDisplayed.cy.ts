/// <reference types="cypress"/>
import '../../support/commands';
import { data } from '../../pom/shared/Data';
import { CasesTable } from '../../pom/pages/CasesTable';

describe('Cases - Information displayed', () => {
  const setupTest = () => {
    cy.login();
    cy.visitCasesPage(data.case.search_criteria);
  };

  it('case', () => {
    setupTest();
    CasesTable.validations.shouldShowColumnContent('case', data.case);
  });

  it('patient', () => {
    setupTest();
    CasesTable.validations.shouldShowColumnContent('patient', data.case);
  });

  it('mrn', () => {
    setupTest();
    CasesTable.validations.shouldShowColumnContent('mrn', data.case);
  });

  it('priority', () => {
    setupTest();
    CasesTable.validations.shouldShowColumnContent('priority', data.case);
  });

  it('status', () => {
    setupTest();
    CasesTable.validations.shouldShowColumnContent('status', data.case);
  });

  it('type', () => {
    setupTest();
    CasesTable.validations.shouldShowColumnContent('type', data.case);
  });

  it('analysis', () => {
    setupTest();
    CasesTable.validations.shouldShowColumnContent('analysis', data.case);
  });

  it('primary_condition', () => {
    setupTest();
    CasesTable.validations.shouldShowColumnContent('primary_condition', data.case);
  });

  it('req_by', () => {
    setupTest();
    CasesTable.validations.shouldShowColumnContent('req_by', data.case);
  });

  it('project', () => {
    setupTest();
    CasesTable.validations.shouldShowColumnContent('project', data.case);
  });

  it('created_on', () => {
    setupTest();
    CasesTable.validations.shouldShowColumnContent('created_on', data.case);
  });

  it('updated_on', () => {
    setupTest();
    CasesTable.validations.shouldShowColumnContent('updated_on', data.case);
  });

  it('prescriber', () => {
    setupTest();
    CasesTable.validations.shouldShowColumnContent('prescriber', data.case);
  });

  it('diagnostic_lab', () => {
    setupTest();
    CasesTable.validations.shouldShowColumnContent('diagnostic_lab', data.case);
  });

  it('request', () => {
    setupTest();
    CasesTable.validations.shouldShowColumnContent('request', data.case);
  });

  it('managing_org', () => {
    setupTest();
    CasesTable.validations.shouldShowColumnContent('managing_org', data.case);
  });

  it('actions', () => {
    setupTest();
    CasesTable.validations.shouldShowColumnContent('actions', data.case);
  });
});
