package server

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/internal/utils"
)

const (
	keycloakHostEnv        = "KEYCLOAK_HOST"
	keycloakPublicURLEnv   = "KEYCLOAK_PUBLIC_URL"
	keycloakRealmEnv       = "KEYCLOAK_REALM"
	keycloakCliClientIDEnv = "KEYCLOAK_CLI_CLIENT_ID"
	defaultCliClientID     = "radiant-client-cli"
)

// ClientConfigFromEnv reads the client configuration once at startup. KEYCLOAK_PUBLIC_URL
// exists for deployments where KEYCLOAK_HOST is an in-cluster address the end user's
// machine cannot reach.
func ClientConfigFromEnv() types.ClientConfig {
	return types.ClientConfig{
		Auth: types.ClientAuthConfig{
			Method:      types.ClientAuthMethodDevice,
			KeycloakURL: utils.GetEnvOrDefault(keycloakPublicURLEnv, utils.GetEnvOrDefault(keycloakHostEnv, "")),
			Realm:       utils.GetEnvOrDefault(keycloakRealmEnv, ""),
			ClientID:    utils.GetEnvOrDefault(keycloakCliClientIDEnv, defaultCliClientID),
		},
	}
}

// GetClientConfigHandler serves the public client configuration
// @Summary Get public client configuration
// @Id getClientConfig
// @Description Settings a command-line client needs to authenticate (Keycloak device flow). Public, no token required.
// @Tags config
// @Produce json
// @Success 200 {object} types.ClientConfig
// @Router /config [get]
func GetClientConfigHandler(cfg types.ClientConfig) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.JSON(http.StatusOK, cfg)
	}
}
