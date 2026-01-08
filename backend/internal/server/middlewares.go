package server

import (
	"github.com/gin-gonic/gin"
	"github.com/radiant-network/radiant-api/internal/utils"
)

func RequireRole(auth utils.Auth, role string, resourceName string) gin.HandlerFunc {
	return func(c *gin.Context) {
		hasRole, err := auth.UserHasRole(c, role, resourceName)
		if err != nil {
			HandleError(c, err)
			c.Abort()
			return
		}
		if !hasRole {
			HandleForbiddenError(c)
			c.Abort()
			return
		}
		c.Next()
	}
}
