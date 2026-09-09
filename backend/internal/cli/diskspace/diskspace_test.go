package diskspace

import (
	"path/filepath"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func Test_Available_TempDirPositive(t *testing.T) {
	n, err := Available(t.TempDir())
	require.NoError(t, err)
	assert.Greater(t, n, int64(0))
}

func Test_Available_MissingPath(t *testing.T) {
	_, err := Available(filepath.Join(t.TempDir(), "does-not-exist"))
	assert.Error(t, err)
}
