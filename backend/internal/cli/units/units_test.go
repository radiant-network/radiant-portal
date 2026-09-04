package units

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func Test_ParseSize_Plain(t *testing.T) {
	n, err := ParseSize("9080")
	require.NoError(t, err)
	assert.Equal(t, int64(9080), n)
}

func Test_ParseSize_WithDecimalUnit(t *testing.T) {
	n, err := ParseSize("1.5 GB")
	require.NoError(t, err)
	assert.Equal(t, int64(1_500_000_000), n)
}

func Test_ParseSize_WithBinaryUnit(t *testing.T) {
	n, err := ParseSize("512MiB")
	require.NoError(t, err)
	assert.Equal(t, int64(512<<20), n)
}

func Test_ParseSize_CaseInsensitive(t *testing.T) {
	n, err := ParseSize("2 mb")
	require.NoError(t, err)
	assert.Equal(t, int64(2_000_000), n)
}

func Test_ParseSize_Empty(t *testing.T) {
	n, err := ParseSize("  ")
	require.NoError(t, err)
	assert.Equal(t, int64(0), n)
}

func Test_ParseSize_UnknownUnit(t *testing.T) {
	_, err := ParseSize("3 parsecs")
	assert.ErrorContains(t, err, `invalid size unit "parsecs"`)
}

func Test_ParseSize_Garbage(t *testing.T) {
	_, err := ParseSize("abc")
	assert.ErrorContains(t, err, `invalid size "abc"`)
}

func Test_FormatBytes_Bytes(t *testing.T) {
	assert.Equal(t, "512 B", FormatBytes(512))
}

func Test_FormatBytes_Kilobytes(t *testing.T) {
	assert.Equal(t, "9.1 KB", FormatBytes(9080))
}

func Test_FormatBytes_Gigabytes(t *testing.T) {
	assert.Equal(t, "31.1 GB", FormatBytes(31_110_000_000))
}
