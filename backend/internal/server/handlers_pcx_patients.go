package server

import (
	"context"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/internal/utils"
)

// The PCX patient handlers not implemented yet answer 501; each story replaces its handler body.

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
func SearchPatientsHandler(repo pcxPatientsSearcher) gin.HandlerFunc {
	return func(c *gin.Context) {
		var body types.ListBodyWithCriteria
		if err := c.ShouldBindJSON(&body); err != nil {
			HandleValidationError(c, err)
			return
		}
		if body.Limit == 0 {
			body.Limit = types.PcxPatientListDefaultLimit
		}
		pagination := types.ResolvePagination(body.Limit, body.Offset, body.PageIndex)
		query, err := types.NewListQueryFromCriteria(types.PcxPatientsQueryConfig, body.AdditionalFields, body.SearchCriteria, pagination, body.Sort)
		if err != nil {
			HandleValidationError(c, err)
			return
		}
		patients, count, err := repo.SearchPatients(c.Request.Context(), query)
		if err != nil {
			HandleError(c, err)
			return
		}
		c.JSON(http.StatusOK, types.PatientsSearchResponse{List: patients, Count: count})
	}
}

type pcxPatientsSearcher interface {
	SearchPatients(ctx context.Context, query types.ListQuery) ([]types.PatientListItem, int64, error)
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
func PatientsAutocompleteHandler(repo pcxPatientsAutocompleter) gin.HandlerFunc {
	return func(c *gin.Context) {
		prefix := c.Query("prefix")
		if prefix == "" {
			c.JSON(http.StatusOK, []types.AutocompleteResult{})
			return
		}
		limit, err := strconv.Atoi(c.Query("limit"))
		if err != nil || limit <= 0 {
			limit = types.PcxPatientListDefaultLimit
		}
		results, err := repo.AutocompletePatients(c.Request.Context(), prefix, min(limit, utils.MaxLimit))
		if err != nil {
			HandleError(c, err)
			return
		}
		c.JSON(http.StatusOK, results)
	}
}

type pcxPatientsAutocompleter interface {
	AutocompletePatients(ctx context.Context, prefix string, limit int) ([]types.AutocompleteResult, error)
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
