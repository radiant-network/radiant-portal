package repository

import (
	"testing"

	_ "github.com/go-sql-driver/mysql"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
	"gorm.io/gorm"
)

func Test_GetOrganizations(t *testing.T) {
	testutils.ParallelTestWithDb(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewOrganizationsRepository(db)
		organizations, err := repo.GetOrganizations()
		assert.NoError(t, err)
		assert.Len(t, *organizations, 6)
		assert.Equal(t, 1, (*organizations)[0].ID)
		assert.Equal(t, "CHOP", (*organizations)[0].Code)
		assert.Equal(t, "Children Hospital of Philadelphia", (*organizations)[0].Name)
		assert.Equal(t, "Healthcare Provider", (*organizations)[0].Category.NameEn)
	})
}
