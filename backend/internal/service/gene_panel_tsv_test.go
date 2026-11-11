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

func Test_ParseGenePanelTSV_GroupsGenesByPanelCodeInOrderOfFirstRow(t *testing.T) {
	panels, err := parseTSV(t, "symbol\tpanels\tversion\n"+
		"AAAS\tPOLYM,RGDIEP\tPOLYM_v1,RGDIEP_v2\n"+
		"AARS1\tEPILEP,POLYM\tEPILEP_v2,POLYM_v1\n")

	require.NoError(t, err)
	assert.Equal(t, []types.GenePanelInput{
		{Code: "POLYM", Name: "POLYM", Rows: []types.GenePanelRow{{Line: 2, Symbol: "AAAS"}, {Line: 3, Symbol: "AARS1"}}},
		{Code: "RGDIEP", Name: "RGDIEP", Rows: []types.GenePanelRow{{Line: 2, Symbol: "AAAS"}}},
		{Code: "EPILEP", Name: "EPILEP", Rows: []types.GenePanelRow{{Line: 3, Symbol: "AARS1"}}},
	}, panels)
}

func Test_ParseGenePanelTSV_VersionColumnIsOptionalAndIgnored(t *testing.T) {
	panels, err := parseTSV(t, "symbol\tpanels\nAAAS\tPOLYM\n")

	require.NoError(t, err)
	assert.Equal(t, []types.GenePanelInput{{Code: "POLYM", Name: "POLYM", Rows: []types.GenePanelRow{{Line: 2, Symbol: "AAAS"}}}}, panels)
}

func Test_ParseGenePanelTSV_FindsColumnsByNameInAnyOrderWithBOMAndCRLF(t *testing.T) {
	panels, err := parseTSV(t, byteOrderMark+"Panels\tVersion\tSymbol\r\nPOLYM\tPOLYM_v1\tAAAS\r\n")

	require.NoError(t, err)
	assert.Equal(t, []types.GenePanelInput{{Code: "POLYM", Name: "POLYM", Rows: []types.GenePanelRow{{Line: 2, Symbol: "AAAS"}}}}, panels)
}

func Test_ParseGenePanelTSV_TrimsCodesAndSkipsEmptyAndRepeatedOnes(t *testing.T) {
	panels, err := parseTSV(t, "symbol\tpanels\n AAAS \t POLYM , ,POLYM,\n")

	require.NoError(t, err)
	assert.Equal(t, []types.GenePanelInput{{Code: "POLYM", Name: "POLYM", Rows: []types.GenePanelRow{{Line: 2, Symbol: "AAAS"}}}}, panels)
}

func Test_ParseGenePanelTSV_GeneInNoPanelIsAccepted(t *testing.T) {
	panels, err := parseTSV(t, "symbol\tpanels\nAAAS\t\nAARS1\tPOLYM\n")

	require.NoError(t, err)
	assert.Equal(t, []types.GenePanelInput{{Code: "POLYM", Name: "POLYM", Rows: []types.GenePanelRow{{Line: 3, Symbol: "AARS1"}}}}, panels)
}

func Test_ParseGenePanelTSV_EmptyFile(t *testing.T) {
	_, err := parseTSV(t, "")
	requireFileError(t, err, 0, "file is empty")
}

func Test_ParseGenePanelTSV_HeaderOnly(t *testing.T) {
	_, err := parseTSV(t, "symbol\tpanels\n")
	requireFileError(t, err, 0, "no gene row")
}

func Test_ParseGenePanelTSV_NoRowNamesAPanel(t *testing.T) {
	_, err := parseTSV(t, "symbol\tpanels\nAAAS\t\n")
	requireFileError(t, err, 0, "file names no panel")
}

func Test_ParseGenePanelTSV_MissingSymbolColumn(t *testing.T) {
	_, err := parseTSV(t, "gene\tpanels\nAAAS\tPOLYM\n")
	requireFileError(t, err, 1, `missing column "symbol"`)
}

func Test_ParseGenePanelTSV_MissingPanelsColumn(t *testing.T) {
	_, err := parseTSV(t, "symbol\tversion\nAAAS\tPOLYM_v1\n")
	requireFileError(t, err, 1, `missing column "panels"`)
}

func Test_ParseGenePanelTSV_DuplicateSymbolColumn(t *testing.T) {
	_, err := parseTSV(t, "symbol\tpanels\tSYMBOL\nAAAS\tPOLYM\tAAAS\n")
	requireFileError(t, err, 1, `duplicate column "symbol"`)
}

func Test_ParseGenePanelTSV_DuplicatePanelsColumn(t *testing.T) {
	_, err := parseTSV(t, "symbol\tpanels\tpanels\nAAAS\tPOLYM\tPOLYM\n")
	requireFileError(t, err, 1, `duplicate column "panels"`)
}

func Test_ParseGenePanelTSV_CommaSeparatedFileHasNoSymbolColumn(t *testing.T) {
	_, err := parseTSV(t, "symbol,panels\nAAAS,POLYM\n")
	requireFileError(t, err, 1, `missing column "symbol"`)
}

func Test_ParseGenePanelTSV_RowWithWrongColumnCount(t *testing.T) {
	_, err := parseTSV(t, "symbol\tpanels\tversion\nAAAS\tPOLYM\n")
	requireFileError(t, err, 2, "row has 2 columns, header has 3")
}

func Test_ParseGenePanelTSV_EmptySymbol(t *testing.T) {
	_, err := parseTSV(t, "symbol\tpanels\n \tPOLYM\n")
	requireFileError(t, err, 2, "symbol is empty")
}

func Test_ParseGenePanelTSV_DuplicateSymbolIgnoresCase(t *testing.T) {
	_, err := parseTSV(t, "symbol\tpanels\nAAAS\tPOLYM\naaas\tRGDIEP\n")
	requireFileError(t, err, 3, `symbol "aaas" is already on line 2`)
}

func Test_ParseGenePanelTSV_BadPanelCode(t *testing.T) {
	_, err := parseTSV(t, "symbol\tpanels\nAAAS\tPOLYM,EPI LEP\n")
	requireFileError(t, err, 2, `panel code "EPI LEP"`)
}

func Test_ParseGenePanelTSV_PanelCodesThatDifferOnlyByCase(t *testing.T) {
	_, err := parseTSV(t, "symbol\tpanels\nAAAS\tPOLYM\nAARS1\tpolym\n")
	requireFileError(t, err, 3, `panel code "polym" differs from "POLYM" only by case`)
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
