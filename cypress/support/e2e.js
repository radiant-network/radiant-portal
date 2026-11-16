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

// The cached token is checked once per spec: it has to outlive the spec, or its last API calls get a 401.
const TOKEN_MIN_REMAINING_SECONDS = 180;

const tokenPayload = token => {
  try {
    return JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
  } catch {
    return null;
  }
};

const expiresSoon = payload => payload.exp - Date.now() / 1000 < TOKEN_MIN_REMAINING_SECONDS;

Cypress.Commands.add('isValidToken', token => {
  const apiUrl = Cypress.expose('api_base_url');
  const tenant = Cypress.expose('api_tenant');
  const payload = token && tokenPayload(token);

  if (!payload || expiresSoon(payload)) {
    return cy.wrap(false);
  }

  return cy.getUsername().then(username => {
    // The cache keeps the token of the account that ran last, which may not be this run's
    if (![payload.preferred_username, payload.email].includes(username?.toLowerCase())) {
      return false;
    }
    return cy
      .request({
        method: 'GET',
        url: `${apiUrl}${tenant}/batches/${globalData.BatchesId.patientNotFound}`,
        headers: { Authorization: `Bearer ${token}` },
        failOnStatusCode: false,
      })
      .then(res => res.status !== 401 && res.status !== 403);
  });
});

Cypress.Commands.add('initializeGlobalData', () => {
  return cy.setToken().then(() => {
    Cypress.expose('globalData', globalData);
    cy.task('saveCachedData', globalData);
  });
});

before(() => {
  return cy
    .task('checkCachedData')
    .then(isExist => {
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
    })
    .then(() => cy.task('referenceSavedFiltersChecked'))
    .then(checked => {
      // Once per Cypress process: the reference filters do not change during a run
      if (!checked) {
        return cy.ensureReferenceSavedFilters(globalData.Authorization.token).then(() => cy.task('markReferenceSavedFiltersChecked'));
      }
    });
});

// Ignore uncaught exception so tests doesn't stop mid run
Cypress.on('uncaught:exception', () => false);
