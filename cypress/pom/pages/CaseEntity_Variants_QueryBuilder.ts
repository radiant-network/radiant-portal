/// <reference types="cypress"/>
import { CommonSelectors } from 'pom/shared/Selectors';
import { buildBilingualRegExp, findFacetData, normalizeSqon, shouldHaveTableResultsCount } from 'pom/shared/Utils';
import { CaseEntity_Variants_Facets, tableCNVFacets, tableSNVFacets, tableSomaticFacets } from './CaseEntity_Variants_Facets';

type FacetRef = { section: string; facet: string };

const generateQueryBuilderFunctions = (
  facetsActions: typeof CaseEntity_Variants_Facets.snv.actions,
  tableFacets: any[],
  config: {
    multiselectFacet: FacetRef;
    secondFacet: FacetRef;
    numericalFacet: FacetRef;
  }
) => {
  const actions = {
    /**
     * Adds a second multiselect pill (variant_type) to the active query.
     */
    addSecondPill() {
      facetsActions.applyMultiselectFacetFilter(config.secondFacet.section, config.secondFacet.facet);
    },
    /**
     * Registers the `/count` intercept, then adds a second pill — capturing the SQON of
     * the resulting two-pill query. Pair with {@link validations.shouldMatchSentSqon}.
     */
    addSecondPillAndCaptureCount() {
      cy.intercept('POST', '**/count').as('postComplexCount');
      actions.addSecondPill();
    },
    /**
     * Builds a first multiselect pill (chromosome) in the active query.
     */
    buildFirstPill() {
      facetsActions.applyMultiselectFacetFilter(config.multiselectFacet.section, config.multiselectFacet.facet);
    },
    /**
     * Builds a `not-in` multiselect pill (chromosome) in the active query: selects
     * the first value, then applies it through the split-button `not_in` action.
     */
    buildNotInPill() {
      const apiField = findFacetData(tableFacets, config.multiselectFacet.section, config.multiselectFacet.facet).apiField;
      facetsActions.clickSidebarSection(config.multiselectFacet.section);
      cy.get(CommonSelectors.facetHeader(apiField)).clickAndWait({ force: true });
      cy.get(CommonSelectors.facetCheckbox(apiField, /*any value*/ '')).eq(0).click({ force: true });
      cy.get(CommonSelectors.facetApplyButton(apiField)).siblings('button').first().clickAndWait({ force: true });
      cy.get(`${CommonSelectors.menuPopper} ${CommonSelectors.menuItem('not_in')}`).clickAndWait({ force: true });
    },
    /**
     * Registers the `/count` intercept, then builds a `not-in` pill — capturing the SQON
     * of the resulting query. Pair with {@link validations.shouldMatchSentSqon}.
     */
    buildNotInPillAndCaptureCount() {
      cy.intercept('POST', '**/count').as('postComplexCount');
      actions.buildNotInPill();
    },
    /**
     * Builds a numerical pill (position|start) in the active query, filled with `1`.
     */
    buildNumericalPill() {
      facetsActions.applyNumericalFacetFilter(config.numericalFacet.section, config.numericalFacet.facet);
    },
    /**
     * Clicks the clear-all button then confirms or cancels the dialog.
     * @param confirm Whether to confirm (true) or cancel (false) the deletion.
     */
    clickClearAll(confirm: boolean) {
      cy.get(CommonSelectors.clearAllButton).clickAndWait({ force: true });
      const dialogButton = confirm ? CommonSelectors.clearAllConfirm : CommonSelectors.clearAllCancel;
      cy.get(dialogButton).clickAndWait({ force: true });
    },
    /**
     * Clicks the new-query button to add a new empty query.
     */
    clickNewQuery() {
      cy.get(CommonSelectors.newQueryButton).clickAndWait({ force: true });
    },
    /**
     * Combines the selected queries.
     * @param operator The combine operator: 'default' (split button), 'and' or 'or' (dropdown item).
     */
    combineQueries(operator: 'default' | 'and' | 'or') {
      if (operator === 'default') {
        cy.get(CommonSelectors.combineQueriesButton).clickAndWait({ force: true });
      } else {
        cy.get(CommonSelectors.combineQueriesButton).siblings('button').first().clickAndWait({ force: true });
        cy.get(`${CommonSelectors.menuPopper} ${CommonSelectors.menuItem(`combine_${operator}`)}`).clickAndWait({ force: true });
      }
    },
    /**
     * Registers the `/count` intercept, then combines the selected queries — capturing the
     * SQON of the resulting combined query. Pair with {@link validations.shouldMatchSentSqon}.
     * @param operator The combine operator: 'default' (split button), 'and' or 'or' (dropdown item).
     */
    combineQueriesAndCaptureCount(operator: 'default' | 'and' | 'or') {
      cy.intercept('POST', '**/count').as('postComplexCount');
      actions.combineQueries(operator);
    },
    /**
     * Deletes a query then confirms or cancels the popover.
     * @param index The query index (0-based).
     * @param confirm Whether to confirm (true) or cancel (false) the deletion.
     */
    deleteQuery(index: number, confirm: boolean) {
      cy.get(CommonSelectors.queryBar).eq(index).find(CommonSelectors.queryDeleteButton).clickAndWait({ force: true });
      const popoverButton = confirm ? CommonSelectors.queryDeleteConfirm : CommonSelectors.queryDeleteCancel;
      cy.get(popoverButton).clickAndWait({ force: true });
    },
    /**
     * Duplicates a query using its copy button.
     * @param index The query index (0-based).
     */
    duplicateQuery(index: number) {
      cy.get(CommonSelectors.queryBar).eq(index).find(CommonSelectors.queryDuplicateButton).clickAndWait({ force: true });
    },
    /**
     * Edits the active multiselect pill (chromosome) from the sidebar facet by selecting all its values.
     */
    editPillViaFacet() {
      const apiField = findFacetData(tableFacets, config.multiselectFacet.section, config.multiselectFacet.facet).apiField;
      facetsActions.clickSidebarSection(config.multiselectFacet.section);
      cy.get(CommonSelectors.facetHeader(apiField)).clickAndWait({ force: true });
      cy.get(CommonSelectors.facetSelectAll(apiField)).click({ force: true });
      cy.get(CommonSelectors.facetApplyButton(apiField)).clickAndWait({ force: true });
    },
    /**
     * Edits the active numerical pill (position|start) via its inline popup editor by changing the max value to `9`.
     */
    editPillInline() {
      const apiField = findFacetData(tableFacets, config.numericalFacet.section, config.numericalFacet.facet).apiField;
      cy.get(`${CommonSelectors.queryActive} ${CommonSelectors.queryPillValue}`).first().clickAndWait({ force: true });
      cy.get(CommonSelectors.queryPillEditor).should('be.visible');
      cy.get(`${CommonSelectors.queryPillEditor} ${CommonSelectors.facetMaxInput(apiField)}`)
        .clear({ force: true })
        .type('9', { force: true });
      cy.get(`${CommonSelectors.queryPillEditor} ${CommonSelectors.facetApplyButton(apiField)}`).clickAndWait({ force: true });
    },
    /**
     * Removes a pill of the active query using its X button.
     * @param index The pill index within the active query (0-based, default: 0).
     */
    removePill(index: number = 0) {
      cy.get(`${CommonSelectors.queryActive} ${CommonSelectors.queryPill}`).eq(index).find(CommonSelectors.queryPillRemove).clickAndWait({ force: true });
    },
    /**
     * Selects (checks) a query for combination using its checkbox.
     * @param index The query index (0-based).
     */
    selectQuery(index: number) {
      cy.get(CommonSelectors.queryBar).eq(index).find(CommonSelectors.querySelectCheckbox).click({ force: true });
    },
    /**
     * Makes a query active by clicking its count area (bubbles to the query row).
     * @param index The query index (0-based).
     */
    setActiveQuery(index: number) {
      cy.get(CommonSelectors.queryBar).eq(index).find(CommonSelectors.queryCount).clickAndWait({ force: true });
    },
    /**
     * Toggles the collapse/expand state of the query panel.
     */
    toggleCollapse() {
      cy.get(CommonSelectors.querybuilderHeader).clickAndWait({ force: true });
    },
    /**
     * Toggles the field labels switch.
     */
    toggleLabels() {
      cy.get(CommonSelectors.labelsSwitch).clickAndWait({ force: true });
    },
    /**
     * Toggles the intra-query combiner operator (and ↔ or) of the active query.
     */
    toggleOperator() {
      cy.get(`${CommonSelectors.queryActive} ${CommonSelectors.queryCombinerOperator}`).first().clickAndWait({ force: true });
    },
    /**
     * Registers the `/count` intercept, then toggles the intra-query operator — capturing the
     * SQON of the resulting query. Pair with {@link validations.shouldMatchSentSqon}.
     */
    toggleOperatorAndCaptureCount() {
      cy.intercept('POST', '**/count').as('postComplexCount');
      actions.toggleOperator();
    },
  };

  const validations = {
    /**
     * Checks that the active query displays the empty-query placeholder.
     */
    shouldBeEmptyQuery() {
      cy.get(CommonSelectors.queryActive).contains(buildBilingualRegExp('queryBuilderEmptyState')).should('exist');
    },
    /**
     * Checks the collapsed/expanded state of the query panel.
     * @param collapsed Whether the panel should be collapsed.
     */
    shouldBeCollapsed(collapsed: boolean) {
      cy.get(CommonSelectors.querybuilderHeader).should('have.attr', 'data-state', collapsed ? 'closed' : 'open');
    },
    /**
     * Checks the number of pills in the active query.
     * @param count The expected pill count.
     */
    shouldHaveActivePillCount(count: number) {
      cy.get(`${CommonSelectors.queryActive} ${CommonSelectors.queryPill}`).should('have.length', count);
    },
    /**
     * Checks that the active query contains a chromosome pill.
     */
    shouldHaveChromosomePill() {
      cy.get(`${CommonSelectors.queryActive} ${CommonSelectors.queryPill}`).contains(findFacetData(tableFacets, config.multiselectFacet.section, config.multiselectFacet.facet).name).should('exist');
    },
    /**
     * Checks that the active query displays its per-query result count.
     */
    shouldHaveQueryCount() {
      cy.get(`${CommonSelectors.queryActive} ${CommonSelectors.queryCount}`).should('exist');
    },
    /**
     * Checks the numerical pill (position|start) in the active query.
     * @param values The values expected in the pill (e.g. ['9']).
     */
    shouldHaveNumericalPill(values: (string | RegExp)[] = []) {
      cy.validatePillSelectedQuery(findFacetData(tableFacets, config.numericalFacet.section, config.numericalFacet.facet).name, values);
    },
    /**
     * Checks the active query intra-query operator.
     * @param operator The expected operator ('and' or 'or').
     */
    shouldHaveOperator(operator: 'and' | 'or') {
      cy.get(`${CommonSelectors.queryActive} ${CommonSelectors.queryCombinerOperator}`).first().should('have.text', operator);
    },
    /**
     * Checks the total number of queries.
     * @param count The expected query count.
     */
    shouldHaveQueryCountTotal(count: number) {
      cy.get(CommonSelectors.queryBar).should('have.length', count);
    },
    /**
     * Checks the number of pills of a query at a given index.
     * @param index The query index.
     * @param count The expected pill count.
     */
    shouldHavePillCountAt(index: number, count: number) {
      cy.get(CommonSelectors.queryBar).eq(index).find(CommonSelectors.queryPill).should('have.length', count);
    },
    /**
     * Checks that the active query contains a variant_type pill.
     */
    shouldHaveVariantTypePill() {
      cy.get(`${CommonSelectors.queryActive} ${CommonSelectors.queryPill}`).contains(findFacetData(tableFacets, config.secondFacet.section, config.secondFacet.facet).name).should('exist');
    },
    /**
     * Checks whether the pills of the active query display the multiselect (chromosome) field label.
     * @param shouldShow Whether the multiselect facet label should be visible.
     */
    shouldShowLabels(shouldShow: boolean) {
      const strExist = shouldShow ? 'exist' : 'not.exist';
      cy.get(`${CommonSelectors.queryActive} ${CommonSelectors.queryPill}`).contains(findFacetData(tableFacets, config.multiselectFacet.section, config.multiselectFacet.facet).name).should(strExist);
    },
    /**
     * Checks whether the clear-all button is displayed.
     * @param shouldExist Whether the button should exist.
     */
    shouldShowClearAll(shouldExist: boolean) {
      cy.get(CommonSelectors.clearAllButton).should(shouldExist ? 'exist' : 'not.exist');
    },
    /**
     * Validates the SQON captured by a preceding `…AndCaptureCount` action and the returned count
     * of the `/count` response must match the total displayed by the table.
     * @param fixtureName The fixture file under `RequestBody/` describing the expected structure.
     * @param replacements The placeholder → value map to resolve in the fixture (e.g. `_OP`, `_CHROM_FIELD`).
     */
    shouldMatchSentSqon(fixtureName: string, replacements: Record<string, string>) {
      cy.wait('@postComplexCount').then(interception => {
        cy.fixture(`RequestBody/${fixtureName}`).then(fixture => {
          let json = JSON.stringify(fixture);
          Object.entries(replacements).forEach(([token, value]) => {
            json = json.split(token).join(value);
          });
          const expected = JSON.parse(json);
          const actual = normalizeSqon(interception.request.body.sqon);

          expect(actual).to.deep.equal(expected);
          shouldHaveTableResultsCount(interception.response!.body.count);
        });
      });
    },
  };

  const fields = {
    chromosome: findFacetData(tableFacets, config.multiselectFacet.section, config.multiselectFacet.facet).apiField,
    variantType: findFacetData(tableFacets, config.secondFacet.section, config.secondFacet.facet).apiField,
  };

  return { actions, validations, fields };
};

export const CaseEntity_Variants_QueryBuilder = {
  snv: generateQueryBuilderFunctions(CaseEntity_Variants_Facets.snv.actions, tableSNVFacets, {
    multiselectFacet: { section: 'Variant', facet: 'chromosome' },
    secondFacet: { section: 'Variant', facet: 'variant_type' },
    numericalFacet: { section: 'Variant', facet: 'position' },
  }),
  cnv: generateQueryBuilderFunctions(CaseEntity_Variants_Facets.cnv.actions, tableCNVFacets, {
    multiselectFacet: { section: 'Variant', facet: 'chromosome' },
    secondFacet: { section: 'Variant', facet: 'variant_type' },
    numericalFacet: { section: 'Variant', facet: 'start' },
  }),
  somatic: generateQueryBuilderFunctions(CaseEntity_Variants_Facets.somatic.actions, tableSomaticFacets, {
    multiselectFacet: { section: 'Variant', facet: 'chromosome' },
    secondFacet: { section: 'Variant', facet: 'variant_type' },
    numericalFacet: { section: 'Variant', facet: 'position' },
  }),
};
