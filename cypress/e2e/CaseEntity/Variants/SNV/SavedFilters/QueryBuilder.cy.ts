/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { CaseEntity_Variants_SavedFilters } from 'pom/pages/CaseEntity_Variants_SavedFilters';

describe('Case Entity - Variants - SNV - Saved filters - Query builder', () => {
  const setupTest = () => {
    cy.login();
    cy.visitCaseVariantsPage('1', 'SNV', data.variantGermline.sqon);
    CaseEntity_Variants_SavedFilters.snv.actions.clickNewFilterButton();
  };

  it('Create', () => {
    setupTest();
    CaseEntity_Variants_SavedFilters.snv.actions.deleteFilter('Cypress_F0');
    CaseEntity_Variants_SavedFilters.snv.actions.createFilter('Cypress_F0');

    CaseEntity_Variants_SavedFilters.snv.validations.shouldDisplayFilterName('Cypress_F0');
    CaseEntity_Variants_SavedFilters.snv.validations.shouldBeSelectedInDropdown('Cypress_F0');
    CaseEntity_Variants_SavedFilters.snv.validations.shouldDisplayInManager('Cypress_F0');
    CaseEntity_Variants_SavedFilters.snv.validations.shouldIconHaveExpectedStates('plus', false /*isDisable*/, false /*isDirty*/);
    CaseEntity_Variants_SavedFilters.snv.validations.shouldIconHaveExpectedStates('save', true /*isDisable*/, false /*isDirty*/);
    CaseEntity_Variants_SavedFilters.snv.validations.shouldIconHaveExpectedStates('duplicate', false /*isDisable*/, false /*isDirty*/);
    CaseEntity_Variants_SavedFilters.snv.validations.shouldIconHaveExpectedStates('delete', false /*isDisable*/, false /*isDirty*/);
    CaseEntity_Variants_SavedFilters.snv.validations.shouldIconHaveExpectedStates('share', false /*isDisable*/, false /*isDirty*/);
  });

  it('Rename', () => {
    setupTest();
    CaseEntity_Variants_SavedFilters.snv.actions.deleteFilter('Cypress_FA');
    CaseEntity_Variants_SavedFilters.snv.actions.deleteFilter('Cypress_F1 COPY');
    CaseEntity_Variants_SavedFilters.snv.actions.createFilter('Cypress_F1');
    CaseEntity_Variants_SavedFilters.snv.actions.selectFilterInDropdown(/^Cypress_F1$/);
    CaseEntity_Variants_SavedFilters.snv.actions.createFilter('Cypress_FA');

    CaseEntity_Variants_SavedFilters.snv.validations.shouldDisplayFilterName('Cypress_FA');
    CaseEntity_Variants_SavedFilters.snv.validations.shouldDisplayInDropdown(/^Cypress_F1$/, false /*shouldExist*/);
    CaseEntity_Variants_SavedFilters.snv.validations.shouldBeSelectedInDropdown('Cypress_FA');
    CaseEntity_Variants_SavedFilters.snv.validations.shouldDisplayInManager('Cypress_F1', false /*shouldExist*/);
    CaseEntity_Variants_SavedFilters.snv.validations.shouldDisplayInManager('Cypress_FA');
    CaseEntity_Variants_SavedFilters.snv.validations.shouldIconHaveExpectedStates('plus', false /*isDisable*/, false /*isDirty*/);
    CaseEntity_Variants_SavedFilters.snv.validations.shouldIconHaveExpectedStates('save', true /*isDisable*/, false /*isDirty*/);
    CaseEntity_Variants_SavedFilters.snv.validations.shouldIconHaveExpectedStates('duplicate', false /*isDisable*/, false /*isDirty*/);
    CaseEntity_Variants_SavedFilters.snv.validations.shouldIconHaveExpectedStates('delete', false /*isDisable*/, false /*isDirty*/);
    CaseEntity_Variants_SavedFilters.snv.validations.shouldIconHaveExpectedStates('share', false /*isDisable*/, false /*isDirty*/);
  });

  it('Select from dropdown', () => {
    setupTest();
    CaseEntity_Variants_SavedFilters.snv.actions.deleteFilter('Cypress_FA');
    CaseEntity_Variants_SavedFilters.snv.actions.deleteFilter('Cypress_F1 COPY');
    CaseEntity_Variants_SavedFilters.snv.actions.createFilter('Cypress_F1');
    CaseEntity_Variants_SavedFilters.snv.actions.selectFilterInDropdown('Cypress_F1');

    CaseEntity_Variants_SavedFilters.snv.validations.shouldDisplayFilterName('Cypress_F1');
    CaseEntity_Variants_SavedFilters.snv.validations.shouldBeSelectedInDropdown('Cypress_F1');
    CaseEntity_Variants_SavedFilters.snv.validations.shouldIconHaveExpectedStates('plus', false /*isDisable*/, false /*isDirty*/);
    CaseEntity_Variants_SavedFilters.snv.validations.shouldIconHaveExpectedStates('save', true /*isDisable*/, false /*isDirty*/);
    CaseEntity_Variants_SavedFilters.snv.validations.shouldIconHaveExpectedStates('duplicate', false /*isDisable*/, false /*isDirty*/);
    CaseEntity_Variants_SavedFilters.snv.validations.shouldIconHaveExpectedStates('delete', false /*isDisable*/, false /*isDirty*/);
    CaseEntity_Variants_SavedFilters.snv.validations.shouldIconHaveExpectedStates('share', false /*isDisable*/, false /*isDirty*/);
  });

  it('Duplicate without saving [SJRA-1097]', () => {
    setupTest();
    CaseEntity_Variants_SavedFilters.snv.actions.deleteFilter('Cypress_FA');
    CaseEntity_Variants_SavedFilters.snv.actions.deleteFilter('Cypress_F1 COPY');
    CaseEntity_Variants_SavedFilters.snv.actions.createFilter('Cypress_F1');
    CaseEntity_Variants_SavedFilters.snv.actions.selectFilterInDropdown('Cypress_F1');
    CaseEntity_Variants_SavedFilters.snv.actions.clickDuplicateButton();

    CaseEntity_Variants_SavedFilters.snv.validations.shouldDisplayFilterName(/^Cypress_F1 COPY$/);
    CaseEntity_Variants_SavedFilters.snv.validations.shouldDisplayInDropdown('Cypress_F1 COPY', false /*shouldExist*/);
    CaseEntity_Variants_SavedFilters.snv.validations.shouldDisplayInManager('Cypress_F1 COPY', false /*shouldExist*/);
    CaseEntity_Variants_SavedFilters.snv.validations.shouldIconHaveExpectedStates('plus', true /*isDisable*/, false /*isDirty*/);
    CaseEntity_Variants_SavedFilters.snv.validations.shouldIconHaveExpectedStates('save', true /*isDisable*/, false /*isDirty*/);
    CaseEntity_Variants_SavedFilters.snv.validations.shouldIconHaveExpectedStates('duplicate', true /*isDisable*/, false /*isDirty*/);
    CaseEntity_Variants_SavedFilters.snv.validations.shouldIconHaveExpectedStates('delete', true /*isDisable*/, false /*isDirty*/);
    CaseEntity_Variants_SavedFilters.snv.validations.shouldIconHaveExpectedStates('share', true /*isDisable*/, false /*isDirty*/);
  });

  it('Duplicate and save [SJRA-1097]', () => {
    setupTest();
    CaseEntity_Variants_SavedFilters.snv.actions.deleteFilter('Cypress_FA');
    CaseEntity_Variants_SavedFilters.snv.actions.deleteFilter('Cypress_F1 COPY');
    CaseEntity_Variants_SavedFilters.snv.actions.createFilter('Cypress_F1');
    CaseEntity_Variants_SavedFilters.snv.actions.selectFilterInDropdown('Cypress_F1');
    CaseEntity_Variants_SavedFilters.snv.actions.clickDuplicateButton();
    CaseEntity_Variants_SavedFilters.snv.actions.clickSaveButton();

    CaseEntity_Variants_SavedFilters.snv.validations.shouldDisplayFilterName(/^Cypress_F1 COPY$/);
    CaseEntity_Variants_SavedFilters.snv.validations.shouldDisplayInDropdown('Cypress_F1 COPY', false /*shouldExist*/);
    CaseEntity_Variants_SavedFilters.snv.validations.shouldDisplayInManager('Cypress_F1 COPY', false /*shouldExist*/);
    CaseEntity_Variants_SavedFilters.snv.validations.shouldIconHaveExpectedStates('plus', true /*isDisable*/, false /*isDirty*/);
    CaseEntity_Variants_SavedFilters.snv.validations.shouldIconHaveExpectedStates('save', true /*isDisable*/, false /*isDirty*/);
    CaseEntity_Variants_SavedFilters.snv.validations.shouldIconHaveExpectedStates('duplicate', true /*isDisable*/, false /*isDirty*/);
    CaseEntity_Variants_SavedFilters.snv.validations.shouldIconHaveExpectedStates('delete', true /*isDisable*/, false /*isDirty*/);
    CaseEntity_Variants_SavedFilters.snv.validations.shouldIconHaveExpectedStates('share', true /*isDisable*/, false /*isDirty*/);
  });

  it('Delete', () => {
    setupTest();
    CaseEntity_Variants_SavedFilters.snv.actions.deleteFilter('Cypress_F2');
    CaseEntity_Variants_SavedFilters.snv.actions.createFilter('Cypress_F2');
    CaseEntity_Variants_SavedFilters.snv.actions.deleteFilter('Cypress_F2');

    CaseEntity_Variants_SavedFilters.snv.validations.shouldDisplayFilterName('Filtre sans titre');
    CaseEntity_Variants_SavedFilters.snv.validations.shouldDisplayInDropdown('Cypress_F2', false /*shouldExist*/);
    CaseEntity_Variants_SavedFilters.snv.validations.shouldDisplayInManager('Cypress_F2', false /*shouldExist*/);
    CaseEntity_Variants_SavedFilters.snv.validations.shouldIconHaveExpectedStates('plus', true /*isDisable*/, false /*isDirty*/);
    CaseEntity_Variants_SavedFilters.snv.validations.shouldIconHaveExpectedStates('save', true /*isDisable*/, false /*isDirty*/);
    CaseEntity_Variants_SavedFilters.snv.validations.shouldIconHaveExpectedStates('duplicate', true /*isDisable*/, false /*isDirty*/);
    CaseEntity_Variants_SavedFilters.snv.validations.shouldIconHaveExpectedStates('delete', true /*isDisable*/, false /*isDirty*/);
    CaseEntity_Variants_SavedFilters.snv.validations.shouldIconHaveExpectedStates('share', true /*isDisable*/, false /*isDirty*/);
  });
});
