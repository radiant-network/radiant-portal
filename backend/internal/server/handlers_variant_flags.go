package server

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/radiant-network/radiant-api/internal/repository"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/internal/utils"
)

// PutVariantFlagHandler
// @Summary Set or change the flag on a variant
// @Id putVariantFlag
// @Description Upserts the flag for a given (case_id, occurrence_id). An occurrence has at most one flag per case.
// @Tags variant_flags
// @Security bearerauth
// @Param case_id path int true "Case ID"
// @Param occurrence_id path string true "Occurrence ID (locus_id for SNV, cnv_id for CNV)"
// @Param message body types.SetVariantFlagInput true "Flag to set"
// @Accept json
// @Produce json
// @Success 200 {object} types.VariantFlag
// @Failure 400 {object} types.ApiError
// @Failure 404 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Router /variant-flags/{case_id}/{occurrence_id} [put]
func PutVariantFlagHandler(repo repository.VariantFlagsDAO, auth utils.Auth) gin.HandlerFunc {
	return func(c *gin.Context) {
		caseID, err := strconv.Atoi(c.Param("case_id"))
		if err != nil {
			HandleNotFoundError(c, "case_id")
			return
		}
		occurrenceID := c.Param("occurrence_id")

		var body types.SetVariantFlagInput
		if err := c.ShouldBindJSON(&body); err != nil {
			HandleValidationError(c, err)
			return
		}

		userID, err := auth.RetrieveUserIdFromToken(c)
		if err != nil {
			HandleNotFoundError(c, "user id")
			return
		}
		fullName, err := auth.RetrieveFullNameFromToken(c)
		if err != nil {
			HandleNotFoundError(c, "user name")
			return
		}

		flag := types.VariantFlag{
			CaseID:       caseID,
			OccurrenceID: occurrenceID,
			FlagType:     body.FlagType,
			UserID:       *userID,
			UserName:     *fullName,
		}

		saved, err := repo.Upsert(flag)
		if err != nil {
			HandleError(c, err)
			return
		}
		c.JSON(http.StatusOK, saved)
	}
}

// DeleteVariantFlagHandler
// @Summary Clear the flag on a variant
// @Id deleteVariantFlag
// @Description Removes the flag for a given (case_id, occurrence_id). Idempotent: succeeds even if no flag exists.
// @Tags variant_flags
// @Security bearerauth
// @Param case_id path int true "Case ID"
// @Param occurrence_id path string true "Occurrence ID (locus_id for SNV, cnv_id for CNV)"
// @Produce json
// @Success 204
// @Failure 404 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Router /variant-flags/{case_id}/{occurrence_id} [delete]
func DeleteVariantFlagHandler(repo repository.VariantFlagsDAO) gin.HandlerFunc {
	return func(c *gin.Context) {
		caseID, err := strconv.Atoi(c.Param("case_id"))
		if err != nil {
			HandleNotFoundError(c, "case_id")
			return
		}
		occurrenceID := c.Param("occurrence_id")

		if err := repo.Delete(caseID, occurrenceID); err != nil {
			HandleError(c, err)
			return
		}
		c.Status(http.StatusNoContent)
	}
}

// GetVariantFlagsByCaseHandler
// @Summary Get all variant flags for a case
// @Id getVariantFlagsByCase
// @Description Returns all flags for the given case, for bulk decoration of the variant table.
// @Tags variant_flags
// @Security bearerauth
// @Param case_id path int true "Case ID"
// @Produce json
// @Success 200 {array} types.VariantFlag
// @Failure 404 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Router /variant-flags/{case_id} [get]
func GetVariantFlagsByCaseHandler(repo repository.VariantFlagsDAO) gin.HandlerFunc {
	return func(c *gin.Context) {
		caseID, err := strconv.Atoi(c.Param("case_id"))
		if err != nil {
			HandleNotFoundError(c, "case_id")
			return
		}

		flags, err := repo.GetByCase(caseID)
		if err != nil {
			HandleError(c, err)
			return
		}
		c.JSON(http.StatusOK, flags)
	}
}

// GetVariantFlagHandler
// @Summary Get the flag for a single occurrence
// @Id getVariantFlag
// @Description Returns the flag for the given (case_id, occurrence_id), or 404 if not flagged.
// @Tags variant_flags
// @Security bearerauth
// @Param case_id path int true "Case ID"
// @Param occurrence_id path string true "Occurrence ID (locus_id for SNV, cnv_id for CNV)"
// @Produce json
// @Success 200 {object} types.VariantFlag
// @Failure 404 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Router /variant-flags/{case_id}/{occurrence_id} [get]
func GetVariantFlagHandler(repo repository.VariantFlagsDAO) gin.HandlerFunc {
	return func(c *gin.Context) {
		caseID, err := strconv.Atoi(c.Param("case_id"))
		if err != nil {
			HandleNotFoundError(c, "case_id")
			return
		}
		occurrenceID := c.Param("occurrence_id")

		flag, err := repo.GetByCaseOccurrence(caseID, occurrenceID)
		if err != nil {
			HandleError(c, err)
			return
		}
		if flag == nil {
			HandleNotFoundError(c, "variant flag")
			return
		}
		c.JSON(http.StatusOK, flag)
	}
}
