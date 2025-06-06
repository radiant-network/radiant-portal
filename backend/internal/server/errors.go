package server

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/radiant-network/radiant-api/internal/types"
	"net/http"
)

func HandleValidationError(c *gin.Context, err error) {
	c.JSON(http.StatusBadRequest, types.ApiError{Status: http.StatusBadRequest, Message: err.Error()})
}

func HandleNotFoundError(c *gin.Context, field string) {
	c.JSON(http.StatusNotFound, types.ApiError{Status: http.StatusNotFound, Message: fmt.Sprintf("%s not found", field)})
}

func HandleError(c *gin.Context, err error) {
	c.JSON(http.StatusInternalServerError, types.ApiError{Status: http.StatusInternalServerError, Message: "Internal Server Error", Detail: err.Error()})
}
