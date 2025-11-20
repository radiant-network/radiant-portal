package repository

import (
	"testing"

	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
	"gorm.io/gorm"
)

func Test_GetOrganizationByCode_Not_Null(t *testing.T) {

	testutils.SequentialPostgresTestWithDb(t, func(t *testing.T, db *gorm.DB) {
		repo := NewOrganizationRepository(db)
		org, err := repo.GetOrganizationByCode("CHOP")
		assert.NoError(t, err)
		assert.NotNil(t, org)
		assert.Equal(t, "CHOP", org.Code)
		assert.Equal(t, "Children Hospital of Philadelphia", org.Name)
		assert.Equal(t, "healthcare_provider", org.CategoryCode)
	})
}
func Test_GetOrganizationByCode_Null(t *testing.T) {
	testutils.SequentialPostgresTestWithDb(t, func(t *testing.T, db *gorm.DB) {
		repo := NewOrganizationRepository(db)
		org, err := repo.GetOrganizationByCode("Unknown")
		assert.NoError(t, err)
		assert.Nil(t, org)
	})
}
