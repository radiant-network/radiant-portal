package authorization

import (
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/radiant-network/radiant-api/internal/utils"
)

func InitAuthorizer(auth *utils.KeycloakAuth) (gin.HandlerFunc, error) {
	if os.Getenv("RADIANT_AUTHORIZATION_PROVIDER") == "keycloak" {
		return NewKeyCloakAuthorizer()
	} else if os.Getenv("RADIANT_AUTHORIZATION_PROVIDER") == "openfga" {
		return NewOpenFGAAuthorizer(auth)
	} else {
		// To avoid breaking existing deployments, we default if nothing is set
		log.Print("RADIANT_AUTHORIZATION_PROVIDER not set or unrecognized, defaulting to Keycloak")
		return NewKeyCloakAuthorizer()
	}
}
