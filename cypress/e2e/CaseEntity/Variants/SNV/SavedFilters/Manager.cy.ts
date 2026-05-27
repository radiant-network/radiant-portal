/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { CaseEntity_Variants_SavedFilters } from 'pom/pages/CaseEntity_Variants_SavedFilters';
import { ManagerFilterModal } from 'pom/pages/ManagerFilterModal';

describe('Case Entity - Variants - SNV - Saved filters - Manager', () => {
  const setupTest = () => {
    cy.login();
    cy.visitCaseVariantsPage(data.case.case, data.case.seq.seq_id, 'SNV', data.variantGermline.sqon);
    CaseEntity_Variants_SavedFilters.snv.actions.selectFilterInDropdown('Cypress_All_Variants'); // Clean Query Builder
    CaseEntity_Variants_SavedFilters.snv.actions.clickNewFilterButton(); // Clean Query Builder
  };

  it('Rename', () => {
    setupTest();
    CaseEntity_Variants_SavedFilters.snv.actions.deleteFilter('CypressFA');
    CaseEntity_Variants_SavedFilters.snv.actions.deleteFilter('CypressF1 COPY');
    CaseEntity_Variants_SavedFilters.snv.actions.createFilter('CypressF1');
    CaseEntity_Variants_SavedFilters.snv.actions.openManager();
    ManagerFilterModal.actions.editFilterName('CypressF1', 'CypressFA');

    CaseEntity_Variants_SavedFilters.snv.validations.shouldDisplayInDropdown(/^CypressF1$/, false /*shouldExist*/);
    CaseEntity_Variants_SavedFilters.snv.validations.shouldDisplayInDropdown('CypressFA');
    CaseEntity_Variants_SavedFilters.snv.actions.openManager();

    ManagerFilterModal.validations.shouldDisplayInManager('CypressF1', false /*shouldExist*/);
    ManagerFilterModal.validations.shouldDisplayInManager('CypressFA');
    ManagerFilterModal.actions.closeManager();
  });

  it('Delete', () => {
    setupTest();
    CaseEntity_Variants_SavedFilters.snv.actions.deleteFilter('CypressF2');
    CaseEntity_Variants_SavedFilters.snv.actions.createFilter('CypressF2');
    CaseEntity_Variants_SavedFilters.snv.actions.openManager();
    ManagerFilterModal.actions.deleteFilter('CypressF2');

    CaseEntity_Variants_SavedFilters.snv.validations.shouldDisplayFilterName('CypressF2', false /*shouldExist*/);
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
