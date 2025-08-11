/// <reference types="cypress"/>
import createUUID from './createUUID';
import { CommonSelectors } from '../pom/shared/Selectors';
import { oneMinute, stringToRegExp } from '../pom/shared/Utils';

Cypress.Commands.add('clickAndWait', { prevSubject: 'element' }, (subject, options) => {
  cy.wrap(subject).click(options);
  cy.waitWhileSpin(oneMinute);
});

/**
 * Returns the table header cell matching the given column name.
 * @param columnName The exact name of the column.
 */
Cypress.Commands.add('getColumnHeadCell', (columnName: string) => {
  cy.get(CommonSelectors.tableHead).find(CommonSelectors.tableCell).then(($tableCells) => {
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
Cypress.Commands.add('hideColumn', (column: string|RegExp) => {
  cy.get('[data-icon="setting"]').clickAndWait({force: true});

  cy.intercept('PUT', '**/user').as('getPOSTuser');
  cy.get('[class*="ColumnSelector_ProTablePopoverColumnListWrapper"]').contains(column).find(CommonSelectors.checkbox).uncheck();
  cy.wait('@getPOSTuser', {timeout: oneMinute});

  cy.get(CommonSelectors.logo).clickAndWait({force: true});
});

Cypress.Commands.add('login', () => {
  cy.session(['user'], () => {
    cy.request({
      url: `https://auth.qa.juno.cqdg.ferlab.bio/realms/CQDG/protocol/openid-connect/auth`,
      qs: {
        client_id: 'radiant',
        client_secret: Cypress.env('keycloak_client_secret'),
        redirect_uri: Cypress.config('baseUrl')+'auth/callback',
        scope: 'openid',
        state: createUUID(),
        nonce: createUUID(),
        response_type: 'code',
        response_mode: 'fragment',
      },
    }).then((/*response*/) => {
      //const html: HTMLElement = document.createElement('html');
      //html.innerHTML = response.body;

      //const script = html.getElementsByTagName('script')[0] as HTMLScriptElement;

      //eval(script.textContent ?? '');

      //const loginUrl: string = (window as any).kcContext.url.loginAction;

      return cy.request({
        form: true,
        method: 'POST',
        url: 'https://auth.qa.juno.cqdg.ferlab.bio/realms/CQDG/protocol/openid-connect/token',
        followRedirect: false,
        body: {
          grant_type: 'password',
          client_id: 'radiant',
          client_secret: Cypress.env('keycloak_client_secret'),
          username: Cypress.env('user_username'),
          password: Cypress.env('user_password'),
        },
      });
    });
 });
 cy.visit('/case');
 cy.get('[id="case-exploration"]').should('exist');
});

Cypress.Commands.add('logout', () => {
  cy.visit('/case');
  cy.wait(5000);

  cy.get('div').then(($div) => {
      if ($div.hasClass('appContainer')) {
          cy.get('[data-cy="UserName"]').click({force: true});
          cy.get('[data-menu-id*="logout"]').clickAndWait({force: true});
      };
  });
});

Cypress.Commands.add('resetColumns', (table_id?: string) => {
  let cySettings: Cypress.Chainable;

  if (table_id == undefined) {
    cySettings = cy.get('svg[data-icon="setting"]');
  }
  else {
    cySettings = cy.get(`[id="${table_id}"]`).find('svg[data-icon="setting"]');
  }

  cySettings.clickAndWait({force: true});
  cy.get('button[class*="ProTablePopoverColumnResetBtn"]').clickAndWait({force: true});
  cy.get('button[class*="ProTablePopoverColumnResetBtn"]').should('be.disabled');
  cySettings.clickAndWait({force: true});
  cy.get(CommonSelectors.logo).clickAndWait({force: true});
});

/**
 * Asserts that the given element is sortable or not.
 * @param subject The element to check.
 * @param isSortable Whether the column should be sortable.
 */
Cypress.Commands.add('shouldBeSortable', { prevSubject: 'element' }, (subject, isSortable: boolean) => {
  const strExpectedSortable = isSortable ? 'exist' : 'not.exist';
  cy.wrap(subject).find(CommonSelectors.sortAscIcon).should(strExpectedSortable);
});

/**
 * Checks a checkbox, asserts it is checked, then unchecks it.
 * @param subject The element containing the checkbox (should be chainable).
 */
Cypress.Commands.add('shouldCheckAndUncheck', { prevSubject: 'element' }, (subject) => {
  cy.wrap(subject).find(CommonSelectors.checkbox).check({ force: true });
  cy.wrap(subject).find(CommonSelectors.checkbox).should('be.checked');
  cy.wrap(subject).find(CommonSelectors.checkbox).uncheck({ force: true });
});

/**
 * Asserts that the given element has a tooltip with the specified content.
 * @param subject The element to check.
 * @param tooltipContent The expected tooltip content.
 */
Cypress.Commands.add('shouldHaveTooltip', { prevSubject: 'element' }, (subject, tooltipContent: string) => {
  cy.wrap(subject).find('[class*="dotted"]').trigger('mouseover', { eventConstructor: 'MouseEvent', force: true });
  cy.get('body').contains(tooltipContent).should('exist');
});

Cypress.Commands.add('showColumn', (column: string|RegExp) => {
  cy.intercept('PUT', '**/user').as('getPOSTuser');

  cy.get('div[class="ant-popover-inner"]')
    .find('div[class="ant-space-item"]').contains(column)
    .find(CommonSelectors.checkbox).check({force: true});
  cy.wait('@getPOSTuser', {timeout: oneMinute});
  cy.get(CommonSelectors.logo).clickAndWait({force: true});
});

Cypress.Commands.add('sortTableAndIntercept', (column: string|RegExp, nbCalls: number) => {
  cy.intercept('POST', '**/graphql').as('getPOSTgraphql');

  if (String(column).startsWith('[')) {
    cy.get(CommonSelectors.tableHead).find(String(column)).clickAndWait({force: true});
  } else {
    cy.get(CommonSelectors.tableHead).contains(column).clickAndWait({force: true});
  };

  for (let i = 0; i < nbCalls; i++) {
    cy.wait('@getPOSTgraphql', {timeout: oneMinute});
  };
});

Cypress.Commands.add('sortTableAndWait', (column: string|RegExp) => {
  cy.get(CommonSelectors.tableHead).contains(column).click({force: true});
  cy.wait(1000);
});

Cypress.Commands.add('validatePillSelectedQuery', (facetTitle: string|RegExp, values: (string|RegExp)[], eq: number = 0) => {
  if (facetTitle == '') {
    cy.get('[class*="QueryBar_selected"] [class*="QueryPill_field"]').should('not.exist');
  }
  else {
    cy.get('[class*="QueryBar_selected"] [class*="QueryPill_field"]').eq(eq).contains(facetTitle).should('exist');
  }

  for (let i = 0; i < values.length; i++) {
    cy.get('[class*="QueryBar_selected"] [class*="QueryValues_queryValuesContainer"]').eq(eq).contains(values[i]).should('exist');
    }
});

Cypress.Commands.add('validatePaging', (tableID: string) => {
  cy.get('span[class*="ant-select-selection-item"]').clickAndWait({force: true});
  cy.get('div[class*="ant-select-item-option-content"]').contains('20').clickAndWait({force: true});
  cy.get(CommonSelectors.tablePagingCombobox(tableID)).contains(/^1$/).should('exist');
  cy.get(CommonSelectors.tablePagingCombobox(tableID)).contains(/^20$/).should('exist');
  cy.get('button[type="button"]').contains('Previous').parent('button').should('be.disabled');
  cy.get('button[type="button"]').contains('First').parent('button').should('be.disabled');

  cy.intercept('POST', '**/graphql').as('getPOSTgraphql1');
  cy.get('button[type="button"]').contains('Next').clickAndWait({force: true});
  cy.wait('@getPOSTgraphql1');
  cy.get(CommonSelectors.tablePagingCombobox(tableID)).contains(/^21$/).should('exist');
  cy.get(CommonSelectors.tablePagingCombobox(tableID)).contains(/^40$/).should('exist');
  cy.get('button[type="button"]').contains('Previous').parent('button').should('not.be.disabled');
  cy.get('button[type="button"]').contains('First').parent('button').should('not.be.disabled');

  cy.intercept('POST', '**/graphql').as('getPOSTgraphql2');
  cy.get('button[type="button"]').contains('Next').clickAndWait({force: true});
  cy.wait('@getPOSTgraphql2');
  cy.get(CommonSelectors.tablePagingCombobox(tableID)).contains(/^41$/).should('exist');
  cy.get(CommonSelectors.tablePagingCombobox(tableID)).contains(/^60$/).should('exist');
  cy.get('button[type="button"]').contains('Previous').parent('button').should('not.be.disabled');
  cy.get('button[type="button"]').contains('First').parent('button').should('not.be.disabled');

  cy.intercept('POST', '**/graphql').as('getPOSTgraphql3');
  cy.get('button[type="button"]').contains('Previous').clickAndWait({force: true});
  cy.wait('@getPOSTgraphql3');
  cy.get(CommonSelectors.tablePagingCombobox(tableID)).contains(/^21$/).should('exist');
  cy.get(CommonSelectors.tablePagingCombobox(tableID)).contains(/^40$/).should('exist');
  cy.get('button[type="button"]').contains('Previous').parent('button').should('not.be.disabled');
  cy.get('button[type="button"]').contains('First').parent('button').should('not.be.disabled');

  cy.get('button[type="button"]').contains('First').clickAndWait({force: true});
  cy.get(CommonSelectors.tablePagingCombobox(tableID)).contains(/^1$/).should('exist');
  cy.get(CommonSelectors.tablePagingCombobox(tableID)).contains(/^20$/).should('exist');
  cy.get('button[type="button"]').contains('Previous').parent('button').should('be.disabled');
  cy.get('button[type="button"]').contains('First').parent('button').should('be.disabled');
});

Cypress.Commands.add('validateTableFirstRowAttr', (expectedAttr: string, expectedValue: string, columnIndex: number) => {
  cy.get(CommonSelectors.tableRow).eq(0).find('td').eq(columnIndex).find('['+expectedAttr+'="'+expectedValue+'"]').should('exist');
});

Cypress.Commands.add('validateTableFirstRowClass', (expectedClass: string, columnIndex: number) => {
  cy.get(CommonSelectors.tableRow).eq(0).find('td').eq(columnIndex).find('[class*="'+expectedClass+'"]').should('exist');
});

Cypress.Commands.add('validateTableFirstRowContent', (expectedValue: string|RegExp, columnIndex: number, hasCheckbox: boolean = false) => {
  cy.get(CommonSelectors.tableRow).eq(0).find('td').eq(columnIndex).contains(expectedValue).should('exist');
  if (hasCheckbox) {
    cy.get(CommonSelectors.tableRow).eq(0).shouldCheckAndUncheck();
  };
});

Cypress.Commands.add('validateTableResultsCount', (expectedCount: string|RegExp, tableID: string, shouldExist: boolean = true) => {
  const strExist = shouldExist ? 'exist' : 'not.exist';
  cy.get(CommonSelectors.tableResultsCount(tableID)).contains(expectedCount).should(strExist);
});

Cypress.Commands.add('validateTotalSelectedQuery', (expectedCount: string|RegExp) => {
  cy.get('[class*="QueryBar_selected"] [class*="QueryBar_total"]').contains(expectedCount).should('exist');
});

Cypress.Commands.add('visitAndIntercept', (url: string, methodHTTP: string, routeMatcher: string, nbCalls: number) => {
  cy.intercept(methodHTTP, routeMatcher).as('getRouteMatcher');

  cy.visit(url);

  for (let i = 0; i < nbCalls; i++) {
    cy.wait('@getRouteMatcher', {timeout: oneMinute});
  };

  cy.waitWhileSpin(oneMinute);
});

Cypress.Commands.add('visitCaseVariantsPage', (caseID: string) => {
  cy.visitAndIntercept(`/case/entity/${caseID}?tab=variants`,
                       'POST',
                       '**/api/occurrences/germline/snv/1/list',
                       1);
//  cy.resetColumns();
});

Cypress.Commands.add('waitWhileSpin', (ms: number) => {
  const start = new Date().getTime();

  function checkForSpinners():any {
    const now = new Date().getTime();
    if (now - start > ms) {
      throw new Error(`Timed out after ${ms}ms waiting for spinners to disappear`);
    };

    return cy.get('body').then(($body) => {
      if ($body.find('.ant-spin-blur').length > 0) {
        return cy.wait(1000).then(checkForSpinners);
      };
    });
  };

  return checkForSpinners();
});

Cypress.Commands.overwrite('log', (subject, message) => cy.task('log', message));