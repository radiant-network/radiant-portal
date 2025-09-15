/* eslint-disable */
/// <reference types="cypress" />
import './commands';
import 'cypress-real-events';

// Ignore uncaught exception so tests doesn't stop mid run
Cypress.on('uncaught:exception', () => false);
