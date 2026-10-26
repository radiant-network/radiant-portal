package server

import (
	"bytes"
	"context"
	"errors"
	"fmt"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/radiant-network/radiant-api/internal/bigwig"
	"github.com/radiant-network/radiant-api/internal/cnvprofile"
	"github.com/radiant-network/radiant-api/internal/repository/starrocks"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/internal/utils"
)

// maxCNVProfileFileBytes bounds each file read for a profile. An exome tn.bw is about 7 MB; a
// genome one is several hundred, which this endpoint does not serve.
const maxCNVProfileFileBytes = 64 << 20

type cnvProfileReader interface {
	GetCNVProfileDocuments(ctx context.Context, seqID int) ([]types.CNVProfileDocument, error)
	GetCNVProfileSegments(ctx context.Context, seqID int, taskID int) ([]types.CNVProfileSegment, error)
	GetCytobands(ctx context.Context) ([]types.Cytoband, error)
}

type objectReader interface {
	GetObject(ctx context.Context, url string, maxBytes int64) ([]byte, error)
}

// cnvProfileFilesMissingError names the required tracks a sequencing has no file for.
type cnvProfileFilesMissingError struct {
	missing []string
}

func (e *cnvProfileFilesMissingError) Error() string {
	return fmt.Sprintf("cnv profile files missing: %v", e.missing)
}

// GetGermlineCNVProfileHandler
// @Summary Get the CNV profile of a sequencing
// @Id getGermlineCNVProfile
// @Description Get the CNV profile of a germline sequencing: the copy ratio of every bin and the B-allele frequency
// @Description of every variant, read from the DRAGEN tn.bw and baf.bw files, the called CNVs, the regions of
// @Description homozygosity of the roh.bed file and the cytobands. Only exome sequencings are supported.
// @Tags occurrences
// @Security bearerauth
// @Param tenant path string true "Tenant code"
// @Param case_id path int true "Case ID"
// @Param seq_id path int true "Sequence ID"
// @Param task_id path int true "Task ID"
// @Produce json
// @Success 200 {object} types.CNVProfile
// @Failure 401 {object} types.ApiError
// @Failure 403 {object} types.ApiError
// @Failure 404 {object} types.ApiError "detail.missing lists the tracks without a file (copy_ratio, baf)"
// @Failure 422 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Header 500 {string} X-Correlation-ID "Unique id correlating this error with the server-side log entry"
// @Router /{tenant}/occurrences/germline/cnv/{case_id}/{seq_id}/{task_id}/profile [get]
func GetGermlineCNVProfileHandler(repo cnvProfileReader, store objectReader) gin.HandlerFunc {
	return func(c *gin.Context) {
		if _, err := strconv.Atoi(c.Param("case_id")); err != nil {
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

		profile, err := buildCNVProfile(c.Request.Context(), repo, store, seqID, taskID)
		var missingErr *cnvProfileFilesMissingError
		switch {
		case errors.As(err, &missingErr):
			c.JSON(http.StatusNotFound, types.ApiError{
				Status:  http.StatusNotFound,
				Message: "cnv profile files not found",
				Detail:  gin.H{"missing": missingErr.missing},
			})
		case errors.Is(err, utils.ErrObjectTooLarge):
			HandleUnprocessableEntityError(c, "cnv profile files too large: only exome sequencings are supported")
		case err != nil:
			HandleError(c, err)
		default:
			c.JSON(http.StatusOK, profile)
		}
	}
}

func buildCNVProfile(ctx context.Context, repo cnvProfileReader, store objectReader, seqID int, taskID int) (*types.CNVProfile, error) {
	documents, err := repo.GetCNVProfileDocuments(ctx, seqID)
	if err != nil {
		return nil, err
	}
	files := starrocks.SelectCNVProfileFiles(documents)
	var missing []string
	if files.CopyRatio == nil {
		missing = append(missing, "copy_ratio")
	}
	if files.BAF == nil {
		missing = append(missing, "baf")
	}
	if len(missing) > 0 {
		return nil, &cnvProfileFilesMissingError{missing: missing}
	}

	tn, err := openBigWig(ctx, store, files.CopyRatio.URL)
	if err != nil {
		return nil, err
	}
	baf, err := openBigWig(ctx, store, files.BAF.URL)
	if err != nil {
		return nil, err
	}

	// The contig sizes come from tn.bw: the BAF of a female sample has no chrY.
	profile := types.CNVProfile{Chromosomes: cnvprofile.Chromosomes(tn), ROH: []types.CNVProfileROH{}}
	if profile.CopyRatio, err = cnvprofile.CopyRatioTrack(tn, profile.Chromosomes); err != nil {
		return nil, fmt.Errorf("read copy ratio: %w", err)
	}
	if profile.BAF, err = cnvprofile.BAFTrack(baf, profile.Chromosomes); err != nil {
		return nil, fmt.Errorf("read baf: %w", err)
	}
	if files.ROH != nil {
		data, err := store.GetObject(ctx, files.ROH.URL, maxCNVProfileFileBytes)
		if err != nil {
			return nil, err
		}
		if profile.ROH, err = cnvprofile.ParseROH(data); err != nil {
			return nil, fmt.Errorf("read %s: %w", files.ROH.URL, err)
		}
	}

	if profile.Segments, err = repo.GetCNVProfileSegments(ctx, seqID, taskID); err != nil {
		return nil, err
	}
	if profile.Segments == nil {
		profile.Segments = []types.CNVProfileSegment{}
	}
	if profile.Cytobands, err = repo.GetCytobands(ctx); err != nil {
		return nil, err
	}
	if profile.Cytobands == nil {
		profile.Cytobands = []types.Cytoband{}
	}
	return &profile, nil
}

func openBigWig(ctx context.Context, store objectReader, url string) (*bigwig.File, error) {
	data, err := store.GetObject(ctx, url, maxCNVProfileFileBytes)
	if err != nil {
		return nil, err
	}
	f, err := bigwig.Open(bytes.NewReader(data))
	if err != nil {
		return nil, fmt.Errorf("open %s: %w", url, err)
	}
	return f, nil
}
