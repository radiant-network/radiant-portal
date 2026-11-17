/// <reference types="cypress"/>

/** Like before(), but redone when a test is retried: Cypress never retries a failed before(). */
export const setupOnce = (setup: () => void) => {
  let ready = false;
  beforeEach(() => {
    if (ready && Cypress.currentRetry === 0) return;
    ready = false;
    setup();
    cy.then(() => {
      ready = true;
    });
  });
};
