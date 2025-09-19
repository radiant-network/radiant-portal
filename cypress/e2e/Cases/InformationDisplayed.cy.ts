/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { CasesTable } from 'pom/pages/CasesTable';

describe('Cases - Information displayed', () => {
  const setupTest = () => {
    cy.login();
    cy.visitCasesPage(data.case.search_criteria);
  };

  it('Case', () => {
    setupTest();
    CasesTable.validations.shouldShowColumnContent('case', data.case);
  });

  it('Patient', () => {
    setupTest();
    CasesTable.validations.shouldShowColumnContent('patient', data.case);
  });

  it('MRN', () => {
    setupTest();
    CasesTable.validations.shouldShowColumnContent('mrn', data.case);
  });

  it('Priority', () => {
    setupTest();
    CasesTable.validations.shouldShowColumnContent('priority', data.case);
  });

  it('Status', () => {
    setupTest();
    CasesTable.validations.shouldShowColumnContent('status', data.case);
  });

  it('Type', () => {
    setupTest();
    CasesTable.validations.shouldShowColumnContent('type', data.case);
  });

  it('Analysis', () => {
    setupTest();
    CasesTable.validations.shouldShowColumnContent('analysis', data.case);
  });

  it('Primary Condition', () => {
    setupTest();
    CasesTable.validations.shouldShowColumnContent('primary_condition', data.case);
  });

  it('Req. By', () => {
    setupTest();
    CasesTable.validations.shouldShowColumnContent('req_by', data.case);
  });

  it('Project', () => {
    setupTest();
    CasesTable.validations.shouldShowColumnContent('project', data.case);
  });

  it('Created On', () => {
    setupTest();
    CasesTable.validations.shouldShowColumnContent('created_on', data.case);
  });

  it('Updated', () => {
    setupTest();
    CasesTable.validations.shouldShowColumnContent('updated_on', data.case);
  });

  it('Prescriber', () => {
    setupTest();
    CasesTable.validations.shouldShowColumnContent('prescriber', data.case);
  });

  it('Diagnostic Lab', () => {
    setupTest();
    CasesTable.validations.shouldShowColumnContent('diagnostic_lab', data.case);
  });

  it('Request', () => {
    setupTest();
    CasesTable.validations.shouldShowColumnContent('request', data.case);
  });

  it('Managing Org.', () => {
    setupTest();
    CasesTable.validations.shouldShowColumnContent('managing_org', data.case);
  });

  it('Actions', () => {
    setupTest();
    CasesTable.validations.shouldShowColumnContent('actions', data.case);
  });
});
