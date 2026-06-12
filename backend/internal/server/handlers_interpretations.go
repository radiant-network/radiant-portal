package server

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/radiant-network/radiant-api/internal/client"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/tbaehler/gin-keycloak/pkg/ginkeycloak"
)

type interpretationsStore interface {
	FirstGermline(caseId string, sequencingId string, locusId string, transcriptId string) (*types.InterpretationGermline, error)
	CreateOrUpdateGermline(interpretation *types.InterpretationGermline) error
	SearchGermline(analysisId []string, patientId []string, variantHash []string) ([]*types.InterpretationGermline, error)
	FirstSomatic(caseId string, sequencingId string, locusId string, transcriptId string) (*types.InterpretationSomatic, error)
	CreateOrUpdateSomatic(interpretation *types.InterpretationSomatic) error
	SearchSomatic(analysisId []string, patientId []string, variantHash []string) ([]*types.InterpretationSomatic, error)
}

type termNameReader interface {
	GetTermNameById(termsTable string, id string) (*string, error)
}

func extractInterpretationParams(c *gin.Context) (string, string, string, string) {
	sequencingId := c.Param("sequencing_id")
	locusId := c.Param("locus_id")
	transcriptId := c.Param("transcript_id")
	caseId := c.Param("case_id")
	return caseId, sequencingId, locusId, transcriptId
}

// analysis_id=foo,bar&analysis_id=toto => ["foo", "bar", "toto"]
func extractArrayQueryParam(c *gin.Context, key string) []string {
	all := []string{}
	values := c.QueryArray(key)
	if len(values) > 0 {
		for _, i := range values {
			if strings.Contains(i, ",") {
				idSplit := strings.Split(i, ",")
				all = append(all, idSplit...)
			} else {
				all = append(all, i)
			}
		}
	}
	return all
}

func fillInterpretationCommonWithContext(c *gin.Context, interpretation *types.InterpretationCommon) error {
	caseId, sequencingId, locusId, transcriptId := extractInterpretationParams(c)

	interpretation.SequencingId = sequencingId
	interpretation.LocusId = locusId
	interpretation.TranscriptId = transcriptId
	interpretation.CaseId = caseId

	tenant, err := GetTenant(c)
	if err != nil {
		return err
	}
	interpretation.TenantCode = *tenant

	ginToken, exist := c.Get("token")
	if exist {
		decodedJWT := ginToken.(ginkeycloak.KeyCloakToken)

		interpretation.CreatedBy = decodedJWT.Sub
		interpretation.CreatedByName = decodedJWT.Name

		interpretation.UpdatedBy = decodedJWT.Sub
		interpretation.UpdatedByName = decodedJWT.Name
	}
	return nil
}

func getInterpretationStatus(interpretation *types.InterpretationCommon) int {
	status := http.StatusOK
	for _, pubmed := range interpretation.Pubmed {
		if pubmed.Citation == "" {
			status = http.StatusPartialContent
			break
		}
	}
	return status
}

// GetInterpretationGermlineDeprecated
// @Deprecated
// @Summary Get interpretation germline
// @Id GetInterpretationGermlineDeprecated
// @Description Get interpretation germline
// @Tags interpretations
// @Security bearerauth
// @Param tenant path string true "Tenant code"
// @Param sequencing_id path string true "Sequencing ID"
// @Param locus_id path string true "Locus ID"
// @Param transcript_id path string true "Transcript ID"
// @Produce json
// @Success 200 {object} types.InterpretationGermline
// @Success 206 {object} types.InterpretationGermline
// @Failure 401 {object} types.ApiError
// @Failure 403 {object} types.ApiError
// @Failure 404 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Header 500 {string} X-Correlation-ID "Unique id correlating this error with the server-side log entry"
// @Router /{tenant}/interpretations/germline/{sequencing_id}/{locus_id}/{transcript_id} [get]
func GetInterpretationGermlineDeprecated(repo interpretationsStore) gin.HandlerFunc {
	return func(c *gin.Context) {
		caseId, sequencingId, locusId, transcriptId := extractInterpretationParams(c)
		interpretation, err := repo.FirstGermline(caseId, sequencingId, locusId, transcriptId)
		if err != nil {
			HandleError(c, err)
			return
		}
		if interpretation == nil {
			HandleNotFoundError(c, "interpretation")
			return
		}
		c.JSON(getInterpretationStatus(&interpretation.InterpretationCommon), interpretation)
	}
}

// GetInterpretationGermline
// @Summary Get interpretation germline
// @Id GetInterpretationGermline
// @Description Get interpretation germline
// @Tags interpretations
// @Security bearerauth
// @Param tenant path string true "Tenant code"
// @Param case_id path string true "Case ID"
// @Param sequencing_id path string true "Sequencing ID"
// @Param locus_id path string true "Locus ID"
// @Param transcript_id path string true "Transcript ID"
// @Produce json
// @Success 200 {object} types.InterpretationGermline
// @Success 206 {object} types.InterpretationGermline
// @Failure 401 {object} types.ApiError
// @Failure 403 {object} types.ApiError
// @Failure 404 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Header 500 {string} X-Correlation-ID "Unique id correlating this error with the server-side log entry"
// @Router /{tenant}/interpretations/v2/germline/{case_id}/{sequencing_id}/{locus_id}/{transcript_id} [get]
func GetInterpretationGermline(repo interpretationsStore, termsRepo termNameReader) gin.HandlerFunc {
	return func(c *gin.Context) {
		caseId, sequencingId, locusId, transcriptId := extractInterpretationParams(c)
		interpretation, err := repo.FirstGermline(caseId, sequencingId, locusId, transcriptId)
		if err != nil {
			HandleError(c, err)
			return
		}
		if interpretation == nil {
			HandleNotFoundError(c, "interpretation")
			return
		}

		conditionName, err := termsRepo.GetTermNameById(types.MondoTable.Name, interpretation.Condition)
		if err != nil {
			HandleError(c, err)
			return
		}
		if conditionName != nil {
			interpretation.ConditionName = *conditionName
		}

		c.JSON(getInterpretationStatus(&interpretation.InterpretationCommon), interpretation)
	}
}

// PostInterpretationGermlineDeprecated
// @Deprecated
// @Summary Create or Update interpretation germline
// @Id PostInterpretationGermlineDeprecated
// @Description Create or Update interpretation germline
// @Tags interpretations
// @Security bearerauth
// @Param tenant path string true "Tenant code"
// @Param sequencing_id path string true "Sequencing ID"
// @Param locus_id path string true "Locus ID"
// @Param transcript_id path string true "Transcript ID"
// @Param message	body		types.InterpretationGermline	true	"Interpretation Body"
// @Accept json
// @Produce json
// @Success 200 {object} types.InterpretationGermline
// @Failure 400 {object} types.ApiError
// @Failure 401 {object} types.ApiError
// @Failure 403 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Header 500 {string} X-Correlation-ID "Unique id correlating this error with the server-side log entry"
// @Router /{tenant}/interpretations/germline/{sequencing_id}/{locus_id}/{transcript_id} [post]
func PostInterpretationGermlineDeprecated(repo interpretationsStore) gin.HandlerFunc {
	return func(c *gin.Context) {

		interpretation := &types.InterpretationGermline{}
		err := c.BindJSON(interpretation)

		if err != nil {
			HandleError(c, err)
			return
		}

		if err := fillInterpretationCommonWithContext(c, &interpretation.InterpretationCommon); err != nil {
			HandleError(c, err)
			return
		}

		err = repo.CreateOrUpdateGermline(interpretation)

		if err != nil {
			HandleValidationError(c, err)
			return
		}

		c.JSON(http.StatusOK, interpretation)
	}
}

// PostInterpretationGermline
// @Summary Create or Update interpretation germline
// @Id PostInterpretationGermline
// @Description Create or Update interpretation germline
// @Tags interpretations
// @Security bearerauth
// @Param tenant path string true "Tenant code"
// @Param case_id path string true "Case ID"
// @Param sequencing_id path string true "Sequencing ID"
// @Param locus_id path string true "Locus ID"
// @Param transcript_id path string true "Transcript ID"
// @Param message	body		types.InterpretationGermline	true	"Interpretation Body"
// @Accept json
// @Produce json
// @Success 200 {object} types.InterpretationGermline
// @Failure 400 {object} types.ApiError
// @Failure 401 {object} types.ApiError
// @Failure 403 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Header 500 {string} X-Correlation-ID "Unique id correlating this error with the server-side log entry"
// @Router /{tenant}/interpretations/v2/germline/{case_id}/{sequencing_id}/{locus_id}/{transcript_id} [post]
func PostInterpretationGermline(repo interpretationsStore) gin.HandlerFunc {
	return func(c *gin.Context) {

		interpretation := &types.InterpretationGermline{}
		err := c.BindJSON(interpretation)

		if err != nil {
			HandleError(c, err)
			return
		}

		if err := fillInterpretationCommonWithContext(c, &interpretation.InterpretationCommon); err != nil {
			HandleError(c, err)
			return
		}

		err = repo.CreateOrUpdateGermline(interpretation)

		if err != nil {
			HandleValidationError(c, err)
			return
		}

		c.JSON(http.StatusOK, interpretation)
	}
}

// GetInterpretationSomaticDeprecated
// @Deprecated
// @Summary Get interpretation somatic
// @Id GetInterpretationSomaticDeprecated
// @Description Get interpretation somatic
// @Tags interpretations
// @Security bearerauth
// @Param tenant path string true "Tenant code"
// @Param sequencing_id path string true "Sequencing ID"
// @Param locus_id path string true "Locus ID"
// @Param transcript_id path string true "Transcript ID"
// @Produce json
// @Success 200 {object} types.InterpretationSomatic
// @Success 206 {object} types.InterpretationSomatic
// @Failure 401 {object} types.ApiError
// @Failure 403 {object} types.ApiError
// @Failure 404 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Header 500 {string} X-Correlation-ID "Unique id correlating this error with the server-side log entry"
// @Router /{tenant}/interpretations/somatic/{sequencing_id}/{locus_id}/{transcript_id} [get]
func GetInterpretationSomaticDeprecated(repo interpretationsStore) gin.HandlerFunc {
	return func(c *gin.Context) {
		caseId, sequencingId, locusId, transcriptId := extractInterpretationParams(c)
		interpretation, err := repo.FirstSomatic(caseId, sequencingId, locusId, transcriptId)
		if err != nil {
			HandleError(c, err)
			return
		}
		if interpretation == nil {
			HandleNotFoundError(c, "interpretation")
			return
		}
		c.JSON(getInterpretationStatus(&interpretation.InterpretationCommon), interpretation)
	}
}

// GetInterpretationSomatic
// @Summary Get interpretation somatic
// @Id GetInterpretationSomatic
// @Description Get interpretation somatic
// @Tags interpretations
// @Security bearerauth
// @Param tenant path string true "Tenant code"
// @Param case_id path string true "Case ID"
// @Param sequencing_id path string true "Sequencing ID"
// @Param locus_id path string true "Locus ID"
// @Param transcript_id path string true "Transcript ID"
// @Produce json
// @Success 200 {object} types.InterpretationSomatic
// @Success 206 {object} types.InterpretationSomatic
// @Failure 401 {object} types.ApiError
// @Failure 403 {object} types.ApiError
// @Failure 404 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Header 500 {string} X-Correlation-ID "Unique id correlating this error with the server-side log entry"
// @Router /{tenant}/interpretations/v2/somatic/{case_id}/{sequencing_id}/{locus_id}/{transcript_id} [get]
func GetInterpretationSomatic(repo interpretationsStore, termsRepo termNameReader) gin.HandlerFunc {
	return func(c *gin.Context) {
		caseId, sequencingId, locusId, transcriptId := extractInterpretationParams(c)
		interpretation, err := repo.FirstSomatic(caseId, sequencingId, locusId, transcriptId)
		if err != nil {
			HandleError(c, err)
			return
		}
		if interpretation == nil {
			HandleNotFoundError(c, "interpretation")
			return
		}

		conditionName, err := termsRepo.GetTermNameById(types.MondoTable.Name, interpretation.TumoralType)
		if err != nil {
			HandleError(c, err)
			return
		}
		if conditionName != nil {
			interpretation.TumoralName = *conditionName
		}

		c.JSON(getInterpretationStatus(&interpretation.InterpretationCommon), interpretation)
	}
}

// PostInterpretationSomaticDeprecated
// @Deprecated
// @Summary Create or Update interpretation somatic
// @Id PostInterpretationSomaticDeprecated
// @Description Create or Update interpretation somatic
// @Tags interpretations
// @Security bearerauth
// @Param tenant path string true "Tenant code"
// @Param sequencing_id path string true "Sequencing ID"
// @Param locus_id path string true "Locus ID"
// @Param transcript_id path string true "Transcript ID"
// @Param message	body		types.InterpretationSomatic	true	"Interpretation Body"
// @Accept json
// @Produce json
// @Success 200 {object} types.InterpretationSomatic
// @Failure 400 {object} types.ApiError
// @Failure 401 {object} types.ApiError
// @Failure 403 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Header 500 {string} X-Correlation-ID "Unique id correlating this error with the server-side log entry"
// @Router /{tenant}/interpretations/somatic/{sequencing_id}/{locus_id}/{transcript_id} [post]
func PostInterpretationSomaticDeprecated(repo interpretationsStore) gin.HandlerFunc {
	return func(c *gin.Context) {
		interpretation := &types.InterpretationSomatic{}
		err := c.BindJSON(interpretation)

		if err != nil {
			HandleError(c, err)
			return
		}

		if err := fillInterpretationCommonWithContext(c, &interpretation.InterpretationCommon); err != nil {
			HandleError(c, err)
			return
		}

		err = repo.CreateOrUpdateSomatic(interpretation)

		if err != nil {
			HandleValidationError(c, err)
			return
		}

		c.JSON(http.StatusOK, interpretation)
	}
}

// PostInterpretationSomatic
// @Summary Create or Update interpretation somatic
// @Id PostInterpretationSomatic
// @Description Create or Update interpretation somatic
// @Tags interpretations
// @Security bearerauth
// @Param tenant path string true "Tenant code"
// @Param case_id path string true "Case ID"
// @Param sequencing_id path string true "Sequencing ID"
// @Param locus_id path string true "Locus ID"
// @Param transcript_id path string true "Transcript ID"
// @Param message	body		types.InterpretationSomatic	true	"Interpretation Body"
// @Accept json
// @Produce json
// @Success 200 {object} types.InterpretationSomatic
// @Failure 400 {object} types.ApiError
// @Failure 401 {object} types.ApiError
// @Failure 403 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Header 500 {string} X-Correlation-ID "Unique id correlating this error with the server-side log entry"
// @Router /{tenant}/interpretations/v2/somatic/{case_id}/{sequencing_id}/{locus_id}/{transcript_id} [post]
func PostInterpretationSomatic(repo interpretationsStore) gin.HandlerFunc {
	return func(c *gin.Context) {
		interpretation := &types.InterpretationSomatic{}
		err := c.BindJSON(interpretation)

		if err != nil {
			HandleError(c, err)
			return
		}

		if err := fillInterpretationCommonWithContext(c, &interpretation.InterpretationCommon); err != nil {
			HandleError(c, err)
			return
		}

		err = repo.CreateOrUpdateSomatic(interpretation)

		if err != nil {
			HandleValidationError(c, err)
			return
		}

		c.JSON(http.StatusOK, interpretation)
	}
}

// GetPubmedCitation
// @Summary Get pubmed citation by ID
// @Id GetPubmedCitation
// @Description Get pubmed citation by ID
// @Tags interpretations
// @Security bearerauth
// @Param tenant path string true "Tenant code"
// @Param citation_id path string true "Citation ID"
// @Produce json
// @Success 200 {object} types.PubmedCitation
// @Success 206 {object} types.PubmedCitation
// @Failure 401 {object} types.ApiError
// @Failure 403 {object} types.ApiError
// @Failure 404 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Header 500 {string} X-Correlation-ID "Unique id correlating this error with the server-side log entry"
// @Router /{tenant}/interpretations/pubmed/{citation_id} [get]
func GetPubmedCitation(pubmedClient client.PubmedClientService) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("citation_id")
		citation, err := pubmedClient.GetCitationById(id)
		if err != nil {
			HandleError(c, err)
			return
		}
		if citation == nil {
			HandleNotFoundError(c, "citation")
			return
		}
		status := http.StatusOK
		if citation.Nlm.Format == "" {
			status = http.StatusPartialContent
		}
		c.JSON(status, citation)
	}
}

// SearchInterpretationGermline
// @Summary Search interpretation germline
// @Id SearchInterpretationGermline
// @Description Search interpretation germline
// @Tags interpretations
// @Security bearerauth
// @Query analysis_id path string true "Analysis ID"
// @Query patient_id path string true "Patient ID"
// @Query variant_hash path string true "Variant Hash"
// @Produce json
// @Success 200 {object} []types.InterpretationGermline
// @Failure 401 {object} types.ApiError
// @Failure 403 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Header 500 {string} X-Correlation-ID "Unique id correlating this error with the server-side log entry"
// @Param tenant path string true "Tenant code"
// @Router /{tenant}/interpretations/germline [get]
func SearchInterpretationGermline(repo interpretationsStore) gin.HandlerFunc {
	return func(c *gin.Context) {
		analysisIds := extractArrayQueryParam(c, "analysis_id")
		patientIds := extractArrayQueryParam(c, "patient_id")
		variantHashIds := extractArrayQueryParam(c, "variant_hash")
		interpretations, err := repo.SearchGermline(analysisIds, patientIds, variantHashIds)
		if err != nil {
			HandleError(c, err)
			return
		}
		c.JSON(http.StatusOK, interpretations)
	}
}

// SearchInterpretationSomatic
// @Summary Search interpretation somatic
// @Id SearchInterpretationSomatic
// @Description Search interpretation somatic
// @Tags interpretations
// @Security bearerauth
// @Query analysis_id path string true "Analysis ID"
// @Query patient_id path string true "Patient ID"
// @Query variant_hash path string true "Variant Hash"
// @Produce json
// @Success 200 {object} []types.InterpretationSomatic
// @Failure 401 {object} types.ApiError
// @Failure 403 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Header 500 {string} X-Correlation-ID "Unique id correlating this error with the server-side log entry"
// @Param tenant path string true "Tenant code"
// @Router /{tenant}/interpretations/somatic [get]
func SearchInterpretationSomatic(repo interpretationsStore) gin.HandlerFunc {
	return func(c *gin.Context) {
		analysisIds := extractArrayQueryParam(c, "analysis_id")
		patientIds := extractArrayQueryParam(c, "patient_id")
		variantHashIds := extractArrayQueryParam(c, "variant_hash")
		interpretations, err := repo.SearchSomatic(analysisIds, patientIds, variantHashIds)
		if err != nil {
			HandleError(c, err)
			return
		}
		c.JSON(http.StatusOK, interpretations)
	}
}
