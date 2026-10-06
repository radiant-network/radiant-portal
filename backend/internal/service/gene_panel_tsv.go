package service

import (
	"encoding/csv"
	"errors"
	"fmt"
	"io"
	"strings"

	"github.com/radiant-network/radiant-api/internal/types"
)

// ParseGenePanelTSV reads a gene panel file: UTF-8 TSV with a header row, then one row per gene. The
// first column holds the gene symbols (its header is free text). Each other column is one panel,
// named by its header, with true or false in each row (any case; an empty cell is false). It returns
// the panels in column order, each with the rows marked true. A bad file gives a
// *types.GenePanelFileError.
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
	panels, err := genePanelColumns(header)
	if err != nil {
		return nil, err
	}

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
		row := types.GenePanelRow{Line: line, Symbol: strings.TrimSpace(record[0])}
		if row.Symbol == "" {
			return nil, &types.GenePanelFileError{Line: line, Message: "symbol is empty"}
		}
		if prev, dup := lineBySymbol[strings.ToUpper(row.Symbol)]; dup {
			return nil, &types.GenePanelFileError{Line: line, Message: fmt.Sprintf("symbol %q is already on line %d", row.Symbol, prev)}
		}
		lineBySymbol[strings.ToUpper(row.Symbol)] = line

		for i := range panels {
			in, err := genePanelCell(record[i+1])
			if err != nil {
				return nil, &types.GenePanelFileError{Line: line, Message: fmt.Sprintf("panel %q: %s", panels[i].Name, err)}
			}
			if in {
				panels[i].Rows = append(panels[i].Rows, row)
			}
		}
	}

	if len(lineBySymbol) == 0 {
		return nil, &types.GenePanelFileError{Message: "file has no gene row"}
	}
	return panels, nil
}

// genePanelColumns reads the panels from the header: one per column after the symbol column. Two
// names that give the same panel code (e.g. that differ only by case) are rejected.
func genePanelColumns(header []string) ([]types.GenePanelInput, error) {
	if len(header) < 2 {
		return nil, &types.GenePanelFileError{Line: 1, Message: "header needs the symbol column and at least one panel column"}
	}
	panels := make([]types.GenePanelInput, 0, len(header)-1)
	nameByCode := map[string]string{}
	for i, raw := range header[1:] {
		name := strings.TrimSpace(raw)
		if name == "" {
			return nil, &types.GenePanelFileError{Line: 1, Message: fmt.Sprintf("column %d has no panel name", i+2)}
		}
		code, err := types.GenePanelCodeFromName(name)
		if err != nil {
			return nil, &types.GenePanelFileError{Line: 1, Message: err.Error()}
		}
		if other, dup := nameByCode[code]; dup {
			return nil, &types.GenePanelFileError{Line: 1, Message: fmt.Sprintf("panels %q and %q are the same panel (code %s)", other, name, code)}
		}
		nameByCode[code] = name
		panels = append(panels, types.GenePanelInput{Code: code, Name: name})
	}
	return panels, nil
}

func genePanelCell(value string) (bool, error) {
	switch strings.ToLower(strings.TrimSpace(value)) {
	case "true":
		return true, nil
	case "false", "":
		return false, nil
	default:
		return false, fmt.Errorf("%q is not true or false", value)
	}
}

// readError wraps a failure to read the file. With LazyQuotes and a free field count, encoding/csv
// returns no *csv.ParseError, so a read error is never a bad file.
func readError(err error) error {
	return fmt.Errorf("read gene panel file: %w", err)
}
