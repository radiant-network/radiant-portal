/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { CaseEntity_Variants_SavedFilters } from 'pom/pages/CaseEntity_Variants_SavedFilters';
import { ManagerFilterModal } from 'pom/pages/ManagerFilterModal';

describe('Case Entity - Variants - Germline - CNV - Saved filters - Query builder', () => {
  const setupTest = () => {
    cy.login();
    cy.visitCaseVariantsPage(data.case.case, data.case.seq.seq_id, 'CNV');
    CaseEntity_Variants_SavedFilters.cnv.actions.selectFilterInDropdown('Cypress_All_Variants'); // Apply a filter for a cleaner query builder
    CaseEntity_Variants_SavedFilters.cnv.actions.clickNewFilterButton(); // Clean Query Builder
  };

  it('Create', () => {
    setupTest();
    CaseEntity_Variants_SavedFilters.cnv.actions.deleteFilter('Cypress_F0');
    CaseEntity_Variants_SavedFilters.cnv.actions.createFilter('Cypress_F0');

    CaseEntity_Variants_SavedFilters.cnv.validations.shouldDisplayFilterName('Cypress_F0');
    CaseEntity_Variants_SavedFilters.cnv.validations.shouldBeSelectedInDropdown('Cypress_F0');
    CaseEntity_Variants_SavedFilters.cnv.actions.openManager();

    ManagerFilterModal.validations.shouldDisplayInManager('Cypress_F0');
    ManagerFilterModal.actions.closeManager();

    CaseEntity_Variants_SavedFilters.cnv.validations.shouldIconHaveExpectedStates('plus', false /*isDisable*/, false /*isDirty*/);
    CaseEntity_Variants_SavedFilters.cnv.validations.shouldIconHaveExpectedStates('save', true /*isDisable*/, false /*isDirty*/);
    CaseEntity_Variants_SavedFilters.cnv.validations.shouldIconHaveExpectedStates('duplicate', false /*isDisable*/, false /*isDirty*/);
    CaseEntity_Variants_SavedFilters.cnv.validations.shouldIconHaveExpectedStates('delete', false /*isDisable*/, false /*isDirty*/);
  });

  it('Rename', () => {
    setupTest();
    CaseEntity_Variants_SavedFilters.cnv.actions.deleteFilter('Cypress_FA');
    CaseEntity_Variants_SavedFilters.cnv.actions.deleteFilter('Cypress_F1 COPY');
    CaseEntity_Variants_SavedFilters.cnv.actions.createFilter('Cypress_F1');
    CaseEntity_Variants_SavedFilters.cnv.actions.selectFilterInDropdown(/^Cypress_F1$/);
    CaseEntity_Variants_SavedFilters.cnv.actions.createFilter('Cypress_FA');

    CaseEntity_Variants_SavedFilters.cnv.validations.shouldDisplayFilterName('Cypress_FA');
    CaseEntity_Variants_SavedFilters.cnv.validations.shouldDisplayInDropdown(/^Cypress_F1$/, false /*shouldExist*/);
    CaseEntity_Variants_SavedFilters.cnv.validations.shouldBeSelectedInDropdown('Cypress_FA');
    CaseEntity_Variants_SavedFilters.cnv.actions.openManager();

    ManagerFilterModal.validations.shouldDisplayInManager('Cypress_F1', false /*shouldExist*/);
    ManagerFilterModal.validations.shouldDisplayInManager('Cypress_FA');
    ManagerFilterModal.actions.closeManager();

    CaseEntity_Variants_SavedFilters.cnv.validations.shouldIconHaveExpectedStates('plus', false /*isDisable*/, false /*isDirty*/);
    CaseEntity_Variants_SavedFilters.cnv.validations.shouldIconHaveExpectedStates('save', true /*isDisable*/, false /*isDirty*/);
    CaseEntity_Variants_SavedFilters.cnv.validations.shouldIconHaveExpectedStates('duplicate', false /*isDisable*/, false /*isDirty*/);
    CaseEntity_Variants_SavedFilters.cnv.validations.shouldIconHaveExpectedStates('delete', false /*isDisable*/, false /*isDirty*/);
  });

  it('Select from dropdown', () => {
    setupTest();
    CaseEntity_Variants_SavedFilters.cnv.actions.deleteFilter('Cypress_FA');
    CaseEntity_Variants_SavedFilters.cnv.actions.deleteFilter('Cypress_F1 COPY');
    CaseEntity_Variants_SavedFilters.cnv.actions.createFilter('Cypress_F1');
    CaseEntity_Variants_SavedFilters.cnv.actions.selectFilterInDropdown('Cypress_F1');

    CaseEntity_Variants_SavedFilters.cnv.validations.shouldDisplayFilterName('Cypress_F1');
    CaseEntity_Variants_SavedFilters.cnv.validations.shouldBeSelectedInDropdown('Cypress_F1');
    CaseEntity_Variants_SavedFilters.cnv.validations.shouldIconHaveExpectedStates('plus', false /*isDisable*/, false /*isDirty*/);
    CaseEntity_Variants_SavedFilters.cnv.validations.shouldIconHaveExpectedStates('save', true /*isDisable*/, false /*isDirty*/);
    CaseEntity_Variants_SavedFilters.cnv.validations.shouldIconHaveExpectedStates('duplicate', false /*isDisable*/, false /*isDirty*/);
    CaseEntity_Variants_SavedFilters.cnv.validations.shouldIconHaveExpectedStates('delete', false /*isDisable*/, false /*isDirty*/);
  });

  it('Duplicate', () => {
    setupTest();
    CaseEntity_Variants_SavedFilters.cnv.actions.deleteFilter('Cypress_FA');
    CaseEntity_Variants_SavedFilters.cnv.actions.deleteFilter('Cypress_F1 COPY');
    CaseEntity_Variants_SavedFilters.cnv.actions.createFilter('Cypress_F1');
    CaseEntity_Variants_SavedFilters.cnv.actions.selectFilterInDropdown('Cypress_F1');
    CaseEntity_Variants_SavedFilters.cnv.actions.clickDuplicateButton();
    CaseEntity_Variants_SavedFilters.cnv.actions.clickSaveButton();

    CaseEntity_Variants_SavedFilters.cnv.validations.shouldDisplayFilterName(/^Cypress_F1 COPY$/);
    CaseEntity_Variants_SavedFilters.cnv.validations.shouldDisplayInDropdown('Cypress_F1 COPY', true /*shouldExist*/);
    CaseEntity_Variants_SavedFilters.cnv.actions.openManager();

    ManagerFilterModal.validations.shouldDisplayInManager('Cypress_F1 COPY', true /*shouldExist*/);
    ManagerFilterModal.actions.closeManager();

    CaseEntity_Variants_SavedFilters.cnv.validations.shouldIconHaveExpectedStates('plus', false /*isDisable*/, false /*isDirty*/);
    CaseEntity_Variants_SavedFilters.cnv.validations.shouldIconHaveExpectedStates('save', true /*isDisable*/, false /*isDirty*/);
    CaseEntity_Variants_SavedFilters.cnv.validations.shouldIconHaveExpectedStates('duplicate', false /*isDisable*/, false /*isDirty*/);
    CaseEntity_Variants_SavedFilters.cnv.validations.shouldIconHaveExpectedStates('delete', false /*isDisable*/, false /*isDirty*/);
  });

  it('Delete', () => {
    setupTest();
    CaseEntity_Variants_SavedFilters.cnv.actions.deleteFilter('Cypress_F2');
    CaseEntity_Variants_SavedFilters.cnv.actions.createFilter('Cypress_F2');
    CaseEntity_Variants_SavedFilters.cnv.actions.deleteFilter('Cypress_F2');

    CaseEntity_Variants_SavedFilters.cnv.validations.shouldDisplayFilterName(/(Filtre sans titre|Untitled filter)/);
    CaseEntity_Variants_SavedFilters.cnv.validations.shouldDisplayInDropdown('Cypress_F2', false /*shouldExist*/);
    CaseEntity_Variants_SavedFilters.cnv.actions.openManager();

    ManagerFilterModal.validations.shouldDisplayInManager('Cypress_F2', false /*shouldExist*/);
    ManagerFilterModal.actions.closeManager();

    CaseEntity_Variants_SavedFilters.cnv.validations.shouldIconHaveExpectedStates('plus', true /*isDisable*/, false /*isDirty*/);
    CaseEntity_Variants_SavedFilters.cnv.validations.shouldIconHaveExpectedStates('save', true /*isDisable*/, false /*isDirty*/);
    CaseEntity_Variants_SavedFilters.cnv.validations.shouldIconHaveExpectedStates('duplicate', true /*isDisable*/, false /*isDirty*/);
    CaseEntity_Variants_SavedFilters.cnv.validations.shouldIconHaveExpectedStates('delete', true /*isDisable*/, false /*isDirty*/);
  });
});
