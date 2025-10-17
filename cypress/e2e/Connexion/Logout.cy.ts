/// <reference types="cypress"/>
import { LandingPage } from 'pom/pages/LandingPage';

describe('Connexion - Logout', () => {
  const setupTest = () => {
    cy.login();
    cy.visit('/');
  };

  it('Information displayed', () => {
    setupTest();
    cy.logout();
    LandingPage.validations.shouldHaveLanguageButton();
    LandingPage.validations.shouldHaveLogo();
    LandingPage.validations.shouldHaveLoginContent();
    LandingPage.validations.shouldHaveProviders();
  });
});
