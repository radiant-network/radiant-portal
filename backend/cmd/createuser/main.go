// Command createuser provisions a regular (non-admin) user end-to-end across
// Keycloak, Postgres, Ranger, and StarRocks, keyed on the Keycloak `sub`.
//
//	go run ./cmd/createuser -email carol@demo.org -first Carol -last Demo \
//	    -grant tenant_a:ORG_A1:geneticist -grant tenant_b:*:geneticist
//
// The realm is configured with email-as-username, so the email is sent as the
// Keycloak username verbatim — the CLI never derives a separate username.
package main

import (
	"context"
	"flag"
	"fmt"
	"log"
	"os"
	"strings"

	_ "github.com/joho/godotenv/autoload"
	"golang.org/x/term"

	"github.com/radiant-network/radiant-api/internal/client"
	"github.com/radiant-network/radiant-api/internal/database"
	"github.com/radiant-network/radiant-api/internal/repository"
	"github.com/radiant-network/radiant-api/internal/service"
	"github.com/radiant-network/radiant-api/internal/types"
)

// grantedBy is the audit attribution recorded on role grants made by this CLI.
const grantedBy = "createuser"

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
		email  = flag.String("email", "", "user email (PK and Keycloak username); required")
		first  = flag.String("first", "", "first name")
		last   = flag.String("last", "", "last name")
		prompt = flag.Bool("p", false, "prompt for the user password (masked); ignored if USER_PASSWORD is set")
		grants grantList
	)
	flag.Var(&grants, "grant", "tenant:org:role grant; repeatable")
	flag.Parse()

	if *email == "" {
		log.Fatal("createuser: -email is required")
	}

	password, err := resolvePassword(*prompt)
	if err != nil {
		log.Fatalf("createuser: %v", err)
	}

	deps, err := buildDeps()
	if err != nil {
		log.Fatalf("createuser: %v", err)
	}

	// The realm uses email-as-username, so the email is the Keycloak username.
	in := types.UserInput{
		Username: *email, Email: *email, FirstName: *first, LastName: *last,
		Password: password, Grants: grants,
	}

	ctx := context.Background()
	sub, err := service.ProvisionUser(ctx, deps, in, grantedBy)
	if err != nil {
		log.Fatalf("createuser: provision %q: %v", in.Email, err)
	}
	log.Printf("provisioned %s (sub=%s) with %d grant(s)", in.Email, sub, len(in.Grants))
}

// resolvePassword determines the password applied to every provisioned user.
// USER_PASSWORD wins if set (an explicitly empty value is honored); otherwise, if
// -p was given, it prompts for a masked password (which may be empty); otherwise
// the password is empty.
func resolvePassword(prompt bool) (string, error) {
	if pw, ok := os.LookupEnv("USER_PASSWORD"); ok {
		return pw, nil
	}
	if prompt {
		return promptPassword()
	}
	return "", nil
}

// promptPassword reads a password from the terminal without echoing it.
func promptPassword() (string, error) {
	fmt.Fprint(os.Stderr, "Password: ")
	b, err := term.ReadPassword(int(os.Stdin.Fd()))
	fmt.Fprintln(os.Stderr)
	if err != nil {
		return "", fmt.Errorf("read password: %w", err)
	}
	return string(b), nil
}

// buildDeps wires the per-system provisioners from environment configuration.
//
// The Postgres and StarRocks handles come from database.NewPostgresDB/NewStarrocksDB,
// which read their connection settings from the environment (loaded from `.env` via
// godotenv/autoload). Against the compose stack, set DB_SSL_MODE=skip-verify so the
// StarRocks connection uses TLS without cert validation (the stack enables SSL).
func buildDeps() (service.AdminDeps, error) {
	pg, err := database.NewPostgresDB()
	if err != nil {
		return service.AdminDeps{}, fmt.Errorf("connect postgres: %w", err)
	}
	sr, err := database.NewStarrocksDB()
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
