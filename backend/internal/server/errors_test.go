package server

import (
	"errors"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
)

func Test_HandleError_OmitsRawErrorFromBody(t *testing.T) {
	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)
	c.Request, _ = http.NewRequest("GET", "/radiant/genes/autocomplete", nil)

	HandleError(c, errors.New(`pq: duplicate key value violates unique constraint "saved_filter_name_key"`))

	assert.Equal(t, http.StatusInternalServerError, w.Code)
	assert.JSONEq(t, `{"status":500,"message":"Internal Server Error"}`, w.Body.String())
	assert.NotContains(t, w.Body.String(), "constraint")
}

func Test_HandleError_SetsCorrelationIDHeader(t *testing.T) {
	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)
	c.Request, _ = http.NewRequest("GET", "/radiant/genes/autocomplete", nil)

	HandleError(c, errors.New("boom"))

	correlationID := w.Header().Get("X-Correlation-ID")
	assert.NotEmpty(t, correlationID)
	_, err := uuid.Parse(correlationID)
	assert.NoError(t, err, "X-Correlation-ID header should be a valid UUID, got %q", correlationID)
}
