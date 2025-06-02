package repository

import (
	"testing"

	"github.com/Ferlab-Ste-Justine/radiant-api/test/testutils"
	_ "github.com/go-sql-driver/mysql"
	"github.com/stretchr/testify/assert"
	"gorm.io/gorm"
)

func Test_GetObservationCoding(t *testing.T) {
	testutils.ParallelTestWithDb(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewObservationCodingRepository(db)
		obs, err := repo.GetObservationCoding()
		assert.NoError(t, err)
		assert.Len(t, *obs, 463)
	})
}
