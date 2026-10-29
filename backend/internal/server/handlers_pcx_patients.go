package server

import (
	"context"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
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
func PatientsFiltersHandler(repo pcxPatientsFiltersReader) gin.HandlerFunc {
	return func(c *gin.Context) {
		filters, err := repo.GetPatientsFilters(c.Request.Context())
		if err != nil {
			HandleError(c, err)
			return
		}
		c.JSON(http.StatusOK, filters)
	}
}

type pcxPatientsFiltersReader interface {
	GetPatientsFilters(ctx context.Context) (*types.PatientFilters, error)
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
// @Description Retrieve types.PatientEntity, the header, sidebar and overview of the patient page, by its patient_key. 404 for an unknown or malformed key, with no hint that the patient exists.
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
func PatientEntityHandler(repo pcxPatientReader) gin.HandlerFunc {
	return patientPartHandler(repo.GetPatient)
}

type pcxPatientReader interface {
	GetPatient(ctx context.Context, patientKey string) (*types.PatientEntity, error)
}

// PatientTreatmentsHandler handles retrieving the treatments of a PCX patient
// @Summary Get types.PatientTreatments of a patient
// @Id patientTreatments
// @Description Retrieve types.PatientTreatments, the treatments tab of the patient page, by its patient_key. 404 for an unknown or malformed key, with no hint that the patient exists.
// @Tags patients
// @Security bearerauth
// @Param tenant path string true "Tenant code"
// @Param patient_key path string true "Patient key" format(uuid)
// @Produce json
// @Success 200 {object} types.PatientTreatments
// @Failure 401 {object} types.ApiError
// @Failure 403 {object} types.ApiError
// @Failure 404 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Header 500 {string} X-Correlation-ID "Unique id correlating this error with the server-side log entry"
// @Router /{tenant}/patients/{patient_key}/treatments [get]
func PatientTreatmentsHandler(repo pcxPatientTreatmentsReader) gin.HandlerFunc {
	return patientPartHandler(repo.GetPatientTreatments)
}

type pcxPatientTreatmentsReader interface {
	GetPatientTreatments(ctx context.Context, patientKey string) (*types.PatientTreatments, error)
}

// PatientLaboratoryHandler handles retrieving the laboratory results of a PCX patient
// @Summary Get types.PatientLaboratory of a patient
// @Id patientLaboratory
// @Description Retrieve types.PatientLaboratory, the laboratory tab of the patient page, by its patient_key. 404 for an unknown or malformed key, with no hint that the patient exists.
// @Tags patients
// @Security bearerauth
// @Param tenant path string true "Tenant code"
// @Param patient_key path string true "Patient key" format(uuid)
// @Produce json
// @Success 200 {object} types.PatientLaboratory
// @Failure 401 {object} types.ApiError
// @Failure 403 {object} types.ApiError
// @Failure 404 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Header 500 {string} X-Correlation-ID "Unique id correlating this error with the server-side log entry"
// @Router /{tenant}/patients/{patient_key}/laboratory [get]
func PatientLaboratoryHandler(repo pcxPatientLaboratoryReader) gin.HandlerFunc {
	return patientPartHandler(repo.GetPatientLaboratory)
}

type pcxPatientLaboratoryReader interface {
	GetPatientLaboratory(ctx context.Context, patientKey string) (*types.PatientLaboratory, error)
}

// PatientImagingHandler handles retrieving the imaging sessions of a PCX patient
// @Summary Get types.PatientImaging of a patient
// @Id patientImaging
// @Description Retrieve types.PatientImaging, the imaging tab of the patient page, by its patient_key. 404 for an unknown or malformed key, with no hint that the patient exists.
// @Tags patients
// @Security bearerauth
// @Param tenant path string true "Tenant code"
// @Param patient_key path string true "Patient key" format(uuid)
// @Produce json
// @Success 200 {object} types.PatientImaging
// @Failure 401 {object} types.ApiError
// @Failure 403 {object} types.ApiError
// @Failure 404 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Header 500 {string} X-Correlation-ID "Unique id correlating this error with the server-side log entry"
// @Router /{tenant}/patients/{patient_key}/imaging [get]
func PatientImagingHandler(repo pcxPatientImagingReader) gin.HandlerFunc {
	return patientPartHandler(repo.GetPatientImaging)
}

type pcxPatientImagingReader interface {
	GetPatientImaging(ctx context.Context, patientKey string) (*types.PatientImaging, error)
}

// PatientGenomicsHandler handles retrieving the portal cases and interpretations of a PCX patient
// @Summary Get types.PatientGenomics of a patient
// @Id patientGenomics
// @Description Retrieve types.PatientGenomics, the genomics tab of the patient page, by its patient_key. 404 for an unknown or malformed key, with no hint that the patient exists.
// @Tags patients
// @Security bearerauth
// @Param tenant path string true "Tenant code"
// @Param patient_key path string true "Patient key" format(uuid)
// @Produce json
// @Success 200 {object} types.PatientGenomics
// @Failure 401 {object} types.ApiError
// @Failure 403 {object} types.ApiError
// @Failure 404 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Header 500 {string} X-Correlation-ID "Unique id correlating this error with the server-side log entry"
// @Router /{tenant}/patients/{patient_key}/genomics [get]
func PatientGenomicsHandler(repo pcxPatientGenomicsReader) gin.HandlerFunc {
	return patientPartHandler(repo.GetPatientGenomics)
}

type pcxPatientGenomicsReader interface {
	GetPatientGenomics(ctx context.Context, patientKey string) (*types.PatientGenomics, error)
}

// patientPartHandler answers 404 for a malformed key without reading, and for a key the caller cannot see.
func patientPartHandler[T any](get func(ctx context.Context, patientKey string) (*T, error)) gin.HandlerFunc {
	return func(c *gin.Context) {
		key := c.Param("patient_key")
		if _, err := uuid.Parse(key); err != nil {
			HandleNotFoundError(c, "patient")
			return
		}
		part, err := get(c.Request.Context(), key)
		if err != nil {
			HandleError(c, err)
			return
		}
		if part == nil {
			HandleNotFoundError(c, "patient")
			return
		}
		c.JSON(http.StatusOK, part)
	}
}
