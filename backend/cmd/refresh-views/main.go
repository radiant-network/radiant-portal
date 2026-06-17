// Command refresh-views re-applies every tenant's StarRocks views — or one tenant's
// with -code — after a schema change. It is idempotent and control-plane only
// (StarRocks DDL + Postgres reads, no Ranger). The API also refreshes on startup
// (see cmd/api/view_refresh.go); this is the manual / break-glass entry point.
//
//	go run ./cmd/refresh-views            # every tenant
//	go run ./cmd/refresh-views -code demo # one tenant
//
// Reads the same env as the API (DB_* for StarRocks, PG* for Postgres).
package main

import (
	"context"
	"flag"
	"log/slog"
	"os"

	_ "github.com/joho/godotenv/autoload"

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

	ctx := context.Background()

	if *code != "" {
		refreshOne(ctx, tenants, views, *code)
		return
	}

	codes, err := service.RefreshAllTenantViews(ctx, tenants, views)
	if err != nil {
		fatal("refresh all views", err)
	}
	slog.Info("refreshed tenant views", slog.Int("tenants", len(codes)), slog.Any("codes", codes))
}

func refreshOne(ctx context.Context, tenants *repository.TenantRepository, views *repository.StarrocksTenantRepository, code string) {
	if err := repository.ValidateTenantCode(code); err != nil {
		fatal("invalid tenant code", err)
	}
	if err := views.EnsureAuthDatabase(ctx); err != nil {
		fatal("ensure auth database", err)
	}
	columns, err := tenants.FederatableColumnsForViews()
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
