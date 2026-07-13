/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { CaseEntity_Variants_QueryBuilder } from 'pom/pages/CaseEntity_Variants_QueryBuilder';
import { CaseEntity_Variants_SavedFilters } from 'pom/pages/CaseEntity_Variants_SavedFilters';

describe('Case Entity - Variants - Germline - CNV - Query builder - One pill', () => {
  const setupTest = () => {
    cy.login();
    cy.visitCaseVariantsPage(data.case.case, data.case.seq.seq_id, 'CNV');
    CaseEntity_Variants_SavedFilters.cnv.actions.selectFilterInDropdown('Cypress_QB_1Pill');
  };

  it('Add a second pill', () => {
    setupTest();
    CaseEntity_Variants_QueryBuilder.cnv.actions.addSecondPill();

    CaseEntity_Variants_QueryBuilder.cnv.validations.shouldHaveActivePillCount(2);
    CaseEntity_Variants_QueryBuilder.cnv.validations.shouldHaveChromosomePill();
    CaseEntity_Variants_QueryBuilder.cnv.validations.shouldHaveVariantTypePill();
    CaseEntity_Variants_QueryBuilder.cnv.validations.shouldHaveOperator('and');
  });

  it('Edit a pill via the facet', () => {
    setupTest();
    CaseEntity_Variants_QueryBuilder.cnv.actions.editPillViaFacet();

    CaseEntity_Variants_QueryBuilder.cnv.validations.shouldHaveChromosomePill();
    CaseEntity_Variants_QueryBuilder.cnv.validations.shouldHaveActivePillCount(1);
  });

  it('Remove the last pill of a query', () => {
    setupTest();
    CaseEntity_Variants_QueryBuilder.cnv.actions.removePill(0);

    CaseEntity_Variants_QueryBuilder.cnv.validations.shouldHaveActivePillCount(0);
    CaseEntity_Variants_QueryBuilder.cnv.validations.shouldBeEmptyQuery();
    CaseEntity_Variants_QueryBuilder.cnv.validations.shouldHaveQueryCountTotal(1);
  });

  it('Create a new query', () => {
    setupTest();
    CaseEntity_Variants_QueryBuilder.cnv.actions.clickNewQuery();

    CaseEntity_Variants_QueryBuilder.cnv.validations.shouldHaveQueryCountTotal(2);
    CaseEntity_Variants_QueryBuilder.cnv.validations.shouldBeEmptyQuery();
    CaseEntity_Variants_QueryBuilder.cnv.validations.shouldShowClearAll(true /*shouldExist*/);
  });

  it('Duplicate a query', () => {
    setupTest();
    CaseEntity_Variants_QueryBuilder.cnv.actions.duplicateQuery(0);

    CaseEntity_Variants_QueryBuilder.cnv.validations.shouldHaveQueryCountTotal(2);
    CaseEntity_Variants_QueryBuilder.cnv.validations.shouldHaveChromosomePill();
  });

  it('Show and hide field labels', () => {
    setupTest();
    CaseEntity_Variants_QueryBuilder.cnv.validations.shouldShowLabels(true /*shouldShow*/);

    CaseEntity_Variants_QueryBuilder.cnv.actions.toggleLabels();
    CaseEntity_Variants_QueryBuilder.cnv.validations.shouldShowLabels(false /*shouldShow*/);

    CaseEntity_Variants_QueryBuilder.cnv.actions.toggleLabels();
    CaseEntity_Variants_QueryBuilder.cnv.validations.shouldShowLabels(true /*shouldShow*/);
  });
});
