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
 * Validates that an API response contains a specific message.
 * @param response The API response object to validate.
 * @param message The expected message that should be included in response.body.message.
 */
Cypress.Commands.add('validateMessage', (response: any, message: string) => {
  expect(response.body.message).to.include(message);
});
