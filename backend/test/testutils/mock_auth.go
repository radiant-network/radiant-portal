package testutils

import (
	"github.com/gin-gonic/gin"
)

type MockAuth struct{}

func (mockAut *MockAuth) RetrieveUserIdFromToken(c *gin.Context) (*string, error) {
	result := "1"
	return &result, nil
}
