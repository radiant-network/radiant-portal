package utils

import (
	"encoding/json"
	"fmt"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
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
	if ginToken, exist := c.Get("token"); exist {
		sub := ginToken.(ginkeycloak.KeyCloakToken).Sub
		return &sub, nil
	}

	token, err := retrieveTokenFromJWT(c)
	if err != nil {
		return nil, err
	}
	return &token.Sub, nil
}

func (auth KeycloakAuth) RetrieveAzpFromToken(c *gin.Context) (*string, error) {
	if ginToken, exist := c.Get("token"); exist {
		sub := ginToken.(ginkeycloak.KeyCloakToken).Azp
		return &sub, nil
	}

	token, err := retrieveTokenFromJWT(c)
	if err != nil {
		return nil, err
	}
	return &token.Azp, nil
}

func (auth KeycloakAuth) RetrieveResourceAccessFromToken(c *gin.Context) (*map[string]ginkeycloak.ServiceRole, error) {
	if ginToken, exist := c.Get("token"); exist {
		sub := ginToken.(ginkeycloak.KeyCloakToken).ResourceAccess
		return &sub, nil
	}

	token, err := retrieveTokenFromJWT(c)
	if err != nil {
		return nil, err
	}
	return &token.ResourceAccess, nil
}

func retrieveTokenFromJWT(c *gin.Context) (*ginkeycloak.KeyCloakToken, error) {
	authHeader := c.GetHeader("Authorization")
	if authHeader == "" {
		return nil, fmt.Errorf("authorization header missing")
	}

	parts := strings.SplitN(authHeader, " ", 2)
	if len(parts) != 2 || strings.ToLower(parts[0]) != "bearer" {
		return nil, fmt.Errorf("invalid authorization header format")
	}
	tokenString := parts[1]

	token, _, err := jwt.NewParser().ParseUnverified(tokenString, jwt.MapClaims{})
	if err != nil {
		return nil, fmt.Errorf("failed to parse token: %w", err)
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return nil, fmt.Errorf("failed to parse claims")
	}

	claimsJSON, err := json.Marshal(claims)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal claims: %w", err)
	}

	var keycloakToken ginkeycloak.KeyCloakToken
	if err := json.Unmarshal(claimsJSON, &keycloakToken); err != nil {
		return nil, fmt.Errorf("failed to unmarshal claims to KeyCloakToken: %w", err)
	}

	c.Set("token", keycloakToken)

	return &keycloakToken, nil
}
