/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { CaseEntity_Variants_SavedFilters } from 'pom/pages/CaseEntity_Variants_SavedFilters';
import { ManagerFilterModal } from 'pom/pages/ManagerFilterModal';

describe('Case Entity - Variants - SNV - Saved filters - Query builder', () => {
  const setupTest = () => {
    cy.login();
    cy.visitCaseVariantsPage(data.case.case, data.case.seq.seq_id, 'SNV', data.variantGermline.sqon);
    CaseEntity_Variants_SavedFilters.snv.actions.clickNewFilterButton(); // Clean Query Builder
  };

  it('Create', () => {
    setupTest();
    CaseEntity_Variants_SavedFilters.snv.actions.deleteFilter('CypressF0');
    CaseEntity_Variants_SavedFilters.snv.actions.createFilter('CypressF0');

    CaseEntity_Variants_SavedFilters.snv.validations.shouldDisplayFilterName('CypressF0');
    CaseEntity_Variants_SavedFilters.snv.validations.shouldBeSelectedInDropdown('CypressF0');
    CaseEntity_Variants_SavedFilters.snv.actions.openManager();

    ManagerFilterModal.validations.shouldDisplayInManager('CypressF0');
    ManagerFilterModal.actions.closeManager();

    CaseEntity_Variants_SavedFilters.snv.validations.shouldIconHaveExpectedStates('plus', false /*isDisable*/, false /*isDirty*/);
    CaseEntity_Variants_SavedFilters.snv.validations.shouldIconHaveExpectedStates('save', true /*isDisable*/, false /*isDirty*/);
    CaseEntity_Variants_SavedFilters.snv.validations.shouldIconHaveExpectedStates('duplicate', false /*isDisable*/, false /*isDirty*/);
    CaseEntity_Variants_SavedFilters.snv.validations.shouldIconHaveExpectedStates('delete', false /*isDisable*/, false /*isDirty*/);
  });

  it('Rename', () => {
    setupTest();
    CaseEntity_Variants_SavedFilters.snv.actions.deleteFilter('CypressFA');
    CaseEntity_Variants_SavedFilters.snv.actions.deleteFilter('CypressF1 COPY');
    CaseEntity_Variants_SavedFilters.snv.actions.createFilter('CypressF1');
    CaseEntity_Variants_SavedFilters.snv.actions.selectFilterInDropdown(/^CypressF1$/);
    CaseEntity_Variants_SavedFilters.snv.actions.createFilter('CypressFA');

    CaseEntity_Variants_SavedFilters.snv.validations.shouldDisplayFilterName('CypressFA');
    CaseEntity_Variants_SavedFilters.snv.validations.shouldDisplayInDropdown(/^CypressF1$/, false /*shouldExist*/);
    CaseEntity_Variants_SavedFilters.snv.validations.shouldBeSelectedInDropdown('CypressFA');
    CaseEntity_Variants_SavedFilters.snv.actions.openManager();

    ManagerFilterModal.validations.shouldDisplayInManager('CypressF1', false /*shouldExist*/);
    ManagerFilterModal.validations.shouldDisplayInManager('CypressFA');
    ManagerFilterModal.actions.closeManager();

    CaseEntity_Variants_SavedFilters.snv.validations.shouldIconHaveExpectedStates('plus', false /*isDisable*/, false /*isDirty*/);
    CaseEntity_Variants_SavedFilters.snv.validations.shouldIconHaveExpectedStates('save', true /*isDisable*/, false /*isDirty*/);
    CaseEntity_Variants_SavedFilters.snv.validations.shouldIconHaveExpectedStates('duplicate', false /*isDisable*/, false /*isDirty*/);
    CaseEntity_Variants_SavedFilters.snv.validations.shouldIconHaveExpectedStates('delete', false /*isDisable*/, false /*isDirty*/);
  });

  it('Select from dropdown', () => {
    setupTest();
    CaseEntity_Variants_SavedFilters.snv.actions.deleteFilter('CypressFA');
    CaseEntity_Variants_SavedFilters.snv.actions.deleteFilter('CypressF1 COPY');
    CaseEntity_Variants_SavedFilters.snv.actions.createFilter('CypressF1');
    CaseEntity_Variants_SavedFilters.snv.actions.selectFilterInDropdown('CypressF1');

    CaseEntity_Variants_SavedFilters.snv.validations.shouldDisplayFilterName('CypressF1');
    CaseEntity_Variants_SavedFilters.snv.validations.shouldBeSelectedInDropdown('CypressF1');
    CaseEntity_Variants_SavedFilters.snv.validations.shouldIconHaveExpectedStates('plus', false /*isDisable*/, false /*isDirty*/);
    CaseEntity_Variants_SavedFilters.snv.validations.shouldIconHaveExpectedStates('save', true /*isDisable*/, false /*isDirty*/);
    CaseEntity_Variants_SavedFilters.snv.validations.shouldIconHaveExpectedStates('duplicate', false /*isDisable*/, false /*isDirty*/);
    CaseEntity_Variants_SavedFilters.snv.validations.shouldIconHaveExpectedStates('delete', false /*isDisable*/, false /*isDirty*/);
  });

  it('Duplicate', () => {
    setupTest();
    CaseEntity_Variants_SavedFilters.snv.actions.deleteFilter('CypressFA');
    CaseEntity_Variants_SavedFilters.snv.actions.deleteFilter('CypressF1 COPY');
    CaseEntity_Variants_SavedFilters.snv.actions.createFilter('CypressF1');
    CaseEntity_Variants_SavedFilters.snv.actions.selectFilterInDropdown('CypressF1');
    CaseEntity_Variants_SavedFilters.snv.actions.clickDuplicateButton();
    CaseEntity_Variants_SavedFilters.snv.actions.clickSaveButton();

    CaseEntity_Variants_SavedFilters.snv.validations.shouldDisplayFilterName(/^CypressF1 COPY$/);
    CaseEntity_Variants_SavedFilters.snv.validations.shouldDisplayInDropdown('CypressF1 COPY', true /*shouldExist*/);
    CaseEntity_Variants_SavedFilters.snv.actions.openManager();

    ManagerFilterModal.validations.shouldDisplayInManager('CypressF1 COPY', true /*shouldExist*/);
    ManagerFilterModal.actions.closeManager();

    CaseEntity_Variants_SavedFilters.snv.validations.shouldIconHaveExpectedStates('plus', false /*isDisable*/, false /*isDirty*/);
    CaseEntity_Variants_SavedFilters.snv.validations.shouldIconHaveExpectedStates('save', true /*isDisable*/, false /*isDirty*/);
    CaseEntity_Variants_SavedFilters.snv.validations.shouldIconHaveExpectedStates('duplicate', false /*isDisable*/, false /*isDirty*/);
    CaseEntity_Variants_SavedFilters.snv.validations.shouldIconHaveExpectedStates('delete', false /*isDisable*/, false /*isDirty*/);
  });

  it('Delete', () => {
    setupTest();
    CaseEntity_Variants_SavedFilters.snv.actions.deleteFilter('CypressF2');
    CaseEntity_Variants_SavedFilters.snv.actions.createFilter('CypressF2');
    CaseEntity_Variants_SavedFilters.snv.actions.deleteFilter('CypressF2');

    CaseEntity_Variants_SavedFilters.snv.validations.shouldDisplayFilterName(/(Filtre sans titre|Untitled filter)/);
    CaseEntity_Variants_SavedFilters.snv.validations.shouldDisplayInDropdown('CypressF2', false /*shouldExist*/);
    CaseEntity_Variants_SavedFilters.snv.actions.openManager();

    ManagerFilterModal.validations.shouldDisplayInManager('CypressF2', false /*shouldExist*/);
    ManagerFilterModal.actions.closeManager();

    CaseEntity_Variants_SavedFilters.snv.validations.shouldIconHaveExpectedStates('plus', true /*isDisable*/, false /*isDirty*/);
    CaseEntity_Variants_SavedFilters.snv.validations.shouldIconHaveExpectedStates('save', true /*isDisable*/, false /*isDirty*/);
    CaseEntity_Variants_SavedFilters.snv.validations.shouldIconHaveExpectedStates('duplicate', true /*isDisable*/, false /*isDirty*/);
    CaseEntity_Variants_SavedFilters.snv.validations.shouldIconHaveExpectedStates('delete', true /*isDisable*/, false /*isDirty*/);
  });
});
