package server

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/radiant-network/radiant-api/internal/repository"
	"github.com/radiant-network/radiant-api/internal/types"
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
		savedFilterId := c.Param("saved_filter_id")
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

// GetSavedFiltersHandler
// @Summary Get user saved filters
// @Id getSavedFilters
// @Description Get user saved filters
// @Tags saved_filters
// @Security bearerauth
// @Param type query string false "Saved Filter Type"
// @Produce json
// @Success 200 {array} types.SavedFilter
// @Failure 401 {object} types.ApiError
// @Failure 404 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Router /users/saved_filters [get]
func GetSavedFiltersHandler(repo repository.SavedFiltersDAO, auth utils.Auth) gin.HandlerFunc {
	return func(c *gin.Context) {
		savedFilterType := c.Query("type")
		userId, err := auth.RetrieveUserIdFromToken(c)
		if err != nil {
			HandleNotFoundError(c, "user id")
			return
		}

		savedFilters, err := repo.GetSavedFiltersByUserID(*userId, savedFilterType)

		if err != nil {
			HandleError(c, err)
			return
		}
		c.JSON(http.StatusOK, savedFilters)
	}
}

// PostSavedFilterHandler
// @Summary Create a new saved filter
// @Id postSavedFilter
// @Description Create a new saved filter
// @Tags saved_filters
// @Security bearerauth
// @Param			message	body		types.SavedFilterCreationInput	true	"New Saved Filter to create"
// @Accept json
// @Produce json
// @Success 201 {object} types.SavedFilter
// @Failure 400 {object} types.ApiError
// @Failure 404 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Router /users/saved_filters [post]
func PostSavedFilterHandler(repo repository.SavedFiltersDAO, auth utils.Auth) gin.HandlerFunc {
	return func(c *gin.Context) {
		var (
			body types.SavedFilterCreationInput
		)

		// Bind JSON to the struct
		if err := c.ShouldBindJSON(&body); err != nil {
			// Return a 400 Bad Request if validation fails
			HandleValidationError(c, err)
			return
		}
		userId, err := auth.RetrieveUserIdFromToken(c)
		if err != nil {
			HandleNotFoundError(c, "user id")
			return
		}
		savedFilter, err := repo.CreateSavedFilter(body, *userId)
		if err != nil {
			HandleError(c, err)
			return
		}
		c.JSON(http.StatusCreated, savedFilter)
	}
}

// PutSavedFilterHandler
// @Summary Update a saved filter
// @Id putSavedFilter
// @Description Update a saved filter
// @Tags saved_filters
// @Security bearerauth
// @Param saved_filter_id path string true "Saved Filter ID"
// @Param			message	body		types.SavedFilterUpdateInput	true	"Saved Filter to update"
// @Accept json
// @Produce json
// @Success 200 {object} types.SavedFilter
// @Failure 400 {object} types.ApiError
// @Failure 404 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Router /users/saved_filters/{saved_filter_id} [put]
func PutSavedFilterHandler(repo repository.SavedFiltersDAO, auth utils.Auth) gin.HandlerFunc {
	return func(c *gin.Context) {
		var (
			body types.SavedFilterUpdateInput
		)

		// Bind JSON to the struct
		if err := c.ShouldBindJSON(&body); err != nil {
			// Return a 400 Bad Request if validation fails
			HandleValidationError(c, err)
			return
		}
		userId, err := auth.RetrieveUserIdFromToken(c)
		if err != nil {
			HandleNotFoundError(c, "user id")
			return
		}
		savedFilterId := c.Param("saved_filter_id")
		if err != nil {
			HandleNotFoundError(c, "saved_filter_id")
			return
		}
		savedFilter, err := repo.GetSavedFilterByID(savedFilterId)
		if err != nil || savedFilter == nil || (*savedFilter).UserID != *userId {
			HandleNotFoundError(c, "saved filter")
			return
		}
		updatedSavedFilter, err := repo.UpdateSavedFilter(body, savedFilterId, *userId)
		if err != nil {
			HandleError(c, err)
			return
		}
		c.JSON(http.StatusOK, updatedSavedFilter)
	}
}

// DeleteSavedFilterHandler
// @Summary Delete a saved filter
// @Id deleteSavedFilter
// @Description Delete a saved filter
// @Tags saved_filters
// @Security bearerauth
// @Param saved_filter_id path string true "Saved Filter ID"
// @Produce json
// @Success 204
// @Failure 404 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Router /users/saved_filters/{saved_filter_id} [delete]
func DeleteSavedFilterHandler(repo repository.SavedFiltersDAO, auth utils.Auth) gin.HandlerFunc {
	return func(c *gin.Context) {
		userId, err := auth.RetrieveUserIdFromToken(c)
		if err != nil {
			HandleNotFoundError(c, "user id")
			return
		}
		savedFilterId := c.Param("saved_filter_id")
		if err != nil {
			HandleNotFoundError(c, "saved_filter_id")
			return
		}
		savedFilter, err := repo.GetSavedFilterByID(savedFilterId)
		if err != nil || savedFilter == nil || (*savedFilter).UserID != *userId {
			HandleNotFoundError(c, "saved filter")
			return
		}
		err = repo.DeleteSavedFilter(savedFilterId, *userId)
		if err != nil {
			HandleError(c, err)
			return
		}
		c.Status(http.StatusNoContent)
	}
}
