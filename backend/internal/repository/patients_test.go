package repository

import (
	"testing"

	"github.com/Ferlab-Ste-Justine/radiant-api/test/testutils"
	_ "github.com/go-sql-driver/mysql"
	"github.com/stretchr/testify/assert"
	"gorm.io/gorm"
)

func Test_GetPatients(t *testing.T) {
	testutils.ParallelTestWithDb(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewPatientsRepository(db)
		patients, err := repo.GetPatients()
		assert.NoError(t, err)
		assert.Len(t, *patients, 61)
	})
}
