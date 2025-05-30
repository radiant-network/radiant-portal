package repository

import (
	"os"
	"testing"

	"github.com/Ferlab-Ste-Justine/radiant-api/test/testutils"
	_ "github.com/go-sql-driver/mysql"
	"github.com/stretchr/testify/assert"
	"gorm.io/gorm"
)

func Test_CheckDatabaseConnection_Return_up(t *testing.T) {
	testutils.ParallelTestWithDb(t, "simple", func(t *testing.T, db *gorm.DB) {
		repo := NewStarrocksRepository(db)
		status := repo.CheckDatabaseConnection()
		assert.Equal(t, "up", status)

	})
}

func TestMain(m *testing.M) {
	testutils.StartAllContainers()
	code := m.Run()
	testutils.StopAllContainers()
	os.Exit(code)
}
