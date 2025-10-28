package repository

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func Test_GetFacet(t *testing.T) {
	repo := NewFacetsRepository()
	facetName := "lrt_pred"
	facet, err := repo.GetFacet(facetName)
	assert.NoError(t, err)
	assert.Equal(t, facet.Name, facetName)
	assert.Equal(t, facet.Values, []string{"D", "N", "U"})
}

func Test_GetFacet_FacetNotFound(t *testing.T) {
	repo := NewFacetsRepository()
	facetName := "non_existing_facet"
	_, err := repo.GetFacet(facetName)
	assert.Error(t, err)
}
