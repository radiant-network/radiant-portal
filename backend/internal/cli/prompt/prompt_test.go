package prompt

import (
	"bytes"
	"strings"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func Test_Confirm_BlankAccepts(t *testing.T) {
	var out bytes.Buffer
	ok, err := Confirm(strings.NewReader("\n"), &out, "Continue?")
	require.NoError(t, err)
	assert.True(t, ok)
	assert.Equal(t, "Continue? [yes] ", out.String())
}

func Test_Confirm_YAccepts(t *testing.T) {
	ok, err := Confirm(strings.NewReader(" Y \n"), &bytes.Buffer{}, "Continue?")
	require.NoError(t, err)
	assert.True(t, ok)
}

func Test_Confirm_NoRejects(t *testing.T) {
	ok, err := Confirm(strings.NewReader("no\n"), &bytes.Buffer{}, "Continue?")
	require.NoError(t, err)
	assert.False(t, ok)
}

func Test_Confirm_EOFWithoutInput(t *testing.T) {
	_, err := Confirm(strings.NewReader(""), &bytes.Buffer{}, "Continue?")
	assert.ErrorContains(t, err, "read input")
}

func Test_Line_UsesDefaultWhenEmpty(t *testing.T) {
	var out bytes.Buffer
	v, err := Line(strings.NewReader("\n"), &out, "API URL", "https://api")
	require.NoError(t, err)
	assert.Equal(t, "https://api", v)
	assert.Equal(t, "API URL [https://api]: ", out.String())
}

func Test_Line_ReturnsTrimmedAnswer(t *testing.T) {
	v, err := Line(strings.NewReader("  https://other  \n"), &bytes.Buffer{}, "API URL", "")
	require.NoError(t, err)
	assert.Equal(t, "https://other", v)
}

func Test_Line_LastLineWithoutNewline(t *testing.T) {
	v, err := Line(strings.NewReader("https://other"), &bytes.Buffer{}, "API URL", "")
	require.NoError(t, err)
	assert.Equal(t, "https://other", v)
}
