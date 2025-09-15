/// <reference types="cypress"/>

/* eslint-disable @typescript-eslint/no-unused-vars */
declare namespace Cypress {
  interface Chainable {
    clickAndWait(options?: Partial<ClickOptions>): Chainable<Element>;
    hideColumn(column: string): cy & CyEventEmitter;
    login(): cy & CyEventEmitter;
    resetColumns(): cy & CyEventEmitter;
    setLang(lang: string): cy & CyEventEmitter;
    shouldBeActiveTab(): cy & CyEventEmitter;
    shouldBeSortable(isSortable: boolean): Chainable<Element>;
    shouldHaveTooltip(tooltipContent: string | RegExp | null): cy & CyEventEmitter;
    showColumn(column: string): cy & CyEventEmitter;
    sortTableAndIntercept(position: number, nbCalls: number): cy & CyEventEmitter;
    sortTableAndWait(position: number): cy & CyEventEmitter;
    validatePillSelectedQuery(facetTitle: string | RegExp, values: (string | RegExp)[], eq?: number): cy & CyEventEmitter;
    validateTableFirstRowAttr(expectedAttr: string, expectedValue: string, columnIndex: number): cy & CyEventEmitter;
    validateTableFirstRowClass(expectedClass: string, columnIndex: number): cy & CyEventEmitter;
    validateTableFirstRowContent(expectedValue: string | RegExp, columnIndex: number): cy & CyEventEmitter;
    visitAndIntercept(url: string, methodHTTP: string, routeMatcher: string, nbCalls: number): cy & CyEventEmitter;
    visitCasesPage(sqon?: string): cy & CyEventEmitter;
    visitCaseVariantsPage(caseID: string, sqon?: string): cy & CyEventEmitter;
    waitWhileLoad(ms: number): cy & CyEventEmitter;
  }
}
