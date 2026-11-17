/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { CasesTable } from 'pom/pages/CasesTable';

// Read-only checks: set the page up once and share it between tests.
describe('Cases - Information displayed', { testIsolation: false }, () => {
  before(() => {
    cy.login();
    cy.resetTablePreferences();
    cy.visitCasesPage(data.case.search_criteria);
    CasesTable.actions.showAllColumns();
  });

  it('Case', () => {
    CasesTable.validations.shouldShowColumnContent('case', data.case);
  });

  it('Patient', () => {
    CasesTable.validations.shouldShowColumnContent('patient', data.case);
  });

  it('MRN', () => {
    CasesTable.validations.shouldShowColumnContent('mrn', data.case);
  });

  it('Priority', () => {
    CasesTable.validations.shouldShowColumnContent('priority', data.case);
  });

  it('Status', () => {
    CasesTable.validations.shouldShowColumnContent('status', data.case);
  });

  it('Type', () => {
    CasesTable.validations.shouldShowColumnContent('type', data.case);
  });

  it('Analysis', () => {
    CasesTable.validations.shouldShowColumnContent('analysis', data.case);
  });

  it('Primary Condition', () => {
    CasesTable.validations.shouldShowColumnContent('primary_condition', data.case);
  });

  it('Req. By', () => {
    CasesTable.validations.shouldShowColumnContent('req_by', data.case);
  });

  it('Sample', () => {
    CasesTable.validations.shouldShowColumnContent('sample', data.case);
  });

  it('Run', () => {
    CasesTable.validations.shouldShowColumnContent('run', data.case);
  });

  it('Project', () => {
    CasesTable.validations.shouldShowColumnContent('project', data.case);
  });

  it('Created On', () => {
    CasesTable.validations.shouldShowColumnContent('created_on', data.case);
  });

  it('Updated', () => {
    CasesTable.validations.shouldShowColumnContent('updated_on', data.case);
  });

  it('Prescriber', () => {
    CasesTable.validations.shouldShowColumnContent('prescriber', data.case);
  });

  it('Diagnostic Lab', () => {
    CasesTable.validations.shouldShowColumnContent('diagnostic_lab', data.case);
  });

  it('Managing Org.', () => {
    CasesTable.validations.shouldShowColumnContent('managing_org', data.case);
  });

  it('Actions', () => {
    CasesTable.validations.shouldShowColumnContent('actions', data.case);
  });
});
