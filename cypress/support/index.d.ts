/// <reference types="cypress"/>

/* eslint-disable @typescript-eslint/no-unused-vars */
declare namespace Cypress {
  interface Chainable {
    clickAndWait(options?: Partial<ClickOptions>): Chainable<Element>;
    getColumnHeadCell(columnName: string): cy & CyEventEmitter;
    hideColumn(column: string): cy & CyEventEmitter;
    login(): cy & CyEventEmitter;
    resetColumns(): cy & CyEventEmitter;
    shouldBeSortable(isSortable: boolean): Chainable<Element>;
    shouldCheckAndUncheck(): Chainable<Element>;
    shouldHaveTooltip(tooltipContent: string): cy & CyEventEmitter;
    showColumn(column: string): cy & CyEventEmitter;
    sortTableAndIntercept(position: number, nbCalls: number): cy & CyEventEmitter;
    sortTableAndWait(position: number): cy & CyEventEmitter;
    validatePillSelectedQuery(facetTitle: string|RegExp, values: (string|RegExp)[], eq?: number): cy & CyEventEmitter;
    validateTableFirstRowAttr(expectedAttr: string, expectedValue: string, columnIndex: number): cy & CyEventEmitter;
    validateTableFirstRowClass(expectedClass: string, columnIndex: number): cy & CyEventEmitter;
    validateTableFirstRowContent(expectedValue: string|RegExp, columnIndex: number): cy & CyEventEmitter;
    visitAndIntercept(url: string, methodHTTP: string, routeMatcher: string, nbCalls: number): cy & CyEventEmitter;
    visitCaseVariantsPage(caseID: string, sqon?: string): cy & CyEventEmitter;
    waitWhileSpin(ms: number): cy & CyEventEmitter;
  }
}
