/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { CaseEntity_Variants_SavedFilters } from 'pom/pages/CaseEntity_Variants_SavedFilters';

describe('Case Entity - Variants - SNV - Saved filters - Manager', () => {
  const setupTest = () => {
    cy.login();
    cy.visitCaseVariantsPage(data.case.case, 'SNV', data.variantGermline.sqon);
    CaseEntity_Variants_SavedFilters.snv.actions.clickNewFilterButton();
  };

  it('Rename', () => {
    setupTest();
    CaseEntity_Variants_SavedFilters.snv.actions.deleteFilter('Cypress_FA');
    CaseEntity_Variants_SavedFilters.snv.actions.deleteFilter('Cypress_F1 COPY');
    CaseEntity_Variants_SavedFilters.snv.actions.createFilter('Cypress_F1');
    CaseEntity_Variants_SavedFilters.snv.actions.openManager();
    CaseEntity_Variants_SavedFilters.snv.actions.editFilterNameFromManager('Cypress_F1', 'Cypress_FA');

    CaseEntity_Variants_SavedFilters.snv.validations.shouldDisplayInDropdown(/^Cypress_F1$/, false /*shouldExist*/);
    CaseEntity_Variants_SavedFilters.snv.validations.shouldDisplayInDropdown('Cypress_FA');
    CaseEntity_Variants_SavedFilters.snv.validations.shouldDisplayInManager('Cypress_F1', false /*shouldExist*/);
    CaseEntity_Variants_SavedFilters.snv.validations.shouldDisplayInManager('Cypress_FA');
  });

  it('Delete', () => {
    setupTest();
    CaseEntity_Variants_SavedFilters.snv.actions.deleteFilter('Cypress_F2');
    CaseEntity_Variants_SavedFilters.snv.actions.createFilter('Cypress_F2');
    CaseEntity_Variants_SavedFilters.snv.actions.openManager();
    CaseEntity_Variants_SavedFilters.snv.actions.deleteFilterFromManager('Cypress_F2');

    CaseEntity_Variants_SavedFilters.snv.validations.shouldDisplayFilterName('Cypress_F2', false /*shouldExist*/);
    CaseEntity_Variants_SavedFilters.snv.validations.shouldDisplayInDropdown('Cypress_F2', false /*shouldExist*/);
    CaseEntity_Variants_SavedFilters.snv.validations.shouldDisplayInManager('Cypress_F2', false /*shouldExist*/);
    CaseEntity_Variants_SavedFilters.snv.validations.shouldIconHaveExpectedStates('plus', true /*isDisable*/, false /*isDirty*/);
    CaseEntity_Variants_SavedFilters.snv.validations.shouldIconHaveExpectedStates('save', true /*isDisable*/, false /*isDirty*/);
    CaseEntity_Variants_SavedFilters.snv.validations.shouldIconHaveExpectedStates('duplicate', true /*isDisable*/, false /*isDirty*/);
    CaseEntity_Variants_SavedFilters.snv.validations.shouldIconHaveExpectedStates('delete', true /*isDisable*/, false /*isDirty*/);
    CaseEntity_Variants_SavedFilters.snv.validations.shouldIconHaveExpectedStates('share', true /*isDisable*/, false /*isDirty*/);
  });
});
