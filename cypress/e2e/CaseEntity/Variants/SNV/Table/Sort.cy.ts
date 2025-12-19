/// <reference types="cypress"/>
import 'support/commands';
import { CaseEntity_Variants_SNV_Table } from 'pom/pages/CaseEntity_Variants_SNV_Table';

describe('Case Entity - Variants - SNV - Table - Sort', () => {
  const setupTest = () => {
    cy.login();
    cy.visitCaseVariantsPage('1', 'SNV');
  };

  it('Alphanumeric', () => {
    setupTest();
    CaseEntity_Variants_SNV_Table.validations.shouldSortColumn('variant');
  });

  it('Number', () => {
    setupTest();
    CaseEntity_Variants_SNV_Table.validations.shouldSortColumn('exomiser');
  });

  it('Tag', () => {
    setupTest();
    CaseEntity_Variants_SNV_Table.validations.shouldSortColumn('acmg_exomiser');
  });

  it('Scientific number', () => {
    setupTest();
    CaseEntity_Variants_SNV_Table.validations.shouldSortColumn('gnomad');
  });

  it('Multiple', () => {
    setupTest();
    CaseEntity_Variants_SNV_Table.actions.unsortAllColumns();
    CaseEntity_Variants_SNV_Table.actions.sortColumn('gnomad');
    CaseEntity_Variants_SNV_Table.actions.sortColumn('gq');
    CaseEntity_Variants_SNV_Table.actions.sortColumn('gq');
    CaseEntity_Variants_SNV_Table.validations.shouldHaveFirstRowValue('3.00', 'gq');
  });
});
