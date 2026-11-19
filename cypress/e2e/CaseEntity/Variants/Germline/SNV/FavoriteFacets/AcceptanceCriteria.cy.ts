/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { CaseEntity_Variants_FavoriteFacets } from 'pom/pages/CaseEntity_Variants_FavoriteFacets';

const FOO_KEY = 'variant_class';
const BAR_KEY = 'consequence';

describe('Case Entity - Variants - Germline - SNV - Favorite facets', () => {
  const visitSNV = () => {
    cy.login();
    cy.visitCaseVariantsPage(data.case.case, data.case.seq.seq_id, 'SNV');
  };

  it('lands on the Favorites panel when preloaded favorites exist', () => {
    cy.mockFavoritePreferences([FOO_KEY]);
    visitSNV();
    CaseEntity_Variants_FavoriteFacets.validations.shouldShowPopulatedList();
    CaseEntity_Variants_FavoriteFacets.validations.shouldShowFacetInPanel(FOO_KEY);
  });

  it('shows the empty state when no favorites are stored', () => {
    cy.mockFavoritePreferences(null);
    visitSNV();
    CaseEntity_Variants_FavoriteFacets.actions.clickFavoritesRail();
    CaseEntity_Variants_FavoriteFacets.validations.shouldShowEmptyState();
  });

  it('adds a facet to Favorites when its star is clicked in a regular section', () => {
    cy.mockFavoritePreferences([]);
    visitSNV();
    CaseEntity_Variants_FavoriteFacets.actions.clickFacetStar(FOO_KEY);
    CaseEntity_Variants_FavoriteFacets.actions.clickFavoritesRail();
    CaseEntity_Variants_FavoriteFacets.validations.shouldShowFacetInPanel(FOO_KEY);
  });

  it('removes a facet instantly when its star is clicked in a regular section', () => {
    cy.mockFavoritePreferences([FOO_KEY, BAR_KEY]);
    visitSNV();
    CaseEntity_Variants_FavoriteFacets.validations.shouldShowFacetInPanel(FOO_KEY);
    CaseEntity_Variants_FavoriteFacets.actions.clickFacetStar(FOO_KEY);
    CaseEntity_Variants_FavoriteFacets.validations.shouldNotShowFacetInPanel(FOO_KEY);
  });

  it('reverts and shows an error toast when the save fails', () => {
    cy.mockFavoritePreferences([], 500);
    visitSNV();
    CaseEntity_Variants_FavoriteFacets.actions.clickFacetStar(FOO_KEY);
    CaseEntity_Variants_FavoriteFacets.validations.shouldShowErrorToast();
    CaseEntity_Variants_FavoriteFacets.actions.clickFavoritesRail();
    CaseEntity_Variants_FavoriteFacets.validations.shouldShowEmptyState();
  });

  it('cancels a pending removal when the star is clicked twice within the undo window', () => {
    cy.mockFavoritePreferences([FOO_KEY]);
    visitSNV();
    CaseEntity_Variants_FavoriteFacets.validations.shouldShowFacetInPanel(FOO_KEY);
    CaseEntity_Variants_FavoriteFacets.actions.clickFacetStar(FOO_KEY);
    CaseEntity_Variants_FavoriteFacets.actions.clickFacetStar(FOO_KEY);
    CaseEntity_Variants_FavoriteFacets.validations.shouldShowFacetInPanel(FOO_KEY);
  });

  it('slides the row out and persists the removal after the undo window elapses', () => {
    cy.mockFavoritePreferences([FOO_KEY]);
    visitSNV();
    CaseEntity_Variants_FavoriteFacets.validations.shouldShowFacetInPanel(FOO_KEY);
    CaseEntity_Variants_FavoriteFacets.actions.clickFacetStar(FOO_KEY);
    cy.wait('@saveFavorites');
    CaseEntity_Variants_FavoriteFacets.validations.shouldNotShowFacetInPanel(FOO_KEY);
  });

  it('shows the error state and recovers when Retry succeeds', () => {
    cy.mockFavoritePreferences(500);
    visitSNV();
    CaseEntity_Variants_FavoriteFacets.actions.clickFavoritesRail();
    CaseEntity_Variants_FavoriteFacets.validations.shouldShowErrorState();
    cy.mockFavoritePreferences([FOO_KEY]);
    CaseEntity_Variants_FavoriteFacets.actions.clickRetry();
    CaseEntity_Variants_FavoriteFacets.validations.shouldShowFacetInPanel(FOO_KEY);
  });
});

describe('Case Entity - Variants - Germline - CNV - Favorite facets isolation', () => {
  const visitCNV = () => {
    cy.login();
    cy.visitCaseVariantsPage(data.case.case, data.case.seq.seq_id, 'CNV');
  };

  it('only lists CNV-scoped favorites on the CNV tab', () => {
    const CNV_KEY = 'type';
    cy.intercept('GET', '**/users/preferences/favorites-germline_snv_occurrence', {
      statusCode: 200,
      body: { key: 'favorites-germline_snv_occurrence', content: { favorites: [FOO_KEY] } },
    });
    cy.intercept('GET', '**/users/preferences/favorites-germline_cnv_occurrence', {
      statusCode: 200,
      body: { key: 'favorites-germline_cnv_occurrence', content: { favorites: [CNV_KEY] } },
    });
    visitCNV();
    CaseEntity_Variants_FavoriteFacets.validations.shouldShowFacetInPanel(CNV_KEY);
    CaseEntity_Variants_FavoriteFacets.validations.shouldNotShowFacetInPanel(FOO_KEY);
  });
});
