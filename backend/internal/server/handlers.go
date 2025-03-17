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
// @Failure 400 {object} map[string]string
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
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
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
		query, err := types.NewListQuery(body.SelectedFields, body.Sqon, types.OccurrencesFields, &p, body.Sort)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		seqID, err := strconv.Atoi(c.Param("seq_id"))
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
			return
		}
		occurrences, err := repo.GetOccurrences(seqID, query)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
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
// @Failure 400 {object} map[string]string
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
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		query, err := types.NewCountQuery(body.Sqon, types.OccurrencesFields)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		seqID, err := strconv.Atoi(c.Param("seq_id"))
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
			return
		}
		count, err := repo.CountOccurrences(seqID, query)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
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
// @Failure 400 {object} map[string]string
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
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		query, err := types.NewAggregationQuery(body.Field, body.Sqon, types.OccurrencesFields)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		seqID, err := strconv.Atoi(c.Param("seq_id"))
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
			return
		}
		aggregation, err := repo.AggregateOccurrences(seqID, query)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
			return
		}
		c.JSON(http.StatusOK, aggregation)
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
// @Failure 404 {object} map[string]string
// @Router /interpretations/germline/{sequencing_id}/{locus_id}/{transcript_id} [get]
func GetInterpretationGermline(repo repository.InterpretationsDAO) gin.HandlerFunc {
	return func(c *gin.Context) {
		sequencingId, locusId, transcriptId := extractInterpretationParams(c)
		interpretation, err := repo.FirstGermline(sequencingId, locusId, transcriptId)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
			return
		}
		if interpretation == nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
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
// @Param sequencing_id path string true "Sequencing ID"
// @Param locus_id path string true "Locus ID"
// @Param transcript_id path string true "Transcript ID"
// @Param message	body		types.InterpretationGermline	true	"Interpretation Body"
// @Accept json
// @Produce json
// @Success 200 {object} types.InterpretationGermline
// @Failure 400 {object} map[string]string
// @Router /interpretations/germline/{sequencing_id}/{locus_id}/{transcript_id} [post]
func PostInterpretationGermline(repo repository.InterpretationsDAO) gin.HandlerFunc {
	return func(c *gin.Context) {

		interpretation := &types.InterpretationGermline{}
		err := c.BindJSON(interpretation)

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
			return
		}

		fillInterpretationCommonWithContext(c, &interpretation.InterpretationCommon)

		err = repo.CreateOrUpdateGermline(interpretation)

		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
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
// @Failure 404 {object} map[string]string
// @Router /interpretations/somatic/{sequencing_id}/{locus_id}/{transcript_id} [get]
func GetInterpretationSomatic(repo repository.InterpretationsDAO) gin.HandlerFunc {
	return func(c *gin.Context) {
		sequencingId, locusId, transcriptId := extractInterpretationParams(c)
		interpretation, err := repo.FirstSomatic(sequencingId, locusId, transcriptId)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
			return
		}
		if interpretation == nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
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
// @Param sequencing_id path string true "Sequencing ID"
// @Param locus_id path string true "Locus ID"
// @Param transcript_id path string true "Transcript ID"
// @Param message	body		types.InterpretationSomatic	true	"Interpretation Body"
// @Accept json
// @Produce json
// @Success 200 {object} types.InterpretationSomatic
// @Failure 400 {object} map[string]string
// @Router /interpretations/somatic/{sequencing_id}/{locus_id}/{transcript_id} [post]
func PostInterpretationSomatic(repo repository.InterpretationsDAO) gin.HandlerFunc {
	return func(c *gin.Context) {
		interpretation := &types.InterpretationSomatic{}
		err := c.BindJSON(interpretation)

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
			return
		}

		fillInterpretationCommonWithContext(c, &interpretation.InterpretationCommon)

		err = repo.CreateOrUpdateSomatic(interpretation)

		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
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
// @Failure 404 {object} map[string]string
// @Router /interpretations/pubmed/{citation_id} [get]
func GetPubmedCitation(pubmedClient client.PubmedClientService) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("citation_id")
		citation, err := pubmedClient.GetCitationById(id)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
			return
		}
		if citation == nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
			return
		}
		c.JSON(http.StatusOK, citation)
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
// @Failure 404 {object} map[string]string
// @Router /users/sets/{user_set_id} [get]
func GetUserSet(repo repository.UserSetsDAO) gin.HandlerFunc {
	return func(c *gin.Context) {
		userSetId := extractUserSetParams(c)
		userSet, err := repo.GetUserSet(userSetId)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
			return
		}
		if userSet == nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
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
// @Router /interpretations/germline [get]
func SearchInterpretationGermline(repo repository.InterpretationsDAO) gin.HandlerFunc {
	return func(c *gin.Context) {
		analysisIds := extractArrayQueryParam(c, "analysis_id")
		patientIds := extractArrayQueryParam(c, "patient_id")
		variantHashIds := extractArrayQueryParam(c, "variant_hash")
		interpretations, err := repo.SearchGermline(analysisIds, patientIds, variantHashIds)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
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
// @Router /interpretations/somatic [get]
func SearchInterpretationSomatic(repo repository.InterpretationsDAO) gin.HandlerFunc {
	return func(c *gin.Context) {
		analysisIds := extractArrayQueryParam(c, "analysis_id")
		patientIds := extractArrayQueryParam(c, "patient_id")
		variantHashIds := extractArrayQueryParam(c, "variant_hash")
		interpretations, err := repo.SearchSomatic(analysisIds, patientIds, variantHashIds)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
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
// @Failure 500 {object} map[string]string
// @Router /sequencing/{seq_id} [get]
func GetSequencing(repo repository.StarrocksDAO) gin.HandlerFunc {
	return func(c *gin.Context) {
		seqID, err := strconv.Atoi(c.Param("seq_id"))
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
			return
		}
		sequencing, err := repo.GetSequencing(seqID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
			return
		}
		if sequencing == nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
			return
		}
		c.JSON(http.StatusOK, sequencing)
	}
}
