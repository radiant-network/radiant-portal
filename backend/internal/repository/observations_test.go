package repository

import (
	"testing"

	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
	"gorm.io/gorm"
)

func Test_GetObservationCodes(t *testing.T) {
	testutils.ParallelTestWithPostgres(t, func(t *testing.T, db *gorm.DB) {
		repo := NewObservationsRepository(db)
		result, err := repo.GetObservationCodes()
		assert.NoError(t, err)
		assert.NotNil(t, result)
		assert.Greater(t, len(result), 0)
	})
}
