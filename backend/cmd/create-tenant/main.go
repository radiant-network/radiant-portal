// Command create-tenant creates a tenant across Postgres, StarRocks, and Ranger.
// Idempotent. Reads the same env as the API (DB_* / PG* / RANGER_*). To re-apply a
// tenant's views after a schema change, use cmd/refresh-views instead.
//
//	go run ./cmd/create-tenant -code demo -name "Demo Hospital" [-dry-run]
package main

import (
	"context"
	"flag"
	"fmt"
	"io"
	"log/slog"
	"os"

	_ "github.com/joho/godotenv/autoload"

	"github.com/radiant-network/radiant-api/internal/client"
	"github.com/radiant-network/radiant-api/internal/database"
	"github.com/radiant-network/radiant-api/internal/repository"
	"github.com/radiant-network/radiant-api/internal/service"
	"github.com/radiant-network/radiant-api/internal/types"
)

func main() {
	code := flag.String("code", "", "tenant code (required); [a-z][a-z0-9_]*")
	name := flag.String("name", "", "tenant display name (required)")
	dryRun := flag.Bool("dry-run", false, "print the plan without applying anything")
	flag.Parse()

	if *code == "" || *name == "" {
		slog.Error("missing required flags: -code and -name")
		os.Exit(1)
	}
	if err := repository.ValidateTenantCode(*code); err != nil {
		fatal("invalid tenant code", err)
	}

	ctx := context.Background()

	if *dryRun {
		pg, err := connectPostgres()
		if err != nil {
			fatal("connect postgres", err)
		}
		if err := printCreatePlan(os.Stdout, *code, *name, pg); err != nil {
			fatal("print plan", err)
		}
		return
	}

	deps, err := buildDeps()
	if err != nil {
		fatal("build dependencies", err)
	}
	if err := service.CreateTenant(ctx, deps, *code, *name); err != nil {
		fatal("create tenant", err)
	}
	slog.Info("created tenant",
		slog.String("code", *code),
		slog.String("name", *name),
		slog.String("db", types.TenantDatabase(*code)),
		slog.String("role", service.RangerTenantRole(*code)),
		slog.String("policy", service.TenantAccessPolicy(*code)),
		slog.Int("views", len(repository.ViewTables)))
}

func fatal(msg string, err error) {
	slog.Error(msg, slog.Any("error", err))
	os.Exit(1)
}

// fprintf writes a dry-run plan line, ignoring the write error: a failure printing
// to stdout is not actionable, and the meaningful errors are returned separately.
func fprintf(w io.Writer, format string, a ...any) {
	_, _ = fmt.Fprintf(w, format, a...)
}

func printCreatePlan(w io.Writer, code, name string, cols service.ViewColumnSource) error {
	fprintf(w, "DRY RUN — plan for tenant %q (%s)\n\n", code, name)

	fprintf(w, "Phase A — Postgres (source of truth):\n")
	fprintf(w, "  INSERT INTO public.tenant (code, name) VALUES (%q, %q) ON CONFLICT DO NOTHING\n", code, name)
	for _, r := range repository.DefaultRoles {
		fprintf(w, "  seed role %s/%s with actions %v\n", code, r.Code, r.Actions)
	}

	fprintf(w, "\nPhase B — StarRocks (control-plane DDL, privileged connection):\n")
	for _, stmt := range repository.BuildAuthStatements() {
		fprintf(w, "  %s;\n", stmt)
	}
	if err := printViews(w, code, cols); err != nil {
		return err
	}

	fprintf(w, "\nPhase C — Ranger (gate):\n")
	fprintf(w, "  ensure role %s (empty; membership owned by user provisioning)\n", service.RangerTenantRole(code))
	fprintf(w, "  ensure access policy %s → SELECT on %s.* for role %s\n",
		service.TenantAccessPolicy(code), types.TenantDatabase(code), service.RangerTenantRole(code))
	return nil
}

func printViews(w io.Writer, code string, cols service.ViewColumnSource) error {
	columns, err := cols.FederatableColumnsForViews()
	if err != nil {
		return err
	}
	stmts, err := repository.BuildViewStatements(code, columns)
	if err != nil {
		return err
	}
	for _, stmt := range stmts {
		fprintf(w, "  %s;\n", stmt)
	}
	return nil
}

// connectPostgres opens just the Postgres handle, enough for the dry-run plan without
// connecting to StarRocks or Ranger.
func connectPostgres() (*repository.TenantRepository, error) {
	pg, err := database.NewPostgresDB()
	if err != nil {
		return nil, fmt.Errorf("connect postgres: %w", err)
	}
	return repository.NewTenantRepository(pg), nil
}

func buildDeps() (service.TenantDeps, error) {
	pg, err := database.NewPostgresDB()
	if err != nil {
		return service.TenantDeps{}, fmt.Errorf("connect postgres: %w", err)
	}
	sr, err := database.NewStarrocksDB()
	if err != nil {
		return service.TenantDeps{}, fmt.Errorf("connect starrocks: %w", err)
	}
	tenantRepo := repository.NewTenantRepository(pg)
	return service.TenantDeps{
		Store:     tenantRepo,
		Columns:   tenantRepo,
		Starrocks: repository.NewStarrocksTenantRepository(sr),
		Ranger:    client.NewRangerAdminClient(client.RangerConfigFromEnv()),
	}, nil
}
