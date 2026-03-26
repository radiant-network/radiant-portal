package repository

import (
	"testing"

	"github.com/Goldziher/go-utils/sliceutils"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
	"gorm.io/gorm"
)

var allSomaticSNVFields = sliceutils.Map(types.SomaticSNVOccurrencesFields, func(value types.Field, index int, slice []types.Field) string {
	return value.GetAlias()
})

var defaultSomaticSNVFieldsForTest = []types.Field{
	types.SomaticSNVLocusIdField,
}

var SomaticSNVQueryConfigForTest = types.QueryConfig{
	AllFields:     types.SomaticSNVOccurrencesFields,
	DefaultFields: defaultSomaticSNVFieldsForTest,
	DefaultSort:   types.SomaticSNVOccurrencesDefaultSort,
	IdField:       types.SomaticSNVLocusIdField,
}

func Test_Somatic_SNV_GetOccurrences(t *testing.T) {
	testutils.ParallelTestWithDb(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewSomaticSNVOccurrencesRepository(db)
		query, err := types.NewListQueryFromSqon(SomaticSNVQueryConfigForTest, allSomaticSNVFields, nil, nil, nil)
		assert.NoError(t, err)
		occurrences, err := repo.GetOccurrences(71, 74, query)
		assert.NoError(t, err)
		if assert.Len(t, occurrences, 1) {
			assert.EqualValues(t, "1000", occurrences[0].LocusId)
			assert.Equal(t, 74, occurrences[0].SeqId)
			assert.Equal(t, 74, occurrences[0].TaskId)
			assert.False(t, occurrences[0].HasInterpretation)
			assert.True(t, occurrences[0].HasNote)
			assert.Equal(t, "hgvsg1", occurrences[0].Hgvsg)
			assert.Equal(t, "BRAF", occurrences[0].Symbol)
			assert.Equal(t, "p.Arg19His", occurrences[0].AaChange)
			assert.Equal(t, "class1", occurrences[0].VariantClass)
			assert.Equal(t, types.MODIFIER, occurrences[0].VepImpact)
			assert.Equal(t, 1, len(occurrences[0].PickedConsequences))
			assert.True(t, *(occurrences[0].IsCanonical))
			assert.True(t, *(occurrences[0].IsManeSelect))
			assert.Nil(t, occurrences[0].IsManePlus)
			assert.Equal(t, "rs111111111", occurrences[0].Rsnumber)
			assert.Equal(t, 1, len(occurrences[0].OmimInheritanceCode))
			assert.True(t, *(occurrences[0].Hotspot))
			assert.Equal(t, 2, len(occurrences[0].Clinvar))
			assert.Equal(t, float64(0.001), *(occurrences[0].GnomadV3Af))
			assert.Equal(t, float64(0.99), *(occurrences[0].GermlinePfWgs))
			assert.Equal(t, 3, *(occurrences[0].GermlinePcWgs))
			assert.Equal(t, float64(0.55), *(occurrences[0].SomaticPfTnWgs))
			assert.Equal(t, 6, *(occurrences[0].SomaticPcTnWgs))
			assert.Equal(t, float32(0.66), *(occurrences[0].AdRatio))
		}
	})
}

func Test_Somatic_SNV_GetOccurrences_Return_Selected_Columns_Only(t *testing.T) {
	testutils.ParallelTestWithDb(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewSomaticSNVOccurrencesRepository(db)
		selectedFields := []string{"seq_id", "locus_id", "ad_ratio", "symbol"}

		query, err := types.NewListQueryFromSqon(SomaticSNVQueryConfigForTest, selectedFields, nil, nil, nil)
		assert.NoError(t, err)
		occurrences, err := repo.GetOccurrences(71, 74, query)
		assert.NoError(t, err)
		if assert.Len(t, occurrences, 1) {
			assert.Equal(t, 74, occurrences[0].SeqId)
			assert.EqualValues(t, "1000", occurrences[0].LocusId)
			assert.Equal(t, "BRAF", occurrences[0].Symbol)
			assert.Empty(t, occurrences[0].VepImpact)
		}
	})
}

func Test_Somatic_SNV_GetOccurrences_Return_Default_Column_If_No_One_Specified(t *testing.T) {
	testutils.ParallelTestWithDb(t, "simple", func(t *testing.T, db *gorm.DB) {

		repo := NewSomaticSNVOccurrencesRepository(db)
		query, err := types.NewListQueryFromSqon(SomaticSNVQueryConfigForTest, nil, nil, nil, nil)
		assert.NoError(t, err)
		occurrences, err := repo.GetOccurrences(71, 74, query)
		assert.NoError(t, err)
		assert.Len(t, occurrences, 1)

		if assert.Len(t, occurrences, 1) {
			assert.EqualValues(t, "1000", occurrences[0].LocusId)
			assert.Empty(t, occurrences[0].Hgvsg)
		}
	})
}

func Test_Somatic_SNV_GetOccurrences_Return_A_Proper_Array_Column(t *testing.T) {
	testutils.ParallelTestWithDb(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewSomaticSNVOccurrencesRepository(db)
		selectedFields := []string{"clinvar"}
		query, err := types.NewListQueryFromSqon(SomaticSNVQueryConfigForTest, selectedFields, nil, nil, nil)
		assert.NoError(t, err)
		occurrences, err := repo.GetOccurrences(71, 74, query)
		assert.NoError(t, err)
		if assert.Len(t, occurrences, 1) {
			assert.Equal(t, types.JsonArray[string]{"Benign", "Pathogenic"}, occurrences[0].Clinvar)

		}
	})
}

func Test_Somatic_SNV_GetOccurrences_Return_Occurrences_That_Match_Filters(t *testing.T) {
	testutils.ParallelTestWithDb(t, "multiple", func(t *testing.T, db *gorm.DB) {

		repo := NewSomaticSNVOccurrencesRepository(db)
		sqon := &types.Sqon{
			Content: types.SqonArray{
				{Op: "in", Content: &types.LeafContent{Field: "symbol", Value: []interface{}{"BRAF"}}},
				{Op: ">", Content: &types.LeafContent{Field: "ad_ratio", Value: []interface{}{0.7}}},
			},
			Op: "and",
		}
		query, err := types.NewListQueryFromSqon(SomaticSNVQueryConfigForTest, allSomaticSNVFields, sqon, nil, nil)
		assert.NoError(t, err)
		occurrences, err := repo.GetOccurrences(71, 74, query)
		assert.NoError(t, err)
		if assert.Len(t, occurrences, 1) {
			assert.Equal(t, 74, occurrences[0].SeqId)
			assert.EqualValues(t, "2000", occurrences[0].LocusId)
		}
	})
}

func Test_Somatic_SNV_GetOccurrences_Return_Expected_Occurrences_When_Limit_And_Offset_Specified(t *testing.T) {
	testutils.ParallelTestWithDb(t, "pagination", func(t *testing.T, db *gorm.DB) {

		repo := NewSomaticSNVOccurrencesRepository(db)

		sortedBody := []types.SortBody{
			{
				Field: "germline_pf_wgs",
				Order: "desc",
			},
		}
		pagination := &types.Pagination{
			Limit:  12,
			Offset: 5,
		}

		query, err := types.NewListQueryFromSqon(SomaticSNVQueryConfigForTest, allSomaticSNVFields, nil, pagination, sortedBody)
		assert.NoError(t, err)
		occurrences, err := repo.GetOccurrences(71, 74, query)
		assert.NoError(t, err)
		if assert.Len(t, occurrences, 12) {
			assert.EqualValues(t, "1023", occurrences[0].LocusId)
			assert.EqualValues(t, "1012", occurrences[len(occurrences)-1].LocusId)
		}
	})
}
