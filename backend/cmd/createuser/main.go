// Command createuser provisions a regular (non-admin) user end-to-end across
// Keycloak, Postgres, Ranger, and StarRocks, keyed on the Keycloak `sub`.
//
//	# Seed the three demo users (alice/bob/wendy) used by backend/compose:
//	go run ./cmd/createuser
//
//	# Provision a single ad-hoc user:
//	go run ./cmd/createuser -email carol@demo.org -first Carol -last Demo \
//	    -grant tenant_a:ORG_A1:geneticist -grant tenant_b:*:geneticist
//
// It assumes the scaffolding already exists (tenants/orgs/roles in Postgres via
// 01_seed_postgres.sql, the tenant_*_user roles + policies in Ranger via
// 03_ranger_policies.py). It only creates the per-user records. Every step is
// idempotent, so re-running converges.
package main

import (
	"context"
	"flag"
	"fmt"
	"log"
	"os"
	"strings"

	_ "github.com/joho/godotenv/autoload"
	"gorm.io/driver/mysql"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"

	"github.com/radiant-network/radiant-api/internal/client"
	"github.com/radiant-network/radiant-api/internal/repository"
	"github.com/radiant-network/radiant-api/internal/service"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/internal/utils"
)

// demoUsers mirrors the grants previously seeded by 01_seed_postgres.sql.
var demoUsers = []types.UserInput{
	{Username: "alice", Email: "alice@demo.org", FirstName: "Alice", LastName: "Demo",
		Grants: []types.Grant{{TenantCode: "tenant_a", OrgCode: "ORG_A1", RoleCode: "geneticist"}}},
	{Username: "bob", Email: "bob@demo.org", FirstName: "Bob", LastName: "Demo",
		Grants: []types.Grant{{TenantCode: "tenant_b", OrgCode: "ORG_B1", RoleCode: "geneticist"}}},
	{Username: "wendy", Email: "wendy@demo.org", FirstName: "Wendy", LastName: "Demo",
		Grants: []types.Grant{{TenantCode: "tenant_a", OrgCode: "*", RoleCode: "geneticist"}}},
}

// grantList collects repeated -grant tenant:org:role flags.
type grantList []types.Grant

func (g *grantList) String() string { return fmt.Sprintf("%v", *g) }

func (g *grantList) Set(value string) error {
	parts := strings.Split(value, ":")
	if len(parts) != 3 {
		return fmt.Errorf("grant %q must be tenant:org:role (org may be empty or '*')", value)
	}
	*g = append(*g, types.Grant{TenantCode: parts[0], OrgCode: parts[1], RoleCode: parts[2]})
	return nil
}

func main() {
	var (
		email    = flag.String("email", "", "user email (PK). If empty, the demo users alice/bob/wendy are provisioned.")
		username = flag.String("username", "", "Keycloak username (defaults to the local part of -email)")
		first    = flag.String("first", "", "first name")
		last     = flag.String("last", "", "last name")
		password = flag.String("password", utils.GetEnvOrDefault("USER_PASSWORD", "radiant123!"), "user password")
		grants   grantList
	)
	flag.Var(&grants, "grant", "tenant:org:role grant; repeatable")
	flag.Parse()

	deps, err := buildDeps()
	if err != nil {
		log.Fatalf("createuser: %v", err)
	}

	users := demoUsers
	if *email != "" {
		name := *username
		if name == "" {
			name = strings.SplitN(*email, "@", 2)[0]
		}
		users = []types.UserInput{{
			Username: name, Email: *email, FirstName: *first, LastName: *last,
			Password: *password, Grants: grants,
		}}
	} else {
		// Demo users share the configured password.
		for i := range users {
			users[i].Password = *password
		}
	}

	ctx := context.Background()
	for _, in := range users {
		sub, err := service.ProvisionUser(ctx, deps, in)
		if err != nil {
			log.Fatalf("createuser: provision %q: %v", in.Email, err)
		}
		log.Printf("provisioned %s (sub=%s) with %d grant(s)", in.Email, sub, len(in.Grants))
	}
	log.Printf("done: %d user(s) provisioned", len(users))
}

// buildDeps wires the per-system provisioners from environment configuration.
//
// This is a local demo-seeding command, so the connections default to the
// backend/compose stack and env vars only override. We build the GORM handles
// here rather than via database.NewPostgresDB/NewStarrocksDB on purpose: those
// read their connection settings into package-level vars at init time (with no
// defaults), so a `.env` isn't required to run this against compose.
func buildDeps() (service.AdminDeps, error) {
	pg, err := openPostgres()
	if err != nil {
		return service.AdminDeps{}, fmt.Errorf("connect postgres: %w", err)
	}
	sr, err := openStarrocks()
	if err != nil {
		return service.AdminDeps{}, fmt.Errorf("connect starrocks: %w", err)
	}
	return service.AdminDeps{
		Keycloak:  client.NewKeycloakAdminClient(client.KeycloakConfigFromEnv()),
		Ranger:    client.NewRangerAdminClient(client.RangerConfigFromEnv()),
		Starrocks: repository.NewStarrocksUserRepository(sr, repository.StarrocksJWTConfigFromEnv()),
		Auth:      repository.NewAuthRepository(pg),
	}, nil
}

func openPostgres() (*gorm.DB, error) {
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=%s",
		utils.GetEnvOrDefault("PGHOST", "localhost"),
		utils.GetEnvOrDefault("PGUSER", "radiant"),
		utils.GetEnvOrDefault("PGPASSWORD", "radiant"),
		utils.GetEnvOrDefault("PGDATABASE", "radiant"),
		utils.GetEnvOrDefault("PGPORT", "5432"),
		utils.GetEnvOrDefault("PGSSLMODE", "disable"))
	return gorm.Open(postgres.Open(dsn), &gorm.Config{})
}

func openStarrocks() (*gorm.DB, error) {
	// StarRocks rejects insecure transport (SSL enabled on the compose stack), so
	// default to TLS without cert validation — the Go-driver equivalent of the
	// `--ssl-mode=PREFERRED` that starrocks-connect.sh uses for the auto-signed
	// cert. Override with DB_TLS (e.g. a registered CA config, or "false" to disable).
	tlsParam := ""
	if tls := utils.GetEnvOrDefault("DB_TLS", "skip-verify"); tls != "" && tls != "false" {
		tlsParam = "&tls=" + tls
	}
	// CREATE USER is a global statement, so no default database is needed.
	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?interpolateParams=true&parseTime=true%s",
		utils.GetEnvOrDefault("DB_USERNAME", "root"),
		os.Getenv("DB_PASSWORD"),
		utils.GetEnvOrDefault("DB_HOST", "127.0.0.1"),
		utils.GetEnvOrDefault("DB_PORT", "9030"),
		os.Getenv("DB_NAME"),
		tlsParam)
	return gorm.Open(mysql.Open(dsn), &gorm.Config{})
}
