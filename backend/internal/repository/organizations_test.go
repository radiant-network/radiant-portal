package repository

import (
	"testing"

	"github.com/Ferlab-Ste-Justine/radiant-api/test/testutils"
	_ "github.com/go-sql-driver/mysql"
	"github.com/stretchr/testify/assert"
	"gorm.io/gorm"
)

func Test_GetOrganizations(t *testing.T) {
	testutils.ParallelTestWithDb(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewOrganizationsRepository(db)
		codes, err := repo.GetOrganizations()
		assert.NoError(t, err)
		assert.Len(t, *codes, 6)
	})
}
