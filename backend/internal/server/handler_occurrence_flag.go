package server

import (
	"fmt"
	"net/http"
	"slices"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/radiant-network/radiant-api/internal/types"
)

type occurrenceFlagsStore interface {
	Upsert(flag types.OccurrenceFlag) (*types.OccurrenceFlag, error)
	Delete(caseID, seqID, taskID int, occurrenceID string) (int64, error)
}

// UpsertOccurrenceFlagHandler
// @Summary Set or change the flag on an occurrence
// @Id upsertOccurrenceFlag
// @Description Upserts the flag for a given (case_id, occurrence_id, seq_id, task_id). An occurrence has at most one flag per case.
// @Tags occurrence_flags
// @Security bearerauth
// @Param tenant path string true "Tenant code"
// @Param case_id path int true "Case ID"
// @Param seq_id path int true "Seq ID"
// @Param task_id path int true "Task ID"
// @Param occurrence_id path string true "Occurrence ID"
// @Param flag_type query string true "Flag to set"
// @Success 204
// @Failure 400 {object} types.ApiError
// @Failure 401 {object} types.ApiError
// @Failure 403 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Router /{tenant}/occurrences/flags/{case_id}/{seq_id}/{task_id}/{occurrence_id} [post]
func UpsertOccurrenceFlagHandler(repo occurrenceFlagsStore) gin.HandlerFunc {
	return func(c *gin.Context) {
		caseID, err := strconv.Atoi(c.Param("case_id"))
		if err != nil {
			HandleNotFoundError(c, "case_id")
			return
		}

		taskID, err := strconv.Atoi(c.Param("task_id"))
		if err != nil {
			HandleNotFoundError(c, "task_id")
			return
		}

		seqID, err := strconv.Atoi(c.Param("seq_id"))
		if err != nil {
			HandleNotFoundError(c, "seq_id")
			return
		}

		occurrenceID := c.Param("occurrence_id")
		flagType := c.Query("flag_type")

		if !slices.Contains(types.ValidOccurrenceFlagTypes, flagType) {
			HandleValidationError(c, fmt.Errorf("invalid type %q; must be one of %v", flagType, types.ValidOccurrenceFlagTypes))
			return
		}

		if _, err := repo.Upsert(types.OccurrenceFlag{
			CaseID:       caseID,
			OccurrenceID: occurrenceID,
			SeqID:        seqID,
			TaskID:       taskID,
			FlagType:     flagType,
		}); err != nil {
			HandleError(c, err)
			return
		}

		c.Status(http.StatusNoContent)
	}
}

// DeleteOccurrenceFlagHandler
// @Summary Delete the flag on an occurrence
// @Id deleteOccurrenceFlag
// @Description Deletes the flag for a given (case_id, occurrence_id, seq_id, task_id). Returns 404 if no flag exists.
// @Tags occurrence_flags
// @Security bearerauth
// @Param tenant path string true "Tenant code"
// @Param case_id path int true "Case ID"
// @Param seq_id path int true "Seq ID"
// @Param task_id path int true "Task ID"
// @Param occurrence_id path string true "Occurrence ID"
// @Success 204
// @Failure 401 {object} types.ApiError
// @Failure 403 {object} types.ApiError
// @Failure 404 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Router /{tenant}/occurrences/flags/{case_id}/{seq_id}/{task_id}/{occurrence_id} [delete]
func DeleteOccurrenceFlagHandler(repo occurrenceFlagsStore) gin.HandlerFunc {
	return func(c *gin.Context) {
		caseID, err := strconv.Atoi(c.Param("case_id"))
		if err != nil {
			HandleNotFoundError(c, "case_id")
			return
		}

		seqID, err := strconv.Atoi(c.Param("seq_id"))
		if err != nil {
			HandleNotFoundError(c, "seq_id")
			return
		}

		taskID, err := strconv.Atoi(c.Param("task_id"))
		if err != nil {
			HandleNotFoundError(c, "task_id")
			return
		}

		occurrenceID := c.Param("occurrence_id")

		affected, err := repo.Delete(caseID, seqID, taskID, occurrenceID)
		if err != nil {
			HandleError(c, err)
			return
		}
		if affected == 0 {
			HandleNotFoundError(c, "occurrence flag")
			return
		}

		c.Status(http.StatusNoContent)
	}
}
