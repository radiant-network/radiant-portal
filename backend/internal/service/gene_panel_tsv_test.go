package service

import (
	"errors"
	"strings"
	"testing"

	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func parseTSV(t *testing.T, content string) ([]types.GenePanelInput, error) {
	t.Helper()
	return ParseGenePanelTSV(strings.NewReader(content))
}

func requireFileError(t *testing.T, err error, line int, contains string) {
	t.Helper()
	var fileErr *types.GenePanelFileError
	require.True(t, errors.As(err, &fileErr), "want *GenePanelFileError, got %v", err)
	assert.Equal(t, line, fileErr.Line)
	assert.Contains(t, fileErr.Message, contains)
}

func Test_ParseGenePanelTSV_OnePanelPerColumnWithTheRowsMarkedTrue(t *testing.T) {
	panels, err := parseTSV(t, "symbol\tEpilepsy\tCardio\n"+
		"SCN1A\ttrue\tfalse\n"+
		"MYH7\tfalse\ttrue\n"+
		"KCNQ2\ttrue\ttrue\n")

	require.NoError(t, err)
	assert.Equal(t, []types.GenePanelInput{
		{Code: "EPILEPSY", Name: "Epilepsy", Rows: []types.GenePanelRow{{Line: 2, Symbol: "SCN1A"}, {Line: 4, Symbol: "KCNQ2"}}},
		{Code: "CARDIO", Name: "Cardio", Rows: []types.GenePanelRow{{Line: 3, Symbol: "MYH7"}, {Line: 4, Symbol: "KCNQ2"}}},
	}, panels)
}

func Test_ParseGenePanelTSV_CellsIgnoreCaseAndEmptyIsFalse(t *testing.T) {
	panels, err := parseTSV(t, "gene\tEpilepsy\n"+
		"SCN1A\tTRUE\n"+
		"MYH7\t\n"+
		"KCNQ2\tFalse\n"+
		"TNMD\t True \n")

	require.NoError(t, err)
	assert.Equal(t, []types.GenePanelRow{{Line: 2, Symbol: "SCN1A"}, {Line: 5, Symbol: "TNMD"}}, panels[0].Rows)
}

func Test_ParseGenePanelTSV_PanelWithNoTrueCellIsKeptEmpty(t *testing.T) {
	panels, err := parseTSV(t, "symbol\tEpilepsy\tEmpty\nSCN1A\ttrue\tfalse\n")

	require.NoError(t, err)
	assert.Equal(t, types.GenePanelInput{Code: "EMPTY", Name: "Empty"}, panels[1])
}

func Test_ParseGenePanelTSV_DerivesTheCodeFromTheTrimmedHeader(t *testing.T) {
	panels, err := parseTSV(t, "\ufeffsymbol\t Rétinopathie (AR) \nSCN1A\ttrue\n")

	require.NoError(t, err)
	assert.Equal(t, "RETINOPATHIE_AR", panels[0].Code)
	assert.Equal(t, "Rétinopathie (AR)", panels[0].Name)
}

func Test_ParseGenePanelTSV_TrimsSymbolsAndSkipsBlankLinesWithCRLF(t *testing.T) {
	panels, err := parseTSV(t, "symbol\tEpilepsy\r\n\r\n SCN1A \ttrue\r\n")

	require.NoError(t, err)
	assert.Equal(t, []types.GenePanelRow{{Line: 3, Symbol: "SCN1A"}}, panels[0].Rows)
}

func Test_ParseGenePanelTSV_EmptyFile(t *testing.T) {
	_, err := parseTSV(t, "")
	requireFileError(t, err, 0, "file is empty")
}

func Test_ParseGenePanelTSV_HeaderOnly(t *testing.T) {
	_, err := parseTSV(t, "symbol\tEpilepsy\n")
	requireFileError(t, err, 0, "no gene row")
}

func Test_ParseGenePanelTSV_HeaderWithNoPanelColumn(t *testing.T) {
	_, err := parseTSV(t, "symbol\nSCN1A\n")
	requireFileError(t, err, 1, "at least one panel column")
}

func Test_ParseGenePanelTSV_CommaSeparatedFileHasNoPanelColumn(t *testing.T) {
	_, err := parseTSV(t, "symbol,Epilepsy\nSCN1A,true\n")
	requireFileError(t, err, 1, "at least one panel column")
}

func Test_ParseGenePanelTSV_EmptyPanelHeader(t *testing.T) {
	_, err := parseTSV(t, "symbol\tEpilepsy\t \nSCN1A\ttrue\ttrue\n")
	requireFileError(t, err, 1, "column 3 has no panel name")
}

func Test_ParseGenePanelTSV_PanelHeaderWithNoLetterOrDigit(t *testing.T) {
	_, err := parseTSV(t, "symbol\t---\nSCN1A\ttrue\n")
	requireFileError(t, err, 1, `panel "---" has no letter or digit`)
}

func Test_ParseGenePanelTSV_TwoHeadersThatDifferOnlyByCase(t *testing.T) {
	_, err := parseTSV(t, "symbol\tEpilepsy\tepilepsy\nSCN1A\ttrue\ttrue\n")
	requireFileError(t, err, 1, `panels "Epilepsy" and "epilepsy" are the same panel (code EPILEPSY)`)
}

func Test_ParseGenePanelTSV_TwoHeadersThatGiveTheSameCode(t *testing.T) {
	_, err := parseTSV(t, "symbol\tHeart-disease\tHeart disease\nSCN1A\ttrue\ttrue\n")
	requireFileError(t, err, 1, "(code HEART_DISEASE)")
}

func Test_ParseGenePanelTSV_RowWithWrongColumnCount(t *testing.T) {
	_, err := parseTSV(t, "symbol\tEpilepsy\tCardio\nSCN1A\ttrue\n")
	requireFileError(t, err, 2, "row has 2 columns, header has 3")
}

func Test_ParseGenePanelTSV_EmptySymbol(t *testing.T) {
	_, err := parseTSV(t, "symbol\tEpilepsy\n \ttrue\n")
	requireFileError(t, err, 2, "symbol is empty")
}

func Test_ParseGenePanelTSV_DuplicateSymbolIgnoresCase(t *testing.T) {
	_, err := parseTSV(t, "symbol\tEpilepsy\nSCN1A\ttrue\nscn1a\tfalse\n")
	requireFileError(t, err, 3, `symbol "scn1a" is already on line 2`)
}

func Test_ParseGenePanelTSV_CellThatIsNotTrueOrFalse(t *testing.T) {
	_, err := parseTSV(t, "symbol\tEpilepsy\nSCN1A\tyes\n")
	requireFileError(t, err, 2, `panel "Epilepsy": "yes" is not true or false`)
}

type failingReader struct{}

func (failingReader) Read([]byte) (int, error) { return 0, errors.New("disk gone") }

func Test_ParseGenePanelTSV_ReadFailureIsNotAFileError(t *testing.T) {
	_, err := ParseGenePanelTSV(failingReader{})

	require.Error(t, err)
	var fileErr *types.GenePanelFileError
	assert.False(t, errors.As(err, &fileErr), "a read failure is a server error, not a bad file")
	assert.Contains(t, err.Error(), "disk gone")
}
