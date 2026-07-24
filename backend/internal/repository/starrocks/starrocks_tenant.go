package starrocks

import (
	"bytes"
	"context"
	"embed"
	"fmt"
	"log"
	"slices"
	"strings"
	"text/template"

	"github.com/radiant-network/radiant-api/internal/database"
	"github.com/radiant-network/radiant-api/internal/types"
	"gorm.io/gorm"
)

//go:embed views/*.sql views/*.sql.tmpl
var viewFS embed.FS

type StarrocksTenantRepository struct {
	db *gorm.DB
}

func NewStarrocksTenantRepository(db database.StarrocksDB) *StarrocksTenantRepository {
	if db.DB == nil {
		log.Print("StarrocksTenantRepository: db is nil")
		return nil
	}
	return &StarrocksTenantRepository{db: db.DB}
}

func (r *StarrocksTenantRepository) EnsureAuthDatabase(ctx context.Context) error {
	for _, stmt := range BuildAuthStatements() {
		if err := r.db.WithContext(ctx).Exec(stmt).Error; err != nil {
			return fmt.Errorf("ensure auth database: %w", err)
		}
	}
	return nil
}

func (r *StarrocksTenantRepository) EnsureClinicalViews(ctx context.Context, tenantCode string, columns map[string][]string) error {
	if err := types.ValidateTenantCode(tenantCode); err != nil {
		return err
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
		readView("auth_pii_grant.sql"),
	}
}

// BuildViewStatements builds the idempotent DDL for a tenant's database and views,
// projecting only federatable columns (SELECT * breaks on jsonb/uuid the JDBC catalog
// can't map). Each view is CREATE OR REPLACE (atomic; replaces a stale definition on
// refresh without a DROP→CREATE gap). A table with views/<table>.sql.tmpl uses that
// template (e.g. patient's can_read_pii flag); the rest get a generated SELECT.
func BuildViewStatements(tenantCode string, columns map[string][]string) ([]string, error) {
	if err := types.ValidateTenantCode(tenantCode); err != nil {
		return nil, err
	}
	db := types.TenantDatabase(tenantCode)
	stmts := []string{fmt.Sprintf("CREATE DATABASE IF NOT EXISTS `%s`", db)}
	for _, t := range types.ViewTables {
		cols := columns[t]
		if len(cols) == 0 {
			continue
		}
		view, err := buildViewStatement(db, tenantCode, t, cols)
		if err != nil {
			return nil, err
		}
		stmts = append(stmts, view)
	}
	return stmts, nil
}

// viewTemplates holds the parsed views/<table>.sql.tmpl files, keyed by table name.
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

func buildViewStatement(db, tenantCode, table string, cols []string) (string, error) {
	tmpl, found := viewTemplates[table]
	if !found {
		// Filter to the tenant only when the table is tenant-scoped (has tenant_code).
		// Reference/enum tables and junctions have no tenant_code → exposed unfiltered.
		where := ""
		if slices.Contains(cols, "tenant_code") {
			where = fmt.Sprintf(" WHERE tenant_code = '%s'", tenantCode)
		}
		return fmt.Sprintf("CREATE OR REPLACE VIEW `%s`.`%s` AS SELECT %s FROM radiant_jdbc.public.`%s`%s",
			db, table, joinColumns(cols), table, where), nil
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
