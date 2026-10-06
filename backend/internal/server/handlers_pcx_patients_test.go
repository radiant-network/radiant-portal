package server

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

func Test_PcxPatientHandlers_NotImplementedYet(t *testing.T) {
	handlers := map[string]gin.HandlerFunc{
		"search":       SearchPatientsHandler(),
		"autocomplete": PatientsAutocompleteHandler(),
		"filters":      PatientsFiltersHandler(),
		"statistics":   PatientsStatisticsHandler(),
		"entity":       PatientEntityHandler(),
	}
	for name, handler := range handlers {
		router := gin.Default()
		router.GET("/", handler)
		w := httptest.NewRecorder()
		router.ServeHTTP(w, httptest.NewRequest(http.MethodGet, "/", nil))

		assert.Equal(t, http.StatusNotImplemented, w.Code, name)
		assert.JSONEq(t, `{"status":501,"message":"Not Implemented"}`, w.Body.String(), name)
	}
}
