/// <reference types="cypress"/>
import { CommonSelectors } from '../shared/Selectors';
import { getTableResultsCount, shouldHaveTableResultsCount } from '../shared/Utils';

export const filters = [
  {
    key: 'priority_code',
    label: 'Priority',
    field: 'priority_code',
    isVisibleByDefault: true,
  },
  {
    key: 'status_code',
    label: 'Status',
    field: 'status_code',
    isVisibleByDefault: true,
  },
  {
    key: 'case_type_code',
    label: 'Type',
    field: 'case_type_code',
    isVisibleByDefault: true,
  },
  {
    key: 'project_code',
    label: 'Project',
    field: 'project_code',
    isVisibleByDefault: false,
  },
  {
    key: 'analysis_catalog_code',
    label: 'Analysis',
    field: 'analysis_catalog_code',
    isVisibleByDefault: false,
  },
  {
    key: 'diagnosis_lab_code',
    label: 'Diagnostic lab',
    field: 'diagnosis_lab_code',
    isVisibleByDefault: false,
  },
  {
    key: 'ordering_organization_code',
    label: 'Prescribing Institution',
    field: 'ordering_organization_code',
    isVisibleByDefault: false,
  },
  {
    key: 'panel_code',
    label: 'Panel',
    field: 'panel_code',
    isVisibleByDefault: false,
  },
  {
    key: 'resolution_status_code',
    label: 'Resolution',
    field: 'resolution_status_code',
    isVisibleByDefault: false,
  },
  {
    key: 'life_status_code',
    label: 'Vital Status',
    field: 'proband_life_status_code',
    isVisibleByDefault: false,
  },
  {
    key: 'case_category_code',
    label: 'Pre/Postnatal',
    field: 'case_category_code',
    isVisibleByDefault: false,
  },
];

export const CasesTable_Filters = {
  actions: {
    /**
     * Clicks the global Clear button that resets every active filter.
     */
    clickClearAll() {
      cy.get(CommonSelectors.tableFiltersClear).clickAndWait({ force: true });
    },
    /**
     * Clicks the internal Clear button (bottom of the popover) of an open filter.
     * @param filterKey The filter key (e.g. 'priority_code').
     */
    clickFilterClear(filterKey: string) {
      cy.get(CommonSelectors.filterClear(filterKey)).clickAndWait({ force: true });
    },
    /**
     * Clicks the "More" button that reveals the filters hidden by default.
     */
    clickMoreButton() {
      cy.get(CommonSelectors.filterMoreButton).clickAndWait({ force: true });
    },
    /**
     * Opens a filter popover by clicking its trigger button.
     * @param filterKey The filter key (e.g. 'priority_code').
     */
    openFilter(filterKey: string) {
      cy.get(CommonSelectors.filterButton(filterKey)).clickAndWait({ force: true });
    },
    /**
     * Reveals a filter hidden by default through the "More" button.
     * @param filterKey The hidden filter key (e.g. 'project_code').
     */
    revealHiddenFilter(filterKey: string) {
      CasesTable_Filters.actions.clickMoreButton();
      cy.get(CommonSelectors.filterOption('more', filterKey)).clickAndWait({ force: true });
    },
    /**
     * Selects its first option.
     * @param filterKey The filter key (e.g. 'priority_code').
     */
    selectFirstOption(filterKey: string) {
      cy.get(CommonSelectors.filterOption(filterKey)).first().clickAndWait({ force: true });
    },
  },

  validations: {
    /**
     * Validates that selecting a filter option changes the displayed results count.
     * @param filterKey The filter key to apply (e.g. 'priority_code').
     */
    shouldChangeResultsOnApply(filterKey: string) {
      const resultCount = getTableResultsCount();
      CasesTable_Filters.actions.openFilter(filterKey);
      CasesTable_Filters.actions.selectFirstOption(filterKey);
      shouldHaveTableResultsCount(resultCount, false /*beEqual*/);
    },
    /**
     * Validates that the global Clear button removes an active filter and restores the initial count.
     * @param filterKey The filter key to apply then clear (e.g. 'priority_code').
     */
    shouldClearAllFilters(filterKey: string) {
      const resultCount = getTableResultsCount();
      CasesTable_Filters.actions.openFilter(filterKey);
      CasesTable_Filters.actions.selectFirstOption(filterKey);
      CasesTable_Filters.actions.clickClearAll();
      cy.get(CommonSelectors.filterBadge(filterKey)).should('not.exist');
      shouldHaveTableResultsCount(resultCount, true /*beEqual*/);
    },
    /**
     * Validates that the internal Clear button of a filter deselects its options.
     * @param filterKey The filter key to apply then clear (e.g. 'priority_code').
     */
    shouldClearFilter(filterKey: string) {
      CasesTable_Filters.actions.openFilter(filterKey);
      CasesTable_Filters.actions.selectFirstOption(filterKey);
      CasesTable_Filters.actions.clickFilterClear(filterKey);
      cy.get(CommonSelectors.filterBadge(filterKey)).should('not.exist');
    },
    /**
     * Validates that the "More" button is rendered (there are filters hidden by default).
     */
    shouldHaveMoreButton() {
      cy.get(CommonSelectors.filterMoreButton).should('exist');
    },
    /**
     * Validates that the buckets returned by GET cases/filters are rendered as options of a filter.
     * @param alias The alias of the intercepted GET cases/filters request (set before visiting the page).
     * @param filterKey The filter key whose options to check (e.g. 'priority_code').
     */
    shouldRenderApiOptions(alias: string, filterKey: string) {
      cy.wait(alias).then(({ response }) => {
        const buckets = response?.body?.[filterKey] || [];
        expect(buckets.length, `filter "${filterKey}" should return buckets`).to.be.greaterThan(0);
        CasesTable_Filters.actions.openFilter(filterKey);
        buckets.forEach((bucket: { key: string }) => {
          cy.get(CommonSelectors.filterOption(filterKey, bucket.key)).should('exist');
        });
      });
    },
    /**
     * Validates that a filter with `showKey` renders its options as "key - label".
     * @param filterKey The key-label filter to check (e.g. 'project_code').
     */
    shouldRenderKeyLabelOptions(filterKey: string) {
      CasesTable_Filters.actions.openFilter(filterKey);
      cy.get(CommonSelectors.filterOption(filterKey))
        .first()
        .then($el => {
          const key = ($el.attr('data-cy') || '').replace(`filter-option-${filterKey}-`, '');
          cy.wrap($el).closest(CommonSelectors.commandItem).should('contain.text', key);
        });
    },
    /**
     * Validates that applying two filters carries both as search criteria in the POST cases/search payload.
     * @param filterKeyA The first filter key to apply (e.g. 'priority_code').
     * @param filterKeyB The second filter key to apply (e.g. 'status_code').
     */
    shouldRequestMultipleFilters(filterKeyA: string, filterKeyB: string) {
      const fieldA = filters.find(f => f.key === filterKeyA)?.field;
      const fieldB = filters.find(f => f.key === filterKeyB)?.field;
      CasesTable_Filters.actions.openFilter(filterKeyA);
      CasesTable_Filters.actions.selectFirstOption(filterKeyA);
      cy.intercept('POST', '**/cases/search', req => {
        const fields = (req.body.search_criteria || []).map((c: { field: string }) => c.field);
        expect(fields, 'search_criteria fields').to.include.members([fieldA, fieldB]);
      }).as('multipleFiltersSearch');
      CasesTable_Filters.actions.openFilter(filterKeyB);
      CasesTable_Filters.actions.selectFirstOption(filterKeyB);
      cy.wait('@multipleFiltersSearch');
    },
    /**
     * Validates that the POST cases/search payload carries the applied filter as a search criterion.
     * @param filterKey The filter key to apply (e.g. 'priority_code').
     */
    shouldRequestOnFilterSelect(filterKey: string) {
      const filter = filters.find(f => f.key === filterKey);
      cy.intercept('POST', '**/cases/search', req => {
        const criterion = req.body.search_criteria?.find((c: { field: string }) => c.field === filter?.field);
        expect(criterion, `search_criteria for "${filter?.field}"`).to.exist;
        expect(criterion.value).to.have.length.greaterThan(0);
      }).as('filterSearchRequest');
      CasesTable_Filters.actions.openFilter(filterKey);
      CasesTable_Filters.actions.selectFirstOption(filterKey);
      cy.wait('@filterSearchRequest');
    },
    /**
     * Validates that a filter hidden by default is not rendered until revealed through "More".
     * @param filterKey The hidden filter key to reveal (e.g. 'project_code').
     */
    shouldRevealHiddenFilter(filterKey: string) {
      cy.get(CommonSelectors.filterButton(filterKey)).should('not.exist');
      CasesTable_Filters.actions.revealHiddenFilter(filterKey);
      cy.get(CommonSelectors.filterButton(filterKey)).should('exist');
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
