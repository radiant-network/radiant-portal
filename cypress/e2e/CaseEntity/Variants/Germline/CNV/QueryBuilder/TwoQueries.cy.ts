/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { CaseEntity_Variants_QueryBuilder } from 'pom/pages/CaseEntity_Variants_QueryBuilder';
import { CaseEntity_Variants_SavedFilters } from 'pom/pages/CaseEntity_Variants_SavedFilters';

describe('Case Entity - Variants - Germline - CNV - Query builder - Two queries', () => {
  const setupTest = () => {
    cy.login();
    cy.visitCaseVariantsPage(data.case.case, data.case.seq.seq_id, 'CNV');
    CaseEntity_Variants_SavedFilters.cnv.actions.selectFilterInDropdown('Cypress_QB_2Queries');
  };

  it('Select the active query', () => {
    setupTest();
    CaseEntity_Variants_QueryBuilder.cnv.actions.setActiveQuery(0);
    CaseEntity_Variants_QueryBuilder.cnv.validations.shouldHaveChromosomePill();

    CaseEntity_Variants_QueryBuilder.cnv.actions.setActiveQuery(1);
    CaseEntity_Variants_QueryBuilder.cnv.validations.shouldHaveVariantTypePill();
  });

  it('Combine two queries with AND', () => {
    setupTest();
    CaseEntity_Variants_QueryBuilder.cnv.actions.selectQuery(0);
    CaseEntity_Variants_QueryBuilder.cnv.actions.selectQuery(1);
    CaseEntity_Variants_QueryBuilder.cnv.actions.combineQueries('and');

    CaseEntity_Variants_QueryBuilder.cnv.validations.shouldHaveQueryCountTotal(3);
    CaseEntity_Variants_QueryBuilder.cnv.validations.shouldHaveActivePillCount(2);
    CaseEntity_Variants_QueryBuilder.cnv.validations.shouldHaveOperator('and');
  });

  it('Combine two queries with OR', () => {
    setupTest();
    CaseEntity_Variants_QueryBuilder.cnv.actions.selectQuery(0);
    CaseEntity_Variants_QueryBuilder.cnv.actions.selectQuery(1);
    CaseEntity_Variants_QueryBuilder.cnv.actions.combineQueries('or');

    CaseEntity_Variants_QueryBuilder.cnv.validations.shouldHaveQueryCountTotal(3);
    CaseEntity_Variants_QueryBuilder.cnv.validations.shouldHaveActivePillCount(2);
    CaseEntity_Variants_QueryBuilder.cnv.validations.shouldHaveOperator('or');
  });

  it('Combine two queries with the default button', () => {
    setupTest();
    CaseEntity_Variants_QueryBuilder.cnv.actions.selectQuery(0);
    CaseEntity_Variants_QueryBuilder.cnv.actions.selectQuery(1);
    CaseEntity_Variants_QueryBuilder.cnv.actions.combineQueries('default');

    CaseEntity_Variants_QueryBuilder.cnv.validations.shouldHaveQueryCountTotal(3);
    CaseEntity_Variants_QueryBuilder.cnv.validations.shouldHaveActivePillCount(2);
    CaseEntity_Variants_QueryBuilder.cnv.validations.shouldHaveOperator('and');
  });

  it('Delete a query and cancel', () => {
    setupTest();
    CaseEntity_Variants_QueryBuilder.cnv.validations.shouldHaveQueryCountTotal(2);

    CaseEntity_Variants_QueryBuilder.cnv.actions.deleteQuery(0, false /*confirm*/);
    CaseEntity_Variants_QueryBuilder.cnv.validations.shouldHaveQueryCountTotal(2);
  });

  it('Delete a query and confirm', () => {
    setupTest();
    CaseEntity_Variants_QueryBuilder.cnv.validations.shouldHaveQueryCountTotal(2);

    CaseEntity_Variants_QueryBuilder.cnv.actions.deleteQuery(0, true /*confirm*/);
    CaseEntity_Variants_QueryBuilder.cnv.validations.shouldHaveQueryCountTotal(1);
    CaseEntity_Variants_QueryBuilder.cnv.validations.shouldHaveVariantTypePill();
  });

  it('Delete a query referenced in a combination', () => {
    setupTest();
    CaseEntity_Variants_QueryBuilder.cnv.actions.selectQuery(0);
    CaseEntity_Variants_QueryBuilder.cnv.actions.selectQuery(1);
    CaseEntity_Variants_QueryBuilder.cnv.actions.combineQueries('default');
    CaseEntity_Variants_QueryBuilder.cnv.validations.shouldHaveQueryCountTotal(3);
    CaseEntity_Variants_QueryBuilder.cnv.validations.shouldHavePillCountAt(2 /*combined query*/, 2);

    CaseEntity_Variants_QueryBuilder.cnv.actions.deleteQuery(0, true /*confirm*/);
    CaseEntity_Variants_QueryBuilder.cnv.validations.shouldHaveQueryCountTotal(2);
    CaseEntity_Variants_QueryBuilder.cnv.validations.shouldHavePillCountAt(1 /*combined query*/, 1);
  });

  it('Clear all queries and cancel', () => {
    setupTest();
    CaseEntity_Variants_QueryBuilder.cnv.validations.shouldHaveQueryCountTotal(2);

    CaseEntity_Variants_QueryBuilder.cnv.actions.clickClearAll(false /*confirm*/);
    CaseEntity_Variants_QueryBuilder.cnv.validations.shouldHaveQueryCountTotal(2);
    CaseEntity_Variants_QueryBuilder.cnv.validations.shouldShowClearAll(true /*shouldExist*/);
  });

  it('Clear all queries and confirm', () => {
    setupTest();
    CaseEntity_Variants_QueryBuilder.cnv.validations.shouldHaveQueryCountTotal(2);

    CaseEntity_Variants_QueryBuilder.cnv.actions.clickClearAll(true /*confirm*/);
    CaseEntity_Variants_QueryBuilder.cnv.validations.shouldHaveQueryCountTotal(1);
    CaseEntity_Variants_QueryBuilder.cnv.validations.shouldBeEmptyQuery();
    CaseEntity_Variants_QueryBuilder.cnv.validations.shouldShowClearAll(false /*shouldExist*/);
  });
});
