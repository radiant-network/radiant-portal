/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { CaseEntity_Variants_QueryBuilder } from 'pom/pages/CaseEntity_Variants_QueryBuilder';
import { CaseEntity_Variants_SavedFilters } from 'pom/pages/CaseEntity_Variants_SavedFilters';

describe('Case Entity - Variants - Somatic - SNV - Query builder - One pill', () => {
  const setupTest = () => {
    cy.login();
    cy.visitCaseVariantsPage(data.caseSomatic.case, data.caseSomatic.seq.seq_id, 'SNV');
    CaseEntity_Variants_SavedFilters.somatic.actions.selectFilterInDropdown('Cypress_QB_1Pill');
  };

  it('Add a second pill', () => {
    setupTest();
    CaseEntity_Variants_QueryBuilder.somatic.actions.addSecondPill();

    CaseEntity_Variants_QueryBuilder.somatic.validations.shouldHaveActivePillCount(2);
    CaseEntity_Variants_QueryBuilder.somatic.validations.shouldHaveChromosomePill();
    CaseEntity_Variants_QueryBuilder.somatic.validations.shouldHaveVariantTypePill();
    CaseEntity_Variants_QueryBuilder.somatic.validations.shouldHaveOperator('and');
  });

  it('Edit a pill via the facet', () => {
    setupTest();
    CaseEntity_Variants_QueryBuilder.somatic.actions.editPillViaFacet();

    CaseEntity_Variants_QueryBuilder.somatic.validations.shouldHaveChromosomePill();
    CaseEntity_Variants_QueryBuilder.somatic.validations.shouldHaveActivePillCount(1);
  });

  it('Remove the last pill of a query', () => {
    setupTest();
    CaseEntity_Variants_QueryBuilder.somatic.actions.removePill(0);

    CaseEntity_Variants_QueryBuilder.somatic.validations.shouldHaveActivePillCount(0);
    CaseEntity_Variants_QueryBuilder.somatic.validations.shouldBeEmptyQuery();
    CaseEntity_Variants_QueryBuilder.somatic.validations.shouldHaveQueryCountTotal(1);
  });

  it('Create a new query', () => {
    setupTest();
    CaseEntity_Variants_QueryBuilder.somatic.actions.clickNewQuery();

    CaseEntity_Variants_QueryBuilder.somatic.validations.shouldHaveQueryCountTotal(2);
    CaseEntity_Variants_QueryBuilder.somatic.validations.shouldBeEmptyQuery();
    CaseEntity_Variants_QueryBuilder.somatic.validations.shouldShowClearAll(true /*shouldExist*/);
  });

  it('Duplicate a query', () => {
    setupTest();
    CaseEntity_Variants_QueryBuilder.somatic.actions.duplicateQuery(0);

    CaseEntity_Variants_QueryBuilder.somatic.validations.shouldHaveQueryCountTotal(2);
    CaseEntity_Variants_QueryBuilder.somatic.validations.shouldHaveChromosomePill();
  });

  it('Show and hide field labels', () => {
    setupTest();
    CaseEntity_Variants_QueryBuilder.somatic.validations.shouldShowLabels(true /*shouldShow*/);

    CaseEntity_Variants_QueryBuilder.somatic.actions.toggleLabels();
    CaseEntity_Variants_QueryBuilder.somatic.validations.shouldShowLabels(false /*shouldShow*/);

    CaseEntity_Variants_QueryBuilder.somatic.actions.toggleLabels();
    CaseEntity_Variants_QueryBuilder.somatic.validations.shouldShowLabels(true /*shouldShow*/);
  });
});
