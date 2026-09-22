package starrocks

import (
	"testing"

	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/stretchr/testify/assert"
)

func Test_interpretationTableFor_Maps_Each_SNV_Table(t *testing.T) {
	table, ok := interpretationTableFor(types.GermlineSNVOccurrenceTable)
	assert.True(t, ok)
	assert.Equal(t, types.InterpretationGermlineTable, table)

	table, ok = interpretationTableFor(types.SomaticSNVOccurrenceTable)
	assert.True(t, ok)
	assert.Equal(t, types.InterpretationSomaticTable, table)
}

func Test_interpretationTableFor_Reports_CNV_As_Unsupported(t *testing.T) {
	_, ok := interpretationTableFor(types.GermlineCNVOccurrenceTable)
	assert.False(t, ok)

	_, ok = interpretationTableFor(types.SomaticCNVOccurrenceTable)
	assert.False(t, ok)
}

func annotatedCountQueryForTest(t *testing.T) types.OccurrenceCountQuery {
	t.Helper()
	query, err := types.NewOccurrenceCountQueryFromSqon(nil, types.GermlineSNVOccurrencesFields,
		types.WithNoteFilter(true),
		types.WithFlagFilter([]types.OccurrenceFlagType{types.OccurrenceFlagTypePin}),
		types.WithInterpretationFilter(true))
	assert.NoError(t, err)
	return query
}

func Test_countWithAndWithoutAnnotations_Runs_One_Unfiltered_Pass_When_No_Annotation_Filter(t *testing.T) {
	query, err := types.NewOccurrenceCountQueryFromSqon(nil, types.GermlineSNVOccurrencesFields)
	assert.NoError(t, err)

	var passes int
	counts, err := countWithAndWithoutAnnotations(query, func(types.OccurrenceCountQuery) (int64, error) {
		passes++
		return 7, nil
	})

	assert.NoError(t, err)
	assert.Equal(t, 1, passes)
	assert.Equal(t, types.OccurrenceCount{Count: 7, FilteredCount: 7}, counts)
}

func Test_countWithAndWithoutAnnotations_Counts_Twice_When_An_Annotation_Filter_Is_Set(t *testing.T) {
	query := annotatedCountQueryForTest(t)

	var annotated []bool
	counts, err := countWithAndWithoutAnnotations(query, func(pass types.OccurrenceCountQuery) (int64, error) {
		annotated = append(annotated, pass.WithNote() || len(pass.WithFlag()) > 0 || pass.WithInterpretation())
		return int64(len(annotated)), nil
	})

	assert.NoError(t, err)
	assert.Equal(t, []bool{false, true}, annotated)
	assert.Equal(t, types.OccurrenceCount{Count: 1, FilteredCount: 2}, counts)
}

func Test_countWithAndWithoutAnnotations_Keeps_The_Sqon_Of_The_Unfiltered_Pass(t *testing.T) {
	sqon := &types.Sqon{Op: "in", Content: types.LeafContent{Field: "filter", Value: []interface{}{"PASS"}}}
	query, err := types.NewOccurrenceCountQueryFromSqon(sqon, types.GermlineSNVOccurrencesFields, types.WithNoteFilter(true))
	assert.NoError(t, err)

	_, err = countWithAndWithoutAnnotations(query, func(pass types.OccurrenceCountQuery) (int64, error) {
		assert.Equal(t, query.Filters(), pass.Filters())
		return 0, nil
	})
	assert.NoError(t, err)
}

func Test_countWithAndWithoutAnnotations_Counts_Once_When_The_Query_Is_Nil(t *testing.T) {
	var passes int
	counts, err := countWithAndWithoutAnnotations(nil, func(pass types.OccurrenceCountQuery) (int64, error) {
		passes++
		assert.Nil(t, pass)
		return 3, nil
	})

	assert.NoError(t, err)
	assert.Equal(t, 1, passes)
	assert.Equal(t, types.OccurrenceCount{Count: 3, FilteredCount: 3}, counts)
}
