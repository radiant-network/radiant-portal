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
