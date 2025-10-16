package server

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/radiant-network/radiant-api/internal/repository"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/internal/utils"
)

// GetUserPreferencesHandler
// @Summary Get user preferences
// @Id getUserPreferences
// @Description Get user preferences
// @Tags user_preferences
// @Security bearerauth
// @Produce json
// @Success 200 {object} types.UserPreference
// @Failure 404 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Router /users/preferences [get]
func GetUserPreferencesHandler(repo repository.UserPreferencesDAO, auth utils.Auth) gin.HandlerFunc {
	return func(c *gin.Context) {
		userId, err := auth.RetrieveUserIdFromToken(c)
		if err != nil {
			HandleNotFoundError(c, "user id")
			return
		}
		userPreference, err := repo.GetUserPreferences(*userId)
		if err != nil {
			HandleError(c, err)
			return
		}
		if userPreference == nil {
			HandleNotFoundError(c, "user preferences")
			return
		}
		c.JSON(http.StatusOK, userPreference)
	}
}

// UpdateUserPreferencesHandler
// @Summary Create or update user preference
// @Id postUserPreferences
// @Description Create or update user preference
// @Tags user_preferences
// @Security bearerauth
// @Param			message	body		types.UserPreference	true	"User Preference to create or update"
// @Accept json
// @Produce json
// @Success 200 {object} types.UserPreference
// @Failure 400 {object} types.ApiError
// @Failure 404 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Router /users/preferences [post]
func UpdateUserPreferencesHandler(repo repository.UserPreferencesDAO, auth utils.Auth) gin.HandlerFunc {
	return func(c *gin.Context) {
		var (
			body types.UserPreference
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
		userPreference, err := repo.UpdateUserPreferences(*userId, body)
		if err != nil {
			HandleError(c, err)
			return
		}
		c.JSON(http.StatusOK, userPreference)
	}
}
