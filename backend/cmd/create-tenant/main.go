// Command create-tenant creates a tenant (Postgres + StarRocks + Ranger), or with
// -refresh-views re-applies view definitions as a manual/break-glass tool (the API
// already refreshes on startup; see cmd/api/view_refresh.go). Idempotent. Reads the
// same env as the API (DB_* / PG* / RANGER_*).
//
//	go run ./cmd/create-tenant -code demo -name "Demo Hospital" [-dry-run]
//	go run ./cmd/create-tenant -refresh-views [-code demo] [-dry-run]
package main

import (
	"context"
	"flag"
	"fmt"
	"io"
	"log"
	"os"

	_ "github.com/joho/godotenv/autoload"

	"github.com/radiant-network/radiant-api/internal/client"
	"github.com/radiant-network/radiant-api/internal/database"
	"github.com/radiant-network/radiant-api/internal/repository"
	"github.com/radiant-network/radiant-api/internal/service"
	"github.com/radiant-network/radiant-api/internal/types"
)

func main() {
	code := flag.String("code", "", "tenant code; [a-z][a-z0-9_]*")
	name := flag.String("name", "", "tenant display name (required when creating)")
	refreshViews := flag.Bool("refresh-views", false, "re-apply view definitions instead of creating a tenant (all tenants, or just -code)")
	dryRun := flag.Bool("dry-run", false, "print the plan without applying anything")
	flag.Parse()

	ctx := context.Background()

	if *refreshViews {
		runRefresh(ctx, *code, *dryRun)
		return
	}

	if *code == "" || *name == "" {
		log.Fatal("create-tenant: -code and -name are required (or pass -refresh-views)")
	}
	if err := repository.ValidateTenantCode(*code); err != nil {
		log.Fatalf("create-tenant: %v", err)
	}
	if *dryRun {
		cols, err := connectColumnSource()
		if err != nil {
			log.Fatalf("create-tenant: %v", err)
		}
		if err := printCreatePlan(os.Stdout, *code, *name, cols); err != nil {
			log.Fatalf("create-tenant: %v", err)
		}
		return
	}
	deps, err := buildDeps()
	if err != nil {
		log.Fatalf("create-tenant: %v", err)
	}
	if err := service.CreateTenant(ctx, deps, *code, *name); err != nil {
		log.Fatalf("create-tenant: create %q: %v", *code, err)
	}
	log.Printf("created tenant %q (%s): db=%s role=%s policy=%s, %d views",
		*code, *name, types.TenantDatabase(*code), service.RangerTenantRole(*code), service.TenantAccessPolicy(*code),
		len(repository.ViewTables))
}

func runRefresh(ctx context.Context, code string, dryRun bool) {
	if code != "" {
		if err := repository.ValidateTenantCode(code); err != nil {
			log.Fatalf("create-tenant: %v", err)
		}
		if dryRun {
			cols, err := connectColumnSource()
			if err != nil {
				log.Fatalf("create-tenant: %v", err)
			}
			if err := printViews(os.Stdout, code, cols); err != nil {
				log.Fatalf("create-tenant: %v", err)
			}
			return
		}
		deps, err := buildDeps()
		if err != nil {
			log.Fatalf("create-tenant: %v", err)
		}
		if err := deps.Starrocks.EnsureAuthDatabase(ctx); err != nil {
			log.Fatalf("create-tenant: ensure auth database: %v", err)
		}
		columns, err := deps.Columns.FederatableColumnsForViews()
		if err != nil {
			log.Fatalf("create-tenant: federatable columns: %v", err)
		}
		if err := deps.Starrocks.EnsureClinicalViews(ctx, code, columns); err != nil {
			log.Fatalf("create-tenant: refresh views %q: %v", code, err)
		}
		log.Printf("refreshed %d views for tenant %q", len(repository.ViewTables), code)
		return
	}

	deps, err := buildDeps()
	if err != nil {
		log.Fatalf("create-tenant: %v", err)
	}
	codes, err := deps.Lister.ListTenants()
	if err != nil {
		log.Fatalf("create-tenant: list tenants: %v", err)
	}
	if dryRun {
		fmt.Printf("DRY RUN — would refresh views for %d tenant(s): %v\n", len(codes), codes)
		return
	}
	if err := service.RefreshAllTenantViews(ctx, deps.Lister, deps.Columns, deps.Starrocks); err != nil {
		log.Fatalf("create-tenant: refresh all views: %v", err)
	}
	log.Printf("refreshed views for %d tenant(s): %v", len(codes), codes)
}

func printCreatePlan(w io.Writer, code, name string, cols service.ViewColumnSource) error {
	fmt.Fprintf(w, "DRY RUN — plan for tenant %q (%s)\n\n", code, name)

	fmt.Fprintln(w, "Phase A — Postgres (source of truth):")
	fmt.Fprintf(w, "  INSERT INTO public.tenant (code, name) VALUES (%q, %q) ON CONFLICT DO NOTHING\n", code, name)
	for _, r := range repository.DefaultRoles {
		fmt.Fprintf(w, "  seed role %s/%s with actions %v\n", code, r.Code, r.Actions)
	}

	fmt.Fprintln(w, "\nPhase B — StarRocks (control-plane DDL, privileged connection):")
	for _, stmt := range repository.BuildAuthStatements() {
		fmt.Fprintf(w, "  %s;\n", stmt)
	}
	if err := printViews(w, code, cols); err != nil {
		return err
	}

	fmt.Fprintln(w, "\nPhase C — Ranger (gate):")
	fmt.Fprintf(w, "  ensure role %s (empty; membership owned by user provisioning)\n", service.RangerTenantRole(code))
	fmt.Fprintf(w, "  ensure access policy %s → SELECT on %s.* for role %s\n",
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
		fmt.Fprintf(w, "  %s;\n", stmt)
	}
	return nil
}

func connectColumnSource() (service.ViewColumnSource, error) {
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
		Lister:    tenantRepo,
		Columns:   tenantRepo,
		Starrocks: repository.NewStarrocksTenantRepository(sr),
		Ranger:    client.NewRangerAdminClient(client.RangerConfigFromEnv()),
	}, nil
}
