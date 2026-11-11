package postgres

import (
	"os"
	"testing"

	"github.com/radiant-network/radiant-api/test/testutils"
)

// TestMain starts the Postgres container; every test in this package targets PostgreSQL.
func TestMain(m *testing.M) {
	testutils.StartPostgresContainer()
	code := m.Run()
	testutils.StopAllContainers()
	os.Exit(code)
}
