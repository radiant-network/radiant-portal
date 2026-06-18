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
  const apiUrl = Cypress.expose('api_base_url');
  const tenant = Cypress.expose('api_tenant');

  return cy
    .request({
      method: 'GET',
      url: `${apiUrl}${tenant}/batches/${globalData.BatchesId.patientNotFound}`,
      headers: { Authorization: `Bearer ${token}` },
      failOnStatusCode: false,
    })
    .then(res => {
      return cy.wrap(res.status !== 401 && res.status !== 403);
    });
});

Cypress.Commands.add('initializeGlobalData', () => {
  return cy.setToken().then(() => {
    Cypress.expose('globalData', globalData);
    cy.task('saveCachedData', globalData);
  });
});

before(() => {
  return cy.task('checkCachedData').then(isExist => {
    if (isExist) {
      return cy.task('loadCachedData').then(cachedData => {
        return cy.isValidToken(cachedData.Authorization.token).then(isValid => {
          if (isValid) {
            globalData.Authorization.token = cachedData.Authorization.token;
            Cypress.expose('globalData', globalData);
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
