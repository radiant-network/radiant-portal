package server

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/radiant-network/radiant-api/internal/repository"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/internal/utils"
)

// PostOccurrenceSNVNoteHandler
// @Summary Create a note on a SNV occurrence
// @Id postOccurrenceSNVNote
// @Description Create a new note associated with a germline SNV occurrence
// @Tags occurrence_notes
// @Security bearerauth
// @Param case_id path int true "Case ID"
// @Param seq_id path int true "Sequencing Experiment ID"
// @Param locus_id path int true "Locus ID"
// @Param message body types.CreateOccurrenceNoteInput true "Note to create"
// @Accept json
// @Produce json
// @Success 201 {object} types.OccurrenceNote
// @Failure 400 {object} types.ApiError
// @Failure 404 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Router /occurrences/germline/snv/{case_id}/{seq_id}/{locus_id}/notes [post]
func PostOccurrenceSNVNoteHandler(repo repository.OccurrenceNotesDAO, auth utils.Auth) gin.HandlerFunc {
	return postOccurrenceNoteHandler(repo, auth, "snv", "locus_id")
}

// PostOccurrenceCNVNoteHandler
// @Summary Create a note on a CNV occurrence
// @Id postOccurrenceCNVNote
// @Description Create a new note associated with a germline CNV occurrence
// @Tags occurrence_notes
// @Security bearerauth
// @Param case_id path int true "Case ID"
// @Param seq_id path int true "Sequencing Experiment ID"
// @Param cnv_id path int true "CNV ID"
// @Param message body types.CreateOccurrenceNoteInput true "Note to create"
// @Accept json
// @Produce json
// @Success 201 {object} types.OccurrenceNote
// @Failure 400 {object} types.ApiError
// @Failure 404 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Router /occurrences/germline/cnv/{case_id}/{seq_id}/{cnv_id}/notes [post]
func PostOccurrenceCNVNoteHandler(repo repository.OccurrenceNotesDAO, auth utils.Auth) gin.HandlerFunc {
	return postOccurrenceNoteHandler(repo, auth, "cnv", "cnv_id")
}

func postOccurrenceNoteHandler(repo repository.OccurrenceNotesDAO, auth utils.Auth, noteType string, occurrenceIDParam string) gin.HandlerFunc {
	return func(c *gin.Context) {
		var body types.CreateOccurrenceNoteInput
		if err := c.ShouldBindJSON(&body); err != nil {
			HandleValidationError(c, err)
			return
		}

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

		occurrenceID, err := strconv.ParseInt(c.Param(occurrenceIDParam), 10, 64)
		if err != nil {
			HandleNotFoundError(c, occurrenceIDParam)
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
			Type:         noteType,
			CaseID:       caseID,
			SeqID:        seqID,
			OccurrenceID: occurrenceID,
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

// GetOccurrenceSNVNotesHandler
// @Summary Get notes for a SNV occurrence
// @Id getOccurrenceSNVNotes
// @Description Get all notes associated with a germline SNV occurrence
// @Tags occurrence_notes
// @Security bearerauth
// @Param case_id path int true "Case ID"
// @Param seq_id path int true "Sequencing Experiment ID"
// @Param locus_id path int true "Locus ID"
// @Produce json
// @Success 200 {array} types.OccurrenceNote
// @Failure 404 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Router /occurrences/germline/snv/{case_id}/{seq_id}/{locus_id}/notes [get]
func GetOccurrenceSNVNotesHandler(repo repository.OccurrenceNotesDAO) gin.HandlerFunc {
	return getOccurrenceNotesHandler(repo, "snv", "locus_id")
}

// GetOccurrenceCNVNotesHandler
// @Summary Get notes for a CNV occurrence
// @Id getOccurrenceCNVNotes
// @Description Get all notes associated with a germline CNV occurrence
// @Tags occurrence_notes
// @Security bearerauth
// @Param case_id path int true "Case ID"
// @Param seq_id path int true "Sequencing Experiment ID"
// @Param cnv_id path int true "CNV ID"
// @Produce json
// @Success 200 {array} types.OccurrenceNote
// @Failure 404 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Router /occurrences/germline/cnv/{case_id}/{seq_id}/{cnv_id}/notes [get]
func GetOccurrenceCNVNotesHandler(repo repository.OccurrenceNotesDAO) gin.HandlerFunc {
	return getOccurrenceNotesHandler(repo, "cnv", "cnv_id")
}

func getOccurrenceNotesHandler(repo repository.OccurrenceNotesDAO, noteType string, occurrenceIDParam string) gin.HandlerFunc {
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

		occurrenceID, err := strconv.ParseInt(c.Param(occurrenceIDParam), 10, 64)
		if err != nil {
			HandleNotFoundError(c, occurrenceIDParam)
			return
		}

		notes, err := repo.GetByOccurrence(noteType, caseID, seqID, occurrenceID)
		if err != nil {
			HandleError(c, err)
			return
		}
		c.JSON(http.StatusOK, notes)
	}
}
