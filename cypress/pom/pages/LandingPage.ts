/// <reference types="cypress"/>
import { buildBilingualRegExp } from 'pom/shared/Utils';

const selectors = {
  title: 'header[id="kc-header"]',
  loginContent: 'main[class="pf-v5-c-login__main"]',
};

export const LandingPage = {
  actions: {},

  validations: {
    /**
     * Validates the content of the landing page.
     */
    shouldHaveLoginContent() {
      const regExp: RegExp = buildBilingualRegExp('loginContent');
      cy.origin('https://auth.dev.qlin.aws.sante.quebec', { args: { selectors, regExp } }, ({ selectors, regExp }) => {
        cy.get(selectors.loginContent).contains(regExp).should('exist');
      });
    },
    /**
     * Validates the title of the landing page.
     */
    shouldHaveTitle() {
      cy.origin('https://auth.dev.qlin.aws.sante.quebec', { args: { selectors } }, ({ selectors }) => {
        cy.get(selectors.title).should('exist');
      });
    },
  },
};
