/// <reference types="cypress"/>
import { CommonSelectors } from 'pom/shared/Selectors';

export const VariantPreview = {
  actions: {
    /**
     * Clicks on the View in IGV button.
     */
    clickOpenIGV() {
      cy.get(`${CommonSelectors.variantPreview} button ${CommonSelectors.igvIcon}`).clickAndWait({ force: true });
    },
  },

  validations: {},
};
