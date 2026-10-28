package server

import (
	"bytes"
	"context"
	"errors"
	"fmt"
	"io"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/hashicorp/golang-lru/v2/expirable"
	"github.com/radiant-network/radiant-api/internal/bigwig"
	"github.com/radiant-network/radiant-api/internal/cnvprofile"
	"github.com/radiant-network/radiant-api/internal/repository/starrocks"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/internal/utils"
)

const (
	// maxCNVProfileFileBytes bounds each file read whole, for an exome: its tn.bw is about 7 MB.
	maxCNVProfileFileBytes = 64 << 20
	// cnvProfileOverviewPoints bounds the copy ratio and the BAF points of a genome overview,
	// about the number of points of an exome.
	cnvProfileOverviewPoints = 200_000
	// cnvProfileOverviewTTL keeps a genome overview while its profile is browsed: building it
	// reads the whole tn.bw and baf.bw, tens of MB.
	cnvProfileOverviewTTL = 30 * time.Minute
	// cnvProfileOverviewCacheSize bounds the overviews kept, the least recently used going first:
	// one is about 380,000 points, 6 to 8 MB.
	cnvProfileOverviewCacheSize = 20

	strategyExome  = "wxs"
	strategyGenome = "wgs"
)

type cnvProfileReader interface {
	GetExperimentalStrategy(ctx context.Context, caseID int, seqID int, taskID int) (string, error)
	GetCNVProfileDocuments(ctx context.Context, seqID int, taskID int) ([]types.CNVProfileDocument, error)
	GetCNVProfileSegments(ctx context.Context, caseID int, seqID int, taskID int) ([]types.CNVProfileSegment, error)
	GetCytobands(ctx context.Context) ([]types.Cytoband, error)
}

type objectReader interface {
	GetObject(ctx context.Context, url string, maxBytes int64) ([]byte, error)
	OpenObject(ctx context.Context, url string) (io.ReaderAt, error)
}

// cnvProfileFilesMissingError names the required tracks a sequencing has no file for.
type cnvProfileFilesMissingError struct {
	missing []string
}

func (e *cnvProfileFilesMissingError) Error() string {
	return fmt.Sprintf("cnv profile files missing: %v", e.missing)
}

var (
	errCNVProfileSequencingNotFound  = errors.New("cnv profile sequencing not found")
	errCNVProfileStrategyUnsupported = errors.New("cnv profile strategy unsupported")
)

// overviewCache keeps the genome overviews by file, bounded in count and in age.
type overviewCache = expirable.LRU[string, *genomeTracks]

// genomeTracks are the reduced copy ratio and BAF of a genome.
type genomeTracks struct {
	chromosomes []types.CNVProfileChromosome
	copyRatio   []types.CNVProfileTrack
	baf         []types.CNVProfileTrack
	overview    types.CNVProfileOverview
}

// GetGermlineCNVProfileHandler
// @Summary Get the CNV profile of a sequencing
// @Id getGermlineCNVProfile
// @Description Get the CNV profile of a germline sequencing: the copy ratio and the B-allele frequency, read from the
// @Description DRAGEN tn.bw and baf.bw files, the called CNVs, the regions of homozygosity of the roh.bed file and the
// @Description cytobands. An exome has every point. A genome has an overview, a regular sample of the copy ratio bins
// @Description and of the BAF variants; the region endpoint serves every point of a region.
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
// @Failure 404 {object} types.ApiError "The case has no such sequencing analysed by the task, or detail.missing lists the tracks without a file (copy_ratio, baf)"
// @Failure 422 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Header 500 {string} X-Correlation-ID "Unique id correlating this error with the server-side log entry"
// @Router /{tenant}/occurrences/germline/cnv/{case_id}/{seq_id}/{task_id}/profile [get]
func GetGermlineCNVProfileHandler(repo cnvProfileReader, store objectReader) gin.HandlerFunc {
	overviews := expirable.NewLRU[string, *genomeTracks](cnvProfileOverviewCacheSize, nil, cnvProfileOverviewTTL)
	return func(c *gin.Context) {
		caseID, seqID, taskID, ok := cnvProfileParams(c)
		if !ok {
			return
		}
		profile, err := buildCNVProfile(c.Request.Context(), repo, store, overviews, caseID, seqID, taskID)
		if err != nil {
			handleCNVProfileError(c, err)
			return
		}
		c.JSON(http.StatusOK, profile)
	}
}

// GetGermlineCNVProfileRegionHandler
// @Summary Get every point of a region of a CNV profile
// @Id getGermlineCNVProfileRegion
// @Description Get every copy ratio and BAF point of a region of at most 10 Mb, read from the DRAGEN tn.bw and baf.bw
// @Description files: what the overview of a genome profile leaves out.
// @Tags occurrences
// @Security bearerauth
// @Param tenant path string true "Tenant code"
// @Param case_id path int true "Case ID"
// @Param seq_id path int true "Sequence ID"
// @Param task_id path int true "Task ID"
// @Param chromosome query string true "Chromosome, without chr prefix"
// @Param start query int true "Region start"
// @Param end query int true "Region end"
// @Produce json
// @Success 200 {object} types.CNVProfileRegion
// @Failure 400 {object} types.ApiError
// @Failure 401 {object} types.ApiError
// @Failure 403 {object} types.ApiError
// @Failure 404 {object} types.ApiError "The case has no such sequencing analysed by the task, or detail.missing lists the tracks without a file (copy_ratio, baf)"
// @Failure 422 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Header 500 {string} X-Correlation-ID "Unique id correlating this error with the server-side log entry"
// @Router /{tenant}/occurrences/germline/cnv/{case_id}/{seq_id}/{task_id}/profile/region [get]
func GetGermlineCNVProfileRegionHandler(repo cnvProfileReader, store objectReader) gin.HandlerFunc {
	return func(c *gin.Context) {
		caseID, seqID, taskID, ok := cnvProfileParams(c)
		if !ok {
			return
		}
		chromosome, start, end, err := parseRegionQuery(c, types.CNVProfileRegionMaxSpan)
		if err != nil {
			HandleValidationError(c, err)
			return
		}
		region, err := buildCNVProfileRegion(c.Request.Context(), repo, store, caseID, seqID, taskID, chromosome, start, end)
		if err != nil {
			handleCNVProfileError(c, err)
			return
		}
		c.JSON(http.StatusOK, region)
	}
}

func cnvProfileParams(c *gin.Context) (int, int, int, bool) {
	caseID, err := strconv.Atoi(c.Param("case_id"))
	if err != nil {
		HandleNotFoundError(c, "case_id")
		return 0, 0, 0, false
	}
	seqID, err := strconv.Atoi(c.Param("seq_id"))
	if err != nil {
		HandleNotFoundError(c, "seq_id")
		return 0, 0, 0, false
	}
	taskID, err := strconv.Atoi(c.Param("task_id"))
	if err != nil {
		HandleNotFoundError(c, "task_id")
		return 0, 0, 0, false
	}
	return caseID, seqID, taskID, true
}

func handleCNVProfileError(c *gin.Context, err error) {
	var missingErr *cnvProfileFilesMissingError
	switch {
	case errors.Is(err, errCNVProfileSequencingNotFound):
		HandleNotFoundError(c, "sequencing")
	case errors.As(err, &missingErr):
		c.JSON(http.StatusNotFound, types.ApiError{
			Status:  http.StatusNotFound,
			Message: "cnv profile files not found",
			Detail:  gin.H{"missing": missingErr.missing},
		})
	case errors.Is(err, errCNVProfileStrategyUnsupported):
		HandleUnprocessableEntityError(c, "cnv profile unsupported: only exome and genome sequencings have one")
	case errors.Is(err, utils.ErrObjectTooLarge):
		HandleUnprocessableEntityError(c, "cnv profile file too large to be read whole")
	default:
		HandleError(c, err)
	}
}

// cnvProfileStrategy checks that the case has the sequencing, analysed by the task, and that the
// sequencing has a profile: an exome or a genome.
func cnvProfileStrategy(ctx context.Context, repo cnvProfileReader, caseID int, seqID int, taskID int) (string, error) {
	strategy, err := repo.GetExperimentalStrategy(ctx, caseID, seqID, taskID)
	if err != nil {
		return "", fmt.Errorf("get experimental strategy of sequencing %d: %w", seqID, err)
	}
	switch strategy {
	case "":
		return "", errCNVProfileSequencingNotFound
	case strategyExome, strategyGenome:
		return strategy, nil
	default:
		return "", errCNVProfileStrategyUnsupported
	}
}

func buildCNVProfile(ctx context.Context, repo cnvProfileReader, store objectReader, overviews *overviewCache, caseID int, seqID int, taskID int) (*types.CNVProfile, error) {
	strategy, err := cnvProfileStrategy(ctx, repo, caseID, seqID, taskID)
	if err != nil {
		return nil, err
	}
	files, err := cnvProfileFiles(ctx, repo, seqID, taskID)
	if err != nil {
		return nil, fmt.Errorf("cnv profile files of sequencing %d: %w", seqID, err)
	}

	profile := types.CNVProfile{ROH: []types.CNVProfileROH{}}
	if strategy == strategyGenome {
		tracks, err := genomeOverview(ctx, store, overviews, files)
		if err != nil {
			return nil, fmt.Errorf("genome overview: %w", err)
		}
		profile.Chromosomes, profile.CopyRatio, profile.BAF = tracks.chromosomes, tracks.copyRatio, tracks.baf
		profile.Overview = &tracks.overview
	} else if err := exomeTracks(ctx, store, files, &profile); err != nil {
		return nil, fmt.Errorf("exome tracks: %w", err)
	}

	if files.ROH != nil {
		data, err := store.GetObject(ctx, files.ROH.URL, maxCNVProfileFileBytes)
		if err != nil {
			return nil, fmt.Errorf("read roh: %w", err)
		}
		if profile.ROH, err = cnvprofile.ParseROH(data); err != nil {
			return nil, fmt.Errorf("read %s: %w", files.ROH.URL, err)
		}
	}

	if profile.Segments, err = repo.GetCNVProfileSegments(ctx, caseID, seqID, taskID); err != nil {
		return nil, fmt.Errorf("get cnv segments of task %d: %w", taskID, err)
	}
	if profile.Segments == nil {
		profile.Segments = []types.CNVProfileSegment{}
	}
	cnvprofile.SortByLocus(profile.Segments, func(s types.CNVProfileSegment) (string, int) { return s.Chromosome, s.Start })
	if profile.Cytobands, err = repo.GetCytobands(ctx); err != nil {
		return nil, fmt.Errorf("get cytobands: %w", err)
	}
	if profile.Cytobands == nil {
		profile.Cytobands = []types.Cytoband{}
	}
	cnvprofile.SortByLocus(profile.Cytobands, func(b types.Cytoband) (string, int) { return b.Chromosome, b.Start })
	return &profile, nil
}

func cnvProfileFiles(ctx context.Context, repo cnvProfileReader, seqID int, taskID int) (starrocks.CNVProfileFiles, error) {
	documents, err := repo.GetCNVProfileDocuments(ctx, seqID, taskID)
	if err != nil {
		return starrocks.CNVProfileFiles{}, fmt.Errorf("get cnv profile documents: %w", err)
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
		return files, &cnvProfileFilesMissingError{missing: missing}
	}
	return files, nil
}

// exomeTracks reads every point.
func exomeTracks(ctx context.Context, store objectReader, files starrocks.CNVProfileFiles, profile *types.CNVProfile) error {
	tn, err := readBigWig(ctx, store, files.CopyRatio.URL)
	if err != nil {
		return fmt.Errorf("read copy ratio file: %w", err)
	}
	baf, err := readBigWig(ctx, store, files.BAF.URL)
	if err != nil {
		return fmt.Errorf("read baf file: %w", err)
	}
	profile.Chromosomes = cnvprofile.Chromosomes(tn, baf)
	if profile.CopyRatio, err = cnvprofile.CopyRatioTrack(tn, profile.Chromosomes); err != nil {
		return fmt.Errorf("read copy ratio: %w", err)
	}
	if profile.BAF, err = cnvprofile.BAFTrack(baf, profile.Chromosomes); err != nil {
		return fmt.Errorf("read baf: %w", err)
	}
	return nil
}

// genomeOverview samples every bin of tn.bw and every variant of baf.bw, both read by range, and
// keeps the result for the next requests on the same files.
func genomeOverview(ctx context.Context, store objectReader, overviews *overviewCache, files starrocks.CNVProfileFiles) (*genomeTracks, error) {
	key := files.CopyRatio.URL + "\n" + files.BAF.URL
	if cached, ok := overviews.Get(key); ok {
		return cached, nil
	}
	tn, err := openBigWig(ctx, store, files.CopyRatio.URL)
	if err != nil {
		return nil, fmt.Errorf("open copy ratio file: %w", err)
	}
	baf, err := openBigWig(ctx, store, files.BAF.URL)
	if err != nil {
		return nil, fmt.Errorf("open baf file: %w", err)
	}
	tracks := &genomeTracks{chromosomes: cnvprofile.Chromosomes(tn, baf)}
	tracks.overview.RegionMaxSpan = types.CNVProfileRegionMaxSpan
	if tracks.copyRatio, tracks.overview.CopyRatioStride, err = cnvprofile.CopyRatioSample(tn, tracks.chromosomes, cnvProfileOverviewPoints); err != nil {
		return nil, fmt.Errorf("read copy ratio: %w", err)
	}
	if tracks.baf, tracks.overview.BAFStride, err = cnvprofile.BAFSample(baf, tracks.chromosomes, cnvProfileOverviewPoints); err != nil {
		return nil, fmt.Errorf("read baf: %w", err)
	}
	overviews.Add(key, tracks)
	return tracks, nil
}

func buildCNVProfileRegion(ctx context.Context, repo cnvProfileReader, store objectReader, caseID int, seqID int, taskID int, chromosome string, start, end int) (*types.CNVProfileRegion, error) {
	if _, err := cnvProfileStrategy(ctx, repo, caseID, seqID, taskID); err != nil {
		return nil, err
	}
	files, err := cnvProfileFiles(ctx, repo, seqID, taskID)
	if err != nil {
		return nil, fmt.Errorf("cnv profile files of sequencing %d: %w", seqID, err)
	}
	tn, err := openBigWig(ctx, store, files.CopyRatio.URL)
	if err != nil {
		return nil, fmt.Errorf("open copy ratio file: %w", err)
	}
	baf, err := openBigWig(ctx, store, files.BAF.URL)
	if err != nil {
		return nil, fmt.Errorf("open baf file: %w", err)
	}
	region := types.CNVProfileRegion{Chromosome: chromosome, Start: start, End: end}
	if region.CopyRatio, err = cnvprofile.CopyRatioRegion(tn, chromosome, start, end); err != nil {
		return nil, fmt.Errorf("read copy ratio: %w", err)
	}
	if region.BAF, err = cnvprofile.BAFRegion(baf, chromosome, start, end); err != nil {
		return nil, fmt.Errorf("read baf: %w", err)
	}
	return &region, nil
}

// readBigWig reads a whole file, which is faster than ranges when every point is needed.
func readBigWig(ctx context.Context, store objectReader, url string) (*bigwig.File, error) {
	data, err := store.GetObject(ctx, url, maxCNVProfileFileBytes)
	if err != nil {
		return nil, fmt.Errorf("get %s: %w", url, err)
	}
	f, err := bigwig.Open(bytes.NewReader(data))
	if err != nil {
		return nil, fmt.Errorf("open %s: %w", url, err)
	}
	return f, nil
}

// openBigWig reads a file by range, only the blocks a query needs.
func openBigWig(ctx context.Context, store objectReader, url string) (*bigwig.File, error) {
	r, err := store.OpenObject(ctx, url)
	if err != nil {
		return nil, fmt.Errorf("open %s: %w", url, err)
	}
	f, err := bigwig.Open(r)
	if err != nil {
		return nil, fmt.Errorf("open %s: %w", url, err)
	}
	return f, nil
}
