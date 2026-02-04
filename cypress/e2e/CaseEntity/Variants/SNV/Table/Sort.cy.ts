/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { CaseEntity_Variants_SNV_Table } from 'pom/pages/CaseEntity_Variants_SNV_Table';

describe('Case Entity - Variants - SNV - Table - Sort', () => {
  const setupTest = () => {
    cy.login();
    cy.visitCaseVariantsPage(data.case.case, 'SNV');
  };

  it('Alphanumeric', () => {
    setupTest();
    CaseEntity_Variants_SNV_Table.validations.shouldSortColumn('variant', false /*hasUniqueValues*/, true /*isReverseSorting*/);
  });

  it('Number', () => {
    setupTest();
    CaseEntity_Variants_SNV_Table.validations.shouldSortColumn('exomiser', false /*hasUniqueValues*/, false /*isReverseSorting*/);
  });

  it('Tag', () => {
    setupTest();
    CaseEntity_Variants_SNV_Table.validations.shouldSortColumn('acmg_exomiser', false /*hasUniqueValues*/, true /*isReverseSorting*/);
  });

  it('Scientific number', () => {
    setupTest();
    CaseEntity_Variants_SNV_Table.validations.shouldSortColumn('gnomad', false /*hasUniqueValues*/, false /*isReverseSorting*/);
  });

  it('Multiple', () => {
    setupTest();
    CaseEntity_Variants_SNV_Table.actions.sortColumn('gnomad');
    CaseEntity_Variants_SNV_Table.actions.sortColumn('gq');
    CaseEntity_Variants_SNV_Table.actions.sortColumn('gq');
    CaseEntity_Variants_SNV_Table.validations.shouldHaveFirstRowValue('3.00', 'gq');
  });
});
