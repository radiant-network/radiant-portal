// Command refresh-tenants re-applies the derived StarRocks + Ranger configuration for
// every tenant — or one with -code — after a schema or policy change. It refreshes the
// per-tenant StarRocks views AND the global Ranger PII-masking policies (self-access +
// row-filter on auth.pii_grant, patient column masks) plus each tenant role's nesting
// under the masking-subject marker. Idempotent, control-plane only.
//
// Unlike the API-startup view refresh (cmd/api/view_refresh.go), this needs Ranger admin
// creds, so masking lives here — the manual / break-glass entry point.
//
//	go run ./cmd/refresh-tenants            # every tenant
//	go run ./cmd/refresh-tenants -code demo # one tenant
//
// Reads the same env as the API (DB_* for StarRocks, PG* for Postgres, RANGER_* for Ranger).
package main

import (
	"context"
	"flag"
	"log/slog"
	"os"

	_ "github.com/joho/godotenv/autoload"

	"github.com/radiant-network/radiant-api/internal/client"
	"github.com/radiant-network/radiant-api/internal/database"
	"github.com/radiant-network/radiant-api/internal/repository"
	"github.com/radiant-network/radiant-api/internal/service"
)

func main() {
	code := flag.String("code", "", "tenant code to refresh; refreshes all tenants if omitted")
	flag.Parse()

	pg, err := database.NewPostgresDB()
	if err != nil {
		fatal("connect postgres", err)
	}
	sr, err := database.NewStarrocksDB()
	if err != nil {
		fatal("connect starrocks", err)
	}
	tenants := repository.NewTenantRepository(pg)
	views := repository.NewStarrocksTenantRepository(sr)
	ranger := client.NewRangerAdminClient(client.RangerConfigFromEnv())

	ctx := context.Background()

	codes := []string{*code}
	if *code != "" {
		refreshOne(ctx, tenants, views, *code)
	} else {
		codes, err = service.RefreshAllTenantViews(ctx, tenants, views)
		if err != nil {
			fatal("refresh all views", err)
		}
		slog.Info("refreshed tenant views", slog.Int("tenants", len(codes)), slog.Any("codes", codes))
	}

	if err := service.RefreshMaskingPolicies(ctx, ranger, codes); err != nil {
		fatal("refresh masking policies", err)
	}
	slog.Info("refreshed masking policies", slog.Any("codes", codes))
}

func refreshOne(ctx context.Context, tenants *repository.TenantRepository, views *repository.StarrocksTenantRepository, code string) {
	if err := repository.ValidateTenantCode(code); err != nil {
		fatal("invalid tenant code", err)
	}
	if err := views.EnsureAuthDatabase(ctx); err != nil {
		fatal("ensure auth database", err)
	}
	columns, err := tenants.FederatableColumnsForViews(ctx)
	if err != nil {
		fatal("federatable columns", err)
	}
	if err := views.EnsureClinicalViews(ctx, code, columns); err != nil {
		fatal("refresh views", err)
	}
	slog.Info("refreshed tenant views", slog.String("tenant", code), slog.Int("views", len(repository.ViewTables)))
}

func fatal(msg string, err error) {
	slog.Error(msg, slog.Any("error", err))
	os.Exit(1)
}
