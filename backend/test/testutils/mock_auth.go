package testutils

import (
	"github.com/gin-gonic/gin"
)

type MockAuth struct{}

func (mockAut *MockAuth) RetrieveUserIdFromToken(c *gin.Context) (*string, error) {
	result := "1"
	return &result, nil
}

type MockAuthUserPreferences struct{}

func (mockAut *MockAuthUserPreferences) RetrieveUserIdFromToken(c *gin.Context) (*string, error) {
	result := "b3a74785-b0a9-4a45-879e-f13c476976f7"
	return &result, nil
}
