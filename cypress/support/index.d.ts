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
    sortTableAndIntercept(position: number, routeMatcher: string, nbCalls: number, tableId: string = ''): cy & CyEventEmitter;
    sortTableAndWait(position: number, tableId: string = ''): cy & CyEventEmitter;
    validatePillSelectedQuery(facetTitle: string | RegExp, values: (string | RegExp)[], eq?: number): cy & CyEventEmitter;
    validateTableFirstRowAttr(expectedAttr: string, expectedValue: string, columnIndex: number, tableId: string = ''): cy & CyEventEmitter;
    validateTableFirstRowClass(expectedClass: string, columnIndex: number, tableId: string = ''): cy & CyEventEmitter;
    validateTableFirstRowContent(expectedValue: string | RegExp, columnIndex: number, tableId: string = ''): cy & CyEventEmitter;
    visitAndIntercept(url: string, methodHTTP: string, routeMatcher: string, nbCalls: number): cy & CyEventEmitter;
    visitCasesPage(search_criteria?: string): cy & CyEventEmitter;
    visitFilesPage(search_criteria?: string): cy & CyEventEmitter;
    visitCaseDetailsPage(caseID: string): cy & CyEventEmitter;
    visitCaseFilesPage(caseID: string, searchCriteria?: string): cy & CyEventEmitter;
    visitCaseVariantsPage(caseID: string, sqon?: string): cy & CyEventEmitter;
    visitVariantEvidCondPage(locusID: string): cy & CyEventEmitter;
    visitVariantPatientsPage(locusID: string): cy & CyEventEmitter;
    waitWhileLoad(ms: number): cy & CyEventEmitter;
  }
}
