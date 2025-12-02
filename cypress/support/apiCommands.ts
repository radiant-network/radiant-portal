/// <reference types="cypress"/>

// Simple environment variable getter
const getEnv = (key: string): string => {
  return Cypress.env(key) || '';
};

/**
 * Makes an authenticated API call with automatic retry logic for 500 errors.
 * Retries up to the specified number of times if a 500 status code is received.
 * @param method The HTTP method (GET, POST, PUT, DELETE, etc.).
 * @param query The API endpoint path (e.g., 'patients/batch', 'analysis/123').
 * @param body The request body as a JSON string.
 * @param token The Bearer authentication token.
 * @param retries The number of retry attempts on 500 errors (default: 3).
 */
Cypress.Commands.add('apiCall', (method: string, query: string, body: string, token: string, retries: number = 3) => {
  const apiUrl = Cypress.env('api_base_url');

  if (Cypress.env('debug')) {
    cy.log('with body: ' + body);
  }

  const makeRequest = (attemptsLeft: number) => {
    cy.request({
      method: method,
      url: `${apiUrl}${query}`,
      headers: { Authorization: `Bearer ${token}` },
      body: body,
      failOnStatusCode: false,
      timeout: 60000,
    }).then(res => {
      if (res.status === 500 && attemptsLeft > 0) {
        cy.log(`Retrying API call, remaining retries: ${attemptsLeft - 1}`);
        makeRequest(attemptsLeft - 1);
      } else {
        return res;
      }
    });
  };

  makeRequest(retries);
});

/**
 * Gets an OAuth access token using Keycloak authentication.
 * Uses password grant type with configured credentials from environment variables.
 * @returns A Cypress chain containing the access token string.
 */
Cypress.Commands.add('getToken', () => {
  return cy
    .request({
      method: 'POST',
      url: `${getEnv('keycloak_host')}/realms/${getEnv('keycloak_realm')}/protocol/openid-connect/token`,
      form: true,
      body: {
        client_id: getEnv('api_client'),
        client_role: getEnv('api_client'),
        client_secret: getEnv('keycloak_client_secret'),
        username: getEnv('user_username'),
        password: getEnv('user_password'),
        grant_type: 'password',
      },
    })
    .then(response => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('access_token');
      return response.body.access_token;
    });
});

/**
 * Validates that a batch response has the expected structure and values.
 * Checks response keys, static fields and validates dynamic fields.
 * @param response The API response object from a batch request.
 * @param batch_type The type of the batch request (patient, sample, etc.).
 */
Cypress.Commands.add('validateAcceptedBatchResponse', (response: any, batch_type: string) => {
  expect(response.body).to.have.keys('id', 'dry_run', 'batch_type', 'status', 'created_on', 'username');
  expect(response.body).to.include({
    dry_run: true,
    batch_type: batch_type,
    status: 'PENDING',
    username: 'cypress',
  });
  expect(response.body.id)
    .to.be.a('string')
    .and.match(/^[0-9a-f-]{36}$/i);
  expect(response.body.created_on)
    .to.be.a('string')
    .and.match(/^\d{4}-\d{2}-\d{2}T/);
  expect(new Date(response.body.created_on).getTime()).to.be.closeTo(Date.now(), 60000); // ±60s
});

/**
 * Validates that a batch processed response has the expected report values.
 * Checks a specific level and code error message.
 * @param response The API response object from a batch processed.
 * @param level The level of the error to validate.
 * @param code The code error of the error to validate.
 * @param message The message of the error to validate.
 * @param path The path of the error to validate.
 */
Cypress.Commands.add('validateReport', (response: any, level: string, code: string, message: string, path: string) => {
  expect(response.body.report).to.have.property(level);
  expect(response.body.report[level]).to.be.an('array');

  const matchingItem = response.body.report[level].find((item: any) => item.code === code && item.message === message && item.path === path);

  expect(matchingItem, `No item found in report.${level} with code="${code}", message="${message}", path="${path}"`).to.exist;
});

/**
 * Validates that a batch processed response has the expected structure and values.
 * Checks response keys, static fields and validates dynamic fields.
 * @param response The API response object from a batch processed.
 * @param batch_type The type of the batch processed (patient, sample, etc.).
 * @param batch_id The id of the batch processed.
 */
Cypress.Commands.add('validateSuccessBatchProcessed', (response: any, batch_type: string, batch_id: string) => {
  expect(response.body).to.have.all.keys('id', 'dry_run', 'batch_type', 'status', 'created_on', 'started_on', 'finished_on', 'username', 'summary', 'report');
  expect(response.body).to.include({
    id: batch_id,
    dry_run: true,
    batch_type: batch_type,
    status: 'SUCCESS',
    username: 'cypress',
  });
  expect(response.body.created_on)
    .to.be.a('string')
    .and.match(/^\d{4}-\d{2}-\d{2}T/);
  expect(response.body.started_on)
    .to.be.a('string')
    .and.match(/^\d{4}-\d{2}-\d{2}T/);
  expect(response.body.finished_on)
    .to.be.a('string')
    .and.match(/^\d{4}-\d{2}-\d{2}T/);
  expect(response.body.summary).to.deep.equal({
    created: 0,
    updated: 0,
    skipped: 0,
    errors: 0,
  });
  expect(response.body.report).to.be.empty;
});

/**
 * Validates that a batch processed response has the expected summary values.
 * @param response The API response object from a batch processed.
 * @param created The number of created objects to validate.
 * @param updated The number of updated objects to validate.
 * @param skipped The number of skipped objects to validate.
 * @param errors The number of errors objects to validate.
 */
Cypress.Commands.add('validateSummary', (response: any, created: number, updated: number, skipped: number, errors: number) => {
  expect(response.body.summary).to.deep.equal({
    created: created,
    updated: updated,
    skipped: skipped,
    errors: errors,
  });
});

/**
 * Validates that an API response contains a specific message.
 * @param response The API response object to validate.
 * @param message The expected message that should be included in response.body.message.
 */
Cypress.Commands.add('validateMessage', (response: any, message: string) => {
  expect(response.body.message).to.include(message);
});
