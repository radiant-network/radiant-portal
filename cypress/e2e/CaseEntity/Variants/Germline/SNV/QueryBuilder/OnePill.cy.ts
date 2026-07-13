/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { CaseEntity_Variants_QueryBuilder } from 'pom/pages/CaseEntity_Variants_QueryBuilder';
import { CaseEntity_Variants_SavedFilters } from 'pom/pages/CaseEntity_Variants_SavedFilters';

describe('Case Entity - Variants - Germline - SNV - Query builder - One pill', () => {
  const setupTest = () => {
    cy.login();
    cy.visitCaseVariantsPage(data.case.case, data.case.seq.seq_id, 'SNV');
    CaseEntity_Variants_SavedFilters.snv.actions.selectFilterInDropdown('Cypress_QB_1Pill');
  };

  it('Add a second pill', () => {
    setupTest();
    CaseEntity_Variants_QueryBuilder.snv.actions.addSecondPill();

    CaseEntity_Variants_QueryBuilder.snv.validations.shouldHaveActivePillCount(2);
    CaseEntity_Variants_QueryBuilder.snv.validations.shouldHaveChromosomePill();
    CaseEntity_Variants_QueryBuilder.snv.validations.shouldHaveVariantTypePill();
    CaseEntity_Variants_QueryBuilder.snv.validations.shouldHaveOperator('and');
  });

  it('Edit a pill via the facet', () => {
    setupTest();
    CaseEntity_Variants_QueryBuilder.snv.actions.editPillViaFacet();

    CaseEntity_Variants_QueryBuilder.snv.validations.shouldHaveChromosomePill();
    CaseEntity_Variants_QueryBuilder.snv.validations.shouldHaveActivePillCount(1);
  });

  it('Remove the last pill of a query', () => {
    setupTest();
    CaseEntity_Variants_QueryBuilder.snv.actions.removePill(0);

    CaseEntity_Variants_QueryBuilder.snv.validations.shouldHaveActivePillCount(0);
    CaseEntity_Variants_QueryBuilder.snv.validations.shouldBeEmptyQuery();
    CaseEntity_Variants_QueryBuilder.snv.validations.shouldHaveQueryCountTotal(1);
  });

  it('Create a new query', () => {
    setupTest();
    CaseEntity_Variants_QueryBuilder.snv.actions.clickNewQuery();

    CaseEntity_Variants_QueryBuilder.snv.validations.shouldHaveQueryCountTotal(2);
    CaseEntity_Variants_QueryBuilder.snv.validations.shouldBeEmptyQuery();
    CaseEntity_Variants_QueryBuilder.snv.validations.shouldShowClearAll(true /*shouldExist*/);
  });

  it('Duplicate a query', () => {
    setupTest();
    CaseEntity_Variants_QueryBuilder.snv.actions.duplicateQuery(0);

    CaseEntity_Variants_QueryBuilder.snv.validations.shouldHaveQueryCountTotal(2);
    CaseEntity_Variants_QueryBuilder.snv.validations.shouldHaveChromosomePill();
  });

  it('Show and hide field labels', () => {
    setupTest();
    CaseEntity_Variants_QueryBuilder.snv.validations.shouldShowLabels(true /*shouldShow*/);

    CaseEntity_Variants_QueryBuilder.snv.actions.toggleLabels();
    CaseEntity_Variants_QueryBuilder.snv.validations.shouldShowLabels(false /*shouldShow*/);

    CaseEntity_Variants_QueryBuilder.snv.actions.toggleLabels();
    CaseEntity_Variants_QueryBuilder.snv.validations.shouldShowLabels(true /*shouldShow*/);
  });
});
