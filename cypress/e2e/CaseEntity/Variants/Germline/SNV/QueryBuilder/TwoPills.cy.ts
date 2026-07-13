/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { CaseEntity_Variants_QueryBuilder } from 'pom/pages/CaseEntity_Variants_QueryBuilder';
import { CaseEntity_Variants_SavedFilters } from 'pom/pages/CaseEntity_Variants_SavedFilters';

describe('Case Entity - Variants - Germline - SNV - Query builder - Two pills', () => {
  const setupTest = () => {
    cy.login();
    cy.visitCaseVariantsPage(data.case.case, data.case.seq.seq_id, 'SNV');
    CaseEntity_Variants_SavedFilters.snv.actions.selectFilterInDropdown('Cypress_QB_2Pills');
  };

  it('Toggle the query operator', () => {
    setupTest();
    CaseEntity_Variants_QueryBuilder.snv.validations.shouldHaveOperator('and');

    CaseEntity_Variants_QueryBuilder.snv.actions.toggleOperator();
    CaseEntity_Variants_QueryBuilder.snv.validations.shouldHaveOperator('or');

    CaseEntity_Variants_QueryBuilder.snv.actions.toggleOperator();
    CaseEntity_Variants_QueryBuilder.snv.validations.shouldHaveOperator('and');
  });

  it('Remove a pill with the X', () => {
    setupTest();
    CaseEntity_Variants_QueryBuilder.snv.validations.shouldHaveActivePillCount(2);

    CaseEntity_Variants_QueryBuilder.snv.actions.removePill(0 /*chromosome*/);
    CaseEntity_Variants_QueryBuilder.snv.validations.shouldHaveActivePillCount(1);
    CaseEntity_Variants_QueryBuilder.snv.validations.shouldHaveVariantTypePill();
  });
});
