package server

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/radiant-network/radiant-api/internal/types"
)

// The PCX patient handlers only publish the API contract for now: they answer 501 and are not
// registered yet. Each story replaces its handler body and registers the route.

func notImplemented(c *gin.Context) {
	c.JSON(http.StatusNotImplemented, types.ApiError{Status: http.StatusNotImplemented, Message: "Not Implemented"})
}

// SearchPatientsHandler handles search of PCX patients
// @Summary Search PCX patients
// @Id searchPatients
// @Description Search PCX patients. Default sort: can_read_phi desc, organization_code asc, patient_id asc. Filterable fields: vital_status, organization_code, cns_integrated_diagnosis, patient_id and patient_name (the latter only matches rows where can_read_phi is true).
// @Tags patients
// @Security bearerauth
// @Param tenant path string true "Tenant code"
// @Param			message	body		types.ListBodyWithCriteria	true	"List Body"
// @Accept json
// @Produce json
// @Success 200 {object} types.PatientsSearchResponse
// @Failure 400 {object} types.ApiError
// @Failure 401 {object} types.ApiError
// @Failure 403 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Header 500 {string} X-Correlation-ID "Unique id correlating this error with the server-side log entry"
// @Router /{tenant}/patients/search [post]
func SearchPatientsHandler() gin.HandlerFunc {
	return notImplemented
}

// PatientsAutocompleteHandler handles retrieving PCX patient suggestions by prefix
// @Summary Get types.AutocompleteResult list of PCX patients matching prefix
// @Id autocompletePatients
// @Description Retrieve types.AutocompleteResult list matching prefix, of type patient_id or patient_name (names only where can_read_phi is true). A selected suggestion becomes a search criterion on the field named by its type.
// @Tags patients
// @Security bearerauth
// @Param tenant path string true "Tenant code"
// @Param prefix query string true "Prefix"
// @Param limit query string false "Limit"
// @Produce json
// @Success 200 {array} types.AutocompleteResult
// @Failure 401 {object} types.ApiError
// @Failure 403 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Header 500 {string} X-Correlation-ID "Unique id correlating this error with the server-side log entry"
// @Router /{tenant}/patients/autocomplete [get]
func PatientsAutocompleteHandler() gin.HandlerFunc {
	return notImplemented
}

// PatientsFiltersHandler handles retrieving the patient list filters
// @Summary Get types.PatientFilters patient list filters
// @Id patientsFilters
// @Description Retrieve types.PatientFilters patient list filters
// @Tags patients
// @Security bearerauth
// @Param tenant path string true "Tenant code"
// @Produce json
// @Success 200 {object} types.PatientFilters
// @Failure 401 {object} types.ApiError
// @Failure 403 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Header 500 {string} X-Correlation-ID "Unique id correlating this error with the server-side log entry"
// @Router /{tenant}/patients/filters [get]
func PatientsFiltersHandler() gin.HandlerFunc {
	return notImplemented
}

// PatientsStatisticsHandler handles retrieving the cohort analytics
// @Summary Get types.PatientStatistics cohort analytics
// @Id patientsStatistics
// @Description Retrieve types.PatientStatistics on every PCX patient the caller can see, regardless of the list filters
// @Tags patients
// @Security bearerauth
// @Param tenant path string true "Tenant code"
// @Produce json
// @Success 200 {object} types.PatientStatistics
// @Failure 401 {object} types.ApiError
// @Failure 403 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Header 500 {string} X-Correlation-ID "Unique id correlating this error with the server-side log entry"
// @Router /{tenant}/patients/statistics [get]
func PatientsStatisticsHandler() gin.HandlerFunc {
	return notImplemented
}

// PatientEntityHandler handles retrieving a PCX patient by its key
// @Summary Get types.PatientEntity patient entity
// @Id patientEntity
// @Description Retrieve types.PatientEntity by its patient_key. 404 for an unknown or malformed key, with no hint that the patient exists.
// @Tags patients
// @Security bearerauth
// @Param tenant path string true "Tenant code"
// @Param patient_key path string true "Patient key" format(uuid)
// @Produce json
// @Success 200 {object} types.PatientEntity
// @Failure 401 {object} types.ApiError
// @Failure 403 {object} types.ApiError
// @Failure 404 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Header 500 {string} X-Correlation-ID "Unique id correlating this error with the server-side log entry"
// @Router /{tenant}/patients/{patient_key} [get]
func PatientEntityHandler() gin.HandlerFunc {
	return notImplemented
}
