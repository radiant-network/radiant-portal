/// <reference types="cypress"/>
import { CommonSelectors } from 'pom/shared/Selectors';
import { buildBilingualRegExp } from 'pom/shared/Utils';

const selectors = {
  providers: '[class*="Login_socialProviders"]',
  logo: '[class*="Login_logoContainer"]',
  langButton: '[class*="Login_switchLang"]',
  loginContent: '[class*="Login_loginFormContent"]',
};

export const LandingPage = {
  actions: {},

  validations: {
    /**
     * Validates the language button of the landing page.
     */
    shouldHaveLanguageButton() {
      cy.origin('https://auth.qa.juno.cqdg.ferlab.bio', { args: { selectors } }, ({ selectors }) => {
        cy.get(selectors.langButton).should('exist');
      });
    },
    /**
     * Validates the providers of the landing page.
     */
    shouldHaveLoginContent() {
      const regExp: RegExp = buildBilingualRegExp('loginContent');
      cy.origin('https://auth.qa.juno.cqdg.ferlab.bio', { args: { selectors, regExp } }, ({ selectors, regExp }) => {
        cy.get(selectors.loginContent).contains(regExp).should('exist');
      });
    },
    /**
     * Validates the logo of the landing page.
     */
    shouldHaveLogo() {
      cy.origin('https://auth.qa.juno.cqdg.ferlab.bio', { args: { selectors } }, ({ selectors }) => {
        cy.get(selectors.logo).should('exist');
      });
    },
    /**
     * Validates the 3 providers from CQDG to the Radiant client of the landing page.
     */
    shouldHaveProviders() {
      const linkSelector = CommonSelectors.link;
      cy.origin('https://auth.qa.juno.cqdg.ferlab.bio', { args: { selectors, linkSelector } }, ({ selectors, linkSelector }) => {
        cy.get(`${selectors.providers} ${linkSelector}`).eq(0).should('have.attr', 'href').and('include', '/realms/CQDG/broker/google/login?client_id=radiant');
        cy.get(`${selectors.providers} ${linkSelector}`).eq(1).should('have.attr', 'href').and('include', '/realms/CQDG/broker/orcid/login?client_id=radiant');
        cy.get(`${selectors.providers} ${linkSelector}`).eq(2).should('have.attr', 'href').and('include', '/realms/CQDG/broker/microsoft/login?client_id=radiant');
      });
    },
  },
};
