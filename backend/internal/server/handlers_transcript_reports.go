package server

import (
	"context"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/radiant-network/radiant-api/internal/types"
)

type germlineReportBuilder interface {
	Build(ctx context.Context, caseId int, seqId int, taskId int, locusIds []int) ([]types.TranscriptReport, error)
}

// GetGermlineSNVTranscriptReport returns the report object of one germline SNV occurrence
// @Summary Get the transcript report object of a germline SNV occurrence
// @Id getGermlineSNVTranscriptReport
// @Description Retrieve the data behind the transcript report of one germline SNV occurrence of a case: case context, variant, occurrence, genes with OMIM and one entry per transcript row (one row per Ensembl transcript, MANE Select first, RefSeq transcript shown through the MANE pair).
// @Tags occurrences
// @Security bearerauth
// @Param tenant path string true "Tenant code"
// @Param case_id path int true "Case ID"
// @Param seq_id path int true "Sequence ID"
// @Param task_id path int true "Task ID"
// @Param locus_id path string true "Locus ID"
// @Produce json
// @Success 200 {object} types.TranscriptReport
// @Failure 401 {object} types.ApiError
// @Failure 403 {object} types.ApiError
// @Failure 404 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Header 500 {string} X-Correlation-ID "Unique id correlating this error with the server-side log entry"
// @Router /{tenant}/occurrences/germline/snv/{case_id}/{seq_id}/{task_id}/{locus_id}/report [get]
func GetGermlineSNVTranscriptReport(builder germlineReportBuilder) gin.HandlerFunc {
	return func(c *gin.Context) {
		caseId, err := strconv.Atoi(c.Param("case_id"))
		if err != nil {
			HandleNotFoundError(c, "case_id")
			return
		}
		seqId, err := strconv.Atoi(c.Param("seq_id"))
		if err != nil {
			HandleNotFoundError(c, "seq_id")
			return
		}
		taskId, err := strconv.Atoi(c.Param("task_id"))
		if err != nil {
			HandleNotFoundError(c, "task_id")
			return
		}
		locusId, err := strconv.Atoi(c.Param("locus_id"))
		if err != nil {
			HandleNotFoundError(c, "locus_id")
			return
		}

		reports, err := builder.Build(c.Request.Context(), caseId, seqId, taskId, []int{locusId})
		if err != nil {
			HandleError(c, err)
			return
		}
		if len(reports) == 0 {
			HandleNotFoundError(c, "occurrence")
			return
		}
		c.JSON(http.StatusOK, reports[0])
	}
}
