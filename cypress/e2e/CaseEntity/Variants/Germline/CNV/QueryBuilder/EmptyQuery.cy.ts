/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { CaseEntity_Variants_QueryBuilder } from 'pom/pages/CaseEntity_Variants_QueryBuilder';
import { CaseEntity_Variants_SavedFilters } from 'pom/pages/CaseEntity_Variants_SavedFilters';

describe('Case Entity - Variants - Germline - CNV - Query builder - Empty query', () => {
  const setupTest = () => {
    cy.login();
    cy.visitCaseVariantsPage(data.case.case, data.case.seq.seq_id, 'CNV');
    CaseEntity_Variants_SavedFilters.cnv.actions.selectFilterInDropdown('Cypress_All_Variants'); // Apply a filter for a cleaner query builder
    CaseEntity_Variants_SavedFilters.cnv.actions.clickNewFilterButton(); // Clean Query Builder (empty query)
  };

  it('Build a first pill', () => {
    setupTest();
    CaseEntity_Variants_QueryBuilder.cnv.actions.buildFirstPill();

    CaseEntity_Variants_QueryBuilder.cnv.validations.shouldHaveChromosomePill();
    CaseEntity_Variants_QueryBuilder.cnv.validations.shouldHaveActivePillCount(1);
    CaseEntity_Variants_QueryBuilder.cnv.validations.shouldHaveQueryCount();
    CaseEntity_Variants_QueryBuilder.cnv.validations.shouldShowClearAll(false /*shouldExist*/);
  });

  it('Collapse and expand the query panel', () => {
    setupTest();
    CaseEntity_Variants_QueryBuilder.cnv.validations.shouldBeCollapsed(false /*collapsed*/);

    CaseEntity_Variants_QueryBuilder.cnv.actions.toggleCollapse();
    CaseEntity_Variants_QueryBuilder.cnv.validations.shouldBeCollapsed(true /*collapsed*/);

    CaseEntity_Variants_QueryBuilder.cnv.actions.toggleCollapse();
    CaseEntity_Variants_QueryBuilder.cnv.validations.shouldBeCollapsed(false /*collapsed*/);
  });
});
