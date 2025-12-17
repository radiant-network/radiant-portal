package repository

import (
	"testing"

	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
	"gorm.io/gorm"
)

func Test_GetProjectByCode_OK(t *testing.T) {
	testutils.SequentialPostgresTestWithDb(t, func(t *testing.T, db *gorm.DB) {
		repo := NewProjectRepository(db)
		project, err := repo.GetProjectByCode("N1")
		assert.NoError(t, err)
		assert.NotNil(t, project)
		assert.Equal(t, 1, project.ID)
		assert.Equal(t, "Phase one NeuroDev cases", project.Description)
	})
}

func Test_GetProjectByCode_NotFound(t *testing.T) {
	testutils.SequentialPostgresTestWithDb(t, func(t *testing.T, db *gorm.DB) {
		repo := NewProjectRepository(db)
		project, err := repo.GetProjectByCode("notexists")
		assert.Equal(t, "record not found", err.Error())
		assert.Nil(t, project)
	})
}
