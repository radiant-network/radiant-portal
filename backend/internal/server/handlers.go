package server

import (
	"net/http"
	"strconv"

	"github.com/Ferlab-Ste-Justine/radiant-api/internal/repository"
	"github.com/Ferlab-Ste-Justine/radiant-api/internal/types"
	"github.com/gin-gonic/gin"
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
		if body.Limit != 0 && body.Offset != 0 {
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
// @Success 200 {object} types.Aggregation
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

func GetInterpretationGermline(repo repository.PostgresDAO) gin.HandlerFunc {
	return func(c *gin.Context) {
		sequencingId := c.Param("sequencing_id")
		locus := c.Param("locus")
		transcriptId := c.Param("transcript_id")
		interpretation, err := repo.FindInterpretationGermline(sequencingId, locus, transcriptId)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
			return
		}
		c.JSON(http.StatusOK, interpretation)
	}
}