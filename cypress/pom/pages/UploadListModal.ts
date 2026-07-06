/// <reference types="cypress"/>
import { CommonSelectors } from 'pom/shared/Selectors';
import { buildBilingualRegExp } from 'pom/shared/Utils';

export const UploadListModal = {
  actions: {
    /**
     * Clicks the cancel button (closes the modal without applying).
     */
    clickCancelButton() {
      cy.get(CommonSelectors.uploadListCancel).clickAndWait({ force: true });
    },
    /**
     * Clicks the clear button (resets the textarea and summary).
     */
    clickClearButton() {
      cy.get(CommonSelectors.uploadListClear).clickAndWait({ force: true });
    },
    /**
     * Clicks the upload button, applying the matched genes as a filter.
     */
    clickUploadButton() {
      cy.intercept('POST', '**/list').as('postListUpload');
      cy.get(CommonSelectors.uploadListSubmit).clickAndWait({ force: true });
      cy.wait('@postListUpload');
    },
    /**
     * Selects a tab in the summary section.
     * @param index The tab index (0 = Matched, 1 = Unmatched).
     */
    selectTab(index: number) {
      cy.get(`${CommonSelectors.modal} ${CommonSelectors.tab}`).eq(index).clickAndWait({ force: true });
    },
    /**
     * Expands (or collapses) the summary section by clicking its title.
     */
    toggleSummary() {
      cy.get(`${CommonSelectors.modal} ${CommonSelectors.cardTitle}`).clickAndWait({ force: true });
    },
    /**
     * Types identifiers in the textarea and waits for the gene search to resolve.
     * @param text The identifiers to type (separators: comma, space, new line).
     */
    typeIdentifiers(text: string) {
      cy.intercept('POST', '**/genes/search').as('postGeneSearch');
      cy.get(`${CommonSelectors.modal} ${CommonSelectors.uploadTextarea}`).type(text, { force: true });
      cy.wait('@postGeneSearch');
    },
  },

  validations: {
    /**
     * Validates that the modal has been cleared (empty textarea, no clear button).
     */
    shouldBeCleared() {
      cy.get(`${CommonSelectors.modal} ${CommonSelectors.uploadTextarea}`).should('have.value', '');
      cy.get(CommonSelectors.uploadListClear).should('not.exist');
    },
    /**
     * Checks that the modal is displayed.
     * @param shouldBeOpen Whether the modal should be open (default: true).
     */
    shouldModalOpen(shouldBeOpen: boolean = true) {
      cy.get(CommonSelectors.modal).should(shouldBeOpen ? 'be.visible' : 'not.exist');
    },
    /**
     * Validates the info popover content (identifiers, separators, file formats).
     * The modal must be open.
     */
    shouldShowPopover() {
      cy.get(CommonSelectors.uploadListInfo).realHover();
      cy.get(CommonSelectors.uploadListPopover).should('be.visible');
      cy.get(CommonSelectors.uploadListPopover).contains(buildBilingualRegExp('uploadPopoverTitle')).should('exist');
      cy.get(CommonSelectors.uploadListPopover).contains(buildBilingualRegExp('uploadPopoverIdentifiersValues')).should('exist');
      cy.get(CommonSelectors.uploadListPopover).contains(buildBilingualRegExp('uploadPopoverSeparatorsValues')).should('exist');
      cy.get(CommonSelectors.uploadListPopover).contains(buildBilingualRegExp('uploadPopoverFileFormatsValues')).should('exist');
    },
    /**
     * Validates whether the summary section (matched table) is visible.
     * @param shouldBeVisible Whether the summary should be visible (default: true).
     */
    shouldSummaryBeVisible(shouldBeVisible: boolean = true) {
      cy.get(CommonSelectors.matchedTable).should(shouldBeVisible ? 'be.visible' : 'not.exist');
    },
    /**
     * Validates that the matched/unmatched summary table contains the expected value.
     * @param tableType Which summary table to check ('matched' or 'unmatched').
     * @param value The value expected in the table (e.g., a gene symbol).
     */
    shouldTableContain(tableType: 'matched' | 'unmatched', value: string) {
      const table = tableType === 'matched' ? CommonSelectors.matchedTable : CommonSelectors.unmatchedTable;
      cy.get(table).contains(value).should('exist');
    },
  },
};
