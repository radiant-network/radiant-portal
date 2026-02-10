/// <reference types="cypress"/>
import { CommonSelectors } from 'pom/shared/Selectors';

export const ManagerFilterModal = {
  actions: {
    /**
     * Closes the manager filter modal.
     */
    closeManager() {
      cy.get(`${CommonSelectors.modal} ${CommonSelectors.closeButton}`).eq(0).clickAndWait({ force: true });
    },
    /**
     * Edits the filter name
     * @param name The filter name.
     */
    deleteFilter(name: string) {
      cy.get(`${CommonSelectors.modal} ${CommonSelectors.listItemAction(name)}`).realHover();
      cy.get(`${CommonSelectors.modal} ${CommonSelectors.deleteIcon}:visible`).clickAndWait({ force: true });

      cy.intercept('**/saved_filters{,/**}').as('deleteSavedFilters');
      cy.get(`${CommonSelectors.alert} ${CommonSelectors.destructiveButton}`).click({ force: true });
      cy.wait('@deleteSavedFilters');

      ManagerFilterModal.actions.closeManager();
    },
    /**
     * Edits the filter name
     * @param oldName The filter name to edit.
     * @param newName The new filter name.
     */
    editFilterName(oldName: string, newName: string) {
      cy.get(`${CommonSelectors.modal} ${CommonSelectors.listItemAction(oldName)}`).realHover();
      cy.get(`${CommonSelectors.modal} ${CommonSelectors.editIcon}:visible`).clickAndWait({ force: true });

      cy.get(`${CommonSelectors.modal} ${CommonSelectors.input}`).clear();
      cy.get(`${CommonSelectors.modal} ${CommonSelectors.input}`).type(newName);
      cy.get(`${CommonSelectors.modal} ${CommonSelectors.inputValue(newName)}`).should('exist');

      cy.intercept('**/saved_filters{,/**}').as('postSavedFilters');
      cy.get(CommonSelectors.submitTypeButton).click({ force: true });
      cy.wait('@postSavedFilters');
    },
  },

  validations: {
    /**
     * Checks that the filter name is displayed in the manager modal.
     * @param name The filter name.
     * @param shouldExist Whether the filter should exist (default: true).
     */
    shouldDisplayInManager(name: string, shouldExist: boolean = true) {
      const strExist = shouldExist ? 'exist' : 'not.exist';
      cy.get(CommonSelectors.modal).contains(name).should(strExist);
    },
  },
};
