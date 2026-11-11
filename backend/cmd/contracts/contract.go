package main

import (
	"fmt"
	"os"
	"path/filepath"
	"regexp"
	"strings"

	"gopkg.in/yaml.v3"
)

// View is a CREATE VIEW / CREATE MATERIALIZED VIEW statement: its name and the names of its columns.
type View struct {
	Name    string
	Columns []string
}

var createView = regexp.MustCompile(
	"(?is)CREATE\\s+(?:OR\\s+REPLACE\\s+)?(?:MATERIALIZED\\s+)?VIEW\\s+(?:IF\\s+NOT\\s+EXISTS\\s+)?(?:`?\\w+`?\\.)?`?(\\w+)`?.*?\\bAS\\s+SELECT\\s+(?:DISTINCT\\s+)?")

var (
	lineComment  = regexp.MustCompile(`--[^\n]*`)
	blockComment = regexp.MustCompile(`(?s)/\*.*?\*/`)
	trailingAs   = regexp.MustCompile("(?is)\\bAS\\s+`?(\\w+)`?\\s*$")
	identifier   = regexp.MustCompile("`?([A-Za-z_]\\w*)`?\\s*$")
)

// parseView reads the name and the output columns of a view: the aliases of its top-level select list.
// StarRocks syntax (catalog.schema.table, lambdas, CAST AS INT) is out of reach of the MySQL parsers;
// only the select list is read, so nothing else needs to parse.
func parseView(sql string) (View, error) {
	sql = blockComment.ReplaceAllString(lineComment.ReplaceAllString(sql, ""), "")
	m := createView.FindStringSubmatchIndex(sql)
	if m == nil {
		return View{}, fmt.Errorf("no CREATE VIEW ... AS SELECT found")
	}
	name := sql[m[2]:m[3]]
	var columns []string
	for _, item := range splitTopLevel(untilTopLevelFrom(sql[m[1]:])) {
		item = strings.TrimSpace(item)
		col := ""
		if a := trailingAs.FindStringSubmatch(item); a != nil {
			col = a[1]
		} else if a := identifier.FindStringSubmatch(item); a != nil {
			col = a[1] // `t.col` or `col`
		}
		if col == "" || col == "*" {
			return View{}, fmt.Errorf("view %s: cannot name the select item %q (give it an alias)", name, item)
		}
		columns = append(columns, col)
	}
	return View{Name: name, Columns: columns}, nil
}

// untilTopLevelFrom cuts the select list at the FROM of the same level (subqueries have their own).
func untilTopLevelFrom(body string) string {
	depth, quote := 0, byte(0)
	upper := strings.ToUpper(body)
	for i := 0; i < len(body); i++ {
		c := body[i]
		switch {
		case quote != 0:
			if c == quote {
				quote = 0
			}
		case c == '\'' || c == '"' || c == '`':
			quote = c
		case c == '(':
			depth++
		case c == ')':
			depth--
		case depth == 0 && strings.HasPrefix(upper[i:], "FROM") && wordBoundary(body, i, 4):
			return body[:i]
		}
	}
	return body
}

func wordBoundary(s string, i, n int) bool {
	isWord := func(b byte) bool {
		return b == '_' || b >= '0' && b <= '9' || b >= 'A' && b <= 'Z' || b >= 'a' && b <= 'z'
	}
	return (i == 0 || !isWord(s[i-1])) && (i+n >= len(s) || !isWord(s[i+n]))
}

// splitTopLevel splits on the commas outside parentheses and quotes.
func splitTopLevel(s string) []string {
	var parts []string
	depth, quote, start := 0, byte(0), 0
	for i := 0; i < len(s); i++ {
		c := s[i]
		switch {
		case quote != 0:
			if c == quote {
				quote = 0
			}
		case c == '\'' || c == '"' || c == '`':
			quote = c
		case c == '(':
			depth++
		case c == ')':
			depth--
		case c == ',' && depth == 0:
			parts = append(parts, s[start:i])
			start = i + 1
		}
	}
	return append(parts, s[start:])
}

// -- ODCS ------------------------------------------------------------------------------------------------

type Contract struct {
	APIVersion  string       `yaml:"apiVersion"`
	Kind        string       `yaml:"kind"`
	ID          string       `yaml:"id"`
	Name        string       `yaml:"name"`
	Version     string       `yaml:"version"`
	Status      string       `yaml:"status"`
	Domain      string       `yaml:"domain"`
	DataProduct string       `yaml:"dataProduct"`
	Description Description  `yaml:"description"`
	Team        []TeamMember `yaml:"team"`
	Servers     []Server     `yaml:"servers"`
	Schema      []Schema     `yaml:"schema"`
	Definitions []AuthDef    `yaml:"authoritativeDefinitions"`
}

type Description struct {
	Purpose string `yaml:"purpose"`
}

type TeamMember struct {
	Username string `yaml:"username"`
	Role     string `yaml:"role"`
}

type Server struct {
	Server   string `yaml:"server"`
	Type     string `yaml:"type"`
	Host     string `yaml:"host"`
	Port     int    `yaml:"port"`
	Database string `yaml:"database"`
}

type Schema struct {
	Name         string     `yaml:"name"`
	PhysicalName string     `yaml:"physicalName"`
	PhysicalType string     `yaml:"physicalType"`
	Tags         []string   `yaml:"tags"`
	Properties   []Property `yaml:"properties"`
}

type Property struct {
	Name             string           `yaml:"name"`
	LogicalType      string           `yaml:"logicalType,omitempty"`
	CustomProperties []CustomProperty `yaml:"customProperties,omitempty"`
}

type CustomProperty struct {
	Property string `yaml:"property"`
	Value    any    `yaml:"value"` // a string, or a list in a hand-edited contract
}

type AuthDef struct {
	Type string `yaml:"type"`
	URL  string `yaml:"url"`
}

// newContract builds the contract of a view; pgTypes (column -> PostgreSQL type) types its columns when known.
func newContract(view View, kind, purpose, source string, pgTypes map[string]string) Contract {
	props := make([]Property, 0, len(view.Columns))
	for _, col := range view.Columns {
		p := Property{Name: col}
		if t, ok := pgTypes[col]; ok {
			p.LogicalType = logicalType(t)
			p.CustomProperties = []CustomProperty{{Property: "postgresType", Value: t}}
		}
		props = append(props, p)
	}
	return Contract{
		APIVersion:  "v3.2.0",
		Kind:        "DataContract",
		ID:          "radiant.starrocks.tenant." + view.Name,
		Name:        view.Name,
		Version:     "0.1.0",
		Status:      "draft",
		Domain:      "clinical",
		DataProduct: "radiant-portal-tenant",
		Description: Description{Purpose: purpose},
		Team:        []TeamMember{{"radiant-portal", "producer"}, {"radiant-mcp", "consumer"}},
		Servers:     []Server{{"starrocks", "mysql", "starrocks", 9030, "{tenant}_tenant"}},
		Schema: []Schema{{
			Name: view.Name, PhysicalName: view.Name, PhysicalType: kind,
			Tags: []string{"per-tenant"}, Properties: props,
		}},
		Definitions: []AuthDef{{Type: "implementation", URL: "backend:" + filepath.ToSlash(source)}},
	}
}

// logicalType maps an information_schema data_type to an ODCS logical type.
func logicalType(pg string) string {
	switch {
	case strings.HasSuffix(pg, "[]"):
		return "array"
	case pg == "smallint", pg == "integer", pg == "bigint":
		return "integer"
	case pg == "numeric", pg == "real", pg == "double precision":
		return "number"
	case pg == "boolean":
		return "boolean"
	case strings.HasPrefix(pg, "timestamp"):
		return "timestamp"
	case pg == "date":
		return "date"
	default:
		return "string"
	}
}

// scaffold writes the contract of each view that has none yet in out/starrocks/tenant (all of them when names is
// empty). An existing contract is hand-edited: it is never overwritten.
func scaffold(out string, contracts []Contract, names []string) (written, kept []string, err error) {
	dir := filepath.Join(out, "starrocks", "tenant")
	if err := os.MkdirAll(dir, 0o755); err != nil {
		return nil, nil, err
	}
	byName := map[string]Contract{}
	for _, c := range contracts {
		byName[c.Name] = c
	}
	if len(names) == 0 {
		for _, c := range contracts {
			names = append(names, c.Name)
		}
	}
	for _, name := range names {
		c, ok := byName[name]
		if !ok {
			return written, kept, fmt.Errorf("%s: the portal creates no such view in a tenant database", name)
		}
		path := filepath.Join(dir, name+".odcs.yaml")
		if _, err := os.Stat(path); err == nil {
			kept = append(kept, name)
			continue
		}
		var b strings.Builder
		b.WriteString(header)
		enc := yaml.NewEncoder(&b)
		enc.SetIndent(2)
		if err := enc.Encode(c); err != nil {
			return written, kept, err
		}
		if err := os.WriteFile(path, []byte(b.String()), 0o644); err != nil {
			return written, kept, err
		}
		written = append(written, name)
	}
	return written, kept, nil
}

// check compares the hand-edited contracts of dir with the views the code creates: every contracted view and column
// must exist, with the same logical type when the generator knows it. A column of the view left out of its contract
// is fine: it is not published.
func check(dir string, generated []Contract) (problems, unpublished []string, err error) {
	views := map[string]map[string]Property{}
	for _, c := range generated {
		views[c.Name] = map[string]Property{}
		for _, p := range c.Schema[0].Properties {
			views[c.Name][p.Name] = p
		}
	}
	files, err := filepath.Glob(filepath.Join(dir, "starrocks", "tenant", "*.odcs.yaml"))
	if err != nil {
		return nil, nil, err
	}
	contracted := map[string]bool{}
	for _, f := range files {
		raw, err := os.ReadFile(f)
		if err != nil {
			return nil, nil, err
		}
		var c Contract
		if err := yaml.Unmarshal(raw, &c); err != nil {
			return nil, nil, fmt.Errorf("%s: %w", f, err)
		}
		if len(c.Schema) == 0 {
			problems = append(problems, fmt.Sprintf("%s: no schema", filepath.Base(f)))
			continue
		}
		name := c.Schema[0].Name
		contracted[name] = true
		cols, ok := views[name]
		if !ok {
			problems = append(problems, fmt.Sprintf("%s: the portal creates no such view (dropped or renamed?)", name))
			continue
		}
		for _, p := range c.Schema[0].Properties {
			got, ok := cols[p.Name]
			switch {
			case !ok:
				problems = append(problems, fmt.Sprintf("%s.%s: in the contract, not in the view", name, p.Name))
			case p.LogicalType != "" && got.LogicalType != "" && p.LogicalType != got.LogicalType:
				problems = append(problems, fmt.Sprintf("%s.%s: logicalType %s in the contract, %s in the view",
					name, p.Name, p.LogicalType, got.LogicalType))
			}
		}
	}
	for _, c := range generated {
		if !contracted[c.Name] {
			unpublished = append(unpublished, c.Name)
		}
	}
	return problems, unpublished, nil
}
