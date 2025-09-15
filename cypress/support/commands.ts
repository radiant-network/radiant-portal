/// <reference types="cypress"/>
import createUUID from './createUUID';
import { CommonSelectors } from '../pom/shared/Selectors';
import { oneMinute } from '../pom/shared/Utils';
import 'cypress-real-events';

// Simple environment variable getter
const getEnv = (key: string): string => {
  return Cypress.env(key) || '';
};

/**
 * Clicks an element and waits for loading to complete.
 * @param subject The element to click.
 * @param options Click options to pass to Cypress.
 */
Cypress.Commands.add('clickAndWait', { prevSubject: 'element' }, (subject, options) => {
  cy.wrap(subject).click(options);
  cy.waitWhileLoad(oneMinute);
});

/**
 * Hides a column in the table by unchecking it in the column selector.
 * @param column The column name to hide.
 */
Cypress.Commands.add('hideColumn', (column: string) => {
  cy.get(CommonSelectors.settingsIcon).clickAndWait({ force: true });
  cy.get(`${CommonSelectors.settingsPopper} ${CommonSelectors.settingsCheckbox(column)}`).click({ force: true });
  cy.get(CommonSelectors.settingsIcon).clickAndWait({ force: true });
  cy.get(CommonSelectors.settingsPopper).should('not.exist');
});

/**
 * Performs OAuth-based login using Keycloak authentication (simplified for Radiant Portal).
 * Creates a session that can be cached across test specs.
 */
Cypress.Commands.add('login', () => {
  cy.session(
    ['user'],
    () => {
      cy.request({
        url: `${getEnv('keycloak_host')}/realms/${getEnv('keycloak_realm')}/protocol/openid-connect/auth`,
        qs: {
          client_id: getEnv('keycloak_client'), // Now uses the working cqdg-client from config
          redirect_uri: Cypress.config('baseUrl'),
          kc_idp_hint: null,
          scope: 'openid',
          state: createUUID(),
          nonce: createUUID(),
          response_type: 'code',
          response_mode: 'fragment',
        },
      }).then(response => {
        const html: HTMLElement = document.createElement('html');
        html.innerHTML = response.body;

        const script = html.getElementsByTagName('script')[0] as HTMLScriptElement;

        eval(script.textContent ?? '');

        const loginUrl: string = (window as any).kcContext.url.loginAction;

        return cy.request({
          form: true,
          method: 'POST',
          url: loginUrl,
          followRedirect: false,
          body: {
            username: getEnv('user_username'),
            password: getEnv('user_password'),
          },
        });
      });
    },
    {
      validate() {
        // Simple validation - just check we're not on auth server
        cy.visit('/', { failOnStatusCode: false });
        cy.url().should('not.contain', 'auth.qa.juno.cqdg.ferlab.bio');
      },
      cacheAcrossSpecs: true,
    }
  );
});

/**
 * Resets all table columns to their default configuration.
 */
Cypress.Commands.add('resetColumns', () => {
  cy.get(CommonSelectors.settingsIcon).clickAndWait({ force: true });
  cy.get(`${CommonSelectors.settingsPopper} ${CommonSelectors.resetButton}`).click({ force: true });
  cy.get(CommonSelectors.settingsIcon).clickAndWait({ force: true });
  cy.get(CommonSelectors.settingsPopper).should('not.exist');
});

/**
 * Set the language of the application.
 * @param lang The language to set (FR|EN).
 */
Cypress.Commands.add('setLang', (lang: string) => {
  cy.get(CommonSelectors.langButton)
    .contains(/^(FR|EN)$/)
    .invoke('text')
    .then(invokeText => {
      if (invokeText.includes(lang)) {
        cy.get(CommonSelectors.langButton).contains(lang).clickAndWait({ force: true });
      }
    });
});

/**
 * Asserts that the given tab is active.
 * @param subject The tab element.
 */
Cypress.Commands.add('shouldBeActiveTab', { prevSubject: 'element' }, subject => {
  cy.wrap(subject).parents(CommonSelectors.activeTab).should('exist');
});

/**
 * Asserts that a given element is sortable or not sortable.
 * @param subject The element to check for sortability.
 * @param isSortable Whether the column should be sortable.
 */
Cypress.Commands.add('shouldBeSortable', { prevSubject: 'element' }, (subject, isSortable: boolean) => {
  const strExpectedSortable = isSortable ? 'exist' : 'not.exist';
  cy.wrap(subject).find(CommonSelectors.sortIcon).should(strExpectedSortable);
});

/**
 * Asserts that a given element has a tooltip with the specified content.
 * @param subject The element to check for tooltip.
 * @param tooltipContent The expected tooltip content (null if no tooltip).
 */
Cypress.Commands.add('shouldHaveTooltip', { prevSubject: 'element' }, (subject, tooltipContent: string | RegExp | null) => {
  if (tooltipContent) {
    cy.wrap(subject).find(CommonSelectors.underlineHeader).realHover();
    cy.get(CommonSelectors.tooltipPopper).contains(tooltipContent).first().should('exist');
    cy.get(CommonSelectors.logo).click();
    cy.get(CommonSelectors.tooltipPopper).should('not.exist');
  } else {
    cy.wrap(subject).realHover();
    cy.get(CommonSelectors.tooltipPopper).should('not.exist');
  }
});

/**
 * Shows a column in the table by checking it in the column selector.
 * @param column The column name to show.
 */
Cypress.Commands.add('showColumn', (column: string) => {
  cy.get(CommonSelectors.settingsIcon).clickAndWait({ force: true });
  cy.get(CommonSelectors.settingsPopper).find(CommonSelectors.settingsCheckbox(column)).click({ force: true });
  cy.get(CommonSelectors.settingsIcon).clickAndWait({ force: true });
  cy.get(CommonSelectors.settingsPopper).should('not.exist');
});

/**
 * Sorts a table column and intercepts API calls.
 * @param position The column position index to sort.
 * @param nbCalls The number of API calls to wait for.
 */
Cypress.Commands.add('sortTableAndIntercept', (position: number, nbCalls: number) => {
  cy.intercept('POST', '**/list').as('postList');

  cy.get(`${CommonSelectors.tableHead} ${CommonSelectors.tableCellHead}`).eq(position).find(CommonSelectors.sortIcon).clickAndWait({ force: true });

  for (let i = 0; i < nbCalls; i++) {
    cy.wait('@postList', { timeout: oneMinute });
  }
});

/**
 * Sorts a table column and waits for a fixed duration.
 * @param position The column position index to sort.
 */
Cypress.Commands.add('sortTableAndWait', (position: number) => {
  cy.get(`${CommonSelectors.tableHead} ${CommonSelectors.tableCellHead}`).eq(position).find(CommonSelectors.sortIcon).click({ force: true });
  cy.wait(1000);
});

/**
 * Validates that the selected query pill contains the expected values.
 * @param facetTitle The title of the facet (or empty string if no pill expected).
 * @param values Array of values that should be present in the pill.
 * @param eq The index of the pill to validate (default: 0).
 */
Cypress.Commands.add('validatePillSelectedQuery', (facetTitle: string | RegExp, values: (string | RegExp)[], eq: number = 0) => {
  if (facetTitle == '') {
    cy.get(CommonSelectors.pillQueryActive).should('not.exist');
  } else {
    cy.get(CommonSelectors.pillQueryActive).eq(eq).contains(facetTitle).should('exist');
  }

  for (let i = 0; i < values.length; i++) {
    cy.get(CommonSelectors.pillQueryActive).eq(eq).contains(values[i]).should('exist');
  }
});

/**
 * Validates that the first table row has a specific attribute with the expected value.
 * @param expectedAttr The attribute name to check.
 * @param expectedValue The expected attribute value.
 * @param columnIndex The column index to check.
 */
Cypress.Commands.add('validateTableFirstRowAttr', (expectedAttr: string, expectedValue: string, columnIndex: number) => {
  cy.wait(2000);
  cy.get(CommonSelectors.tableRow)
    .eq(0)
    .find(CommonSelectors.tableCellData)
    .eq(columnIndex)
    .find('[' + expectedAttr + '="' + expectedValue + '"]')
    .should('exist');
});

/**
 * Validates that the first table row has a specific CSS class.
 * @param expectedClass The CSS class name to check for.
 * @param columnIndex The column index to check.
 */
Cypress.Commands.add('validateTableFirstRowClass', (expectedClass: string, columnIndex: number) => {
  cy.wait(2000);
  cy.get(CommonSelectors.tableRow).eq(0).find(CommonSelectors.tableCellData).eq(columnIndex).find(expectedClass).should('exist');
});

/**
 * Validates that the first table row contains the expected content.
 * @param expectedValue The expected value (string or RegExp).
 * @param columnIndex The column index to check.
 */
Cypress.Commands.add('validateTableFirstRowContent', (expectedValue: string | RegExp, columnIndex: number) => {
  cy.wait(2000);
  cy.get(CommonSelectors.tableRow).eq(0).find(CommonSelectors.tableCellData).eq(columnIndex).contains(expectedValue).should('exist');
});

/**
 * Visits a URL and intercepts API calls, waiting for a specified number of requests.
 * @param url The URL to visit.
 * @param methodHTTP The HTTP method to intercept.
 * @param routeMatcher The route pattern to match for interception.
 * @param nbCalls The number of API calls to wait for.
 */
Cypress.Commands.add('visitAndIntercept', (url: string, methodHTTP: string, routeMatcher: string, nbCalls: number) => {
  cy.intercept(methodHTTP, routeMatcher).as('routeMatcher');

  cy.visit(url, { failOnStatusCode: false });

  for (let i = 0; i < nbCalls; i++) {
    cy.wait('@routeMatcher', { timeout: oneMinute });
  }

  cy.waitWhileLoad(oneMinute);
});

/**
 * Visits the cases page.
 * @param searchCriteria Optional search criteria to apply (JSON string).
 */
Cypress.Commands.add('visitCasesPage', (searchCriteria?: string) => {
  if (searchCriteria == undefined) {
    cy.visitAndIntercept('/case', 'POST', '**/cases/search', 1);
  } else {
    cy.intercept('POST', '**/cases/search', interception => {
      const mockBody = { ...interception.body };
      mockBody.search_criteria = JSON.parse(searchCriteria);
      interception.alias = 'postSearch';
      interception.body = mockBody;
    });
    cy.visit('/case', { failOnStatusCode: false });
    cy.wait('@postSearch');
  }

  cy.setLang('EN');
  cy.resetColumns();
});

/**
 * Visits the case variants page for a specific case.
 * @param caseId The case ID to visit.
 * @param sqon Optional query filter to apply (JSON string).
 */
Cypress.Commands.add('visitCaseVariantsPage', (caseId: string, sqon?: string) => {
  if (sqon == undefined) {
    cy.visitAndIntercept(`/case/entity/${caseId}?tab=variants`, 'POST', '**/list', 1);
  } else {
    cy.intercept('POST', '**/list', interception => {
      const mockBody = { ...interception.body };
      mockBody.sqon = JSON.parse(sqon);
      interception.alias = 'postList';
      interception.body = mockBody;
    });
    cy.visit(`/case/entity/${caseId}?tab=variants`, { failOnStatusCode: false });
    cy.wait('@postList');
  }

  cy.setLang('EN');
  cy.resetColumns();
});

/**
 * Waits for loading indicators to disappear within a specified timeout.
 * @param ms The maximum time to wait in milliseconds.
 */
Cypress.Commands.add('waitWhileLoad', (ms: number) => {
  const start = new Date().getTime();

  function checkForLoadIndicator(): any {
    const now = new Date().getTime();
    if (now - start > ms) {
      throw new Error(`Timed out after ${ms}ms waiting for load indicator to disappear`);
    }

    return cy.get('body').then($body => {
      if ($body.find(CommonSelectors.loadIndicator).length > 0) {
        return cy.wait(1000).then(checkForLoadIndicator);
      }
    });
  }

  return checkForLoadIndicator();
});

/**
 * Overrides the default Cypress log command to use a custom task logger.
 * @param subject The original log subject.
 * @param message The message to log.
 */
Cypress.Commands.overwrite('log', (subject, message) => cy.task('log', message));
