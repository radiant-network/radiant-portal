package types

import (
	"encoding/json"
	"testing"

	"github.com/stretchr/testify/require"
)

func TestTrimmedString_JSON(t *testing.T) {
	// ---- Unmarshal ----
	jsonInput := `"   hello world   "`
	var ts TrimmedString

	err := json.Unmarshal([]byte(jsonInput), &ts)
	require.NoError(t, err)
	require.Equal(t, TrimmedString("hello world"), ts)

	// ---- Marshal ----
	out, err := json.Marshal(ts)
	require.NoError(t, err)
	require.Equal(t, `"hello world"`, string(out))
}

func TestTrimmedString_Empty(t *testing.T) {
	jsonInput := `"   "`
	var ts TrimmedString

	err := json.Unmarshal([]byte(jsonInput), &ts)
	require.NoError(t, err)
	require.Equal(t, TrimmedString(""), ts)
}
