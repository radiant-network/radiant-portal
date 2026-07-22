package repository

import (
	"context"
	"fmt"
	"log"
	"regexp"

	"github.com/radiant-network/radiant-api/internal/database"
	"gorm.io/gorm"
)

var tenantCodePattern = regexp.MustCompile(`^[a-z][a-z0-9_]{0,48}[a-z0-9]$`)

func ValidateTenantCode(code string) error {
	if !tenantCodePattern.MatchString(code) {
		return fmt.Errorf("invalid tenant code %q: must match %s", code, tenantCodePattern.String())
	}
	return nil
}

type roleSeed struct {
	Code        string
	Name        string
	Description string
	Actions     []string
}

var DefaultRoles = []roleSeed{
	{"member", "Member", "Search cases and view the knowledge base.",
		[]string{"can_search_case", "can_view_kb"}},
	{"geneticist", "Geneticist", "Read PII, download files, and interpret, comment on, and flag variants.",
		[]string{"can_read_pii", "can_interpret_variant", "can_comment_variant", "can_flag_variant", "can_download_file"}},
	{"data_manager", "Data Manager", "Submit batches (cases, patients, samples, sequencing).",
		[]string{"can_ingest_data"}},
}

type TenantRepository struct {
	db *gorm.DB
}

func NewTenantRepository(db database.PostgresDB) *TenantRepository {
	if db.DB == nil {
		log.Print("TenantRepository: db is nil")
		return nil
	}
	return &TenantRepository{db: db.DB}
}

func (r *TenantRepository) ListTenants(ctx context.Context) ([]string, error) {
	var codes []string
	if err := r.db.WithContext(ctx).Raw(`SELECT code FROM public.tenant ORDER BY code`).Scan(&codes).Error; err != nil {
		return nil, fmt.Errorf("list tenants: %w", err)
	}
	return codes, nil
}

// unsupportedFederationTypes are Postgres column types the StarRocks JDBC catalog
// cannot map, so they are excluded.
var unsupportedFederationTypes = []string{"json", "jsonb", "uuid"}

// FederatableColumns returns, per table, the columns whose types the radiant_jdbc
// catalog can read (ordinal order).
func (r *TenantRepository) FederatableColumnsForViews(ctx context.Context) (map[string][]string, error) {
	return r.FederatableColumns(ctx, ViewTables)
}

func (r *TenantRepository) FederatableColumns(ctx context.Context, tables []string) (map[string][]string, error) {
	var rows []struct {
		TableName  string
		ColumnName string
	}
	err := r.db.WithContext(ctx).Raw(`
		SELECT table_name, column_name
		FROM information_schema.columns
		WHERE table_schema = 'public' AND table_name IN ? AND data_type NOT IN ?
		ORDER BY table_name, ordinal_position`,
		tables, unsupportedFederationTypes).Scan(&rows).Error
	if err != nil {
		return nil, fmt.Errorf("fetch federatable columns: %w", err)
	}
	cols := make(map[string][]string, len(tables))
	for _, row := range rows {
		cols[row.TableName] = append(cols[row.TableName], row.ColumnName)
	}
	return cols, nil
}

func (r *TenantRepository) EnsureTenant(ctx context.Context, code, name string) error {
	if err := ValidateTenantCode(code); err != nil {
		return err
	}
	err := r.db.WithContext(ctx).Exec(`
		INSERT INTO public.tenant (code, name)
		VALUES (?, ?)
		ON CONFLICT (code) DO NOTHING`,
		code, name).Error
	if err != nil {
		return fmt.Errorf("ensure tenant %q: %w", code, err)
	}
	return nil
}

func (r *TenantRepository) SeedDefaultRoles(ctx context.Context, tenantCode string) error {
	if err := ValidateTenantCode(tenantCode); err != nil {
		return err
	}
	return r.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		for _, role := range DefaultRoles {
			if err := tx.Exec(`
				INSERT INTO public.role (tenant_code, code, name, description)
				VALUES (?, ?, ?, ?)
				ON CONFLICT (tenant_code, code) DO NOTHING`,
				tenantCode, role.Code, role.Name, role.Description).Error; err != nil {
				return fmt.Errorf("seed role %s/%s: %w", tenantCode, role.Code, err)
			}
			for _, action := range role.Actions {
				if err := tx.Exec(`
					INSERT INTO public.role_action (tenant_code, role_code, action_code)
					VALUES (?, ?, ?)
					ON CONFLICT (tenant_code, role_code, action_code) DO NOTHING`,
					tenantCode, role.Code, action).Error; err != nil {
					return fmt.Errorf("seed role_action %s/%s/%s: %w", tenantCode, role.Code, action, err)
				}
			}
		}
		return nil
	})
}
