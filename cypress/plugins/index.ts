/* eslint-disable no-console */
/// <reference types="cypress"/>

require('dotenv').config();

module.exports = (on: Cypress.PluginEvents, config: Cypress.ConfigOptions) => {
  on('task', {
  });

  if (!config.env) {
    config.env = {};
  }

  config.env.user_username = process.env.CYPRESS_USER_USERNAME;
  config.env.user_password = process.env.CYPRESS_USER_PASSWORD;
  config.env.keycloak_client_secret = process.env.KEYCLOAK_CLIENT_SECRET;

  return config;
};

export {};
