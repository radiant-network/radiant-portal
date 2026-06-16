package server

import (
	"fmt"
	"log/slog"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/radiant-network/radiant-api/internal/observability"
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
// The correlation id is the request id assigned by the RequestID middleware; if none is
// present on the context (e.g. a direct unit-test call), a fresh UUID is minted.
func HandleError(c *gin.Context, err error) {
	correlationID, ok := observability.RequestIDFromContext(c.Request.Context())
	if !ok {
		correlationID = uuid.NewString()
	}
	slog.ErrorContext(c.Request.Context(), "internal error",
		slog.String("method", c.Request.Method),
		slog.String("path", c.Request.URL.Path),
		slog.Any("error", err),
	)
	c.Header("X-Correlation-ID", correlationID)
	c.JSON(http.StatusInternalServerError, types.ApiError{Status: http.StatusInternalServerError, Message: "Internal Server Error"})
}

func HandleUnauthorizedError(c *gin.Context) {
	c.JSON(http.StatusUnauthorized, types.ApiError{Status: http.StatusUnauthorized, Message: "Unauthorized"})
}

func HandleForbiddenError(c *gin.Context) {
	c.JSON(http.StatusForbidden, types.ApiError{Status: http.StatusForbidden, Message: "Forbidden"})
}
