package starrocks

import (
	"os"
	"testing"

	_ "github.com/go-sql-driver/mysql"
	"github.com/radiant-network/radiant-api/internal/database"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
)

func Test_CheckDatabaseConnection_Return_up(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		repo := NewStarrocksRepository(database.StarrocksDB{DB: env.Starrocks})
		status := repo.CheckDatabaseConnection()
		assert.Equal(t, "up", status)
	})
}

func Test_StarrocksReadOnlyGuard_RejectsCreate(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		err := env.Starrocks.Exec("INSERT INTO ensembl_gene (gene_id, name) VALUES ('TEST', 'TEST')").Error
		assert.ErrorIs(t, err, testutils.ErrStarrocksReadOnly)
	})
}

func Test_StarrocksReadOnlyGuard_AllowsRead(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		var count int64
		err := env.Starrocks.Table("ensembl_gene").Count(&count).Error
		assert.NoError(t, err)
		assert.Greater(t, count, int64(0))
	})
}

func TestMain(m *testing.M) {
	testutils.StartPostgresContainer()
	testutils.StartStarrocksContainer()
	code := m.Run()
	testutils.StopAllContainers()
	os.Exit(code)
}
