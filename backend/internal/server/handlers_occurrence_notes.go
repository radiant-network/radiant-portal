package server

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/radiant-network/radiant-api/internal/repository"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/internal/utils"
)

// PostOccurrenceNoteHandler
// @Summary Create a note on an occurrence
// @Id postOccurrenceNote
// @Description Create a new note associated with an occurrence (SNV or CNV)
// @Tags occurrence_notes
// @Security bearerauth
// @Param message body types.CreateOccurrenceNoteInput true "Note to create"
// @Accept json
// @Produce json
// @Success 201 {object} types.OccurrenceNote
// @Failure 400 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Router /notes [post]
func PostOccurrenceNoteHandler(repo repository.OccurrenceNotesDAO, auth utils.Auth) gin.HandlerFunc {
	return func(c *gin.Context) {
		var body types.CreateOccurrenceNoteInput
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

		note := types.OccurrenceNote{
			CaseID:       body.CaseID,
			SeqID:        body.SeqID,
			TaskID:       body.TaskID,
			OccurrenceID: body.OccurrenceID,
			UserID:       *userID,
			UserName:     *fullName,
			Content:      body.Content,
		}

		created, err := repo.Create(note)
		if err != nil {
			HandleError(c, err)
			return
		}
		c.JSON(http.StatusCreated, created)
	}
}

// GetOccurrenceNotesHandler
// @Summary Get notes for an occurrence
// @Id getOccurrenceNotes
// @Description Get all notes associated with an occurrence
// @Tags occurrence_notes
// @Security bearerauth
// @Param case_id path int true "Case ID"
// @Param seq_id path int true "Sequencing Experiment ID"
// @Param task_id path int true "Task ID"
// @Param occurrence_id path string true "Occurrence ID"
// @Produce json
// @Success 200 {array} types.OccurrenceNote
// @Failure 404 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Router /notes/{case_id}/{seq_id}/{task_id}/{occurrence_id} [get]
func GetOccurrenceNotesHandler(repo repository.OccurrenceNotesDAO) gin.HandlerFunc {
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

		notes, err := repo.GetByOccurrence(caseID, seqID, taskID, occurrenceID)
		if err != nil {
			HandleError(c, err)
			return
		}
		c.JSON(http.StatusOK, notes)
	}
}
