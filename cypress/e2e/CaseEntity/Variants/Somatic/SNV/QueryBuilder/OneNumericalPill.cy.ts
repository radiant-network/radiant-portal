/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { CaseEntity_Variants_QueryBuilder } from 'pom/pages/CaseEntity_Variants_QueryBuilder';
import { CaseEntity_Variants_SavedFilters } from 'pom/pages/CaseEntity_Variants_SavedFilters';

describe('Case Entity - Variants - Somatic - SNV - Query builder - One numerical pill', () => {
  const setupTest = () => {
    cy.login();
    cy.visitCaseVariantsPage(data.caseSomatic.case, data.caseSomatic.seq.seq_id, 'SNV');
    CaseEntity_Variants_SavedFilters.somatic.actions.selectFilterInDropdown('Cypress_QB_1NumericalPill');
  };

  it('Edit a pill via its inline popup', () => {
    setupTest();
    CaseEntity_Variants_QueryBuilder.somatic.actions.editPillInline();

    CaseEntity_Variants_QueryBuilder.somatic.validations.shouldHaveNumericalPill(['9']);
    CaseEntity_Variants_QueryBuilder.somatic.validations.shouldHaveActivePillCount(1);
  });
});
