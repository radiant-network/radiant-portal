/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { CaseEntity_Variants_SNV_Table } from 'pom/pages/CaseEntity_Variants_SNV_Table';
import { CaseEntity_Variants_SavedFilters } from 'pom/pages/CaseEntity_Variants_SavedFilters';

describe('Case Entity - Variants - Germline - SNV - Table - Request Validation', () => {
  const setupTest = () => {
    cy.login();
  };

  it('Sort', () => {
    setupTest();
    cy.visitCaseVariantsPage(data.case.case, data.case.seq.seq_id, 'SNV');
    CaseEntity_Variants_SavedFilters.snv.actions.selectFilterInDropdown('Cypress_All_Variants'); // Apply a filter for a cleaner query builder
    CaseEntity_Variants_SavedFilters.snv.actions.clickNewFilterButton(); // Clean Query Builder
    CaseEntity_Variants_SNV_Table.germline.validations.shouldRequestOnSort('variant');
  });

  it('Paging', () => {
    setupTest();
    CaseEntity_Variants_SNV_Table.germline.validations.shouldRequestOnPageChange(data.case);
  });
});
