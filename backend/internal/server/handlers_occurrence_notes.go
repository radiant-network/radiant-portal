package server

import (
	"log"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/microcosm-cc/bluemonday"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/internal/utils"
)

type occurrenceNotesStore interface {
	Create(note types.OccurrenceNote) (*types.OccurrenceNote, error)
	GetByID(id string) (*types.OccurrenceNote, error)
	GetByOccurrence(caseID int, seqID int, taskID int, occurrenceID string) ([]types.OccurrenceNote, error)
	CountByOccurrence(caseID int, seqID int, taskID int, occurrenceID string) (int, error)
	Update(id string, content string) (*types.OccurrenceNote, error)
	Delete(id string) error
}

var htmlPolicy = bluemonday.UGCPolicy()

func sanitizeNoteContent(content string, userID string) string {
	sanitized := htmlPolicy.Sanitize(content)
	if sanitized != content {
		log.Printf("WARN: suspect content detected and sanitized for user %s: %s", userID, content)
	}
	return sanitized
}

// PostOccurrenceNoteHandler
// @Summary Create a note on an occurrence
// @Id postOccurrenceNote
// @Description Create a new note associated with an occurrence (SNV or CNV)
// @Tags occurrence_notes
// @Security bearerauth
// @Param tenant path string true "Tenant code"
// @Param message body types.CreateOccurrenceNoteInput true "Note to create"
// @Accept json
// @Produce json
// @Success 201 {object} types.OccurrenceNote
// @Failure 400 {object} types.ApiError
// @Failure 401 {object} types.ApiError
// @Failure 403 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Header 500 {string} X-Correlation-ID "Unique id correlating this error with the server-side log entry"
// @Router /{tenant}/notes [post]
func PostOccurrenceNoteHandler(repo occurrenceNotesStore, auth utils.Auth) gin.HandlerFunc {
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
			Content:      sanitizeNoteContent(body.Content, *userID),
		}

		created, err := repo.Create(note)
		if err != nil {
			HandleError(c, err)
			return
		}
		c.JSON(http.StatusCreated, created)
	}
}

// PutOccurrenceNoteHandler
// @Summary Update a note on an occurrence
// @Id putOccurrenceNote
// @Description Update the content of an existing note. Only the owner of the note can update it.
// @Tags occurrence_notes
// @Security bearerauth
// @Param tenant path string true "Tenant code"
// @Param id path string true "Note ID"
// @Param message body types.UpdateOccurrenceNoteInput true "Updated content"
// @Accept json
// @Produce json
// @Success 200 {object} types.OccurrenceNote
// @Failure 400 {object} types.ApiError
// @Failure 401 {object} types.ApiError
// @Failure 403 {object} types.ApiError
// @Failure 404 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Header 500 {string} X-Correlation-ID "Unique id correlating this error with the server-side log entry"
// @Router /{tenant}/notes/{id} [put]
func PutOccurrenceNoteHandler(repo occurrenceNotesStore, auth utils.Auth) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")

		var body types.UpdateOccurrenceNoteInput
		if err := c.ShouldBindJSON(&body); err != nil {
			HandleValidationError(c, err)
			return
		}
		userID, err := auth.RetrieveUserIdFromToken(c)
		if err != nil {
			HandleNotFoundError(c, "user id")
			return
		}

		note, err := repo.GetByID(id)
		if err != nil {
			HandleError(c, err)
			return
		}
		if note == nil {
			HandleNotFoundError(c, "note")
			return
		}
		if note.UserID != *userID {
			HandleForbiddenError(c)
			return
		}

		updated, err := repo.Update(id, sanitizeNoteContent(body.Content, *userID))
		if err != nil {
			HandleError(c, err)
			return
		}
		c.JSON(http.StatusOK, updated)
	}
}

// DeleteOccurrenceNoteHandler
// @Summary Delete a note on an occurrence
// @Id deleteOccurrenceNote
// @Description Soft-delete a note by ID. Only the owner of the note can delete it.
// @Tags occurrence_notes
// @Security bearerauth
// @Param tenant path string true "Tenant code"
// @Param id path string true "Note ID"
// @Produce json
// @Success 204
// @Failure 401 {object} types.ApiError
// @Failure 403 {object} types.ApiError
// @Failure 404 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Header 500 {string} X-Correlation-ID "Unique id correlating this error with the server-side log entry"
// @Router /{tenant}/notes/{id} [delete]
func DeleteOccurrenceNoteHandler(repo occurrenceNotesStore, auth utils.Auth) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")

		userID, err := auth.RetrieveUserIdFromToken(c)
		if err != nil {
			HandleNotFoundError(c, "user id")
			return
		}

		note, err := repo.GetByID(id)
		if err != nil {
			HandleError(c, err)
			return
		}
		if note == nil {
			HandleNotFoundError(c, "note")
			return
		}
		if note.UserID != *userID {
			HandleForbiddenError(c)
			return
		}

		if err := repo.Delete(id); err != nil {
			HandleError(c, err)
			return
		}
		c.Status(http.StatusNoContent)
	}
}

// GetOccurrenceNoteCountHandler handles counting notes for an occurrence
// @Summary Count notes for an occurrence
// @Id countOccurrenceNotes
// @Description Count all notes associated with an occurrence
// @Tags occurrence_notes
// @Security bearerauth
// @Param tenant path string true "Tenant code"
// @Param case_id path int true "Case ID"
// @Param seq_id path int true "Sequencing Experiment ID"
// @Param task_id path int true "Task ID"
// @Param occurrence_id path string true "Occurrence ID"
// @Produce json
// @Success 200 {object} types.Count
// @Failure 401 {object} types.ApiError
// @Failure 403 {object} types.ApiError
// @Failure 404 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Header 500 {string} X-Correlation-ID "Unique id correlating this error with the server-side log entry"
// @Router /{tenant}/notes/{case_id}/{seq_id}/{task_id}/{occurrence_id}/count [get]
func GetOccurrenceNoteCountHandler(repo occurrenceNotesStore) gin.HandlerFunc {
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

		count, err := repo.CountByOccurrence(caseID, seqID, taskID, occurrenceID)
		if err != nil {
			HandleError(c, err)
			return
		}
		c.JSON(http.StatusOK, types.Count{int64(count)})
	}
}

// GetOccurrenceNotesHandler
// @Summary Get notes for an occurrence
// @Id getOccurrenceNotes
// @Description Get all notes associated with an occurrence
// @Tags occurrence_notes
// @Security bearerauth
// @Param tenant path string true "Tenant code"
// @Param case_id path int true "Case ID"
// @Param seq_id path int true "Sequencing Experiment ID"
// @Param task_id path int true "Task ID"
// @Param occurrence_id path string true "Occurrence ID"
// @Produce json
// @Success 200 {array} types.OccurrenceNote
// @Failure 401 {object} types.ApiError
// @Failure 403 {object} types.ApiError
// @Failure 404 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Header 500 {string} X-Correlation-ID "Unique id correlating this error with the server-side log entry"
// @Router /{tenant}/notes/{case_id}/{seq_id}/{task_id}/{occurrence_id} [get]
func GetOccurrenceNotesHandler(repo occurrenceNotesStore) gin.HandlerFunc {
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
