/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { CaseEntity_Variants_QueryBuilder } from 'pom/pages/CaseEntity_Variants_QueryBuilder';
import { CaseEntity_Variants_SavedFilters } from 'pom/pages/CaseEntity_Variants_SavedFilters';

describe('Case Entity - Variants - Germline - SNV - Query builder - Two queries', () => {
  const setupTest = () => {
    cy.login();
    cy.visitCaseVariantsPage(data.case.case, data.case.seq.seq_id, 'SNV');
    CaseEntity_Variants_SavedFilters.snv.actions.selectFilterInDropdown('Cypress_QB_2Queries');
  };

  it('Select the active query', () => {
    setupTest();
    CaseEntity_Variants_QueryBuilder.snv.actions.setActiveQuery(0);
    CaseEntity_Variants_QueryBuilder.snv.validations.shouldHaveChromosomePill();

    CaseEntity_Variants_QueryBuilder.snv.actions.setActiveQuery(1);
    CaseEntity_Variants_QueryBuilder.snv.validations.shouldHaveVariantTypePill();
  });

  it('Combine two queries with AND', () => {
    setupTest();
    CaseEntity_Variants_QueryBuilder.snv.actions.selectQuery(0);
    CaseEntity_Variants_QueryBuilder.snv.actions.selectQuery(1);
    CaseEntity_Variants_QueryBuilder.snv.actions.combineQueries('and');

    CaseEntity_Variants_QueryBuilder.snv.validations.shouldHaveQueryCountTotal(3);
    CaseEntity_Variants_QueryBuilder.snv.validations.shouldHaveActivePillCount(2);
    CaseEntity_Variants_QueryBuilder.snv.validations.shouldHaveOperator('and');
  });

  it('Combine two queries with OR', () => {
    setupTest();
    CaseEntity_Variants_QueryBuilder.snv.actions.selectQuery(0);
    CaseEntity_Variants_QueryBuilder.snv.actions.selectQuery(1);
    CaseEntity_Variants_QueryBuilder.snv.actions.combineQueries('or');

    CaseEntity_Variants_QueryBuilder.snv.validations.shouldHaveQueryCountTotal(3);
    CaseEntity_Variants_QueryBuilder.snv.validations.shouldHaveActivePillCount(2);
    CaseEntity_Variants_QueryBuilder.snv.validations.shouldHaveOperator('or');
  });

  it('Combine two queries with the default button', () => {
    setupTest();
    CaseEntity_Variants_QueryBuilder.snv.actions.selectQuery(0);
    CaseEntity_Variants_QueryBuilder.snv.actions.selectQuery(1);
    CaseEntity_Variants_QueryBuilder.snv.actions.combineQueries('default');

    CaseEntity_Variants_QueryBuilder.snv.validations.shouldHaveQueryCountTotal(3);
    CaseEntity_Variants_QueryBuilder.snv.validations.shouldHaveActivePillCount(2);
    CaseEntity_Variants_QueryBuilder.snv.validations.shouldHaveOperator('and');
  });

  it('Delete a query and cancel', () => {
    setupTest();
    CaseEntity_Variants_QueryBuilder.snv.validations.shouldHaveQueryCountTotal(2);

    CaseEntity_Variants_QueryBuilder.snv.actions.deleteQuery(0, false /*confirm*/);
    CaseEntity_Variants_QueryBuilder.snv.validations.shouldHaveQueryCountTotal(2);
  });

  it('Delete a query and confirm', () => {
    setupTest();
    CaseEntity_Variants_QueryBuilder.snv.validations.shouldHaveQueryCountTotal(2);

    CaseEntity_Variants_QueryBuilder.snv.actions.deleteQuery(0, true /*confirm*/);
    CaseEntity_Variants_QueryBuilder.snv.validations.shouldHaveQueryCountTotal(1);
    CaseEntity_Variants_QueryBuilder.snv.validations.shouldHaveVariantTypePill();
  });

  it('Delete a query referenced in a combination', () => {
    setupTest();
    CaseEntity_Variants_QueryBuilder.snv.actions.selectQuery(0);
    CaseEntity_Variants_QueryBuilder.snv.actions.selectQuery(1);
    CaseEntity_Variants_QueryBuilder.snv.actions.combineQueries('default');
    CaseEntity_Variants_QueryBuilder.snv.validations.shouldHaveQueryCountTotal(3);
    CaseEntity_Variants_QueryBuilder.snv.validations.shouldHavePillCountAt(2 /*combined query*/, 2);

    CaseEntity_Variants_QueryBuilder.snv.actions.deleteQuery(0, true /*confirm*/);
    CaseEntity_Variants_QueryBuilder.snv.validations.shouldHaveQueryCountTotal(2);
    CaseEntity_Variants_QueryBuilder.snv.validations.shouldHavePillCountAt(1 /*combined query*/, 1);
  });

  it('Clear all queries and cancel', () => {
    setupTest();
    CaseEntity_Variants_QueryBuilder.snv.validations.shouldHaveQueryCountTotal(2);

    CaseEntity_Variants_QueryBuilder.snv.actions.clickClearAll(false /*confirm*/);
    CaseEntity_Variants_QueryBuilder.snv.validations.shouldHaveQueryCountTotal(2);
    CaseEntity_Variants_QueryBuilder.snv.validations.shouldShowClearAll(true /*shouldExist*/);
  });

  it('Clear all queries and confirm', () => {
    setupTest();
    CaseEntity_Variants_QueryBuilder.snv.validations.shouldHaveQueryCountTotal(2);

    CaseEntity_Variants_QueryBuilder.snv.actions.clickClearAll(true /*confirm*/);
    CaseEntity_Variants_QueryBuilder.snv.validations.shouldHaveQueryCountTotal(1);
    CaseEntity_Variants_QueryBuilder.snv.validations.shouldBeEmptyQuery();
    CaseEntity_Variants_QueryBuilder.snv.validations.shouldShowClearAll(false /*shouldExist*/);
  });
});
