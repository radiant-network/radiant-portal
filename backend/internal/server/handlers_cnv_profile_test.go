package server

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/internal/utils"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

var cnvProfileDocuments = []types.CNVProfileDocument{
	{TaskID: 1, DocumentName: "S1.tn.bw", FormatCode: "bw", URL: "s3://bucket/S1.tn.bw"},
	{TaskID: 1, DocumentName: "S1.hard-filtered.baf.bw", FormatCode: "bw", URL: "s3://bucket/S1.hard-filtered.baf.bw"},
	{TaskID: 1, DocumentName: "S1.roh.bed", FormatCode: "bed", URL: "s3://bucket/S1.roh.bed"},
}

// cnvProfileObjects serves the bigwig fixtures written by test/data/bigwig/generate.py.
func cnvProfileObjects(t *testing.T) map[string][]byte {
	t.Helper()
	tn, err := os.ReadFile("../../test/data/bigwig/tn.bw")
	require.NoError(t, err)
	baf, err := os.ReadFile("../../test/data/bigwig/baf.bw")
	require.NoError(t, err)
	return map[string][]byte{
		"s3://bucket/S1.tn.bw":                tn,
		"s3://bucket/S1.hard-filtered.baf.bw": baf,
		"s3://bucket/S1.roh.bed":              []byte("chr2\t100\t400\t1.5\t60\t0\n"),
	}
}

func getCNVProfile(repo cnvProfileReader, store objectReader, caseID, seqID, taskID string) *httptest.ResponseRecorder {
	return serveCNVProfile(cnvProfileRouter(repo, store), fmt.Sprintf("/radiant/occurrences/germline/cnv/%s/%s/%s/profile", caseID, seqID, taskID))
}

func cnvProfileRouter(repo cnvProfileReader, store objectReader) *gin.Engine {
	router := gin.Default()
	router.GET("/:tenant/occurrences/germline/cnv/:case_id/:seq_id/:task_id/profile", GetGermlineCNVProfileHandler(repo, store))
	router.GET("/:tenant/occurrences/germline/cnv/:case_id/:seq_id/:task_id/profile/region", GetGermlineCNVProfileRegionHandler(repo, store))
	return router
}

func serveCNVProfile(router *gin.Engine, url string) *httptest.ResponseRecorder {
	req, _ := http.NewRequest("GET", url, nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)
	return w
}

// genomeObjects serve a copy ratio file of 1,000 bins, as a genome.
func genomeObjects(t *testing.T) map[string][]byte {
	t.Helper()
	objects := cnvProfileObjects(t)
	zoomed, err := os.ReadFile("../../test/data/bigwig/zoomed.bw")
	require.NoError(t, err)
	objects["s3://bucket/S1.tn.bw"] = zoomed
	return objects
}

func Test_GetGermlineCNVProfileHandler_OK(t *testing.T) {
	cn, sm, nbSNV, gnomadSF := 3, float32(1.5), 4, float32(0.25)
	repo := &MockCNVProfileRepository{
		documents: cnvProfileDocuments,
		segments:  []types.CNVProfileSegment{{CnvID: "7", Chromosome: "1", Start: 100, End: 200, Type: "GAIN", Length: 100, Filter: "PASS", CN: &cn, SM: &sm, NbSNV: &nbSNV, GnomadSF: &gnomadSF}},
		cytobands: []types.Cytoband{{Chromosome: "1", Cytoband: "p36.33", Start: 0, End: 500, GieStain: "gneg"}},
	}
	w := getCNVProfile(repo, &MockObjectStore{objects: cnvProfileObjects(t)}, "1", "1", "1")

	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, `{
		"chromosomes": [{"name":"1","size":1000},{"name":"2","size":500},{"name":"X","size":300}],
		"copy_ratio": [
			{"chromosome":"1","positions":[50,150],"values":[1,2]},
			{"chromosome":"2","positions":[50],"values":[0.5]},
			{"chromosome":"X","positions":[],"values":[]}
		],
		"baf": [
			{"chromosome":"1","positions":[10,150],"values":[0.5,0.25]},
			{"chromosome":"2","positions":[20],"values":[1]}
		],
		"segments": [{"cnv_id":"7","chromosome":"1","start":100,"end":200,"type":"GAIN","length":100,"filter":"PASS","cn":3,"sm":1.5,"nb_snv":4,"gnomad_sf":0.25}],
		"roh": [{"chromosome":"2","start":100,"end":400,"score":1.5,"nb_hom":60,"nb_het":0}],
		"cytobands": [{"chromosome":"1","cytoband":"p36.33","start":0,"end":500,"gie_stain":"gneg"}]
	}`, w.Body.String())
}

func Test_GetGermlineCNVProfileHandler_WithoutROHFile(t *testing.T) {
	repo := &MockCNVProfileRepository{documents: cnvProfileDocuments[:2]}
	w := getCNVProfile(repo, &MockObjectStore{objects: cnvProfileObjects(t)}, "1", "1", "1")

	assert.Equal(t, http.StatusOK, w.Code)
	assert.Contains(t, w.Body.String(), `"roh":[]`)
	assert.Contains(t, w.Body.String(), `"segments":[]`)
	assert.Contains(t, w.Body.String(), `"cytobands":[]`)
}

func Test_GetGermlineCNVProfileHandler_CopyRatioFileMissing(t *testing.T) {
	repo := &MockCNVProfileRepository{documents: cnvProfileDocuments[1:]}
	w := getCNVProfile(repo, &MockObjectStore{objects: cnvProfileObjects(t)}, "1", "1", "1")

	assert.Equal(t, http.StatusNotFound, w.Code)
	assert.JSONEq(t, `{"status":404,"message":"cnv profile files not found","detail":{"missing":["copy_ratio"]}}`, w.Body.String())
}

func Test_GetGermlineCNVProfileHandler_BAFFileMissing(t *testing.T) {
	repo := &MockCNVProfileRepository{documents: []types.CNVProfileDocument{cnvProfileDocuments[0], cnvProfileDocuments[2]}}
	w := getCNVProfile(repo, &MockObjectStore{objects: cnvProfileObjects(t)}, "1", "1", "1")

	assert.Equal(t, http.StatusNotFound, w.Code)
	assert.JSONEq(t, `{"status":404,"message":"cnv profile files not found","detail":{"missing":["baf"]}}`, w.Body.String())
}

func Test_GetGermlineCNVProfileHandler_FileTooLarge(t *testing.T) {
	repo := &MockCNVProfileRepository{documents: cnvProfileDocuments}
	w := getCNVProfile(repo, &MockObjectStore{err: fmt.Errorf("s3://bucket/S1.tn.bw: %w", utils.ErrObjectTooLarge)}, "1", "1", "1")

	assert.Equal(t, http.StatusUnprocessableEntity, w.Code)
	assert.JSONEq(t, `{"status":422,"message":"cnv profile files too large for an exome"}`, w.Body.String())
}

func Test_GetGermlineCNVProfileHandler_NotABigWig(t *testing.T) {
	objects := cnvProfileObjects(t)
	objects["s3://bucket/S1.tn.bw"] = []byte("not a bigwig, but long enough to hold a whole bigwig header of 64 bytes")
	w := getCNVProfile(&MockCNVProfileRepository{documents: cnvProfileDocuments}, &MockObjectStore{objects: objects}, "1", "1", "1")

	assert.Equal(t, http.StatusInternalServerError, w.Code)
}

func Test_GetGermlineCNVProfileHandler_RepositoryError(t *testing.T) {
	w := getCNVProfile(&MockCNVProfileRepository{err: fmt.Errorf("boom")}, &MockObjectStore{}, "1", "1", "1")

	assert.Equal(t, http.StatusInternalServerError, w.Code)
	assert.JSONEq(t, `{"status":500,"message":"Internal Server Error"}`, w.Body.String())
}

func Test_GetGermlineCNVProfileHandler_InvalidCaseID(t *testing.T) {
	w := getCNVProfile(&MockCNVProfileRepository{}, &MockObjectStore{}, "x", "1", "1")

	assert.Equal(t, http.StatusNotFound, w.Code)
	assert.JSONEq(t, `{"status":404,"message":"case_id not found"}`, w.Body.String())
}

func Test_GetGermlineCNVProfileHandler_InvalidSeqID(t *testing.T) {
	w := getCNVProfile(&MockCNVProfileRepository{}, &MockObjectStore{}, "1", "x", "1")

	assert.Equal(t, http.StatusNotFound, w.Code)
	assert.JSONEq(t, `{"status":404,"message":"seq_id not found"}`, w.Body.String())
}

func Test_GetGermlineCNVProfileHandler_InvalidTaskID(t *testing.T) {
	w := getCNVProfile(&MockCNVProfileRepository{}, &MockObjectStore{}, "1", "1", "x")

	assert.Equal(t, http.StatusNotFound, w.Code)
	assert.JSONEq(t, `{"status":404,"message":"task_id not found"}`, w.Body.String())
}

func Test_GetGermlineCNVProfileHandler_GenomeOverview(t *testing.T) {
	repo := &MockCNVProfileRepository{strategy: "wgs", documents: cnvProfileDocuments}
	w := getCNVProfile(repo, &MockObjectStore{objects: genomeObjects(t)}, "1", "1", "1")

	require.Equal(t, http.StatusOK, w.Code)
	var profile types.CNVProfile
	require.NoError(t, json.Unmarshal(w.Body.Bytes(), &profile))
	assert.Equal(t, &types.CNVProfileOverview{CopyRatioStride: 1, BAFStride: 1, RegionMaxSpan: types.CNVProfileRegionMaxSpan}, profile.Overview)
	require.Len(t, profile.CopyRatio, 1)
	assert.Len(t, profile.CopyRatio[0].Positions, 1000)
	assert.Equal(t, []int{10, 150}, profile.BAF[0].Positions)
}

func Test_GetGermlineCNVProfileHandler_GenomeOverviewIsCached(t *testing.T) {
	repo := &MockCNVProfileRepository{strategy: "wgs", documents: cnvProfileDocuments}
	store := &MockObjectStore{objects: genomeObjects(t)}
	router := cnvProfileRouter(repo, store)
	require.Equal(t, http.StatusOK, serveCNVProfile(router, "/radiant/occurrences/germline/cnv/1/1/1/profile").Code)

	delete(store.objects, "s3://bucket/S1.tn.bw")
	delete(store.objects, "s3://bucket/S1.hard-filtered.baf.bw")

	assert.Equal(t, http.StatusOK, serveCNVProfile(router, "/radiant/occurrences/germline/cnv/1/1/1/profile").Code)
}

func Test_GetGermlineCNVProfileHandler_UnsupportedStrategy(t *testing.T) {
	repo := &MockCNVProfileRepository{strategy: "rnaseq", documents: cnvProfileDocuments}
	w := getCNVProfile(repo, &MockObjectStore{objects: cnvProfileObjects(t)}, "1", "1", "1")

	assert.Equal(t, http.StatusUnprocessableEntity, w.Code)
	assert.JSONEq(t, `{"status":422,"message":"cnv profile unsupported: only exome and genome sequencings have one"}`, w.Body.String())
}

func Test_GetGermlineCNVProfileRegionHandler_OK(t *testing.T) {
	repo := &MockCNVProfileRepository{documents: cnvProfileDocuments}
	router := cnvProfileRouter(repo, &MockObjectStore{objects: cnvProfileObjects(t)})
	w := serveCNVProfile(router, "/radiant/occurrences/germline/cnv/1/1/1/profile/region?chromosome=1&start=120&end=200")

	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, `{
		"chromosome":"1","start":120,"end":200,
		"copy_ratio":{"chromosome":"1","positions":[150],"values":[2]},
		"baf":{"chromosome":"1","positions":[150],"values":[0.25]}
	}`, w.Body.String())
}

func Test_GetGermlineCNVProfileRegionHandler_SpanTooWide(t *testing.T) {
	router := cnvProfileRouter(&MockCNVProfileRepository{documents: cnvProfileDocuments}, &MockObjectStore{objects: cnvProfileObjects(t)})
	w := serveCNVProfile(router, "/radiant/occurrences/germline/cnv/1/1/1/profile/region?chromosome=1&start=0&end=10000001")

	assert.Equal(t, http.StatusBadRequest, w.Code)
	assert.JSONEq(t, `{"status":400,"message":"region must satisfy 0 <= start <= end and span at most 10000000 bases"}`, w.Body.String())
}

func Test_GetGermlineCNVProfileRegionHandler_FilesMissing(t *testing.T) {
	router := cnvProfileRouter(&MockCNVProfileRepository{}, &MockObjectStore{objects: cnvProfileObjects(t)})
	w := serveCNVProfile(router, "/radiant/occurrences/germline/cnv/1/1/1/profile/region?chromosome=1&start=0&end=100")

	assert.Equal(t, http.StatusNotFound, w.Code)
	assert.JSONEq(t, `{"status":404,"message":"cnv profile files not found","detail":{"missing":["copy_ratio","baf"]}}`, w.Body.String())
}
