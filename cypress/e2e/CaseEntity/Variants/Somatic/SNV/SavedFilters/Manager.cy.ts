/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { CaseEntity_Variants_SavedFilters } from 'pom/pages/CaseEntity_Variants_SavedFilters';
import { ManagerFilterModal } from 'pom/pages/ManagerFilterModal';

describe('Case Entity - Variants - Somatic - SNV - Saved filters - Manager', () => {
  const setupTest = () => {
    cy.login();
    cy.visitCaseVariantsPage(data.caseSomatic.case, data.caseSomatic.seq.seq_id, 'SNV');
    CaseEntity_Variants_SavedFilters.somatic.actions.selectFilterInDropdown('Cypress_All_Variants'); // Clean Query Builder
    CaseEntity_Variants_SavedFilters.somatic.actions.clickNewFilterButton(); // Clean Query Builder
  };

  it('Rename', () => {
    setupTest();
    CaseEntity_Variants_SavedFilters.somatic.actions.deleteFilter('Cypress_FA');
    CaseEntity_Variants_SavedFilters.somatic.actions.deleteFilter('Cypress_F1 COPY');
    CaseEntity_Variants_SavedFilters.somatic.actions.createFilter('Cypress_F1');
    CaseEntity_Variants_SavedFilters.somatic.actions.openManager();
    ManagerFilterModal.actions.editFilterName('Cypress_F1', 'Cypress_FA');

    CaseEntity_Variants_SavedFilters.somatic.validations.shouldDisplayInDropdown(/^Cypress_F1$/, false /*shouldExist*/);
    CaseEntity_Variants_SavedFilters.somatic.validations.shouldDisplayInDropdown('Cypress_FA');
    CaseEntity_Variants_SavedFilters.somatic.actions.openManager();

    ManagerFilterModal.validations.shouldDisplayInManager('Cypress_F1', false /*shouldExist*/);
    ManagerFilterModal.validations.shouldDisplayInManager('Cypress_FA');
    ManagerFilterModal.actions.closeManager();
  });

  it('Delete', () => {
    setupTest();
    CaseEntity_Variants_SavedFilters.somatic.actions.deleteFilter('Cypress_F2');
    CaseEntity_Variants_SavedFilters.somatic.actions.createFilter('Cypress_F2');
    CaseEntity_Variants_SavedFilters.somatic.actions.openManager();
    ManagerFilterModal.actions.deleteFilter('Cypress_F2');

    CaseEntity_Variants_SavedFilters.somatic.validations.shouldDisplayFilterName('Cypress_F2', false /*shouldExist*/);
    CaseEntity_Variants_SavedFilters.somatic.validations.shouldDisplayInDropdown('Cypress_F2', false /*shouldExist*/);
    CaseEntity_Variants_SavedFilters.somatic.actions.openManager();

    ManagerFilterModal.validations.shouldDisplayInManager('Cypress_F2', false /*shouldExist*/);
    ManagerFilterModal.actions.closeManager();

    CaseEntity_Variants_SavedFilters.somatic.validations.shouldIconHaveExpectedStates('plus', true /*isDisable*/, false /*isDirty*/);
    CaseEntity_Variants_SavedFilters.somatic.validations.shouldIconHaveExpectedStates('save', true /*isDisable*/, false /*isDirty*/);
    CaseEntity_Variants_SavedFilters.somatic.validations.shouldIconHaveExpectedStates('duplicate', true /*isDisable*/, false /*isDirty*/);
    CaseEntity_Variants_SavedFilters.somatic.validations.shouldIconHaveExpectedStates('delete', true /*isDisable*/, false /*isDirty*/);
  });
});
