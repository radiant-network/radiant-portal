package service

import (
	"encoding/csv"
	"errors"
	"fmt"
	"io"
	"strings"

	"github.com/radiant-network/radiant-api/internal/types"
)

const (
	genePanelColumnSymbol = "symbol"
	genePanelColumnPanels = "panels"
)

// byteOrderMark is U+FEFF, which Excel writes at the start of a UTF-8 file.
var byteOrderMark = string(rune(0xFEFF))

// ParseGenePanelTSV reads a gene panel file: UTF-8 TSV with a header row, then one row per gene. The
// `symbol` column holds the gene symbol, the `panels` column the comma-separated codes of the panels
// the gene is in. Other columns (such as `version`) are ignored. It returns the panels in the order
// of their first row, each named by its code. A bad file gives a *types.GenePanelFileError.
func ParseGenePanelTSV(r io.Reader) ([]types.GenePanelInput, error) {
	reader := csv.NewReader(r)
	reader.Comma = '\t'
	reader.FieldsPerRecord = -1
	reader.LazyQuotes = true

	header, err := reader.Read()
	if errors.Is(err, io.EOF) {
		return nil, &types.GenePanelFileError{Message: "file is empty"}
	}
	if err != nil {
		return nil, readError(err)
	}
	symbolCol, panelsCol, err := genePanelColumns(header)
	if err != nil {
		return nil, err
	}

	var panels []types.GenePanelInput
	panelByCode := map[string]int{}
	lineBySymbol := map[string]int{}
	for {
		record, err := reader.Read()
		if errors.Is(err, io.EOF) {
			break
		}
		if err != nil {
			return nil, readError(err)
		}
		line, _ := reader.FieldPos(0)
		if len(record) != len(header) {
			return nil, &types.GenePanelFileError{Line: line, Message: fmt.Sprintf("row has %d columns, header has %d", len(record), len(header))}
		}
		row := types.GenePanelRow{Line: line, Symbol: strings.TrimSpace(record[symbolCol])}
		if row.Symbol == "" {
			return nil, &types.GenePanelFileError{Line: line, Message: "symbol is empty"}
		}
		if prev, dup := lineBySymbol[strings.ToUpper(row.Symbol)]; dup {
			return nil, &types.GenePanelFileError{Line: line, Message: fmt.Sprintf("symbol %q is already on line %d", row.Symbol, prev)}
		}
		lineBySymbol[strings.ToUpper(row.Symbol)] = line

		inRow := map[int]bool{}
		for _, raw := range strings.Split(record[panelsCol], ",") {
			code := strings.TrimSpace(raw)
			if code == "" {
				continue
			}
			if err := types.ValidateGenePanelCode(code); err != nil {
				return nil, &types.GenePanelFileError{Line: line, Message: err.Error()}
			}
			idx, seen := panelByCode[strings.ToUpper(code)]
			if !seen {
				idx = len(panels)
				panelByCode[strings.ToUpper(code)] = idx
				panels = append(panels, types.GenePanelInput{Code: code, Name: code})
			}
			if panels[idx].Code != code {
				return nil, &types.GenePanelFileError{Line: line, Message: fmt.Sprintf("panel code %q differs from %q only by case", code, panels[idx].Code)}
			}
			if !inRow[idx] {
				inRow[idx] = true
				panels[idx].Rows = append(panels[idx].Rows, row)
			}
		}
	}

	if len(lineBySymbol) == 0 {
		return nil, &types.GenePanelFileError{Message: "file has no gene row"}
	}
	if len(panels) == 0 {
		return nil, &types.GenePanelFileError{Message: "file names no panel"}
	}
	return panels, nil
}

// genePanelColumns finds the symbol and panels columns by header name, ignoring case.
func genePanelColumns(header []string) (int, int, error) {
	symbolCol, panelsCol := -1, -1
	for i, raw := range header {
		name := strings.ToLower(strings.TrimSpace(raw))
		if i == 0 {
			name = strings.TrimPrefix(name, byteOrderMark)
		}
		switch name {
		case genePanelColumnSymbol:
			if symbolCol >= 0 {
				return 0, 0, &types.GenePanelFileError{Line: 1, Message: `duplicate column "symbol"`}
			}
			symbolCol = i
		case genePanelColumnPanels:
			if panelsCol >= 0 {
				return 0, 0, &types.GenePanelFileError{Line: 1, Message: `duplicate column "panels"`}
			}
			panelsCol = i
		}
	}
	if symbolCol < 0 {
		return 0, 0, &types.GenePanelFileError{Line: 1, Message: `missing column "symbol"`}
	}
	if panelsCol < 0 {
		return 0, 0, &types.GenePanelFileError{Line: 1, Message: `missing column "panels"`}
	}
	return symbolCol, panelsCol, nil
}

// readError wraps a failure to read the file. With LazyQuotes and a free field count, encoding/csv
// returns no *csv.ParseError, so a read error is never a bad file.
func readError(err error) error {
	return fmt.Errorf("read gene panel file: %w", err)
}
