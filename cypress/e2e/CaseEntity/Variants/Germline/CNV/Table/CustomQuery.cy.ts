/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { CaseEntity_Variants_CNV_Table } from 'pom/pages/CaseEntity_Variants_CNV_Table';
import { CaseEntity_Variants_SavedFilters } from 'pom/pages/CaseEntity_Variants_SavedFilters';

describe('Case Entity - Variants - Germline - CNV - Table - Custom query', () => {
  const setupTest = () => {
    cy.login();
    cy.visitCaseVariantsPage(data.case.case, data.case.seq.seq_id, 'CNV');
    CaseEntity_Variants_SavedFilters.cnv.actions.selectFilterInDropdown('Cypress_All_Variants'); // Apply a filter for a cleaner query builder
    CaseEntity_Variants_SavedFilters.cnv.actions.clickNewFilterButton(); // Clean Query Builder
  };

  it('Save icon', () => {
    setupTest();
    CaseEntity_Variants_CNV_Table.validations.shouldHaveCustomQuery();
  });
});
