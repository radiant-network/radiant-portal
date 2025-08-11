/// <reference types="cypress"/>

/* eslint-disable @typescript-eslint/no-unused-vars */
declare namespace Cypress {
  interface Chainable {
    clickAndWait(options?: Partial<ClickOptions>): Chainable<Element>;
    getColumnHeadCell(columnName: string): cy & CyEventEmitter;
    hideColumn(column: string|RegExp): cy & CyEventEmitter;
    login(): cy & CyEventEmitter;
    loginByRoo(): cy & CyEventEmitter;
    logout(): cy & CyEventEmitter;
    resetColumns(table_id?: string): cy & CyEventEmitter;
    shouldBeSortable(isSortable: boolean): Chainable<Element>;
    shouldCheckAndUncheck(): Chainable<Element>;
    shouldHaveTooltip(tooltipContent: string): cy & CyEventEmitter;
    showColumn(column: string|RegExp): cy & CyEventEmitter;
    sortTableAndIntercept(column: string|RegExp, nbCalls: number): cy & CyEventEmitter;
    sortTableAndWait(column: string|RegExp): cy & CyEventEmitter;
    validatePaging(tableID: string): cy & CyEventEmitter;
    validatePillSelectedQuery(facetTitle: string|RegExp, values: (string|RegExp)[], eq?: number): cy & CyEventEmitter;
    validateTableFirstRowAttr(expectedAttr: string, expectedValue: string, columnIndex: number): cy & CyEventEmitter;
    validateTableFirstRowClass(expectedClass: string, columnIndex: number): cy & CyEventEmitter;
    validateTableFirstRowContent(expectedValue: string|RegExp, columnIndex: number, hasCheckbox?: boolean): cy & CyEventEmitter;
    validateTableResultsCount(expectedCount: string|RegExp, tableID: string, shouldExist: boolean): cy & CyEventEmitter;
    validateTotalSelectedQuery(expectedCount: string|RegExp): cy & CyEventEmitter;
    visitAndIntercept(url: string, methodHTTP: string, routeMatcher: string, nbCalls: number): cy & CyEventEmitter;
    visitCaseVariantsPage(caseID: string): cy & CyEventEmitter;
    waitWhileSpin(ms: number): cy & CyEventEmitter;
  }
}
