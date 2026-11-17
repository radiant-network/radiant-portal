/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { CasesTable } from 'pom/pages/CasesTable';

// Read-only checks: set the page up once and share it between tests.
describe('Cases - Information displayed', { testIsolation: false }, () => {
  before(() => {
    cy.login();
    cy.visitCasesPage(data.case.search_criteria);
    CasesTable.actions.showAllColumns();
  });

  it('Case', () => {
    CasesTable.validations.shouldShowColumnContent('case', data.case, false);
  });

  it('Patient', () => {
    CasesTable.validations.shouldShowColumnContent('patient', data.case, false);
  });

  it('MRN', () => {
    CasesTable.validations.shouldShowColumnContent('mrn', data.case, false);
  });

  it('Priority', () => {
    CasesTable.validations.shouldShowColumnContent('priority', data.case, false);
  });

  it('Status', () => {
    CasesTable.validations.shouldShowColumnContent('status', data.case, false);
  });

  it('Type', () => {
    CasesTable.validations.shouldShowColumnContent('type', data.case, false);
  });

  it('Analysis', () => {
    CasesTable.validations.shouldShowColumnContent('analysis', data.case, false);
  });

  it('Primary Condition', () => {
    CasesTable.validations.shouldShowColumnContent('primary_condition', data.case, false);
  });

  it('Req. By', () => {
    CasesTable.validations.shouldShowColumnContent('req_by', data.case, false);
  });

  it('Sample', () => {
    CasesTable.validations.shouldShowColumnContent('sample', data.case, false);
  });

  it('Run', () => {
    CasesTable.validations.shouldShowColumnContent('run', data.case, false);
  });

  it('Project', () => {
    CasesTable.validations.shouldShowColumnContent('project', data.case, false);
  });

  it('Created On', () => {
    CasesTable.validations.shouldShowColumnContent('created_on', data.case, false);
  });

  it('Updated', () => {
    CasesTable.validations.shouldShowColumnContent('updated_on', data.case, false);
  });

  it('Prescriber', () => {
    CasesTable.validations.shouldShowColumnContent('prescriber', data.case, false);
  });

  it('Diagnostic Lab', () => {
    CasesTable.validations.shouldShowColumnContent('diagnostic_lab', data.case, false);
  });

  it('Managing Org.', () => {
    CasesTable.validations.shouldShowColumnContent('managing_org', data.case, false);
  });

  it('Actions', () => {
    CasesTable.validations.shouldShowColumnContent('actions', data.case, false);
  });
});
