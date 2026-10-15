// Command bootstrap-admin-policies applies the cluster-level Ranger policies that aren't
// tied to any tenant. Today that's one grant: it lets root/admin resume a suspended
// warehouse (with Ranger on, "resume" needs the ALTER permission on the warehouse, so
// without it a suspended warehouse can't be brought back). Idempotent, control-plane only —
// run it deliberately, not as part of tenant create/refresh.
//
//	go run ./cmd/bootstrap-admin-policies
//
// Reads RANGER_* env (same as the API / refresh-tenants).
package main

import (
	"context"
	"log/slog"
	"os"

	_ "github.com/joho/godotenv/autoload"

	"github.com/radiant-network/radiant-api/internal/client"
	"github.com/radiant-network/radiant-api/internal/service"
)

func main() {
	ranger := client.NewRangerAdminClient(client.RangerConfigFromEnv())

	if err := service.BootstrapAdminPolicies(context.Background(), ranger); err != nil {
		slog.Error("bootstrap admin policies", slog.Any("error", err))
		os.Exit(1)
	}
	slog.Info("bootstrapped admin policies")
}
