/* eslint-disable no-console */
/// <reference types="cypress"/>

require("dotenv").config();

module.exports = (on: Cypress.PluginEvents, config: Cypress.ConfigOptions) => {
  on("task", {});

  if (!config.env) {
    config.env = {};
  }

  // Set all environment variables in config.env with fallbacks
  config.env = {
    ...config.env,
    user_username: process.env.CYPRESS_USER_USERNAME,
    user_password: process.env.CYPRESS_USER_PASSWORD,
    keycloak_host:
      process.env.KEYCLOAK_HOST || "https://auth.qa.juno.cqdg.ferlab.bio",
    keycloak_realm: process.env.KEYCLOAK_REALM || "CQDG",
    keycloak_client: process.env.KEYCLOAK_CLIENT || "cqdg-client", // Changed to working client
    keycloak_client_secret: process.env.KEYCLOAK_CLIENT_SECRET,
  };

  return config;
};

export {};
