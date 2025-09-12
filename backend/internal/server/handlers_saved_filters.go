package server

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/radiant-network/radiant-api/internal/repository"
	"github.com/radiant-network/radiant-api/internal/utils"
)

// GetSavedFilterByIDHandler
// @Summary Get saved filter by id
// @Id getSavedFilterById
// @Description Get saved filter by id
// @Tags saved_filters
// @Security bearerauth
// @Param saved_filter_id path string true "Saved Filter ID"
// @Produce json
// @Success 200 {object} types.SavedFilter
// @Failure 404 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Router /users/saved_filters/{saved_filter_id} [get]
func GetSavedFilterByIDHandler(repo repository.SavedFiltersDAO) gin.HandlerFunc {
	return func(c *gin.Context) {
		savedFilterId, err := strconv.Atoi(c.Param("saved_filter_id"))
		if err != nil {
			HandleNotFoundError(c, "saved_filter_id")
			return
		}
		savedFilter, err := repo.GetSavedFilterByID(savedFilterId)
		if err != nil {
			HandleError(c, err)
			return
		}
		if savedFilter == nil {
			HandleNotFoundError(c, "saved filter")
			return
		}
		c.JSON(http.StatusOK, savedFilter)
	}
}

// GetSavedFiltersByUserIDHandler
// @Summary Get user saved filters
// @Id getSavedFiltersByUserID
// @Description Get user saved filters
// @Tags saved_filters
// @Security bearerauth
// @Param user_id path string true "User ID"
// @Produce json
// @Success 200 {array} types.SavedFilter
// @Failure 401 {object} types.ApiError
// @Failure 404 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Router /users/{user_id}/saved_filters [get]
func GetSavedFiltersByUserIDHandler(repo repository.SavedFiltersDAO, auth utils.Auth) gin.HandlerFunc {
	return func(c *gin.Context) {
		userIdFromPath := c.Param("user_id")
		userId, err := auth.RetrieveUserIdFromToken(c)
		if err != nil {
			HandleNotFoundError(c, "user id")
			return
		}
		if *userId != userIdFromPath {
			HandleUnauthorizedError(c)
			return
		}
		savedFilters, err := repo.GetSavedFiltersByUserID(*userId)
		if err != nil {
			HandleError(c, err)
			return
		}
		c.JSON(http.StatusOK, savedFilters)
	}
}

// GetSavedFiltersByUserIDAndTypeHandler
// @Summary Get user saved filters by type
// @Id getSavedFiltersByUserIDAndType
// @Description Get user saved filters by type
// @Tags saved_filters
// @Security bearerauth
// @Param user_id path string true "User ID"
// @Param saved_filter_type path string true "Saved Filter Type"
// @Produce json
// @Success 200 {array} types.SavedFilter
// @Failure 401 {object} types.ApiError
// @Failure 404 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Router /users/{user_id}/saved_filters/{saved_filter_type} [get]
func GetSavedFiltersByUserIDAndTypeHandler(repo repository.SavedFiltersDAO, auth utils.Auth) gin.HandlerFunc {
	return func(c *gin.Context) {
		userIdFromPath := c.Param("user_id")
		savedFilterType := c.Param("saved_filter_type")
		userId, err := auth.RetrieveUserIdFromToken(c)
		if err != nil {
			HandleNotFoundError(c, "user id")
			return
		}
		if *userId != userIdFromPath {
			HandleUnauthorizedError(c)
			return
		}
		savedFilters, err := repo.GetSavedFiltersByUserIDAndType(*userId, savedFilterType)
		if err != nil {
			HandleError(c, err)
			return
		}
		c.JSON(http.StatusOK, savedFilters)
	}
}
