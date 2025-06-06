package server

import (
	"github.com/gin-gonic/gin"
	"github.com/radiant-network/radiant-api/internal/repository"
	"github.com/radiant-network/radiant-api/internal/types"
	"net/http"
	"strconv"
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

func extractUserSetParams(c *gin.Context) string {
	userSetId := c.Param("user_set_id")
	return userSetId
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
func GetSequencing(repo repository.SequencingDAO) gin.HandlerFunc {
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
func GetMondoTermAutoComplete(repo repository.TermsDAO) gin.HandlerFunc {
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
func GetHPOTermAutoComplete(repo repository.TermsDAO) gin.HandlerFunc {
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
