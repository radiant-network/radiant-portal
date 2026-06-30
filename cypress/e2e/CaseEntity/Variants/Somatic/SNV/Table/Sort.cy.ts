/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { CaseEntity_Variants_SNV_Table } from 'pom/pages/CaseEntity_Variants_SNV_Table';
import { CaseEntity_Variants_SavedFilters } from 'pom/pages/CaseEntity_Variants_SavedFilters';

describe('Case Entity - Variants - Somatic - SNV - Table - Sort', () => {
  const setupTest = () => {
    cy.login();
    cy.visitCaseVariantsPage(data.caseSomatic.case, data.caseSomatic.seq.seq_id, 'SNV');
    CaseEntity_Variants_SavedFilters.snv.actions.clickNewFilterButton(); // Clean Query Builder
  };

  it('Alphanumeric', () => {
    setupTest();
    CaseEntity_Variants_SNV_Table.somatic.validations.shouldSortColumn('variant', false /*hasUniqueValues*/, true /*isReverseSorting*/);
  });

  it('Number', () => {
    setupTest();
    CaseEntity_Variants_SNV_Table.somatic.validations.shouldSortColumn('ad_ratio', false /*hasUniqueValues*/, false /*isReverseSorting*/);
  });

  it('Tag', () => {
    setupTest();
    CaseEntity_Variants_SNV_Table.somatic.validations.shouldSortColumn('type', false /*hasUniqueValues*/, true /*isReverseSorting*/);
  });

  it('Scientific number', () => {
    setupTest();
    CaseEntity_Variants_SNV_Table.somatic.validations.shouldSortColumn('gnomad', false /*hasUniqueValues*/, false /*isReverseSorting*/);
  });

  it('Multiple', () => {
    setupTest();
    CaseEntity_Variants_SNV_Table.somatic.actions.showColumn('ad_ratio');
    CaseEntity_Variants_SNV_Table.somatic.actions.sortColumn('freq_tn');
    CaseEntity_Variants_SNV_Table.somatic.actions.sortColumn('ad_ratio');
    CaseEntity_Variants_SNV_Table.somatic.actions.sortColumn('ad_ratio');
    CaseEntity_Variants_SNV_Table.somatic.validations.shouldHaveFirstRowValue('0.04', 'ad_ratio');
  });
});
