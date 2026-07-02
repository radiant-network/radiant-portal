/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { CaseEntity_Variants_SNV_Table } from 'pom/pages/CaseEntity_Variants_SNV_Table';
import { CaseEntity_Variants_SavedFilters } from 'pom/pages/CaseEntity_Variants_SavedFilters';

describe('Case Entity - Variants - Somatic - SNV - Table - Request Validation', () => {
  const setupTest = () => {
    cy.login();
  };

  it('Sort', () => {
    setupTest();
    cy.visitCaseVariantsPage(data.caseSomatic.case, data.caseSomatic.seq.seq_id, 'SNV');
    CaseEntity_Variants_SavedFilters.snv.actions.selectFilterInDropdown('Cypress_All_Variants'); // Apply a filter for a cleaner query builder
    CaseEntity_Variants_SavedFilters.snv.actions.clickNewFilterButton(); // Clean Query Builder
    CaseEntity_Variants_SNV_Table.somatic.validations.shouldRequestOnSort('variant');
  });

  it('Paging [SJRA-1684]', () => {
    setupTest();
    CaseEntity_Variants_SNV_Table.somatic.validations.shouldRequestOnPageChange(data.caseSomatic);
  });
});
