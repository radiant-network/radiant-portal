package repository

import (
	"testing"

	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
	"gorm.io/gorm"
)

func Test_GetFamilyById_OK(t *testing.T) {
	testutils.ParallelTestWithPostgres(t, func(t *testing.T, db *gorm.DB) {
		repo := NewFamilyRepository(db)
		result, err := repo.GetFamilyById(1)

		expected := &types.Family{
			ID:                        1,
			CaseID:                    1,
			FamilyMemberID:            1,
			RelationshipToProbandCode: "mother",
			AffectedStatusCode:        "affected",
		}

		assert.NoError(t, err)
		assert.Equal(t, expected, result)
	})
}

func Test_GetFamilyById_HandlesError(t *testing.T) {
	testutils.ParallelTestWithPostgres(t, func(t *testing.T, db *gorm.DB) {
		repo := NewFamilyRepository(db)
		result, err := repo.GetFamilyById(999)
		assert.Equal(t, gorm.ErrRecordNotFound, err)
		assert.Nil(t, result)
	})
}

func Test_CreateFamily_OK(t *testing.T) {
	testutils.SequentialPostgresTestWithDb(t, func(t *testing.T, db *gorm.DB) {
		newFamily := &types.Family{
			ID:                        999,
			CaseID:                    1,
			FamilyMemberID:            1,
			RelationshipToProbandCode: "mother",
			AffectedStatusCode:        "affected",
		}

		repo := NewFamilyRepository(db)
		err := repo.CreateFamily(newFamily)
		assert.NoError(t, err)

		result, err := repo.GetFamilyById(999)
		assert.NoError(t, err)
		assert.Equal(t, newFamily, result)

		db.Exec("DELETE FROM family WHERE id=999")
	})
}
