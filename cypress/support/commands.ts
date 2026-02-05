/// <reference types="cypress"/>
import createUUID from './createUUID';
import { CommonSelectors } from 'pom/shared/Selectors';
import { oneMinute } from 'pom/shared/Utils';
import 'cypress-real-events';
import { CaseEntity_Variants_CNV_Table } from 'pom/pages/CaseEntity_Variants_CNV_Table';

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
 * Handle when the column is not found.
 * @param column The column not found.
 */
Cypress.Commands.add('handleColumnNotFound', (column: string) => {
  throw new Error(`Error: "Column ${column} not found"`);
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
 * Logs out the current user.
 */
Cypress.Commands.add('logout', () => {
  cy.visit('/');
  cy.wait(2000);

  cy.get(CommonSelectors.userIcon).eq(0).click();
  cy.get(`${CommonSelectors.menuPopper} ${CommonSelectors.logoutIcon}`).click();
  cy.wait(2000);
});

/**
 * Pins a column in the table to the left side.
 * @param position The column position index to pin.
 * @param tableId The table ID to pin the column in (default: '').
 */
Cypress.Commands.add('pinColumn', (position: number, tableId: string = '') => {
  cy.get(`${CommonSelectors.tableHeadCell(tableId)}`)
    .eq(position)
    .find(CommonSelectors.pinIcon)
    .click({ force: true });
  cy.get(`${CommonSelectors.menuPopper} ${CommonSelectors.pinLeftIcon}`).click({ force: true });
  cy.wait(1000);
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
  cy.wrap(subject).then($el => {
    if ($el.is(CommonSelectors.activeTab)) {
      cy.wrap($el).should('match', CommonSelectors.activeTab);
    } else {
      cy.wrap($el).parents(CommonSelectors.activeTab).should('exist');
    }
  });
});

/**
 * Asserts that the given element has data-state attribute.
 * @param subject The element.
 * @param state The expected level of the element.
 */
Cypress.Commands.add('shouldBeDataState', { prevSubject: 'element' }, (subject, state: string) => {
  cy.wrap(subject).should('match', `[data-state="${state}"]`);
});

/**
 * Asserts that a given element is pinnable or not pinnable.
 * @param subject The element to check for pinnability.
 * @param isPinnable Whether the column should be pinnable.
 */
Cypress.Commands.add('shouldBePinnable', { prevSubject: 'element' }, (subject, isPinnable: boolean) => {
  const strExpectedPinnable = isPinnable ? 'exist' : 'not.exist';
  cy.wrap(subject).find(CommonSelectors.pinIcon).should(strExpectedPinnable);
});

/**
 * Validates if a column is pinned or not.
 * @param subject The element to check for pin state.
 * @param position The side of the pinned column ('left', 'right', or null if not pinned).
 */
Cypress.Commands.add('shouldBePinned', { prevSubject: 'element' }, (subject, position: 'left' | 'right' | null) => {
  if (position) {
    cy.wrap(subject).should('match', CommonSelectors.pinned(position));
  } else {
    cy.wrap(subject).should('not.match', `${CommonSelectors.pinned('left')}, ${CommonSelectors.pinned('right')}`);
  }
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
 * @param object The object containing the necessary fields (isSortable, isPinnable, tooltip).
 */
Cypress.Commands.add('shouldHaveTooltip', { prevSubject: 'element' }, (subject, object: any) => {
  let scrollIntoSubject;
  if (object.isSortable || object.isPinnable) {
    scrollIntoSubject = cy
      .wrap(subject)
      .invoke('css', 'width', '125px' /*Widen column for tooltip access*/)
      .scrollIntoView({ offset: { top: -300, left: -300 } })
      .should('be.visible');
  } else {
    scrollIntoSubject = cy.wrap(subject).scrollIntoView().wait(1000).should('be.visible');
  }
  if (object.tooltip) {
    cy.wait(6000);
    scrollIntoSubject.find(`${CommonSelectors.underlineHeader}, ${CommonSelectors.facetTriggerTooltip}`).realHover();
    cy.get(CommonSelectors.tooltipPopper).invoke('css', { position: 'fixed', left: '20px' } /*Avoid hiding the logo*/).contains(object.tooltip).first().should('exist');
    cy.get(CommonSelectors.logo).click(); // Close the popper
    cy.get(CommonSelectors.tooltipPopper).should('not.exist');
  } else {
    scrollIntoSubject.realHover();
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
  cy.get(CommonSelectors.logo).clickAndWait({ force: true }); // Close the popper
  cy.get(CommonSelectors.settingsPopper).should('not.exist');
  cy.waitWhileLoad(oneMinute);
});

/**
 * Sorts a table column and intercepts API calls.
 * @param position The column position index to sort.
 * @param routeMatcher The route pattern to match for interception.
 * @param nbCalls The number of API calls to wait for.
 * @param tableId The table ID to sort (default: '').
 */
Cypress.Commands.add('sortTableAndIntercept', (position: number, routeMatcher: string, nbCalls: number, tableId: string = '') => {
  cy.intercept('POST', routeMatcher).as('routeMatcher');

  cy.get(`${CommonSelectors.tableHeadCell(tableId)}`)
    .eq(position)
    .find(CommonSelectors.sortIcon)
    .clickAndWait({ force: true });

  for (let i = 0; i < nbCalls; i++) {
    cy.wait('@routeMatcher', { timeout: oneMinute });
  }

  cy.waitWhileLoad(oneMinute);
});

/**
 * Sorts a table column and waits for a fixed duration.
 * @param position The column position index to sort.
 * @param tableId The table ID to sort (default: '').
 */
Cypress.Commands.add('sortTableAndWait', (position: number, tableId: string = '') => {
  cy.get(`${CommonSelectors.tableHeadCell(tableId)}`)
    .eq(position)
    .find(CommonSelectors.sortIcon)
    .click({ force: true });
  cy.wait(1000);
});

/**
 * Unpins a column in the table.
 * @param position The column position index to unpin.
 * @param tableId The table ID to unpin the column in (default: '').
 */
Cypress.Commands.add('unpinColumn', (position: number, tableId: string = '') => {
  cy.get(`${CommonSelectors.tableHeadCell(tableId)}`)
    .eq(position)
    .find(CommonSelectors.pinIcon)
    .click({ force: true });
  cy.get(`${CommonSelectors.menuPopper} ${CommonSelectors.unpinIcon}`).click({ force: true });
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
 * @param tableId The table ID to check (default: '').
 */
Cypress.Commands.add('validateTableFirstRowAttr', (expectedAttr: string, expectedValue: string, columnIndex: number, tableId: string = '') => {
  cy.wait(2000);
  cy.get(CommonSelectors.tableRow(tableId))
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
 * @param tableId The table ID to check (default: '').
 */
Cypress.Commands.add('validateTableFirstRowClass', (expectedClass: string, columnIndex: number, tableId: string = '') => {
  cy.wait(2000);
  cy.get(CommonSelectors.tableRow(tableId)).eq(0).find(CommonSelectors.tableCellData).eq(columnIndex).find(expectedClass).should('exist');
});

/**
 * Validates that the first table row contains the expected content.
 * @param expectedValue The expected value (string or RegExp).
 * @param columnIndex The column index to check.
 * @param tableId The table ID to check (default: '').
 */
Cypress.Commands.add('validateTableFirstRowContent', (expectedValue: string | RegExp, columnIndex: number, tableId: string = '') => {
  cy.wait(2000);
  cy.get(CommonSelectors.tableRow(tableId)).eq(0).find(CommonSelectors.tableCellData).eq(columnIndex).contains(expectedValue).should('exist');
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
 * Visits the files page.
 * @param searchCriteria Optional search criteria to apply (JSON string).
 */
Cypress.Commands.add('visitFilesPage', (searchCriteria?: string) => {
  if (searchCriteria == undefined) {
    cy.visitAndIntercept('/file', 'POST', '**/documents/search', 1);
  } else {
    cy.intercept('POST', '**/documents/search', interception => {
      const mockBody = { ...interception.body };
      mockBody.search_criteria = JSON.parse(searchCriteria);
      interception.alias = 'postSearch';
      interception.body = mockBody;
    });
    cy.visit('/file', { failOnStatusCode: false });
    cy.wait('@postSearch');
  }

  cy.setLang('EN');
  cy.resetColumns();
});

/**
 * Visits the case details page for a specific case.
 * @param caseId The case ID to visit.
 */
Cypress.Commands.add('visitCaseDetailsPage', (caseId: string) => {
  cy.visitAndIntercept(`/case/entity/${caseId}?tab=details`, 'GET', `**/cases/${caseId}`, 1);
  cy.setLang('EN');
});

/**
 * Visits the case files page for a specific case.
 * @param caseId The case ID to visit.
 * @param searchCriteria Optional search criteria to apply (JSON string).
 */
Cypress.Commands.add('visitCaseFilesPage', (caseId: string, searchCriteria?: string) => {
  if (searchCriteria == undefined) {
    cy.visitAndIntercept(`/case/entity/${caseId}?tab=files`, 'POST', '**/documents/search', 1);
  } else {
    cy.intercept('POST', '**/documents/search', interception => {
      const mockBody = { ...interception.body };
      mockBody.search_criteria = JSON.parse(searchCriteria);
      interception.alias = 'postSearch';
      interception.body = mockBody;
    });
    cy.visit(`/case/entity/${caseId}?tab=files`, { failOnStatusCode: false });
    cy.wait('@postSearch');
  }

  cy.setLang('EN');
  cy.resetColumns();
});

/**
 * Visits the case variants page for a specific case.
 * @param caseId The case ID to visit.
 * @param type The type of variants (SNV | CNV).
 * @param sqon Optional query filter to apply (JSON string).
 */
Cypress.Commands.add('visitCaseVariantsPage', (caseId: string, type: string, sqon?: string) => {
  if (type === 'SNV') {
    if (sqon == undefined) {
      cy.visitAndIntercept(`/case/entity/${caseId}?tab=variants`, 'POST', '**/list', 1);
    } else {
      cy.intercept('POST', '**/list', interception => {
        const mockBody = { ...interception.body };
        mockBody.sqon = JSON.parse(sqon);
        interception.alias = 'postListSNV';
        interception.body = mockBody;
      });
      cy.visit(`/case/entity/${caseId}?tab=variants`, { failOnStatusCode: false });
      cy.wait('@postListSNV');
    }
  } else if (type === 'CNV') {
    cy.visitAndIntercept(`/case/entity/${caseId}?tab=variants`, 'POST', '**/list', 1);

    if (sqon == undefined) {
      cy.intercept('POST', '**/list').as('postListCNV');
      CaseEntity_Variants_CNV_Table.actions.clickToggle();
      cy.wait('@postListCNV');
    } else {
      cy.intercept('POST', '**/list', interception => {
        const mockBody = { ...interception.body };
        mockBody.sqon = JSON.parse(sqon);
        interception.alias = 'postListCNV';
        interception.body = mockBody;
      });
      CaseEntity_Variants_CNV_Table.actions.clickToggle();
      cy.wait('@postListCNV');
    }
  }

  cy.setLang('EN');
  cy.resetColumns();
});

/**
 * Visits the variant evidence and conditions page for a specific variant.
 * @param locusID The locus ID to visit.
 */
Cypress.Commands.add('visitVariantEvidCondPage', (locusID: string) => {
  cy.visitAndIntercept(`/variants/entity/${locusID}?tab=evidenceAndConditions`, 'GET', `**/conditions/omim`, 1);
  cy.setLang('EN');
});

/**
 * Visits the variant frequency page for a specific variant.
 * @param locusID The locus ID to visit.
 */
Cypress.Commands.add('visitVariantFrequencyPage', (locusID: string) => {
  cy.visitAndIntercept(`/variants/entity/${locusID}?tab=frequency`, 'GET', `**/external_frequencies`, 1);
  cy.setLang('EN');
});

/**
 * Visits the variant patients page for a specific variant.
 * @param locusID The locus ID to visit.
 */
Cypress.Commands.add('visitVariantPatientsPage', (locusID: string) => {
  cy.visitAndIntercept(`/variants/entity/${locusID}?tab=patients`, 'POST', `**/cases/interpreted`, 1);
  cy.setLang('EN');
});

/**
 * Waits for loading indicators to disappear within a specified timeout.
 * @param ms The maximum time to wait in milliseconds.
 */
Cypress.Commands.add('waitWhileLoad', (ms: number) => {
  const start = new Date().getTime();

  function checkForLoadIndicator(): any {
    cy.wait(500);
    const now = new Date().getTime();
    if (now - start > ms) {
      throw new Error(`Timed out after ${ms}ms waiting for load indicator to disappear`);
    }

    return cy.get('body').then($body => {
      if ($body.find(CommonSelectors.loadIndicator).length > 0) {
        return checkForLoadIndicator();
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
