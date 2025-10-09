package authorization

import (
	"os"

	"github.com/gin-gonic/gin"
	"github.com/tbaehler/gin-keycloak/pkg/ginkeycloak"
)

func NewKeyCloakAuthorizer() (gin.HandlerFunc, error) {
	var keycloakConfig = ginkeycloak.BuilderConfig{
		Service: os.Getenv("KEYCLOAK_CLIENT"),
		Url:     os.Getenv("KEYCLOAK_HOST"),
		Realm:   os.Getenv("KEYCLOAK_REALM"),
	}

	role := os.Getenv("KEYCLOAK_CLIENT_ROLE")
	return ginkeycloak.NewAccessBuilder(keycloakConfig).
		RestrictButForRole(role).
		RestrictButForRealm(role).
		Build(), nil
}
