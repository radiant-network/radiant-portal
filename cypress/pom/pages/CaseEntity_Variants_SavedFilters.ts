/// <reference types="cypress"/>
import { CommonSelectors } from 'pom/shared/Selectors';
import { CommonTexts } from 'pom/shared/Texts';
import { CaseEntity_Variants_Facets } from './CaseEntity_Variants_Facets';

const generateSavedFiltersFunctions = (
  facetsActions: typeof CaseEntity_Variants_Facets.snv.actions,
  numericalFacet: { section: string; field: string },
) => {
  const actions = {
    /**
     * Clicks the delete filter button.
     */
    clickDeleteButton() {
      cy.get(`${CommonSelectors.querybuilderHeader} ${CommonSelectors.deleteIcon}`).clickAndWait({ force: true });
    },
    /**
     * Clicks the discard filter button.
     */
    clickDiscardButton() {
      cy.get(`${CommonSelectors.querybuilderHeader} ${CommonSelectors.discardIcon}`).clickAndWait({ force: true });
    },
    /**
     * Clicks the duplicate filter button.
     */
    clickDuplicateButton() {
      cy.get(`${CommonSelectors.querybuilderHeader} button:has(${CommonSelectors.duplicateIcon})`).clickAndWait();
    },
    /**
     * Clicks the edit filter button.
     */
    clickEditButton() {
      cy.get(`${CommonSelectors.querybuilderHeader} ${CommonSelectors.editLineIcon}`).clickAndWait({ force: true });
    },
    /**
     * Clicks the new filter button.
     */
    clickNewFilterButton() {
      cy.get(`${CommonSelectors.querybuilderHeader} ${CommonSelectors.plusIcon}`).clickAndWait({ force: true });
    },
    /**
     * Clicks the save filter button.
     */
    clickSaveButton() {
      cy.get(`${CommonSelectors.querybuilderHeader} ${CommonSelectors.saveIcon}`).clickAndWait({ force: true });
    },
    /**
     * Clicks the share filter button.
     */
    clickShareButton() {
      cy.get(`${CommonSelectors.querybuilderHeader} ${CommonSelectors.shareIcon}`).clickAndWait({ force: true });
    },
    /**
     * Create a filter.
     * @param name The filter name.
     */
    createFilter(name: string) {
      actions.deleteFilter(name);

      facetsActions.clickSidebarSection('Variant');
      cy.get(CommonSelectors.facetHeader('chromosome')).clickAndWait({ force: true });
      cy.get(CommonSelectors.facetCheckbox('chromosome', '1')).click({ force: true });
      cy.get(CommonSelectors.facetApplyButton('chromosome')).click({ force: true });

      actions.clickEditButton();
      cy.get(`${CommonSelectors.modal} ${CommonSelectors.input}`).clear();
      cy.get(`${CommonSelectors.modal} ${CommonSelectors.input}`).type(name);
      cy.get(`${CommonSelectors.modal} ${CommonSelectors.inputValue(name)}`).should('exist');

      cy.intercept('**/saved_filters{,/**}').as('postSavedFilters');
      cy.get(CommonSelectors.submitTypeButton).click({ force: true });
      cy.wait('@postSavedFilters');

      validations.shouldDisplayFilterName(name);
    },
    /**
     * Deletes a filter.
     * @param name The filter name.
     */
    deleteFilter(name: string) {
      actions.openMyFiltersDropdown();
      cy.get(CommonSelectors.savedListDropdown)
        .invoke('text')
        .then(invokeText => {
          if (invokeText.includes(name)) {
            cy.get(CommonSelectors.savedListDropdown).contains(name).clickAndWait({ force: true });
            validations.shouldDisplayFilterName(name);
            actions.clickDeleteButton();

            cy.intercept('**/saved_filters{,/**}').as('deleteSavedFilters');
            cy.get(CommonSelectors.deleteFilterConfirmButton).click({ force: true });
            cy.wait('@deleteSavedFilters');

            actions.openMyFiltersDropdown();
            cy.get(CommonSelectors.savedListDropdown).contains(name).should('not.exist');
          }
        });
    },
    /**
     * Edits the filter name from the query builder.
     * @param newName The new filter name.
     */
    editFilterNameFromQueryBuilder(newName: string) {
      actions.clickEditButton();

      cy.get(`${CommonSelectors.modal} ${CommonSelectors.input}`).clear();
      cy.get(`${CommonSelectors.modal} ${CommonSelectors.input}`).type(newName);
      cy.get(`${CommonSelectors.modal} ${CommonSelectors.inputValue(newName)}`).should('exist');

      cy.intercept('**/saved_filters{,/**}').as('postSavedFilters');
      cy.get(CommonSelectors.submitTypeButton).click({ force: true });
      cy.wait('@postSavedFilters');
    },
    /**
     * Modifies the current filter by applying a numerical facet.
     */
    modifyFilter() {
      facetsActions.applyNumericalFacetFilter(numericalFacet.section, numericalFacet.field);
    },
    /**
     * Opens the manager filter modal.
     */
    openManager() {
      actions.openMyFiltersDropdown();
      cy.get('body').contains(CommonTexts.en.manageFilters).clickAndWait({ force: true });
    },
    /**
     * Opens the My Filters dropdown.
     */
    openMyFiltersDropdown() {
      cy.get(CommonSelectors.logo).clickAndWait({ force: true }); // Close the dropdown if open
      cy.get(CommonSelectors.myFiltersButton).clickAndWait({ force: true });
    },
    /**
     * Selects a filter in the dropdown.
     * @param name The filter name.
     */
    selectFilterInDropdown(name: string | RegExp) {
      actions.openMyFiltersDropdown();
      cy.get(CommonSelectors.savedListDropdown).contains(name).clickAndWait({ force: true });
    },
    /**
     * Updates the selected filter by saving its unsaved changes.
     */
    updateFilter() {
      cy.intercept('**/saved_filters{,/**}').as('putSavedFilters');
      actions.clickSaveButton();
      cy.wait('@putSavedFilters');
    },
  };

  const validations = {
    /**
     * Checks that the filter is selected in the dropdown.
     * @param name The filter name.
     */
    shouldBeSelectedInDropdown(name: string) {
      actions.openMyFiltersDropdown();
      cy.get(CommonSelectors.savedListDropdown).filter(`:contains("${name}")`).parent().find(CommonSelectors.checkIcon).should('exist');
    },
    /**
     * Checks that the filter name is displayed in the query builder.
     * @param name The filter name.
     * @param shouldExist Whether the name should exist (default: true).
     */
    shouldDisplayFilterName(name: string | RegExp, shouldExist: boolean = true) {
      const strExist = shouldExist ? 'exist' : 'not.exist';
      cy.get(CommonSelectors.querybuilderHeader).contains(name).should(strExist);
    },
    /**
     * Checks that the filter name is displayed in the dropdown.
     * @param name The filter name.
     * @param shouldExist Whether the filter should exist (default: true).
     */
    shouldDisplayInDropdown(name: string | RegExp, shouldExist: boolean = true) {
      const strExist = shouldExist ? 'exist' : 'not.exist';
      actions.openMyFiltersDropdown();
      cy.get(CommonSelectors.savedListDropdown).contains(name).should(strExist);
    },
    /**
     * Checks that the icon have the expected enabled/disabled and dirty states.
     * @param name The icon name (e.g.: plus, save, copy, etc.)
     * @param isDisable Whether the icon should be disable.
     * @param isDirty Whether the icon should be dirty.
     */
    shouldIconHaveExpectedStates(name: string, isDisable: boolean, isDirty: boolean) {
      const iconSelector = CommonSelectors[`${name}Icon` as keyof typeof CommonSelectors];
      const shouldBeDisabled = isDisable ? 'be.disabled' : 'not.be.disabled';
      const shouldBeDirty = isDirty ? 'have.class' : 'not.have.class';
      cy.get(`${CommonSelectors.querybuilderHeader} button:has(${iconSelector})`).should(shouldBeDisabled);
      cy.get(`${CommonSelectors.querybuilderHeader} button:has(${iconSelector})`).should(shouldBeDirty, CommonSelectors.dirtyClass);
    },
  };

  return { actions, validations };
};

export const CaseEntity_Variants_SavedFilters = {
  snv: generateSavedFiltersFunctions(CaseEntity_Variants_Facets.snv.actions, { section: 'Variant', field: 'position' }),
  cnv: generateSavedFiltersFunctions(CaseEntity_Variants_Facets.cnv.actions, { section: 'Variant', field: 'start' }),
  somatic: generateSavedFiltersFunctions(CaseEntity_Variants_Facets.somatic.actions, { section: 'Variant', field: 'position' }),
};
