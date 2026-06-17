package repository

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func Test_GetFacets_WithValidNames(t *testing.T) {
	repo := NewFacetsRepository()
	facetNames := []string{"variant_class", "lrt_pred"}
	facets, err := repo.GetFacets(t.Context(), facetNames)
	assert.NoError(t, err)
	assert.Len(t, facets, 2)

	for _, facet := range facets {
		switch facet.Name {
		case "variant_class":
			expectedValues := []string{"insertion", "deletion", "SNV", "indel", "substitution", "sequence_alteration"}
			assert.ElementsMatch(t, expectedValues, facet.Values)
		case "lrt_pred":
			expectedValues := []string{"D", "N", "U"}
			assert.ElementsMatch(t, expectedValues, facet.Values)
		default:
			t.Errorf("Unexpected facet name: %s", facet.Name)
		}
	}
}

func Test_GetFacets_Biotype_IncludesEmptyStringForNoData(t *testing.T) {
	repo := NewFacetsRepository()
	facets, err := repo.GetFacets(t.Context(), []string{"biotype"})
	assert.NoError(t, err)
	assert.Len(t, facets, 1)
	assert.Contains(t, facets[0].Values, "")
}

func Test_GetFacets_WithNoNames(t *testing.T) {
	repo := NewFacetsRepository()
	facets, err := repo.GetFacets(t.Context(), []string{})
	assert.Error(t, err)
	assert.Nil(t, facets)
}

func Test_GetFacet_FacetNotFound(t *testing.T) {
	repo := NewFacetsRepository()
	facetNames := []string{"non_existent_facet"}
	facets, err := repo.GetFacets(t.Context(), facetNames)
	assert.Error(t, err)
	assert.Nil(t, facets)
}
