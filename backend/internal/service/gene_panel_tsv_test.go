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

func Test_ParseGenePanelTSV_GroupsRowsByPanelInFileOrder(t *testing.T) {
	panels, err := parseTSV(t, "panel_code\tpanel_name\tsymbol\n"+
		"EPI\tEpilepsy\tSCN1A\n"+
		"CARDIO\tCardio\tMYH7\n"+
		"EPI\tEpilepsy\tKCNQ2\n")

	require.NoError(t, err)
	assert.Equal(t, []types.GenePanelInput{
		{Code: "EPI", Name: "Epilepsy", Rows: []types.GenePanelRow{{Line: 2, Symbol: "SCN1A"}, {Line: 4, Symbol: "KCNQ2"}}},
		{Code: "CARDIO", Name: "Cardio", Rows: []types.GenePanelRow{{Line: 3, Symbol: "MYH7"}}},
	}, panels)
}

func Test_ParseGenePanelTSV_ReadsOptionalEnsemblIDInUpperCase(t *testing.T) {
	panels, err := parseTSV(t, "panel_code\tpanel_name\tsymbol\tensembl_id\nEPI\tEpilepsy\tSCN1A\tensg00000144285\n")

	require.NoError(t, err)
	assert.Equal(t, "ENSG00000144285", panels[0].Rows[0].EnsemblID)
}

func Test_ParseGenePanelTSV_AcceptsColumnsInAnyOrderWithBOMAndCRLF(t *testing.T) {
	panels, err := parseTSV(t, "\ufeffSymbol\tPanel_Name\tpanel_code\r\nSCN1A\tEpilepsy\tEPI\r\n")

	require.NoError(t, err)
	assert.Equal(t, []types.GenePanelInput{{Code: "EPI", Name: "Epilepsy", Rows: []types.GenePanelRow{{Line: 2, Symbol: "SCN1A"}}}}, panels)
}

func Test_ParseGenePanelTSV_TrimsFieldsAndSkipsBlankLines(t *testing.T) {
	panels, err := parseTSV(t, "panel_code\tpanel_name\tsymbol\n\n EPI \t Epilepsy \t SCN1A \n\n")

	require.NoError(t, err)
	assert.Equal(t, []types.GenePanelInput{{Code: "EPI", Name: "Epilepsy", Rows: []types.GenePanelRow{{Line: 3, Symbol: "SCN1A"}}}}, panels)
}

func Test_ParseGenePanelTSV_EmptyFile(t *testing.T) {
	_, err := parseTSV(t, "")
	requireFileError(t, err, 0, "file is empty")
}

func Test_ParseGenePanelTSV_HeaderOnly(t *testing.T) {
	_, err := parseTSV(t, "panel_code\tpanel_name\tsymbol\n")
	requireFileError(t, err, 0, "no gene row")
}

func Test_ParseGenePanelTSV_MissingColumn(t *testing.T) {
	_, err := parseTSV(t, "panel_code\tsymbol\nEPI\tSCN1A\n")
	requireFileError(t, err, 1, `missing column "panel_name"`)
}

func Test_ParseGenePanelTSV_UnknownColumn(t *testing.T) {
	_, err := parseTSV(t, "panel_code\tpanel_name\tsymbol\tnote\nEPI\tEpilepsy\tSCN1A\tx\n")
	requireFileError(t, err, 1, `unknown column "note"`)
}

func Test_ParseGenePanelTSV_DuplicateColumn(t *testing.T) {
	_, err := parseTSV(t, "panel_code\tpanel_name\tsymbol\tSYMBOL\nEPI\tEpilepsy\tSCN1A\tSCN1A\n")
	requireFileError(t, err, 1, `duplicate column "symbol"`)
}

func Test_ParseGenePanelTSV_CommaSeparatedFileIsOneUnknownColumn(t *testing.T) {
	_, err := parseTSV(t, "panel_code,panel_name,symbol\nEPI,Epilepsy,SCN1A\n")
	requireFileError(t, err, 1, "unknown column")
}

func Test_ParseGenePanelTSV_RowWithWrongColumnCount(t *testing.T) {
	_, err := parseTSV(t, "panel_code\tpanel_name\tsymbol\nEPI\tEpilepsy\n")
	requireFileError(t, err, 2, "row has 2 columns, header has 3")
}

func Test_ParseGenePanelTSV_BadPanelCode(t *testing.T) {
	_, err := parseTSV(t, "panel_code\tpanel_name\tsymbol\nEPI LEPSY\tEpilepsy\tSCN1A\n")
	requireFileError(t, err, 2, `panel_code "EPI LEPSY"`)
}

func Test_ParseGenePanelTSV_EmptyPanelCode(t *testing.T) {
	_, err := parseTSV(t, "panel_code\tpanel_name\tsymbol\n\tEpilepsy\tSCN1A\n")
	requireFileError(t, err, 2, `panel_code ""`)
}

func Test_ParseGenePanelTSV_EmptyPanelName(t *testing.T) {
	_, err := parseTSV(t, "panel_code\tpanel_name\tsymbol\nEPI\t\tSCN1A\n")
	requireFileError(t, err, 2, "panel_name is empty")
}

func Test_ParseGenePanelTSV_EmptySymbol(t *testing.T) {
	_, err := parseTSV(t, "panel_code\tpanel_name\tsymbol\nEPI\tEpilepsy\t \n")
	requireFileError(t, err, 2, "symbol is empty")
}

func Test_ParseGenePanelTSV_BadEnsemblID(t *testing.T) {
	_, err := parseTSV(t, "panel_code\tpanel_name\tsymbol\tensembl_id\nEPI\tEpilepsy\tSCN1A\tENST00000303395\n")
	requireFileError(t, err, 2, `ensembl_id "ENST00000303395"`)
}

func Test_ParseGenePanelTSV_DuplicateSymbolInPanelIgnoresCase(t *testing.T) {
	_, err := parseTSV(t, "panel_code\tpanel_name\tsymbol\nEPI\tEpilepsy\tSCN1A\nEPI\tEpilepsy\tscn1a\n")
	requireFileError(t, err, 3, `symbol "scn1a" is already in panel_code "EPI" (line 2)`)
}

func Test_ParseGenePanelTSV_DuplicateEnsemblIDInPanel(t *testing.T) {
	_, err := parseTSV(t, "panel_code\tpanel_name\tsymbol\tensembl_id\n"+
		"EPI\tEpilepsy\tSCN1A\tENSG00000144285\n"+
		"EPI\tEpilepsy\tSCN1A_OLD\tENSG00000144285\n")
	requireFileError(t, err, 3, `ensembl_id "ENSG00000144285" is already in panel_code "EPI" (line 2)`)
}

func Test_ParseGenePanelTSV_SameSymbolInTwoPanelsIsAccepted(t *testing.T) {
	panels, err := parseTSV(t, "panel_code\tpanel_name\tsymbol\nEPI\tEpilepsy\tSCN1A\nNEURO\tNeuro\tSCN1A\n")

	require.NoError(t, err)
	assert.Len(t, panels, 2)
}

func Test_ParseGenePanelTSV_TwoPanelsWithSameNameIgnoresCase(t *testing.T) {
	_, err := parseTSV(t, "panel_code\tpanel_name\tsymbol\nEPI\tEpilepsy\tSCN1A\nEPI2\tepilepsy\tKCNQ2\n")
	requireFileError(t, err, 3, `panel_name "epilepsy" is already used by panel_code "EPI"`)
}

func Test_ParseGenePanelTSV_OnePanelCodeWithTwoNames(t *testing.T) {
	_, err := parseTSV(t, "panel_code\tpanel_name\tsymbol\nEPI\tEpilepsy\tSCN1A\nEPI\tEpilepsies\tKCNQ2\n")
	requireFileError(t, err, 3, `panel_code "EPI" has two names`)
}

func Test_ParseGenePanelTSV_PanelCodesThatDifferOnlyByCase(t *testing.T) {
	_, err := parseTSV(t, "panel_code\tpanel_name\tsymbol\nEPI\tEpilepsy\tSCN1A\nepi\tEpilepsy\tKCNQ2\n")
	requireFileError(t, err, 3, `panel_code "epi" differs from "EPI" only by case`)
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
