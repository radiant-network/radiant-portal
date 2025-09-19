/// <reference types="cypress"/>
import 'support/commands';
import { CaseEntity_Variants } from 'pom/pages/CaseEntity_Variants';

describe('Case Entity - Variants - Sort', () => {
  const setupTest = () => {
    cy.login();
    cy.visitCaseVariantsPage('1');
  };

  it('Api request [SJRA-661]', () => {
    setupTest();
    CaseEntity_Variants.validations.shouldRequestOnSort('variant');
  });

  it('Alphanumeric', () => {
    setupTest();
    CaseEntity_Variants.validations.shouldSortColumn('variant');
  });

  // Activate after SJRA-661
  it.skip('Number', () => {
    setupTest();
    CaseEntity_Variants.validations.shouldSortColumn('exomiser');
  });

  it('Tag', () => {
    setupTest();
    CaseEntity_Variants.validations.shouldSortColumn('acmg_exomiser');
  });

  // Activate after SJRA-661
  it.skip('Scientific number', () => {
    setupTest();
    CaseEntity_Variants.validations.shouldSortColumn('gnomad');
  });

  it('Multiple [SJRA-661]', () => {
    setupTest();
    CaseEntity_Variants.actions.unsortAllColumns();
    CaseEntity_Variants.actions.sortColumn('gnomad');
    CaseEntity_Variants.actions.sortColumn('type');
    CaseEntity_Variants.validations.shouldHaveFirstRowValue('Deletion', 'type');
  });
});
