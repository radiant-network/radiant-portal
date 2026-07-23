package repository

import (
	"os"
	"testing"

	"github.com/radiant-network/radiant-api/test/testutils"
)

// TestMain starts the containers the dual-purpose repositories exercise: Postgres (write path)
// and StarRocks (read/federation path). Each test package owns its own TestMain since the
// repository layer was split into repository/postgres and repository/starrocks subpackages.
func TestMain(m *testing.M) {
	testutils.StartPostgresContainer()
	testutils.StartStarrocksContainer()
	code := m.Run()
	testutils.StopAllContainers()
	os.Exit(code)
}
