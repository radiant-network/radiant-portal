/// <reference types="cypress"/>
import 'support/commands';
import { CaseEntity_Variants_SNV } from 'pom/pages/CaseEntity_Variants_SNV';

describe('Case Entity - Variants - SNV - Sort', () => {
  const setupTest = () => {
    cy.login();
    cy.visitCaseVariantsPage('1', 'SNV');
  };

  it('Api request [SJRA-661]', () => {
    setupTest();
    CaseEntity_Variants_SNV.validations.shouldRequestOnSort('variant');
  });

  it('Alphanumeric', () => {
    setupTest();
    CaseEntity_Variants_SNV.validations.shouldSortColumn('variant');
  });

  // Activate after SJRA-661
  it.skip('Number', () => {
    setupTest();
    CaseEntity_Variants_SNV.validations.shouldSortColumn('exomiser');
  });

  it('Tag', () => {
    setupTest();
    CaseEntity_Variants_SNV.validations.shouldSortColumn('acmg_exomiser');
  });

  // Activate after SJRA-661
  it.skip('Scientific number', () => {
    setupTest();
    CaseEntity_Variants_SNV.validations.shouldSortColumn('gnomad');
  });

  it('Multiple [SJRA-661]', () => {
    setupTest();
    CaseEntity_Variants_SNV.actions.unsortAllColumns();
    CaseEntity_Variants_SNV.actions.sortColumn('gnomad');
    CaseEntity_Variants_SNV.actions.sortColumn('type');
    CaseEntity_Variants_SNV.validations.shouldHaveFirstRowValue('Deletion', 'type');
  });
});
