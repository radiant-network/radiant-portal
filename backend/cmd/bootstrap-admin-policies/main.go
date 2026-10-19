// Command bootstrap-admin-policies applies the cluster-level Ranger policies that aren't
// tied to any tenant. Today that's one grant: it lets the admin users resume a suspended
// warehouse (with Ranger on, "resume" needs the ALTER permission on the warehouse, so
// without it a suspended warehouse can't be brought back). Idempotent, control-plane only —
// run it deliberately, not as part of tenant create/refresh.
//
//	go run ./cmd/bootstrap-admin-policies               # defaults to root,admin
//	go run ./cmd/bootstrap-admin-policies -users root   # a deployment with different admins
//
// Reads RANGER_* env (same as the API / refresh-tenants).
package main

import (
	"context"
	"flag"
	"log/slog"
	"os"
	"strings"

	_ "github.com/joho/godotenv/autoload"

	"github.com/radiant-network/radiant-api/internal/client"
	"github.com/radiant-network/radiant-api/internal/service"
)

func main() {
	usersArg := flag.String("users", "root,admin",
		"comma-separated StarRocks users granted USAGE+ALTER on warehouses (ALTER authorizes resume)")
	flag.Parse()

	users := splitUsers(*usersArg)

	ranger := client.NewRangerAdminClient(client.RangerConfigFromEnv())

	if err := service.BootstrapAdminPolicies(context.Background(), ranger, users); err != nil {
		slog.Error("bootstrap admin policies", slog.Any("error", err))
		os.Exit(1)
	}
	slog.Info("bootstrapped admin policies", slog.Any("users", users))
}

// splitUsers turns the comma-separated -users flag into a trimmed list, dropping blanks.
func splitUsers(s string) []string {
	var users []string
	for _, u := range strings.Split(s, ",") {
		if u = strings.TrimSpace(u); u != "" {
			users = append(users, u)
		}
	}
	return users
}
