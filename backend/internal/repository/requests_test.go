package repository

import (
	"testing"

	_ "github.com/go-sql-driver/mysql"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
	"gorm.io/gorm"
)

func Test_GetRequests(t *testing.T) {
	testutils.ParallelTestWithDb(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewRequestsRepository(db)
		requests, err := repo.GetRequests()
		assert.NoError(t, err)
		assert.Len(t, *requests, 82)
	})
}
