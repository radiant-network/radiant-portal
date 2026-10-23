package types

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func Test_GermlineCNVFrequencyField_Is_Selected_By_Its_Api_Name_Not_Its_Column(t *testing.T) {
	t.Parallel()
	query, err := NewOccurrenceListQueryFromSqon(GermlineCNVOccurrencesQueryConfig, []string{"germline_pf_wgs", "pf_wxs"}, nil, nil, nil)
	if assert.NoError(t, err) {
		assert.Equal(t, []Field{GermlineCNVPfWgsField}, query.GetFieldsFromTables(GermlineCNVVariantFrequencyTable))
	}
}

func Test_SomaticCNVFrequencyField_Is_Selected_By_Its_Api_Name_Not_Its_Column(t *testing.T) {
	t.Parallel()
	query, err := NewOccurrenceListQueryFromSqon(SomaticCNVOccurrencesQueryConfig, []string{"somatic_pf_to_wgs", "pf_to_wxs"}, nil, nil, nil)
	if assert.NoError(t, err) {
		assert.Equal(t, []Field{SomaticCNVPfToWgsField}, query.GetFieldsFromTables(SomaticCNVVariantFrequencyTable))
	}
}

func Test_GermlineCNVOccurrencesDefaultFields_Exclude_Frequencies(t *testing.T) {
	t.Parallel()
	query, err := NewOccurrenceListQueryFromSqon(GermlineCNVOccurrencesQueryConfig, nil, nil, nil, nil)
	if assert.NoError(t, err) {
		assert.False(t, query.HasFieldFromTables(GermlineCNVVariantFrequencyTable))
	}
}

func Test_SomaticCNVOccurrencesDefaultFields_Exclude_Frequencies(t *testing.T) {
	t.Parallel()
	query, err := NewOccurrenceListQueryFromSqon(SomaticCNVOccurrencesQueryConfig, nil, nil, nil, nil)
	if assert.NoError(t, err) {
		assert.False(t, query.HasFieldFromTables(SomaticCNVVariantFrequencyTable))
	}
}
