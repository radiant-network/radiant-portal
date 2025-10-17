/// <reference types="cypress"/>
import { CommonSelectors } from 'pom/shared/Selectors';

const selectors = {
  tab: '[class*= "z-1 group"]:contains("Overview")',
};

export const VariantEntity_Overview = {
  validations: {
    /**
     * Checks that the tab is active.
     */
    shouldHaveActiveTab() {
      cy.get(selectors.tab).shouldBeActiveTab();
    },
    /**
     * Validates the title of the page.
     * @param dataVariant The variant object.
     */
    shouldHaveTitle(dataVariant: any) {
      cy.get(CommonSelectors.title).contains(dataVariant.variant).should('exist');
    },
  },
};
