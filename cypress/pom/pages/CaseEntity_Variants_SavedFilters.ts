/// <reference types="cypress"/>

import { CommonSelectors } from 'pom/shared/Selectors';
const generateSavedFiltersFunctions = () => {
  const actions = {
    /**
     * Clicks the delete filter button.
     */
    clickDeleteButton() {
      cy.get(`${CommonSelectors.querybuilderHeader} ${CommonSelectors.deleteIcon}`).clickAndWait({ force: true });
    },
    /**
     * Clicks the duplicate filter button.
     */
    clickDuplicateButton() {
      cy.get(`${CommonSelectors.querybuilderHeader} ${CommonSelectors.duplicateIcon}`).clickAndWait({ force: true });
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
     * Closes the manager filter modal.
     */
    closeManager() {
      cy.get(`${CommonSelectors.modal} ${CommonSelectors.closeButton}`).eq(0).clickAndWait({ force: true });
    },
    /**
     * Create a filter.
     * @param name The filter name.
     */
    createFilter(name: string) {
      actions.deleteFilter(name);
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
      cy.get('body')
        .invoke('text')
        .then(invokeText => {
          if (invokeText.includes(name)) {
            cy.get('body').contains(name).clickAndWait({ force: true });
            validations.shouldDisplayFilterName(name);
            actions.clickDeleteButton();

            cy.intercept('**/saved_filters{,/**}').as('deleteSavedFilters');
            cy.get(`${CommonSelectors.alert} ${CommonSelectors.destructiveButton}`).click({ force: true });
            cy.wait('@deleteSavedFilters');

            actions.openMyFiltersDropdown();
            cy.get('body').contains(name).should('not.exist');
          }
        });
    },
    /**
     * Edist the filter name from the manager filter modal
     * @param name The filter name.
     */
    deleteFilterFromManager(name: string) {
      cy.get(`${CommonSelectors.modal} ${CommonSelectors.listItemAction(name)}`).realHover();
      cy.get(`${CommonSelectors.modal} ${CommonSelectors.deleteIcon}:visible`).clickAndWait({ force: true });

      cy.intercept('**/saved_filters{,/**}').as('deleteSavedFilters');
      cy.get(`${CommonSelectors.alert} ${CommonSelectors.destructiveButton}`).click({ force: true });
      cy.wait('@deleteSavedFilters');

      actions.closeManager();
    },
    /**
     * Edits the filter name from the manager filter modal
     * @param oldName The filter name to edit.
     * @param newName The new filter name.
     */
    editFilterNameFromManager(oldName: string, newName: string) {
      cy.get(`${CommonSelectors.modal} ${CommonSelectors.listItemAction(oldName)}`).realHover();
      cy.get(`${CommonSelectors.modal} ${CommonSelectors.editIcon}:visible`).clickAndWait({ force: true });

      cy.get(`${CommonSelectors.modal} ${CommonSelectors.input}`).clear();
      cy.get(`${CommonSelectors.modal} ${CommonSelectors.input}`).type(newName);
      cy.get(`${CommonSelectors.modal} ${CommonSelectors.inputValue(newName)}`).should('exist');

      cy.intercept('**/saved_filters{,/**}').as('postSavedFilters');
      cy.get(CommonSelectors.submitTypeButton).click({ force: true });
      cy.wait('@postSavedFilters');
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
     * Opens the manager filter modal.
     */
    openManager() {
      actions.openMyFiltersDropdown();
      cy.get('body').contains('Manage filters').clickAndWait({ force: true });
    },
    /**
     * Opens the My Filters dropdown.
     */
    openMyFiltersDropdown() {
      cy.get(CommonSelectors.logo).clickAndWait({ force: true }); // Close the dropdown if open
      cy.get(`${CommonSelectors.querybuilderHeader} ${CommonSelectors.comboboxButton}`).clickAndWait({ force: true });
    },
    /**
     * Selects a filter in the dropdown.
     * @param name The filter name.
     */
    selectFilterInDropdown(name: string | RegExp) {
      actions.openMyFiltersDropdown();
      cy.get('body').contains(name).clickAndWait({ force: true });
    },
  };

  const validations = {
    /**
     * Checks that the filter is selected in the dropdown.
     * @param name The filter name.
     */
    shouldBeSelectedInDropdown(name: string) {
      actions.openMyFiltersDropdown();
      cy.get('body span').filter(`:contains("${name}")`).parent().find(CommonSelectors.checkIcon).should('exist');
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
      cy.get('body').contains(name).should(strExist);
    },
    /**
     * Checks that the filter name is displayed in the manager modal.
     * @param name The filter name.
     * @param shouldExist Whether the filter should exist (default: true).
     */
    shouldDisplayInManager(name: string, shouldExist: boolean = true) {
      const strExist = shouldExist ? 'exist' : 'not.exist';
      actions.openManager();
      cy.get(CommonSelectors.modal).contains(name).should(strExist);
      actions.closeManager();
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
  snv: generateSavedFiltersFunctions(),
  cnv: generateSavedFiltersFunctions(),
};
