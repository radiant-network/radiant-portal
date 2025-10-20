package testutils

import (
	"github.com/gin-gonic/gin"
	"github.com/tbaehler/gin-keycloak/pkg/ginkeycloak"
)

type MockAuth struct{}

func (mockAut *MockAuth) RetrieveUserIdFromToken(_ *gin.Context) (*string, error) {
	result := "1"
	return &result, nil
}

func (mockAut *MockAuth) RetrieveAzpFromToken(_ *gin.Context) (*string, error) {
	result := "mock-azp"
	return &result, nil
}

func (mockAut *MockAuth) RetrieveResourceAccessFromToken(_ *gin.Context) (*map[string]ginkeycloak.ServiceRole, error) {
	result := map[string]ginkeycloak.ServiceRole{
		"mock-resource": {
			Roles: []string{"mock-role"},
		},
	}
	return &result, nil
}

type MockAuthUserPreferences struct{}

func (mockAut *MockAuthUserPreferences) RetrieveUserIdFromToken(c *gin.Context) (*string, error) {
	result := "b3a74785-b0a9-4a45-879e-f13c476976f7"
	return &result, nil
}

func (mockAut *MockAuthUserPreferences) RetrieveAzpFromToken(_ *gin.Context) (*string, error) {
	result := "mock-azp"
	return &result, nil
}

func (mockAut *MockAuthUserPreferences) RetrieveResourceAccessFromToken(_ *gin.Context) (*map[string]ginkeycloak.ServiceRole, error) {
	result := map[string]ginkeycloak.ServiceRole{
		"mock-resource": {
			Roles: []string{"mock-role"},
		},
	}
	return &result, nil
}
