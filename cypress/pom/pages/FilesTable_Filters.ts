/// <reference types="cypress"/>
import { CommonSelectors } from '../shared/Selectors';
import { getTableResultsCount, shouldHaveTableResultsCount } from '../shared/Utils';

export const filters = [
  {
    key: 'project_code',
    label: 'Project',
    field: 'project_code',
    isVisibleByDefault: true,
  },
  {
    key: 'diagnosis_lab_code',
    label: 'Diagnostic Lab',
    field: 'diagnosis_lab_code',
    isVisibleByDefault: true,
  },
  {
    key: 'relationship_to_proband_code',
    label: 'Relationship',
    field: 'relationship_to_proband_code',
    isVisibleByDefault: true,
  },
  {
    key: 'format_code',
    label: 'Format',
    field: 'format_code',
    isVisibleByDefault: true,
  },
  {
    key: 'data_type_code',
    label: 'Type',
    field: 'data_type_code',
    isVisibleByDefault: true,
  },
];

export const FilesTable_Filters = {
  actions: {
    /**
     * Clicks the global Clear button that resets every active filter.
     */
    clickClearAll() {
      cy.get(CommonSelectors.tableFiltersClear).clickAndWait({ force: true });
    },
    /**
     * Clicks the internal Clear button (bottom of the popover) of an open filter.
     * @param filterKey The filter key (e.g. 'project_code').
     */
    clickFilterClear(filterKey: string) {
      cy.get(CommonSelectors.filterClear(filterKey)).clickAndWait({ force: true });
    },
    /**
     * Opens a filter popover by clicking its trigger button.
     * @param filterKey The filter key (e.g. 'project_code').
     */
    openFilter(filterKey: string) {
      cy.get(CommonSelectors.filterButton(filterKey)).clickAndWait({ force: true });
    },
    /**
     * Selects its first option.
     * @param filterKey The filter key (e.g. 'project_code').
     */
    selectFirstOption(filterKey: string) {
      cy.get(CommonSelectors.filterOption(filterKey)).first().clickAndWait({ force: true });
    },
  },

  validations: {
    /**
     * Validates that selecting a filter option changes the displayed results count.
     * @param filterKey The filter key to apply (e.g. 'format_code').
     */
    shouldChangeResultsOnApply(filterKey: string) {
      const resultCount = getTableResultsCount();
      FilesTable_Filters.actions.openFilter(filterKey);
      FilesTable_Filters.actions.selectFirstOption(filterKey);
      shouldHaveTableResultsCount(resultCount, false /*beEqual*/);
    },
    /**
     * Validates that the global Clear button removes an active filter and restores the initial count.
     * @param filterKey The filter key to apply then clear (e.g. 'format_code').
     */
    shouldClearAllFilters(filterKey: string) {
      const resultCount = getTableResultsCount();
      FilesTable_Filters.actions.openFilter(filterKey);
      FilesTable_Filters.actions.selectFirstOption(filterKey);
      FilesTable_Filters.actions.clickClearAll();
      cy.get(CommonSelectors.filterBadge(filterKey)).should('not.exist');
      shouldHaveTableResultsCount(resultCount, true /*beEqual*/);
    },
    /**
     * Validates that the internal Clear button of a filter deselects its options.
     * @param filterKey The filter key to apply then clear (e.g. 'format_code').
     */
    shouldClearFilter(filterKey: string) {
      FilesTable_Filters.actions.openFilter(filterKey);
      FilesTable_Filters.actions.selectFirstOption(filterKey);
      FilesTable_Filters.actions.clickFilterClear(filterKey);
      cy.get(CommonSelectors.filterBadge(filterKey)).should('not.exist');
    },
    /**
     * Validates that the buckets returned by GET documents/filters are rendered as options of a filter.
     * @param alias The alias of the intercepted GET documents/filters request (set before visiting the page).
     * @param filterKey The filter key whose options to check (e.g. 'format_code').
     */
    shouldRenderApiOptions(alias: string, filterKey: string) {
      cy.wait(alias).then(({ response }) => {
        const buckets = response?.body?.[filterKey] || [];
        expect(buckets.length, `filter "${filterKey}" should return buckets`).to.be.greaterThan(0);
        FilesTable_Filters.actions.openFilter(filterKey);
        buckets.forEach((bucket: { key: string }) => {
          cy.get(CommonSelectors.filterOption(filterKey, bucket.key)).should('exist');
        });
      });
    },
    /**
     * Validates that a filter with `showKey` renders its options as "key - label".
     * @param filterKey The key-label filter to check (e.g. 'diagnosis_lab_code').
     */
    shouldRenderKeyLabelOptions(filterKey: string) {
      FilesTable_Filters.actions.openFilter(filterKey);
      cy.get(CommonSelectors.filterOption(filterKey))
        .first()
        .then($el => {
          const key = ($el.attr('data-cy') || '').replace(`filter-option-${filterKey}-`, '');
          cy.wrap($el).closest(CommonSelectors.commandItem).should('contain.text', key);
        });
    },
    /**
     * Validates that applying two filters carries both as search criteria in the POST documents/search payload.
     * @param filterKeyA The first filter key to apply (e.g. 'project_code').
     * @param filterKeyB The second filter key to apply (e.g. 'format_code').
     */
    shouldRequestMultipleFilters(filterKeyA: string, filterKeyB: string) {
      const fieldA = filters.find(f => f.key === filterKeyA)?.field;
      const fieldB = filters.find(f => f.key === filterKeyB)?.field;
      FilesTable_Filters.actions.openFilter(filterKeyA);
      FilesTable_Filters.actions.selectFirstOption(filterKeyA);
      cy.intercept('POST', '**/documents/search', req => {
        const fields = (req.body.search_criteria || []).map((c: { field: string }) => c.field);
        expect(fields, 'search_criteria fields').to.include.members([fieldA, fieldB]);
      }).as('multipleFiltersSearch');
      FilesTable_Filters.actions.openFilter(filterKeyB);
      FilesTable_Filters.actions.selectFirstOption(filterKeyB);
      cy.wait('@multipleFiltersSearch');
    },
    /**
     * Validates that the POST documents/search payload carries the applied filter as a search criterion.
     * @param filterKey The filter key to apply (e.g. 'project_code').
     */
    shouldRequestOnFilterSelect(filterKey: string) {
      const filter = filters.find(f => f.key === filterKey);
      FilesTable_Filters.actions.openFilter(filterKey);
      cy.intercept('POST', '**/documents/search', req => {
        const criterion = req.body.search_criteria?.find((c: { field: string }) => c.field === filter?.field);
        expect(criterion, `search_criteria for "${filter?.field}"`).to.exist;
        expect(criterion.value).to.have.length.greaterThan(0);
      }).as('filterSearchRequest');
      FilesTable_Filters.actions.selectFirstOption(filterKey);
      cy.wait('@filterSearchRequest');
    },
    /**
     * Validates that the filters visible by default are rendered as leading buttons, in weight order.
     */
    shouldShowDefaultFilters() {
      const expected = filters.filter(f => f.isVisibleByDefault).map(f => `filter-button-${f.key}`);
      cy.get(CommonSelectors.tableFilters)
        .find('[data-cy^="filter-button-"]')
        .then($els => {
          const actual = [...$els].map(el => el.getAttribute('data-cy')).filter(dataCy => dataCy !== 'filter-button-more'); // drop the "More" trigger
          expect(actual.slice(0, expected.length)).to.deep.equal(expected);
        });
    },
  },
};
