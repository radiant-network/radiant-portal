package server

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/golang/glog"
	"github.com/google/uuid"
	"github.com/radiant-network/radiant-api/internal/types"
)

func HandleValidationError(c *gin.Context, err error) {
	c.JSON(http.StatusBadRequest, types.ApiError{Status: http.StatusBadRequest, Message: err.Error()})
}

func HandleNotFoundError(c *gin.Context, field string) {
	c.JSON(http.StatusNotFound, types.ApiError{Status: http.StatusNotFound, Message: fmt.Sprintf("%s not found", field)})
}

// HandleError responds with a generic 500 and never leaks the underlying error to the client.
// The full error is logged server-side with a correlation id (also returned in the
// X-Correlation-ID header) so an operator can tie a client report back to the log line.
func HandleError(c *gin.Context, err error) {
	correlationID := uuid.NewString()
	glog.Errorf("[correlation_id=%s] internal error on %s %s: %v",
		correlationID, c.Request.Method, c.Request.URL.Path, err)
	c.Header("X-Correlation-ID", correlationID)
	c.JSON(http.StatusInternalServerError, types.ApiError{Status: http.StatusInternalServerError, Message: "Internal Server Error"})
}

func HandleUnauthorizedError(c *gin.Context) {
	c.JSON(http.StatusUnauthorized, types.ApiError{Status: http.StatusUnauthorized, Message: "Unauthorized"})
}

func HandleForbiddenError(c *gin.Context) {
	c.JSON(http.StatusForbidden, types.ApiError{Status: http.StatusForbidden, Message: "Forbidden"})
}
