package server

import (
	"net/http"
	"strconv"
	"strings"

	"github.com/Ferlab-Ste-Justine/radiant-api/internal/client"
	"github.com/Ferlab-Ste-Justine/radiant-api/internal/repository"
	"github.com/Ferlab-Ste-Justine/radiant-api/internal/types"
	"github.com/gin-gonic/gin"
	"github.com/tbaehler/gin-keycloak/pkg/ginkeycloak"
)

// StatusHandler handles the status endpoint
// @Summary Get API status
// @Description Returns the current status of the API
// @Tags status
// @Produce json
// @Success 200 {object} map[string]string
// @Router /status [get]
func StatusHandler(repoStarrocks repository.StarrocksDAO, repoPostgres repository.PostgresDAO) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status": gin.H{
				"starrocks": repoStarrocks.CheckDatabaseConnection(),
				"postgres":  repoPostgres.CheckDatabaseConnection(),
			},
		})
	}
}

// OccurrencesListHandler handles list of occurrences
// @Summary List occurrences
// @Id listOccurrences
// @Description List occurrences for a given sequence ID
// @Tags occurrences
// @Security bearerauth
// @Param seq_id path string true "Sequence ID"
// @Param			message	body		types.ListBody	true	"List Body"
// @Accept json
// @Produce json
// @Success 200 {array} types.Occurrence
// @Failure 400 {object} types.ApiError
// @Failure 404 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Router /occurrences/{seq_id}/list [post]
func OccurrencesListHandler(repo repository.StarrocksDAO) gin.HandlerFunc {
	return func(c *gin.Context) {
		var (
			body  types.ListBody
			query types.ListQuery
		)

		// Bind JSON to the struct
		if err := c.ShouldBindJSON(&body); err != nil {
			// Return a 400 Bad Request if validation fails
			HandleValidationError(c, err)
			return
		}
		var p types.Pagination
		if body.Limit != 0 && body.PageIndex != 0 {
			p = types.Pagination{Limit: body.Limit, PageIndex: body.PageIndex}
		} else if body.Limit != 0 && body.Offset != 0 {
			p = types.Pagination{Limit: body.Limit, Offset: body.Offset}
		} else if body.Limit != 0 {
			p = types.Pagination{Limit: body.Limit, Offset: 0}
		} else {
			p = types.Pagination{Limit: 10, Offset: 0}
		}
		query, err := types.NewListQuery(body.AdditionalFields, body.Sqon, types.OccurrencesFields, types.OccurrencesDefaultFields, &p, body.Sort)
		if err != nil {
			HandleValidationError(c, err)
			return
		}
		seqID, err := strconv.Atoi(c.Param("seq_id"))
		if err != nil {
			HandleNotFoundError(c, "seq_id")
			return
		}
		occurrences, err := repo.GetOccurrences(seqID, query)
		if err != nil {
			HandleError(c, err)
			return
		}

		c.JSON(http.StatusOK, occurrences)
	}
}

// OccurrencesCountHandler handles counting occurrences
// @Summary Count occurrences
// @Id countOccurrences
// @Description Counts occurrences for a given sequence ID
// @Tags occurrences
// @Security bearerauth
// @Param seq_id path string true "Sequence ID"
// @Param			message	body		types.CountBody	true	"Count Body"
// @Accept json
// @Produce json
// @Success 200 {object} types.Count
// @Failure 400 {object} types.ApiError
// @Failure 404 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Router /occurrences/{seq_id}/count [post]
func OccurrencesCountHandler(repo repository.StarrocksDAO) gin.HandlerFunc {
	return func(c *gin.Context) {
		var (
			body  types.CountBody
			query types.CountQuery
		)

		// Bind JSON to the struct
		if err := c.ShouldBindJSON(&body); err != nil {
			// Return a 400 Bad Request if validation fails
			HandleValidationError(c, err)
			return
		}
		query, err := types.NewCountQuery(body.Sqon, types.OccurrencesFields)
		if err != nil {
			HandleValidationError(c, err)
			return
		}
		seqID, err := strconv.Atoi(c.Param("seq_id"))
		if err != nil {
			HandleNotFoundError(c, "seq_id")
			return
		}
		count, err := repo.CountOccurrences(seqID, query)
		if err != nil {
			HandleError(c, err)
			return
		}
		countResponse := types.Count{count}
		c.JSON(http.StatusOK, countResponse)
	}
}

// OccurrencesAggregateHandler handles aggregation of occurrences
// @Summary Aggregate occurrences
// @Id aggregateOccurrences
// @Description Aggregate occurrences for a given sequence ID
// @Tags occurrences
// @Security bearerauth
// @Param seq_id path string true "Sequence ID"
// @Param			message	body		types.AggregationBody	true	"Aggregation Body"
// @Accept json
// @Produce json
// @Success 200 {array} types.Aggregation
// @Failure 400 {object} types.ApiError
// @Failure 404 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Router /occurrences/{seq_id}/aggregate [post]
func OccurrencesAggregateHandler(repo repository.StarrocksDAO) gin.HandlerFunc {
	return func(c *gin.Context) {
		var (
			body  types.AggregationBody
			query types.AggQuery
		)

		// Bind JSON to the struct
		if err := c.ShouldBindJSON(&body); err != nil {
			// Return a 400 Bad Request if validation fails
			HandleValidationError(c, err)
			return
		}

		query, err := types.NewAggregationQuery(body.Field, body.Sqon, types.OccurrencesFields)
		if err != nil {
			HandleValidationError(c, err)
			return
		}
		seqID, err := strconv.Atoi(c.Param("seq_id"))
		if err != nil {
			HandleNotFoundError(c, "seq_id")
			return
		}
		aggregation, err := repo.AggregateOccurrences(seqID, query)
		if err != nil {
			HandleError(c, err)
			return
		}
		c.JSON(http.StatusOK, aggregation)
	}
}

// OccurrencesStatisticsHandler handles statistics of occurrences
// @Summary Statistics of occurrences
// @Id statisticsOccurrences
// @Description Return statistics about a field for a given sequence ID
// @Tags occurrences
// @Security bearerauth
// @Param seq_id path string true "Sequence ID"
// @Param			message	body		types.StatisticsBody	true	"Statistics Body"
// @Accept json
// @Produce json
// @Success 200 {object} types.Statistics
// @Failure 400 {object} types.ApiError
// @Failure 404 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Router /occurrences/{seq_id}/statistics [post]
func OccurrencesStatisticsHandler(repo repository.StarrocksDAO) gin.HandlerFunc {
	return func(c *gin.Context) {
		var (
			body  types.StatisticsBody
			query types.StatisticsQuery
		)

		// Bind JSON to the struct
		if err := c.ShouldBindJSON(&body); err != nil {
			// Return a 400 Bad Request if validation fails
			HandleValidationError(c, err)
			return
		}

		query, err := types.NewStatisticsQuery(body.Field, body.Sqon, types.OccurrencesFields)
		if err != nil {
			HandleValidationError(c, err)
			return
		}
		seqID, err := strconv.Atoi(c.Param("seq_id"))
		if err != nil {
			HandleNotFoundError(c, "seq_id")
			return
		}
		statistics, err := repo.GetStatisticsOccurrences(seqID, query)
		if err != nil {
			HandleError(c, err)
			return
		}
		c.JSON(http.StatusOK, statistics)
	}
}

func extractInterpretationParams(c *gin.Context) (string, string, string) {
	sequencingId := c.Param("sequencing_id")
	locusId := c.Param("locus_id")
	transcriptId := c.Param("transcript_id")
	return sequencingId, locusId, transcriptId
}

func extractUserSetParams(c *gin.Context) string {
	userSetId := c.Param("user_set_id")
	return userSetId
}

func fillInterpretationCommonWithContext(c *gin.Context, interpretation *types.InterpretationCommon) {
	sequencingId, locusId, transcriptId := extractInterpretationParams(c)

	interpretation.SequencingId = sequencingId
	interpretation.LocusId = locusId
	interpretation.TranscriptId = transcriptId

	ginToken, exist := c.Get("token")
	if exist {
		decodedJWT := ginToken.(ginkeycloak.KeyCloakToken)

		interpretation.CreatedBy = decodedJWT.Sub
		interpretation.CreatedByName = decodedJWT.Name

		interpretation.UpdatedBy = decodedJWT.Sub
		interpretation.UpdatedByName = decodedJWT.Name
	}
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

// GetInterpretationGermline
// @Summary Get interpretation germline
// @Id GetInterpretationGermline
// @Description Get interpretation germline
// @Tags interpretations
// @Security bearerauth
// @Param sequencing_id path string true "Sequencing ID"
// @Param locus_id path string true "Locus ID"
// @Param transcript_id path string true "Transcript ID"
// @Produce json
// @Success 200 {object} types.InterpretationGermline
// @Success 206 {object} types.InterpretationGermline
// @Failure 404 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Router /interpretations/germline/{sequencing_id}/{locus_id}/{transcript_id} [get]
func GetInterpretationGermline(repo repository.InterpretationsDAO) gin.HandlerFunc {
	return func(c *gin.Context) {
		sequencingId, locusId, transcriptId := extractInterpretationParams(c)
		interpretation, err := repo.FirstGermline(sequencingId, locusId, transcriptId)
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

// PostInterpretationGermline
// @Summary Create or Update interpretation germline
// @Id PostInterpretationGermline
// @Description Create or Update interpretation germline
// @Tags interpretations
// @Security bearerauth
// @Param sequencing_id path string true "Sequencing ID"
// @Param locus_id path string true "Locus ID"
// @Param transcript_id path string true "Transcript ID"
// @Param message	body		types.InterpretationGermline	true	"Interpretation Body"
// @Accept json
// @Produce json
// @Success 200 {object} types.InterpretationGermline
// @Failure 400 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Router /interpretations/germline/{sequencing_id}/{locus_id}/{transcript_id} [post]
func PostInterpretationGermline(repo repository.InterpretationsDAO) gin.HandlerFunc {
	return func(c *gin.Context) {

		interpretation := &types.InterpretationGermline{}
		err := c.BindJSON(interpretation)

		if err != nil {
			HandleError(c, err)
			return
		}

		fillInterpretationCommonWithContext(c, &interpretation.InterpretationCommon)

		err = repo.CreateOrUpdateGermline(interpretation)

		if err != nil {
			HandleValidationError(c, err)
			return
		}

		c.JSON(http.StatusOK, interpretation)
	}
}

// analysis_id=foo,bar&analysis_id=toto => ["foo", "bar", "toto"]
func extractArrayQueryParam(c *gin.Context, key string) []string {
	all := []string{}
	values := c.QueryArray(key)
	if len(values) > 0 {
		for _, i := range values {
			if strings.Contains(i, ",") {
				idSplit := strings.Split(i, ",")
				for _, i := range idSplit {
					all = append(all, i)
				}
			} else {
				all = append(all, i)
			}
		}
	}
	return all
}

// GetInterpretationSomatic
// @Summary Get interpretation somatic
// @Id GetInterpretationSomatic
// @Description Get interpretation somatic
// @Tags interpretations
// @Security bearerauth
// @Param sequencing_id path string true "Sequencing ID"
// @Param locus_id path string true "Locus ID"
// @Param transcript_id path string true "Transcript ID"
// @Produce json
// @Success 200 {object} types.InterpretationSomatic
// @Success 206 {object} types.InterpretationSomatic
// @Failure 404 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Router /interpretations/somatic/{sequencing_id}/{locus_id}/{transcript_id} [get]
func GetInterpretationSomatic(repo repository.InterpretationsDAO) gin.HandlerFunc {
	return func(c *gin.Context) {
		sequencingId, locusId, transcriptId := extractInterpretationParams(c)
		interpretation, err := repo.FirstSomatic(sequencingId, locusId, transcriptId)
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

// PostInterpretationSomatic
// @Summary Create or Update interpretation somatic
// @Id PostInterpretationSomatic
// @Description Create or Update interpretation somatic
// @Tags interpretations
// @Security bearerauth
// @Param sequencing_id path string true "Sequencing ID"
// @Param locus_id path string true "Locus ID"
// @Param transcript_id path string true "Transcript ID"
// @Param message	body		types.InterpretationSomatic	true	"Interpretation Body"
// @Accept json
// @Produce json
// @Success 200 {object} types.InterpretationSomatic
// @Failure 400 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Router /interpretations/somatic/{sequencing_id}/{locus_id}/{transcript_id} [post]
func PostInterpretationSomatic(repo repository.InterpretationsDAO) gin.HandlerFunc {
	return func(c *gin.Context) {
		interpretation := &types.InterpretationSomatic{}
		err := c.BindJSON(interpretation)

		if err != nil {
			HandleError(c, err)
			return
		}

		fillInterpretationCommonWithContext(c, &interpretation.InterpretationCommon)

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
// @Param citation_id path string true "Citation ID"
// @Produce json
// @Success 200 {object} types.PubmedCitation
// @Success 206 {object} types.PubmedCitation
// @Failure 404 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Router /interpretations/pubmed/{citation_id} [get]
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

// GetUserSet
// @Summary Get user set by id
// @Id GetUserSet
// @Description Get user set
// @Tags user_sets
// @Security bearerauth
// @Param user_set_id path string true "UserSet ID"
// @Produce json
// @Success 200 {object} types.UserSet
// @Failure 404 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Router /users/sets/{user_set_id} [get]
func GetUserSet(repo repository.UserSetsDAO) gin.HandlerFunc {
	return func(c *gin.Context) {
		userSetId := extractUserSetParams(c)
		userSet, err := repo.GetUserSet(userSetId)
		if err != nil {
			HandleError(c, err)
			return
		}
		if userSet == nil {
			HandleNotFoundError(c, "user")
			return
		}
		c.JSON(http.StatusOK, userSet)
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
// @Failure 500 {object} types.ApiError
// @Router /interpretations/germline [get]
func SearchInterpretationGermline(repo repository.InterpretationsDAO) gin.HandlerFunc {
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
// @Failure 500 {object} types.ApiError
// @Router /interpretations/somatic [get]
func SearchInterpretationSomatic(repo repository.InterpretationsDAO) gin.HandlerFunc {
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

// GetSequencing handles retrieving a sequencing by its id
// @Summary Get a Sequencing
// @Id getSequencing
// @Description Retrieve Sequencing data for a given sequence ID
// @Tags sequencing
// @Security bearerauth
// @Param seq_id path string true "Sequence ID"
// @Produce json
// @Success 200 {object} types.Sequencing
// @Failure 404 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Router /sequencing/{seq_id} [get]
func GetSequencing(repo repository.StarrocksDAO) gin.HandlerFunc {
	return func(c *gin.Context) {
		seqID, err := strconv.Atoi(c.Param("seq_id"))
		if err != nil {
			HandleNotFoundError(c, "seq_id")
			return
		}
		sequencing, err := repo.GetSequencing(seqID)
		if err != nil {
			HandleError(c, err)
			return
		}
		if sequencing == nil {
			HandleNotFoundError(c, "sequencing")
			return
		}
		c.JSON(http.StatusOK, sequencing)
	}
}

// GetMondoTermAutoComplete handles retrieving mondo terms by autocomplete
// @Summary Get AutoCompleteTerm list of matching input string with highlighted
// @Id mondoTermAutoComplete
// @Description Retrieve AutoCompleteTerm list of mondo terms matching input string with highlighted
// @Tags mondo
// @Security bearerauth
// @Param prefix query string true "Prefix"
// @Param limit query string false "Limit"
// @Produce json
// @Success 200 {array} types.AutoCompleteTerm
// @Failure 500 {object} types.ApiError
// @Router /mondo/autocomplete [get]
func GetMondoTermAutoComplete(repo repository.StarrocksDAO) gin.HandlerFunc {
	return func(c *gin.Context) {
		prefix := c.Query("prefix")
		limit, err := strconv.Atoi(c.Query("limit"))
		if err != nil {
			limit = 25
		}
		mondoTerms, err := repo.GetTermAutoComplete(types.MondoTable.Name, prefix, limit)
		if err != nil {
			HandleError(c, err)
			return
		}
		c.JSON(http.StatusOK, mondoTerms)
	}
}

// GetHPOTermAutoComplete handles retrieving HPO terms by autocomplete
// @Summary Get AutoCompleteTerm list of matching input string with highlighted
// @Id hpoTermAutoComplete
// @Description Retrieve AutoCompleteTerm list of HPO terms matching input string with highlighted
// @Tags hpo
// @Security bearerauth
// @Param prefix query string true "Prefix"
// @Param limit query string false "Limit"
// @Produce json
// @Success 200 {array} types.AutoCompleteTerm
// @Failure 500 {object} types.ApiError
// @Router /hpo/autocomplete [get]
func GetHPOTermAutoComplete(repo repository.StarrocksDAO) gin.HandlerFunc {
	return func(c *gin.Context) {
		prefix := c.Query("prefix")
		limit, err := strconv.Atoi(c.Query("limit"))
		if err != nil {
			limit = 25
		}
		hpoTerms, err := repo.GetTermAutoComplete(types.HPOTable.Name, prefix, limit)
		if err != nil {
			HandleError(c, err)
			return
		}
		c.JSON(http.StatusOK, hpoTerms)
	}
}

// GetExpendedOccurrence handles retrieving expended information about occurrence
// @Summary Get a ExpendedOccurrence
// @Id getExpendedOccurrence
// @Description Retrieve ExpendedOccurrence data for a given locus ID
// @Tags occurrences
// @Security bearerauth
// @Param seq_id path string true "Sequence ID"
// @Param locus_id path string true "Locus ID"
// @Produce json
// @Success 200 {object} types.ExpendedOccurrence
// @Failure 404 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Router /occurrences/{seq_id}/{locus_id}/expended [get]
func GetExpendedOccurrence(repo repository.StarrocksDAO) gin.HandlerFunc {
	return func(c *gin.Context) {
		seqId, errSeq := strconv.Atoi(c.Param("seq_id"))
		if errSeq != nil {
			HandleNotFoundError(c, "seq_id")
			return
		}
		locusId, errLocus := strconv.Atoi(c.Param("locus_id"))
		if errLocus != nil {
			HandleNotFoundError(c, "locus_id")
			return
		}
		expendedOccurrence, err := repo.GetExpendedOccurrence(seqId, locusId)
		if err != nil {
			HandleError(c, err)
			return
		}
		if expendedOccurrence == nil {
			HandleNotFoundError(c, "occurrence")
			return
		}
		c.JSON(http.StatusOK, expendedOccurrence)
	}
}

// GetVariantOverview handles retrieving a variant overview by its locus
// @Summary Get a VariantOverview
// @Id getVariantOverview
// @Description Retrieve Variant Overview data for a given locus
// @Tags variant
// @Security bearerauth
// @Param locus_id path string true "Locus ID"
// @Produce json
// @Success 200 {object} types.VariantOverview
// @Failure 404 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Router /variants/{locus_id}/overview [get]
func GetVariantOverview(repo repository.StarrocksDAO) gin.HandlerFunc {
	return func(c *gin.Context) {
		locusID, err := strconv.Atoi(c.Param("locus_id"))
		if err != nil {
			HandleNotFoundError(c, "locus_id")
			return
		}
		variantOverview, err := repo.GetVariantOverview(locusID)
		if err != nil {
			HandleError(c, err)
			return
		}
		if variantOverview == nil {
			HandleNotFoundError(c, "variant")
			return
		}
		c.JSON(http.StatusOK, variantOverview)
	}
}
