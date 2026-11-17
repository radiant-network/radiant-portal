/// <reference types="cypress"/>

const selectors = {
  sidebarFavorites: '[data-cy="sidebar-favorites"]',
  favoritesEmpty: '[data-cy="favorites-empty"]',
  favoritesPopulated: '[data-cy="favorites-populated"]',
  favoritesLoading: '[data-cy="favorites-loading"]',
  favoritesError: '[data-cy="favorites-error"]',
  favoritesRetry: '[data-cy="favorites-retry"]',
  facetStar: (key: string) => `[data-cy="facet-star-${key}"]`,
  errorToast: '[data-sonner-toast][data-type="error"]',
};

export const CaseEntity_Variants_FavoriteFacets = {
  selectors,
  actions: {
    clickFavoritesRail() {
      cy.get(selectors.sidebarFavorites).clickAndWait({ force: true });
    },
    clickFacetStar(facetKey: string) {
      cy.get(selectors.facetStar(facetKey)).clickAndWait({ force: true });
    },
    clickRetry() {
      cy.get(selectors.favoritesRetry).clickAndWait({ force: true });
    },
  },
  validations: {
    shouldShowEmptyState() {
      cy.get(selectors.favoritesEmpty).should('be.visible');
    },
    shouldShowPopulatedList() {
      cy.get(selectors.favoritesPopulated).should('be.visible');
    },
    shouldShowLoading() {
      cy.get(selectors.favoritesLoading).should('be.visible');
    },
    shouldShowErrorState() {
      cy.get(selectors.favoritesError).should('be.visible');
      cy.get(selectors.favoritesRetry).should('be.visible');
    },
    shouldShowFacetInPanel(facetKey: string) {
      cy.get(`${selectors.favoritesPopulated} ${selectors.facetStar(facetKey)}`).should('exist');
    },
    shouldNotShowFacetInPanel(facetKey: string) {
      cy.get(`${selectors.favoritesPopulated} ${selectors.facetStar(facetKey)}`).should('not.exist');
    },
    shouldShowErrorToast() {
      cy.get(selectors.errorToast).should('be.visible');
    },
  },
};
