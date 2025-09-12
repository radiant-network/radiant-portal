package utils

import (
	"fmt"

	"github.com/gin-gonic/gin"
	"github.com/tbaehler/gin-keycloak/pkg/ginkeycloak"
)

type Auth interface {
	RetrieveUserIdFromToken(c *gin.Context) (*string, error)
}

type KeycloakAuth struct{}

func NewKeycloakAuth() *KeycloakAuth {
	return &KeycloakAuth{}
}

func (auth KeycloakAuth) RetrieveUserIdFromToken(c *gin.Context) (*string, error) {
	ginToken, exist := c.Get("token")
	if exist {
		decodedJWT := ginToken.(ginkeycloak.KeyCloakToken)
		return &(decodedJWT.Sub), nil
	}
	return nil, fmt.Errorf("JWT token not found in context")
}
