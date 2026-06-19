package testutils

import (
	"github.com/gin-gonic/gin"
	"github.com/tbaehler/gin-keycloak/pkg/ginkeycloak"
)

const (
	DefaultMockUserId   = "1"
	DefaultMockUsername = "mock-username"
	DefaultMockFullName = "Mock User"
	DefaultMockAzp      = "mock-azp"
	DefaultMockRole     = "mock-role"
)

type MockAuth struct {
	Id             string
	Username       string
	Name           string
	Azp            string
	ResourceAccess map[string]ginkeycloak.ServiceRole
	Error          error
}

func (m *MockAuth) RetrieveUserIdFromToken(c *gin.Context) (*string, error) {
	if m.Error != nil {
		return nil, m.Error
	}
	if m.Id == "" {
		result := DefaultMockUserId
		return &result, nil
	}
	return &m.Id, nil
}

func (m *MockAuth) RetrieveAzpFromToken(c *gin.Context) (*string, error) {
	if m.Error != nil {
		return nil, m.Error
	}
	if m.Azp == "" {
		result := DefaultMockAzp
		return &result, nil
	}
	return &m.Azp, nil
}

func (m *MockAuth) RetrieveResourceAccessFromToken(c *gin.Context) (*map[string]ginkeycloak.ServiceRole, error) {
	if m.Error != nil {
		return nil, m.Error
	}
	if m.ResourceAccess == nil {
		result := map[string]ginkeycloak.ServiceRole{
			DefaultMockAzp: {
				Roles: []string{DefaultMockRole},
			},
		}
		return &result, nil
	}
	return &m.ResourceAccess, nil
}

func (m *MockAuth) RetrieveUsernameFromToken(c *gin.Context) (*string, error) {
	if m.Error != nil {
		return nil, m.Error
	}
	if m.Username == "" {
		result := DefaultMockUsername
		return &result, nil
	}
	return &m.Username, nil
}

func (m *MockAuth) RetrieveFullNameFromToken(c *gin.Context) (*string, error) {
	if m.Error != nil {
		return nil, m.Error
	}
	if m.Name == "" {
		result := DefaultMockFullName
		return &result, nil
	}
	return &m.Name, nil
}
