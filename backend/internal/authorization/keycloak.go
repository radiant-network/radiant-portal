package authorization

import (
	"os"

	"github.com/gin-gonic/gin"
	"github.com/tbaehler/gin-keycloak/pkg/ginkeycloak"
)

// NewKeyCloakAuthorizer authenticates the bearer token against the Keycloak realm
// (signature + validity) and sets it on the context. It does not restrict by role —
// per-route authorization is enforced by the tenant/action middlewares.
func NewKeyCloakAuthorizer() (gin.HandlerFunc, error) {
	keycloakConfig := ginkeycloak.KeycloakConfig{
		Url:   os.Getenv("KEYCLOAK_HOST"),
		Realm: os.Getenv("KEYCLOAK_REALM"),
	}
	return ginkeycloak.Auth(ginkeycloak.AuthCheck(), keycloakConfig), nil
}
