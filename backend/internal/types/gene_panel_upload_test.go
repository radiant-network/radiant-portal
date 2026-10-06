package types

import (
	"strings"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func Test_GenePanelCodeFromName_UpperCaseWithUnderscores(t *testing.T) {
	code, err := GenePanelCodeFromName("Cardiac arrhythmia")
	require.NoError(t, err)
	assert.Equal(t, "CARDIAC_ARRHYTHMIA", code)
}

func Test_GenePanelCodeFromName_RemovesAccents(t *testing.T) {
	code, err := GenePanelCodeFromName("Rétinopathie héréditaire")
	require.NoError(t, err)
	assert.Equal(t, "RETINOPATHIE_HEREDITAIRE", code)
}

func Test_GenePanelCodeFromName_CollapsesRunsAndTrimsEdges(t *testing.T) {
	code, err := GenePanelCodeFromName("  (Heart -- disease) v2. ")
	require.NoError(t, err)
	assert.Equal(t, "HEART_DISEASE_V2", code)
}

func Test_GenePanelCodeFromName_CutsTo50WithoutTrailingUnderscore(t *testing.T) {
	code, err := GenePanelCodeFromName(strings.Repeat("a", 49) + " b")
	require.NoError(t, err)
	assert.Equal(t, strings.Repeat("A", 49), code)
}

func Test_GenePanelCodeFromName_NoLetterOrDigit(t *testing.T) {
	_, err := GenePanelCodeFromName("--- !")
	assert.ErrorContains(t, err, `panel "--- !" has no letter or digit`)
}

func Test_GenePanelCodeFromName_Empty(t *testing.T) {
	_, err := GenePanelCodeFromName("")
	assert.Error(t, err)
}
