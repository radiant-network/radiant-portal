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
	"log"

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
		log.Fatalf("refresh-views: connect postgres: %v", err)
	}
	sr, err := database.NewStarrocksDB()
	if err != nil {
		log.Fatalf("refresh-views: connect starrocks: %v", err)
	}
	tenants := repository.NewTenantRepository(pg)
	views := repository.NewStarrocksTenantRepository(sr)

	ctx := context.Background()

	if *code != "" {
		refreshOne(ctx, tenants, views, *code)
		return
	}

	codes, err := service.RefreshAllTenantViews(ctx, tenants, tenants, views)
	if err != nil {
		log.Fatalf("refresh-views: %v", err)
	}
	log.Printf("refreshed views for %d tenant(s): %v", len(codes), codes)
}

func refreshOne(ctx context.Context, tenants *repository.TenantRepository, views *repository.StarrocksTenantRepository, code string) {
	if err := repository.ValidateTenantCode(code); err != nil {
		log.Fatalf("refresh-views: %v", err)
	}
	if err := views.EnsureAuthDatabase(ctx); err != nil {
		log.Fatalf("refresh-views: ensure auth database: %v", err)
	}
	columns, err := tenants.FederatableColumnsForViews()
	if err != nil {
		log.Fatalf("refresh-views: federatable columns: %v", err)
	}
	if err := views.EnsureClinicalViews(ctx, code, columns); err != nil {
		log.Fatalf("refresh-views: %q: %v", code, err)
	}
	log.Printf("refreshed %d views for tenant %q", len(repository.ViewTables), code)
}
