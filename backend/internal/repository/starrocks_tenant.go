package repository

import (
	"bytes"
	"context"
	"embed"
	"fmt"
	"log"
	"strings"
	"text/template"

	"github.com/radiant-network/radiant-api/internal/types"
	"gorm.io/gorm"
)

//go:embed views/*.sql views/*.sql.tmpl
var viewFS embed.FS

// ViewTables are the tables a tenant gets a view for: tenant-scoped tables the API
// reads through the radiant_jdbc federation (those with a FederationName). A table
// with a views/<table>.sql.tmpl (e.g. patient, for its can_read_pii flag) is rendered
// from that template; the rest get a generated SELECT. Tables that are tenant-scoped
// but NOT federated (batch, user_set) are intentionally absent — the API never reads
// them via StarRocks.
var ViewTables = []string{
	"patient",
	"organization", "cases", "sample", "sequencing_experiment",
	"analysis_catalog", "document", "family", "family_history",
	"interpretation_germline", "interpretation_germline_history",
	"interpretation_somatic", "interpretation_somatic_history",
	"obs_categorical", "obs_string", "occurrence_flag", "occurrence_note",
	"panel", "project", "task",
}

// FederatableColumnSource yields the federatable columns per table (see
// TenantRepository.FederatableColumns).
type FederatableColumnSource interface {
	FederatableColumns(tables []string) (map[string][]string, error)
}

type StarrocksTenantRepository struct {
	db   *gorm.DB
	cols FederatableColumnSource
}

func NewStarrocksTenantRepository(db *gorm.DB, cols FederatableColumnSource) *StarrocksTenantRepository {
	if db == nil {
		log.Print("StarrocksTenantRepository: db is nil")
		return nil
	}
	return &StarrocksTenantRepository{db: db, cols: cols}
}

// EnsureAuthDatabase creates the global auth database and pii_grant view — the PII
// masking source shared by every tenant, not tenant-specific. Must run before any
// tenant's patient view (which references auth.pii_grant). Idempotent.
func (r *StarrocksTenantRepository) EnsureAuthDatabase(ctx context.Context) error {
	for _, stmt := range BuildAuthStatements() {
		if err := r.db.WithContext(ctx).Exec(stmt).Error; err != nil {
			return fmt.Errorf("ensure auth database: %w", err)
		}
	}
	return nil
}

func (r *StarrocksTenantRepository) EnsureClinicalViews(ctx context.Context, tenantCode string) error {
	if err := ValidateTenantCode(tenantCode); err != nil {
		return err
	}
	columns, err := r.cols.FederatableColumns(ViewTables)
	if err != nil {
		return fmt.Errorf("federatable columns for %q: %w", tenantCode, err)
	}
	stmts, err := BuildViewStatements(tenantCode, columns)
	if err != nil {
		return err
	}
	for _, stmt := range stmts {
		if err := r.db.WithContext(ctx).Exec(stmt).Error; err != nil {
			return fmt.Errorf("ensure views for %q: %w", tenantCode, err)
		}
	}
	return nil
}

// BuildAuthStatements builds the global auth database + pii_grant view DDL.
func BuildAuthStatements() []string {
	return []string{
		"CREATE DATABASE IF NOT EXISTS auth",
		"DROP VIEW IF EXISTS auth.pii_grant",
		readView("auth_pii_grant.sql"),
	}
}

// BuildViewStatements builds the idempotent (DROP+CREATE) DDL for a tenant's database
// and views, projecting only federatable columns (SELECT * breaks on jsonb/uuid the
// JDBC catalog can't map). A table with views/<table>.sql.tmpl uses that template
// (e.g. patient's can_read_pii flag); the rest get a generated SELECT. A StarRocks
// view is NOT a Ranger access boundary — isolation comes from the DB-level access
// policy plus per-tenant base data, not the WHERE clause.
func BuildViewStatements(tenantCode string, columns map[string][]string) ([]string, error) {
	if err := ValidateTenantCode(tenantCode); err != nil {
		return nil, err
	}
	db := types.TenantDatabase(tenantCode)
	stmts := []string{fmt.Sprintf("CREATE DATABASE IF NOT EXISTS `%s`", db)}
	for _, t := range ViewTables {
		cols := columns[t]
		if len(cols) == 0 {
			continue
		}
		view, err := buildViewStatement(db, tenantCode, t, cols)
		if err != nil {
			return nil, err
		}
		stmts = append(stmts, fmt.Sprintf("DROP VIEW IF EXISTS `%s`.`%s`", db, t), view)
	}
	return stmts, nil
}

// viewTemplates holds the parsed views/<table>.sql.tmpl files, keyed by table name.
// Loaded once at init so "does this table have a template?" is a deterministic map
// lookup (not inferred from a read error), and a malformed template fails fast at
// startup rather than silently degrading to a generated view.
var viewTemplates = loadViewTemplates()

func loadViewTemplates() map[string]*template.Template {
	entries, err := viewFS.ReadDir("views")
	if err != nil {
		panic("read embedded views dir: " + err.Error())
	}
	templates := map[string]*template.Template{}
	for _, e := range entries {
		table, ok := strings.CutSuffix(e.Name(), ".sql.tmpl")
		if !ok {
			continue
		}
		raw := readView(e.Name())
		templates[table] = template.Must(template.New(table).Parse(raw))
	}
	return templates
}

// buildViewStatement renders the table's template when one exists, else generates a
// tenant-filtered projection of the federatable columns.
func buildViewStatement(db, tenantCode, table string, cols []string) (string, error) {
	tmpl, found := viewTemplates[table]
	if !found {
		return fmt.Sprintf("CREATE VIEW `%s`.`%s` AS SELECT %s FROM radiant_jdbc.public.`%s` WHERE tenant_code = '%s'",
			db, table, joinColumns(cols), table, tenantCode), nil
	}
	var buf bytes.Buffer
	if err := tmpl.Execute(&buf, map[string]string{
		"DB":         db,
		"TenantCode": tenantCode,
		"Columns":    joinColumns(cols),
	}); err != nil {
		return "", fmt.Errorf("render view template %q: %w", table, err)
	}
	return buf.String(), nil
}

// readView returns an embedded view file. The file is guaranteed present by the
// embed directive above, so a read error is a build/programming fault.
func readView(name string) string {
	b, err := viewFS.ReadFile("views/" + name)
	if err != nil {
		panic("missing embedded view " + name + ": " + err.Error())
	}
	return string(b)
}

func joinColumns(cols []string) string {
	quoted := make([]string, len(cols))
	for i, c := range cols {
		quoted[i] = "`" + c + "`"
	}
	return strings.Join(quoted, ", ")
}
