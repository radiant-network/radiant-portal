package server

import (
	"context"
	"errors"
	"fmt"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/radiant-network/radiant-api/internal/report"
	"github.com/radiant-network/radiant-api/internal/types"
)

type transcriptReportBuilder interface {
	BuildGermline(ctx context.Context, caseId int, seqId int, taskId int, locusIds []int) ([]types.TranscriptReport, error)
	BuildSomatic(ctx context.Context, caseId int, seqId int, taskId int, locusIds []int) ([]types.TranscriptReport, error)
}

type reportBuildFunc func(ctx context.Context, caseId int, seqId int, taskId int, locusIds []int) ([]types.TranscriptReport, error)

const (
	transcriptReportMaxLoci = 100
	xlsxContentType         = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
)

type transcriptReportRenderer interface {
	Render(tenant string, kind report.Kind, reports []types.TranscriptReport) ([]byte, error)
}

// GetGermlineSNVTranscriptReportsXlsx downloads the transcript report workbook of germline SNV occurrences
// @Summary Download the transcript report (xlsx) of germline SNV occurrences of a case
// @Id getGermlineSNVTranscriptReportsXlsx
// @Description Fill the tenant's germline transcript report template with the report object of each locus, one sheet per locus named after its hgvsg, and return the workbook. 1 to 100 locus ids.
// @Tags occurrences
// @Security bearerauth
// @Param tenant path string true "Tenant code"
// @Param case_id path int true "Case ID"
// @Param seq_id path int true "Sequence ID"
// @Param task_id path int true "Task ID"
// @Param locus_ids query string true "Comma-separated locus ids, 1 to 100"
// @Produce application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
// @Success 200 {string} binary "xlsx workbook"
// @Header 200 {string} Content-Disposition "attachment; filename=<MRN>_<case id>_<UTC timestamp>.xlsx"
// @Failure 400 {object} types.ApiError "Zero, more than 100 or malformed locus ids"
// @Failure 401 {object} types.ApiError
// @Failure 403 {object} types.ApiError
// @Failure 404 {object} types.ApiError "A locus is not an occurrence of the task"
// @Failure 500 {object} types.ApiError
// @Failure 503 {object} types.ApiError "The tenant has no transcript report template loaded"
// @Header 500 {string} X-Correlation-ID "Unique id correlating this error with the server-side log entry"
// @Router /{tenant}/occurrences/germline/snv/{case_id}/{seq_id}/{task_id}/reports/transcripts [get]
func GetGermlineSNVTranscriptReportsXlsx(builder transcriptReportBuilder, renderer transcriptReportRenderer) gin.HandlerFunc {
	return snvTranscriptReportsXlsx(builder.BuildGermline, renderer, report.KindGermline)
}

// GetSomaticSNVTranscriptReportsXlsx downloads the transcript report workbook of somatic SNV occurrences
// @Summary Download the transcript report (xlsx) of somatic SNV occurrences of a case
// @Id getSomaticSNVTranscriptReportsXlsx
// @Description Fill the tenant's somatic transcript report template with the report object of each locus, one sheet per locus named after its hgvsg, and return the workbook. 1 to 100 locus ids.
// @Tags occurrences
// @Security bearerauth
// @Param tenant path string true "Tenant code"
// @Param case_id path int true "Case ID"
// @Param seq_id path int true "Tumor sequence ID"
// @Param task_id path int true "Task ID"
// @Param locus_ids query string true "Comma-separated locus ids, 1 to 100"
// @Produce application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
// @Success 200 {string} binary "xlsx workbook"
// @Header 200 {string} Content-Disposition "attachment; filename=<MRN>_<case id>_<UTC timestamp>.xlsx"
// @Failure 400 {object} types.ApiError "Zero, more than 100 or malformed locus ids"
// @Failure 401 {object} types.ApiError
// @Failure 403 {object} types.ApiError
// @Failure 404 {object} types.ApiError "A locus is not an occurrence of the task"
// @Failure 500 {object} types.ApiError
// @Failure 503 {object} types.ApiError "The tenant has no transcript report template loaded"
// @Header 500 {string} X-Correlation-ID "Unique id correlating this error with the server-side log entry"
// @Router /{tenant}/occurrences/somatic/snv/{case_id}/{seq_id}/{task_id}/reports/transcripts [get]
func GetSomaticSNVTranscriptReportsXlsx(builder transcriptReportBuilder, renderer transcriptReportRenderer) gin.HandlerFunc {
	return snvTranscriptReportsXlsx(builder.BuildSomatic, renderer, report.KindSomatic)
}

func snvTranscriptReportsXlsx(build reportBuildFunc, renderer transcriptReportRenderer, kind report.Kind) gin.HandlerFunc {
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
		locusIds, err := parseLocusIds(c.Query("locus_ids"))
		if err != nil {
			HandleValidationError(c, err)
			return
		}
		tenant, err := GetTenant(c)
		if err != nil {
			HandleError(c, err)
			return
		}

		reports, err := build(c.Request.Context(), caseId, seqId, taskId, locusIds)
		if err != nil {
			HandleError(c, err)
			return
		}
		if len(reports) != len(locusIds) {
			HandleNotFoundError(c, "occurrence")
			return
		}
		workbook, err := renderer.Render(*tenant, kind, reports)
		if errors.Is(err, report.ErrTemplateMissing) {
			HandleServiceUnavailableError(c, err.Error())
			return
		}
		if err != nil {
			HandleError(c, err)
			return
		}
		fileName := report.FileName(reports[0].Case.SubmitterPatientID, caseId, time.Now())
		c.Header("Content-Disposition", fmt.Sprintf("attachment; filename=%q", fileName))
		c.Data(http.StatusOK, xlsxContentType, workbook)
	}
}

// parseLocusIds reads the comma-separated query value, drops duplicates and enforces the cap.
func parseLocusIds(raw string) ([]int, error) {
	var ids []int
	seen := map[int]bool{}
	for _, part := range strings.Split(raw, ",") {
		part = strings.TrimSpace(part)
		if part == "" {
			continue
		}
		id, err := strconv.Atoi(part)
		if err != nil {
			return nil, fmt.Errorf("locus_ids: %q is not an id", part)
		}
		if !seen[id] {
			seen[id] = true
			ids = append(ids, id)
		}
	}
	if len(ids) == 0 || len(ids) > transcriptReportMaxLoci {
		return nil, fmt.Errorf("locus_ids: 1 to %d ids required, got %d", transcriptReportMaxLoci, len(ids))
	}
	return ids, nil
}
