/// <reference types="cypress"/>
import { CommonSelectors } from 'pom/shared/Selectors';

const selectors = {
  tab: '[class*= "lucide-clipboard-list"]',
};

export const CaseEntity_Details = {
  validations: {
    /**
     * Checks that the tab is active.
     */
    shouldHaveActiveTab() {
      cy.get(selectors.tab).shouldBeActiveTab();
    },
    /**
     * Validates the title of the page.
     * @param dataCase The case object.
     */
    shouldHaveTitle(dataCase: any) {
      cy.get(CommonSelectors.title).contains(`Case ${dataCase.case}`).should('exist');
    },
  },
};
