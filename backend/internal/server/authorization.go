package server

import (
	"fmt"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/tbaehler/gin-keycloak/pkg/ginkeycloak"
)

func getKeyCloakAuthorizer() gin.HandlerFunc {
	var keycloakConfig = ginkeycloak.BuilderConfig{
		Service: os.Getenv("KEYCLOAK_CLIENT"),
		Url:     os.Getenv("KEYCLOAK_HOST"),
		Realm:   os.Getenv("KEYCLOAK_REALM"),
	}

	role := os.Getenv("KEYCLOAK_CLIENT_ROLE")
	return ginkeycloak.NewAccessBuilder(keycloakConfig).
		RestrictButForRole(role).
		RestrictButForRealm(role).
		Build()
}

func getOpenFGAAuthorizer() gin.HandlerFunc {
	// TODO : Implement this
	return func(c *gin.Context) {
		return
	}
}

func InitAuthorizer() (gin.HandlerFunc, error) {
	if os.Getenv("RADIANT_AUTHORIZATION_PROVIDER") == "keycloak" {
		return getKeyCloakAuthorizer(), nil
	} else if os.Getenv("RADIANT_AUTHORIZATION_PROVIDER") == "openfga" {
		return getOpenFGAAuthorizer(), nil
	} else {
		return nil, fmt.Errorf("unsupported auth provider: %s", os.Getenv("RADIANT_AUTHORIZATION_PROVIDER"))
	}
}
