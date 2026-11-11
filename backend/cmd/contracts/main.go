// Command contracts writes the data contracts (ODCS v3.2.0) of the StarRocks objects the portal publishes
// in each tenant database, for the readers of these objects (the MCP):
//
//   - one view per table of types.ViewTables, built by starrocks.BuildViewStatements over the columns
//     postgres.TenantRepository.FederatableColumnsForViews returns, as `refresh-tenants` does;
//   - the gene panel materialized view (starrocks.BuildGenePanelMVStatement);
//   - the clinical PCX views of scripts/seed/views and scripts/pcx_tables/access_controlled_views.
//
// The contracts are hand-edited by the backend, the owner (descriptions, the columns it publishes). This command
// scaffolds the contract of a view that has none yet, and never overwrites one; with -check it fails when a contract
// names a view, a column or a type the code no longer creates (a column of the view left out is not published).
//
// The federatable columns come from a PostgreSQL migrated with scripts/init-sql/migrations: a throwaway
// container (Docker), or the database of -dsn.
//
//	go run ./cmd/contracts [-out contracts] [-dsn postgres://...] [view ...]   # scaffold the missing contracts
//	go run ./cmd/contracts -check [-out contracts] [-dsn postgres://...]       # contracts ⊆ the views
package main

import (
	"context"
	"flag"
	"fmt"
	"log"
	"net/url"
	"os"
	"path/filepath"
	"slices"
	"sort"
	"strings"
	"time"

	"github.com/radiant-network/radiant-api/internal/database"
	"github.com/radiant-network/radiant-api/internal/repository/postgres"
	"github.com/radiant-network/radiant-api/internal/repository/starrocks"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/testcontainers/testcontainers-go"
	"github.com/testcontainers/testcontainers-go/wait"
	pgdriver "gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

const (
	// Any valid tenant code: the contracts are the same for every tenant.
	sampleTenant  = "contract"
	migrations    = "scripts/init-sql/migrations"
	postgresImage = "postgres:17-alpine"
	header        = "# Owned by the backend: the source of truth for this view, hand-edited (moon run backend:contracts-check).\n" +
		"# Scaffolded by `go run ./cmd/contracts`: add the descriptions, remove the columns no reader should use.\n"
)

// PCX views: SQL templates applied outside the Go code, read as files.
var pcxViewDirs = []string{"scripts/seed/views", "scripts/pcx_tables/access_controlled_views"}

func main() {
	out := flag.String("out", "contracts", "contracts directory (starrocks/tenant/*.odcs.yaml under it)")
	dsn := flag.String("dsn", "", "PostgreSQL to read the columns from, already migrated (default: a throwaway container)")
	verify := flag.Bool("check", false, "check the contracts against the views instead of scaffolding")
	flag.Parse()
	log.SetFlags(0)
	ctx := context.Background()

	if *dsn == "" {
		stop, containerDSN, err := startPostgres(ctx)
		if err != nil {
			log.Fatalf("start postgres: %v", err)
		}
		defer stop()
		*dsn = containerDSN
		if err := migrate(containerDSN); err != nil {
			log.Fatalf("migrate: %v", err)
		}
	}
	db, err := gorm.Open(pgdriver.Open(*dsn), &gorm.Config{Logger: logger.Discard})
	if err != nil {
		log.Fatalf("open postgres: %v", err)
	}

	contracts, err := build(ctx, db)
	if err != nil {
		log.Fatal(err)
	}
	dir := filepath.Join(*out, "starrocks", "tenant")

	if *verify {
		problems, unpublished, err := check(*out, contracts)
		if err != nil {
			log.Fatal(err)
		}
		for _, p := range problems {
			fmt.Println("  ✗ " + p)
		}
		fmt.Printf("%d views, %d without a contract (not published), %d mismatch(es)\n",
			len(contracts), len(unpublished), len(problems))
		if len(problems) > 0 {
			os.Exit(1)
		}
		return
	}

	written, kept, err := scaffold(*out, contracts, flag.Args())
	if err != nil {
		log.Fatal(err)
	}
	for _, name := range written {
		fmt.Printf("  + %s\n", filepath.Join(dir, name+".odcs.yaml"))
	}
	fmt.Printf("%d contract(s) scaffolded, %d kept as they are (hand-edited, never overwritten)\n", len(written), len(kept))
}

func build(ctx context.Context, db *gorm.DB) ([]Contract, error) {
	columns, err := postgres.NewTenantRepository(database.PostgresDB{DB: db}).FederatableColumnsForViews(ctx)
	if err != nil {
		return nil, err
	}
	pgTypes, err := postgresTypes(db)
	if err != nil {
		return nil, err
	}
	var contracts []Contract

	// The views refresh-tenants creates, from the same statements.
	stmts, err := starrocks.BuildViewStatements(sampleTenant, columns)
	if err != nil {
		return nil, err
	}
	for _, stmt := range stmts[1:] { // [0] is CREATE DATABASE
		view, err := parseView(stmt)
		if err != nil {
			return nil, err
		}
		purpose := fmt.Sprintf("Rows of the portal's PostgreSQL table public.%s (through radiant_jdbc)", view.Name)
		if slices.Contains(columns[view.Name], "tenant_code") {
			purpose += " of the tenant"
		} else {
			purpose += ", every tenant (no tenant_code)"
		}
		purpose += "; json, jsonb and uuid columns are not exposed (the JDBC catalog cannot map them)."
		contracts = append(contracts, newContract(view, "view", purpose,
			"internal/repository/starrocks/starrocks_tenant.go", pgTypes[view.Name]))
	}
	for _, table := range types.ViewTables {
		if len(columns[table]) == 0 {
			return nil, fmt.Errorf("ViewTables lists %s, which has no federatable column after the migrations", table)
		}
	}

	mv, err := starrocks.BuildGenePanelMVStatement(sampleTenant)
	if err != nil {
		return nil, err
	}
	view, err := parseView(mv)
	if err != nil {
		return nil, err
	}
	contracts = append(contracts, newContract(view, "materialized_view",
		"Distinct (panel, gene symbol) pairs of the tenant's gene panels, refreshed by the portal.",
		"internal/repository/starrocks/starrocks_tenant.go", nil))

	for _, dir := range pcxViewDirs {
		files, err := filepath.Glob(filepath.Join(dir, "*.sql.tmpl"))
		if err != nil {
			return nil, err
		}
		for _, file := range files {
			raw, err := os.ReadFile(file)
			if err != nil {
				return nil, err
			}
			view, err := parseView(strings.ReplaceAll(string(raw), "{{.TenantCode}}", sampleTenant))
			if err != nil {
				return nil, fmt.Errorf("%s: %w", file, err)
			}
			contracts = append(contracts, newContract(view, "view",
				"Clinical PCX view of the tenant, access controlled.", file, nil))
		}
	}
	sort.Slice(contracts, func(i, j int) bool { return contracts[i].Name < contracts[j].Name })
	return contracts, nil
}

// postgresTypes returns table -> column -> PostgreSQL type (arrays as `<element>[]`).
func postgresTypes(db *gorm.DB) (map[string]map[string]string, error) {
	var rows []struct {
		TableName, ColumnName, DataType, UdtName string
	}
	err := db.Raw(`SELECT table_name, column_name, data_type, udt_name FROM information_schema.columns
		WHERE table_schema = 'public' AND table_name IN ?`, types.ViewTables).Scan(&rows).Error
	if err != nil {
		return nil, fmt.Errorf("read postgres types: %w", err)
	}
	out := map[string]map[string]string{}
	for _, r := range rows {
		if out[r.TableName] == nil {
			out[r.TableName] = map[string]string{}
		}
		t := r.DataType
		if t == "ARRAY" {
			t = strings.TrimPrefix(r.UdtName, "_") + "[]"
		}
		out[r.TableName][r.ColumnName] = t
	}
	return out, nil
}

// -- PostgreSQL -------------------------------------------------------------------------------------------

// startPostgres starts a throwaway PostgreSQL. It is not named after the test containers
// (postgres_radiant): starting it never touches a local stack or a running test.
func startPostgres(ctx context.Context) (func(), string, error) {
	container, err := testcontainers.GenericContainer(ctx, testcontainers.GenericContainerRequest{
		ContainerRequest: testcontainers.ContainerRequest{
			Image:        postgresImage,
			ExposedPorts: []string{"5432/tcp"},
			Env:          map[string]string{"POSTGRES_USER": "radiant", "POSTGRES_PASSWORD": "radiant", "POSTGRES_DB": "radiant"},
			WaitingFor: wait.ForLog("database system is ready to accept connections").
				WithOccurrence(2).WithStartupTimeout(60 * time.Second),
		},
		Started: true,
	})
	if err != nil {
		return nil, "", err
	}
	stop := func() { _ = container.Terminate(context.Background()) }
	host, err := container.Host(ctx)
	if err != nil {
		stop()
		return nil, "", err
	}
	port, err := container.MappedPort(ctx, "5432")
	if err != nil {
		stop()
		return nil, "", err
	}
	return stop, fmt.Sprintf("postgres://radiant:radiant@%s:%s/radiant?sslmode=disable", host, port.Port()), nil
}

// migrate applies the portal migrations with the API's own migration code.
func migrate(dsn string) error {
	u, err := url.Parse(dsn)
	if err != nil {
		return err
	}
	password, _ := u.User.Password()
	path, err := filepath.Abs(migrations)
	if err != nil {
		return err
	}
	// Exits the process when a migration fails; false only means there was nothing to apply.
	database.MigrateWithParams("file://"+path, u.Hostname(), u.Port(), strings.TrimPrefix(u.Path, "/"),
		u.User.Username(), password, "disable", "")
	return nil
}
