/// <reference types="cypress"/>
import createUUID from './createUUID';
import { CommonSelectors } from '../pom/shared/Selectors';
import { oneMinute, stringToRegExp } from '../pom/shared/Utils';
// Simple environment variable getter
const getEnv = (key: string): string => {
  return Cypress.env(key) || '';
};

Cypress.Commands.add('clickAndWait', { prevSubject: 'element' }, (subject, options) => {
  cy.wrap(subject).click(options);
  cy.waitWhileSpin(oneMinute);
});

/**
 * Returns the table header cell matching the given column name.
 * @param columnName The exact name of the column.
 */
Cypress.Commands.add('getColumnHeadCell', (columnName: string) => {
  cy.get(CommonSelectors.tableHead).find(CommonSelectors.tableCellHead).then(($tableCells) => {
    let matchedCell: JQuery<HTMLElement> | undefined = undefined;
    $tableCells.each((_index, cell) => {
      if (columnName.startsWith('[')) {
        if (Cypress.$(cell).find(columnName).length > 0) {
          matchedCell = Cypress.$(cell);
          return false;
        };
      } else {
        if (cell.textContent?.match(stringToRegExp(columnName, true/*exact*/))) {
          matchedCell = Cypress.$(cell);
          return false;
        };
      };
    });
    if (matchedCell) {
      return matchedCell;
    };
  });
});

/**
 * Hides a column in the table by unchecking it in the column selector.
 * @param column The column name or RegExp to match.
 */
Cypress.Commands.add('hideColumn', (column: string) => {
  cy.get(CommonSelectors.settingsIcon).clickAndWait({force: true});
  cy.get(CommonSelectors.settingsPopper).find(CommonSelectors.settingsCheckbox(column)).click({force: true});
  cy.get(CommonSelectors.settingsIcon).clickAndWait({force: true});
  cy.get(CommonSelectors.settingsPopper).should('not.exist');
});

// Working OAuth-based login (simplified for Radiant Portal)
Cypress.Commands.add('login', () => {
  cy.session(['user'], () => {
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
    }).then((response) => {
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
  }, {
    validate() {
      // Simple validation - just check we're not on auth server
      cy.visit('/', { failOnStatusCode: false });
      cy.url().should('not.contain', 'auth.qa.juno.cqdg.ferlab.bio');
    },
    cacheAcrossSpecs: true
  });
});

Cypress.Commands.add('resetColumns', () => {
  cy.get(CommonSelectors.settingsIcon).clickAndWait({force: true});
  cy.get(CommonSelectors.settingsPopper).find(CommonSelectors.resetButton).click({force: true});
  cy.get(CommonSelectors.settingsIcon).clickAndWait({force: true});
  cy.get(CommonSelectors.settingsPopper).should('not.exist');
});

/**
 * Asserts that the given element is sortable or not.
 * @param subject The element to check.
 * @param isSortable Whether the column should be sortable.
 */
Cypress.Commands.add('shouldBeSortable', { prevSubject: 'element' }, (subject, isSortable: boolean) => {
  const strExpectedSortable = isSortable ? 'exist' : 'not.exist';
  cy.wrap(subject).find(CommonSelectors.sortIcon).should(strExpectedSortable);
});

/**
 * Asserts that the given element has a tooltip with the specified content.
 * @param subject The element to check.
 * @param tooltipContent The expected tooltip content.
 */
Cypress.Commands.add('shouldHaveTooltip', { prevSubject: 'element' }, (subject, tooltipContent: string) => {
  cy.wrap(subject).find('[class*="decoration-dotted"]').trigger('mouseover', { eventConstructor: 'MouseEvent', force: true });
  cy.get(CommonSelectors.tooltipPopper).contains(tooltipContent).should('exist');
});

Cypress.Commands.add('showColumn', (column: string) => {
  cy.get(CommonSelectors.settingsIcon).clickAndWait({force: true});
  cy.get(CommonSelectors.settingsPopper).find(CommonSelectors.settingsCheckbox(column)).click({force: true});
  cy.get(CommonSelectors.settingsIcon).clickAndWait({force: true});
  cy.get(CommonSelectors.settingsPopper).should('not.exist');
});

Cypress.Commands.add('sortTableAndIntercept', (position: number, nbCalls: number) => {
  cy.intercept('POST', '**/list').as('postList');

  cy.get(`${CommonSelectors.tableHead} ${CommonSelectors.tableCellHead}`).eq(position).find(CommonSelectors.sortIcon).clickAndWait({force: true});

  for (let i = 0; i < nbCalls; i++) {
    cy.wait('@postList', {timeout: oneMinute});
  };
});

Cypress.Commands.add('sortTableAndWait', (position: number) => {
  cy.get(`${CommonSelectors.tableHead} ${CommonSelectors.tableCellHead}`).eq(position).find(CommonSelectors.sortIcon).click({force: true});
  cy.wait(1000);
});

Cypress.Commands.add('validatePillSelectedQuery', (facetTitle: string | RegExp, values: (string | RegExp)[], eq: number = 0) => {
  if (facetTitle == '') {
    cy.get('[data-query-active="true"] [class*="group-data-[query-active=true]"]').should('not.exist');
  }
  else {
    cy.get('[data-query-active="true"] [class*="group-data-[query-active=true]"]').eq(eq).contains(facetTitle).should('exist');
  }

  for (let i = 0; i < values.length; i++) {
    cy.get('[data-query-active="true"] [class*="group-data-[query-active=true]"]').eq(eq).contains(values[i]).should('exist');
    }
});

Cypress.Commands.add('validateTableFirstRowAttr', (expectedAttr: string, expectedValue: string, columnIndex: number) => {
  cy.wait(2000);
  cy.get(CommonSelectors.tableRow).eq(0).find(CommonSelectors.tableCellData).eq(columnIndex).find('['+expectedAttr+'="'+expectedValue+'"]').should('exist');
});

Cypress.Commands.add('validateTableFirstRowClass', (expectedClass: string, columnIndex: number) => {
  cy.wait(2000);
  cy.get(CommonSelectors.tableRow).eq(0).find(CommonSelectors.tableCellData).eq(columnIndex).find('[class*="'+expectedClass+'"]').should('exist');
});

Cypress.Commands.add('validateTableFirstRowContent', (expectedValue: string|RegExp, columnIndex: number) => {
  cy.wait(2000);
  cy.get(CommonSelectors.tableRow).eq(0).find(CommonSelectors.tableCellData).eq(columnIndex).contains(expectedValue).should('exist');
});

Cypress.Commands.add('visitAndIntercept', (url: string, methodHTTP: string, routeMatcher: string, nbCalls: number) => {
  cy.intercept(methodHTTP, routeMatcher).as('routeMatcher');

  cy.visit(url, { failOnStatusCode: false });

  for (let i = 0; i < nbCalls; i++) {
    cy.wait('@routeMatcher', {timeout: oneMinute});
  };

  cy.waitWhileSpin(oneMinute);
});

Cypress.Commands.add('visitCaseVariantsPage', (caseId: string, sqon?: string) => {
  if (sqon == undefined) {
    cy.visitAndIntercept(`/case/entity/${caseId}?tab=variants`, 'POST', '**/list', 1);
  } else {
    cy.intercept('POST', '**/list', (interception) => {
      const mockBody = { ...interception.body };
      mockBody.sqon = JSON.parse(sqon);
      interception.alias = 'postList';
      interception.body = mockBody;
    });
    cy.visit(`/case/entity/${caseId}?tab=variants`, { failOnStatusCode: false });
    cy.wait('@postList');
  };

  cy.get('button[class*="text-muted-foreground px-3 text-base md:text-sm"]').contains(/^(FR|EN)$/).invoke('text').then((invokeText) => {
    if (invokeText.includes("EN")) {
      cy.get('button[class*="text-muted-foreground px-3 text-base md:text-sm"]').contains(/^EN$/).clickAndWait({force: true});
    };
  });
  cy.resetColumns();
});

Cypress.Commands.add('waitWhileSpin', (ms: number) => {
  const start = new Date().getTime();

  function checkForSpinners(): any {
    const now = new Date().getTime();
    if (now - start > ms) {
      throw new Error(`Timed out after ${ms}ms waiting for spinners to disappear`);
    }

    return cy.get('body').then($body => {
      if ($body.find('.ant-spin-blur').length > 0) {
        return cy.wait(1000).then(checkForSpinners);
      }
    });
  }

  return checkForSpinners();
});

Cypress.Commands.overwrite('log', (subject, message) => cy.task('log', message));
