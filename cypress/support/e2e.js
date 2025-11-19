/* eslint-disable */
/// <reference types="cypress" />
import './commands';
import './apiCommands';
import 'cypress-real-events';
import { globalData } from './globalData';

Cypress.Commands.add('setToken', () => {
  cy.getToken().then(token => {
    globalData.Authorization.token = token;
    expect(globalData.Authorization.token).to.exist;
  });
});

Cypress.Commands.add('isValidToken', token => {
  const apiUrl = Cypress.env('api_base_url');

  return cy
    .request({
      method: 'GET',
      url: `${apiUrl}batches/mustReturn500ifTokenValid`,
      headers: { Authorization: `Bearer ${token}` },
      failOnStatusCode: false,
    })
    .then(res => {
      return cy.wrap(res.status === 500);
    });
});

Cypress.Commands.add('initializeGlobalData', () => {
  return cy.setToken().then(() => {
    Cypress.env('globalData', globalData);
    cy.task('saveCachedData', globalData);
  });
});

before(() => {
  return cy.task('checkCachedData').then(isExist => {
    if (isExist) {
      return cy.task('loadCachedData').then(cachedData => {
        return cy.isValidToken(cachedData.Authorization.token).then(isValid => {
          if (isValid) {
            Cypress.env('globalData', cachedData);
          } else {
            return cy.initializeGlobalData();
          }
        });
      });
    } else {
      return cy.initializeGlobalData();
    }
  });
});

// Ignore uncaught exception so tests doesn't stop mid run
Cypress.on('uncaught:exception', () => false);
