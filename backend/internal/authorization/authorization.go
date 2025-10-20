package authorization

import (
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/radiant-network/radiant-api/internal/utils"
)

func InitAuthorizer(auth *utils.KeycloakAuth) (gin.HandlerFunc, error) {
	provider := os.Getenv("RADIANT_AUTHORIZATION_PROVIDER")
	switch provider {
	case "keycloak":
		return NewKeyCloakAuthorizer()
	case "openfga":
		return NewOpenFGAAuthorizer(auth)
	case "":
		log.Print("RADIANT_AUTHORIZATION_PROVIDER not set; defaulting to Keycloak")
		return NewKeyCloakAuthorizer()
	default:
		log.Printf("Unrecognized RADIANT_AUTHORIZATION_PROVIDER=%q; defaulting to Keycloak", provider)
		return NewKeyCloakAuthorizer()
	}
}
