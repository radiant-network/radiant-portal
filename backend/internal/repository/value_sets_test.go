package repository

import (
	"testing"

	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
	"gorm.io/gorm"
)

func Test_GetCodes(t *testing.T) {
	testutils.ParallelTestWithPostgres(t, func(t *testing.T, db *gorm.DB) {
		repo := NewValueSetsRepository(db)

		for vsType, tableName := range repo.tableMap {
			result, err := repo.GetCodes(vsType)
			assert.NoError(t, err)
			assert.NotNil(t, result)
			assert.Greater(t, len(result), 0, "ValueSetType: %s, TableName: %s", vsType, tableName)
		}
	})
}
