/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { CaseEntity_Variants_QueryBuilder } from 'pom/pages/CaseEntity_Variants_QueryBuilder';
import { CaseEntity_Variants_SavedFilters } from 'pom/pages/CaseEntity_Variants_SavedFilters';

describe('Case Entity - Variants - Germline - CNV - Query builder - One numerical pill', () => {
  const setupTest = () => {
    cy.login();
    cy.visitCaseVariantsPage(data.case.case, data.case.seq.seq_id, 'CNV');
    CaseEntity_Variants_SavedFilters.cnv.actions.selectFilterInDropdown('Cypress_QB_1NumericalPill');
  };

  it('Edit a pill via its inline popup', () => {
    setupTest();
    CaseEntity_Variants_QueryBuilder.cnv.actions.editPillInline();

    CaseEntity_Variants_QueryBuilder.cnv.validations.shouldHaveNumericalPill(['9']);
    CaseEntity_Variants_QueryBuilder.cnv.validations.shouldHaveActivePillCount(1);
  });
});
