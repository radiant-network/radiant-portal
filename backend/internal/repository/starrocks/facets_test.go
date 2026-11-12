package starrocks

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

func Test_GetFacets_CNVType(t *testing.T) {
	repo := NewFacetsRepository()
	facets, err := repo.GetFacets(t.Context(), []string{"type"})
	assert.NoError(t, err)
	assert.Len(t, facets, 1)
	assert.Equal(t, "type", facets[0].Name)
	assert.ElementsMatch(t, []string{"GAIN", "LOSS", "GAINLOH", "CNLOH"}, facets[0].Values)
}

func Test_GetFacets_CmcTier(t *testing.T) {
	repo := NewFacetsRepository()
	facets, err := repo.GetFacets(t.Context(), []string{"cmc_tier"})
	assert.NoError(t, err)
	assert.Len(t, facets, 1)
	assert.Equal(t, "cmc_tier", facets[0].Name)
	assert.Equal(t, []string{"1", "2", "3", "Other"}, facets[0].Values)
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

func Test_GetFacets_TransmissionMode_ExcludesGermlineCNVModes(t *testing.T) {
	repo := NewFacetsRepository()
	facets, err := repo.GetFacets(t.Context(), []string{"transmission_mode"})
	assert.NoError(t, err)
	assert.Len(t, facets, 1)
	assert.Len(t, facets[0].Values, 13)
	assert.NotContains(t, facets[0].Values, "denovo")
	assert.NotContains(t, facets[0].Values, "unknown_cn")
}

func Test_GetGermlineCNVFacets_TransmissionMode_ReturnsCNVModesOnly(t *testing.T) {
	repo := NewFacetsRepository()
	facets, err := repo.GetGermlineCNVFacets(t.Context(), []string{"transmission_mode"})
	assert.NoError(t, err)
	assert.Len(t, facets, 1)
	assert.ElementsMatch(t, []string{
		"denovo", "denovo_suspect", "possible_denovo", "x_linked_denovo", "x_linked_recessive",
		"inherited_maternal", "inherited_paternal", "possible_inherited_maternal", "possible_inherited_paternal",
		"recessive", "recessive_lowconf", "inheritance_unresolved", "mendelian_inconsistent", "unknown_cn",
	}, facets[0].Values)
}

func Test_GetGermlineCNVFacets_SharedFacet_FallsBackToSharedDictionary(t *testing.T) {
	repo := NewFacetsRepository()
	facets, err := repo.GetGermlineCNVFacets(t.Context(), []string{"type"})
	assert.NoError(t, err)
	assert.Len(t, facets, 1)
	assert.Equal(t, []string{"GAIN", "LOSS", "GAINLOH", "CNLOH"}, facets[0].Values)
}

func Test_GetGermlineCNVFacets_UnknownFacet_ReturnsError(t *testing.T) {
	repo := NewFacetsRepository()
	facets, err := repo.GetGermlineCNVFacets(t.Context(), []string{"not_a_facet"})
	assert.Error(t, err)
	assert.Nil(t, facets)
}

func Test_GetGermlineCNVFacets_NoNames_ReturnsError(t *testing.T) {
	repo := NewFacetsRepository()
	facets, err := repo.GetGermlineCNVFacets(t.Context(), nil)
	assert.Error(t, err)
	assert.Nil(t, facets)
}
