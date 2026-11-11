package authorization

import (
	"github.com/gin-gonic/gin"
)

func InitAuthorizer() (gin.HandlerFunc, error) {
	return NewKeyCloakAuthorizer()
}
