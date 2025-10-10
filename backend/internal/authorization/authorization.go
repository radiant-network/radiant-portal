package authorization

import (
	"log"
	"os"

	"github.com/gin-gonic/gin"
)

func InitAuthorizer() (gin.HandlerFunc, error) {
	if os.Getenv("RADIANT_AUTHORIZATION_PROVIDER") == "keycloak" {
		return NewKeyCloakAuthorizer()
	} else if os.Getenv("RADIANT_AUTHORIZATION_PROVIDER") == "openfga" {
		return NewOpenFGAAuthorizer()
	} else {
		// To avoid breaking existing deployments, we default if nothing is set
		log.Print("RADIANT_AUTHORIZATION_PROVIDER not set or unrecognized, defaulting to Keycloak")
		return NewKeyCloakAuthorizer()
	}
}
