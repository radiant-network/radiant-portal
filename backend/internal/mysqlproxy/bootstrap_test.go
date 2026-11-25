package mysqlproxy

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func Test_MaxConnsFromEnv_UnsetGivesFallback(t *testing.T) {
	t.Setenv("MAX_CONNECTIONS", "")
	n, err := MaxConnsFromEnv(256)
	require.NoError(t, err)
	assert.Equal(t, 256, n)
}

func Test_MaxConnsFromEnv_ReadsTheValue(t *testing.T) {
	t.Setenv("MAX_CONNECTIONS", "32")
	n, err := MaxConnsFromEnv(256)
	require.NoError(t, err)
	assert.Equal(t, 32, n)
}

func Test_MaxConnsFromEnv_ZeroMeansNoCap(t *testing.T) {
	t.Setenv("MAX_CONNECTIONS", "0")
	n, err := MaxConnsFromEnv(256)
	require.NoError(t, err)
	assert.Equal(t, 0, n)
}

func Test_MaxConnsFromEnv_RejectsANonInteger(t *testing.T) {
	t.Setenv("MAX_CONNECTIONS", "many")
	_, err := MaxConnsFromEnv(256)
	assert.ErrorContains(t, err, "parse MAX_CONNECTIONS")
}

func Test_MaxConnsFromEnv_RejectsANegativeValue(t *testing.T) {
	t.Setenv("MAX_CONNECTIONS", "-1")
	_, err := MaxConnsFromEnv(256)
	assert.ErrorContains(t, err, "0 (no cap) or more")
}
