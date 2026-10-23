package starrocks

import (
	"testing"

	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func Test_UsesTable_False_When_Query_Is_Nil(t *testing.T) {
	assert.False(t, usesTable(nil, types.GermlineCNVVariantFrequencyTable))
}

func Test_UsesTable_False_When_No_Field_Of_The_Table(t *testing.T) {
	query, err := types.NewOccurrenceListQueryFromSqon(types.GermlineCNVOccurrencesQueryConfig, nil, nil, nil, nil)
	require.NoError(t, err)
	assert.False(t, usesTable(query, types.GermlineCNVVariantFrequencyTable))
}

func Test_UsesTable_True_When_A_Field_Of_The_Table_Is_Selected(t *testing.T) {
	query, err := types.NewOccurrenceListQueryFromSqon(types.GermlineCNVOccurrencesQueryConfig, []string{"germline_pc_wgs"}, nil, nil, nil)
	require.NoError(t, err)
	assert.True(t, usesTable(query, types.GermlineCNVVariantFrequencyTable))
}

func Test_UsesTable_True_When_A_Field_Of_The_Table_Is_Only_Sorted(t *testing.T) {
	sort := []types.SortBody{{Field: "germline_pf_wgs", Order: "desc"}}
	query, err := types.NewOccurrenceListQueryFromSqon(types.GermlineCNVOccurrencesQueryConfig, nil, nil, nil, sort)
	require.NoError(t, err)
	assert.True(t, usesTable(query, types.GermlineCNVVariantFrequencyTable))
}

func Test_UsesTable_True_When_The_Statistics_Target_Is_In_The_Table(t *testing.T) {
	query, err := types.NewStatisticsQueryFromSqon("germline_pf_wgs", nil, types.GermlineCNVOccurrencesFields)
	require.NoError(t, err)
	assert.True(t, usesTable(query, types.GermlineCNVVariantFrequencyTable))
}
