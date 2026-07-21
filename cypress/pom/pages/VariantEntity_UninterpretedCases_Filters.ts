/// <reference types="cypress"/>
import { CommonSelectors } from '../shared/Selectors';

export const filters = [
  {
    key: 'diagnosis_lab_code',
    label: 'Diagnostic Lab',
    field: 'diagnosis_lab_code',
    isVisibleByDefault: true,
  },
  {
    key: 'filter_is_pass',
    label: 'Filter',
    field: 'filter_is_pass',
    isVisibleByDefault: true,
  },
  {
    key: 'zygosity',
    label: 'Zygosity',
    field: 'zygosity',
    isVisibleByDefault: true,
  },
  {
    key: 'transmission_mode',
    label: 'Transmission',
    field: 'transmission_mode',
    isVisibleByDefault: true,
  },
  {
    key: 'analysis_catalog_code',
    label: 'Analysis',
    field: 'analysis_catalog_code',
    isVisibleByDefault: false,
  },
  {
    key: 'sex_code',
    label: 'Sex',
    field: 'sex_code',
    isVisibleByDefault: false,
  },
];

export const VariantEntity_UninterpretedCases_Filters = {
  actions: {
    /**
     * Clicks the global Clear button that resets every active filter.
     */
    clickClearAll() {
      cy.get(CommonSelectors.tableFiltersClear).clickAndWait({ force: true });
    },
    /**
     * Clicks the internal Clear button (bottom of the popover) of an open filter.
     * @param filterKey The filter key (e.g. 'diagnosis_lab_code').
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
     * @param filterKey The filter key (e.g. 'diagnosis_lab_code').
     */
    openFilter(filterKey: string) {
      cy.get(CommonSelectors.filterButton(filterKey)).clickAndWait({ force: true });
    },
    /**
     * Reveals a filter hidden by default through the "More" button.
     * @param filterKey The hidden filter key (e.g. 'analysis_catalog_code').
     */
    revealHiddenFilter(filterKey: string) {
      VariantEntity_UninterpretedCases_Filters.actions.clickMoreButton();
      cy.get(CommonSelectors.filterOption('more', filterKey)).clickAndWait({ force: true });
    },
    /**
     * Types a term in the HPO phenotype filter (debounced text input, not a popover).
     * @param term The phenotype term to search.
     */
    searchPhenotype(term: string) {
      cy.get(CommonSelectors.phenotypeCasesFilter).type(term, { force: true });
    },
    /**
     * Selects its first option.
     * @param filterKey The filter key (e.g. 'diagnosis_lab_code').
     */
    selectFirstOption(filterKey: string) {
      cy.get(CommonSelectors.filterOption(filterKey)).first().clickAndWait({ force: true });
    },
  },

  validations: {
    /**
     * Validates that the "More" button is rendered (there are filters hidden by default).
     */
    shouldHaveMoreButton() {
      cy.get(CommonSelectors.filterMoreButton).should('exist');
    },
    /**
     * Validates that the buckets returned by GET variants/germline/cases/filters are rendered as options of a filter.
     * @param alias The alias of the intercepted GET cases/filters request (set before visiting the page).
     * @param filterKey The filter key whose options to check (e.g. 'diagnosis_lab_code').
     */
    shouldRenderApiOptions(alias: string, filterKey: string) {
      cy.wait(alias).then(({ response }) => {
        const buckets = response?.body?.[filterKey] || [];
        expect(buckets.length, `filter "${filterKey}" should return buckets`).to.be.greaterThan(0);
        VariantEntity_UninterpretedCases_Filters.actions.openFilter(filterKey);
        buckets.forEach((bucket: { key: string }) => {
          cy.get(CommonSelectors.filterOption(filterKey, bucket.key)).should('exist');
        });
      });
    },
    /**
     * Validates that a filter with hard-coded options (not fed by the API) renders each of them.
     * @param filterKey The filter key to check (e.g. 'filter_is_pass').
     * @param values The expected option keys (e.g. ['true', 'false']).
     */
    shouldRenderFixedOptions(filterKey: string, values: string[]) {
      VariantEntity_UninterpretedCases_Filters.actions.openFilter(filterKey);
      values.forEach(value => {
        cy.get(CommonSelectors.filterOption(filterKey, value)).should('exist');
      });
    },
    /**
     * Validates that applying two filters carries both as search criteria in the POST cases/uninterpreted payload.
     * @param filterKeyA The first filter key to apply (e.g. 'diagnosis_lab_code').
     * @param filterKeyB The second filter key to apply (e.g. 'zygosity').
     */
    shouldRequestMultipleFilters(filterKeyA: string, filterKeyB: string) {
      const fieldA = filters.find(f => f.key === filterKeyA)?.field;
      const fieldB = filters.find(f => f.key === filterKeyB)?.field;
      VariantEntity_UninterpretedCases_Filters.actions.openFilter(filterKeyA);
      VariantEntity_UninterpretedCases_Filters.actions.selectFirstOption(filterKeyA);
      cy.intercept('POST', '**/cases/uninterpreted', req => {
        const fields = (req.body.search_criteria || []).map((c: { field: string }) => c.field);
        expect(fields, 'search_criteria fields').to.include.members([fieldA, fieldB]);
      }).as('multipleFiltersSearch');
      VariantEntity_UninterpretedCases_Filters.actions.openFilter(filterKeyB);
      VariantEntity_UninterpretedCases_Filters.actions.selectFirstOption(filterKeyB);
      cy.wait('@multipleFiltersSearch');
    },
    /**
     * Validates that the POST cases/uninterpreted payload carries the applied filter as a search criterion.
     * @param filterKey The filter key to apply (e.g. 'diagnosis_lab_code').
     */
    shouldRequestOnFilterSelect(filterKey: string) {
      const filter = filters.find(f => f.key === filterKey);
      VariantEntity_UninterpretedCases_Filters.actions.openFilter(filterKey);
      cy.intercept('POST', '**/cases/uninterpreted', req => {
        const criterion = req.body.search_criteria?.find((c: { field: string }) => c.field === filter?.field);
        expect(criterion, `search_criteria for "${filter?.field}"`).to.exist;
        expect(criterion.value).to.have.length.greaterThan(0);
      }).as('filterSearchRequest');
      VariantEntity_UninterpretedCases_Filters.actions.selectFirstOption(filterKey);
      cy.wait('@filterSearchRequest');
    },
    /**
     * Validates that typing in the HPO filter sends a phenotypes_term criterion with the 'contains' operator.
     * @param term The phenotype term to search.
     */
    shouldRequestPhenotypeFilter(term: string) {
      cy.intercept('POST', '**/cases/uninterpreted', req => {
        const criterion = req.body.search_criteria?.find((c: { field: string }) => c.field === 'phenotypes_term');
        expect(criterion, 'search_criteria for "phenotypes_term"').to.exist;
        expect(criterion.operator).to.equal('contains');
        expect(criterion.value).to.deep.equal([term]);
      }).as('phenotypeSearchRequest');
      VariantEntity_UninterpretedCases_Filters.actions.searchPhenotype(term);
      cy.wait('@phenotypeSearchRequest');
    },
    /**
     * Validates that a filter hidden by default is not rendered until revealed through "More".
     * @param filterKey The hidden filter key to reveal (e.g. 'analysis_catalog_code').
     */
    shouldRevealHiddenFilter(filterKey: string) {
      cy.get(CommonSelectors.filterButton(filterKey)).should('not.exist');
      VariantEntity_UninterpretedCases_Filters.actions.revealHiddenFilter(filterKey);
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
