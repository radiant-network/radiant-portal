package authorization

import (
	"fmt"
	"os"

	"github.com/gin-gonic/gin"
)

func InitAuthorizer() (gin.HandlerFunc, error) {
	if os.Getenv("RADIANT_AUTHORIZATION_PROVIDER") == "keycloak" {
		return NewKeyCloakAuthorizer()
	} else if os.Getenv("RADIANT_AUTHORIZATION_PROVIDER") == "openfga" {
		return NewOpenFGAAuthorizer()
	} else {
		return nil, fmt.Errorf("unsupported auth provider: %s", os.Getenv("RADIANT_AUTHORIZATION_PROVIDER"))
	}
}
