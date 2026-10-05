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
	genePanelColumnCode      = "panel_code"
	genePanelColumnName      = "panel_name"
	genePanelColumnSymbol    = "symbol"
	genePanelColumnEnsemblID = "ensembl_id"
)

var genePanelRequiredColumns = []string{genePanelColumnCode, genePanelColumnName, genePanelColumnSymbol}

// ParseGenePanelTSV reads a gene panel file: UTF-8 TSV, a header row with panel_code, panel_name,
// symbol and an optional ensembl_id, then one row per gene. It returns the panels in file order.
// A bad file gives a *types.GenePanelFileError.
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
	columns, err := genePanelColumns(header)
	if err != nil {
		return nil, err
	}

	var panels []types.GenePanelInput
	byCode := map[string]int{}
	codeByName := map[string]string{}
	geneLines := map[string]int{}
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
		code, name, row, err := genePanelRow(record, columns, line)
		if err != nil {
			return nil, err
		}

		idx, seen := byCode[strings.ToLower(code)]
		if !seen {
			if other, taken := codeByName[strings.ToLower(name)]; taken {
				return nil, &types.GenePanelFileError{Line: line, Message: fmt.Sprintf("panel_name %q is already used by panel_code %q", name, other)}
			}
			idx = len(panels)
			byCode[strings.ToLower(code)] = idx
			codeByName[strings.ToLower(name)] = code
			panels = append(panels, types.GenePanelInput{Code: code, Name: name})
		}
		panel := &panels[idx]
		if panel.Code != code {
			return nil, &types.GenePanelFileError{Line: line, Message: fmt.Sprintf("panel_code %q differs from %q only by case", code, panel.Code)}
		}
		if panel.Name != name {
			return nil, &types.GenePanelFileError{Line: line, Message: fmt.Sprintf("panel_code %q has two names: %q and %q", code, panel.Name, name)}
		}
		if err := checkDuplicateGene(geneLines, panel.Code, row); err != nil {
			return nil, err
		}
		panel.Rows = append(panel.Rows, row)
	}

	if len(panels) == 0 {
		return nil, &types.GenePanelFileError{Message: "file has no gene row"}
	}
	return panels, nil
}

func genePanelColumns(header []string) (map[string]int, error) {
	columns := map[string]int{}
	for i, raw := range header {
		name := strings.ToLower(strings.TrimSpace(raw))
		if i == 0 {
			name = strings.TrimPrefix(name, "\ufeff")
		}
		switch name {
		case genePanelColumnCode, genePanelColumnName, genePanelColumnSymbol, genePanelColumnEnsemblID:
		default:
			return nil, &types.GenePanelFileError{Line: 1, Message: fmt.Sprintf("unknown column %q", raw)}
		}
		if _, dup := columns[name]; dup {
			return nil, &types.GenePanelFileError{Line: 1, Message: fmt.Sprintf("duplicate column %q", name)}
		}
		columns[name] = i
	}
	for _, required := range genePanelRequiredColumns {
		if _, ok := columns[required]; !ok {
			return nil, &types.GenePanelFileError{Line: 1, Message: fmt.Sprintf("missing column %q", required)}
		}
	}
	return columns, nil
}

func genePanelRow(record []string, columns map[string]int, line int) (string, string, types.GenePanelRow, error) {
	field := func(name string) string {
		idx, ok := columns[name]
		if !ok {
			return ""
		}
		return strings.TrimSpace(record[idx])
	}
	code, name := field(genePanelColumnCode), field(genePanelColumnName)
	row := types.GenePanelRow{Line: line, Symbol: field(genePanelColumnSymbol), EnsemblID: strings.ToUpper(field(genePanelColumnEnsemblID))}

	if err := types.ValidateGenePanelCode(code); err != nil {
		return "", "", row, &types.GenePanelFileError{Line: line, Message: err.Error()}
	}
	if name == "" {
		return "", "", row, &types.GenePanelFileError{Line: line, Message: "panel_name is empty"}
	}
	if row.Symbol == "" {
		return "", "", row, &types.GenePanelFileError{Line: line, Message: "symbol is empty"}
	}
	if row.EnsemblID != "" {
		if err := types.ValidateEnsemblGeneID(row.EnsemblID); err != nil {
			return "", "", row, &types.GenePanelFileError{Line: line, Message: err.Error()}
		}
	}
	return code, name, row, nil
}

// checkDuplicateGene rejects a second row with the same symbol or Ensembl ID in one panel. seen
// maps a panel-scoped key to the line that first used it.
func checkDuplicateGene(seen map[string]int, panelCode string, row types.GenePanelRow) error {
	symbolKey := panelCode + "\x00symbol\x00" + strings.ToUpper(row.Symbol)
	if prev, dup := seen[symbolKey]; dup {
		return &types.GenePanelFileError{Line: row.Line, Message: fmt.Sprintf("symbol %q is already in panel_code %q (line %d)", row.Symbol, panelCode, prev)}
	}
	seen[symbolKey] = row.Line
	if row.EnsemblID == "" {
		return nil
	}
	idKey := panelCode + "\x00ensembl_id\x00" + row.EnsemblID
	if prev, dup := seen[idKey]; dup {
		return &types.GenePanelFileError{Line: row.Line, Message: fmt.Sprintf("ensembl_id %q is already in panel_code %q (line %d)", row.EnsemblID, panelCode, prev)}
	}
	seen[idKey] = row.Line
	return nil
}

// readError wraps a failure to read the file. With LazyQuotes and a free field count, encoding/csv
// returns no *csv.ParseError, so a read error is never a bad file.
func readError(err error) error {
	return fmt.Errorf("read gene panel file: %w", err)
}
