// Package provisioning wires the per-system provisioners service.ProvisionUser orchestrates.
//
// It exists as its own package so both cmd/createuser and cmd/api build the same set of
// dependencies from the same environment variables — a user added through the API is provisioned
// identically to one added by the CLI. The wiring cannot live in internal/service, which declares
// the provisioner interfaces and deliberately imports nothing but internal/types.
package provisioning

import (
	"github.com/radiant-network/radiant-api/internal/client"
	"github.com/radiant-network/radiant-api/internal/database"
	"github.com/radiant-network/radiant-api/internal/repository/postgres"
	"github.com/radiant-network/radiant-api/internal/repository/starrocks"
	"github.com/radiant-network/radiant-api/internal/service"
)

// NewAdminDeps reads the Keycloak, Ranger and StarRocks-JWT settings from the environment. The
// clients are lazy — nothing is dialed here — so a deployment that never provisions a user does not
// need them configured, and one that does surfaces a misconfiguration on the call rather than at
// startup.
func NewAdminDeps(pg database.PostgresDB, sr database.StarrocksDB) service.AdminDeps {
	return service.AdminDeps{
		Keycloak:  client.NewKeycloakAdminClient(client.KeycloakConfigFromEnv()),
		Ranger:    client.NewRangerAdminClient(client.RangerConfigFromEnv()),
		Starrocks: starrocks.NewStarrocksUserRepository(sr, starrocks.StarrocksJWTConfigFromEnv()),
		Auth:      postgres.NewAuthRepository(pg),
	}
}
