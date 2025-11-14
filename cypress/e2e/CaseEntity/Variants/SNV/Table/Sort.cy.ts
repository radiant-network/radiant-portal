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

  // Activate after SJRA-661
  it.skip('Number', () => {
    setupTest();
    CaseEntity_Variants_SNV_Table.validations.shouldSortColumn('exomiser');
  });

  it('Tag', () => {
    setupTest();
    CaseEntity_Variants_SNV_Table.validations.shouldSortColumn('acmg_exomiser');
  });

  // Activate after SJRA-661
  it.skip('Scientific number', () => {
    setupTest();
    CaseEntity_Variants_SNV_Table.validations.shouldSortColumn('gnomad');
  });

  it('Multiple [SJRA-661]', () => {
    setupTest();
    CaseEntity_Variants_SNV_Table.actions.unsortAllColumns();
    CaseEntity_Variants_SNV_Table.actions.sortColumn('gnomad');
    CaseEntity_Variants_SNV_Table.actions.sortColumn('type');
    CaseEntity_Variants_SNV_Table.validations.shouldHaveFirstRowValue('Deletion', 'type');
  });
});
