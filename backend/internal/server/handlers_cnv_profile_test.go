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
	return router
}

func serveCNVProfile(router *gin.Engine, url string) *httptest.ResponseRecorder {
	req, _ := http.NewRequest("GET", url, nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)
	return w
}

func Test_GetGermlineCNVProfileHandler_OK(t *testing.T) {
	cn, sm, nbSNV, gnomadSF := 3, float32(1.5), 4, float32(0.25)
	repo := &MockCNVProfileRepository{
		documents: cnvProfileDocuments,
		segments:  []types.CNVProfileSegment{{CnvID: "7", Chromosome: "1", Start: 100, End: 200, Type: "GAIN", Length: 100, Filter: "PASS", CN: &cn, SM: &sm, NbSNV: &nbSNV, GnomadSF: &gnomadSF, HasNote: true, FlagType: types.OccurrenceFlagTypePin}},
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
		"segments": [{"cnv_id":"7","chromosome":"1","start":100,"end":200,"type":"GAIN","length":100,"filter":"PASS","cn":3,"sm":1.5,"nb_snv":4,"gnomad_sf":0.25,"has_note":true,"flag_type":"pin"}],
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

func Test_GetGermlineCNVProfileHandler_BAFObjectMissing(t *testing.T) {
	objects := cnvProfileObjects(t)
	delete(objects, "s3://bucket/S1.hard-filtered.baf.bw")
	w := getCNVProfile(&MockCNVProfileRepository{documents: cnvProfileDocuments}, &MockObjectStore{objects: objects}, "1", "1", "1")

	assert.Equal(t, http.StatusNotFound, w.Code)
	assert.JSONEq(t, `{"status":404,"message":"cnv profile files not found","detail":{"missing":["baf"]}}`, w.Body.String())
}

func Test_GetGermlineCNVProfileHandler_ROHObjectMissing(t *testing.T) {
	objects := cnvProfileObjects(t)
	delete(objects, "s3://bucket/S1.roh.bed")
	w := getCNVProfile(&MockCNVProfileRepository{documents: cnvProfileDocuments}, &MockObjectStore{objects: objects}, "1", "1", "1")

	assert.Equal(t, http.StatusOK, w.Code)
	assert.Contains(t, w.Body.String(), `"roh":[]`)
}

func Test_GetGermlineCNVProfileHandler_ROHInvalid(t *testing.T) {
	objects := cnvProfileObjects(t)
	objects["s3://bucket/S1.roh.bed"] = []byte("chr2\t100\t400\n")
	w := getCNVProfile(&MockCNVProfileRepository{documents: cnvProfileDocuments}, &MockObjectStore{objects: objects}, "1", "1", "1")

	assert.Equal(t, http.StatusOK, w.Code)
	assert.Contains(t, w.Body.String(), `"roh":[]`)
}

func Test_GetGermlineCNVProfileHandler_FileTooLarge(t *testing.T) {
	repo := &MockCNVProfileRepository{documents: cnvProfileDocuments}
	w := getCNVProfile(repo, &MockObjectStore{err: fmt.Errorf("s3://bucket/S1.tn.bw: %w", utils.ErrObjectTooLarge)}, "1", "1", "1")

	assert.Equal(t, http.StatusUnprocessableEntity, w.Code)
	assert.JSONEq(t, `{"status":422,"message":"cnv profile file too large to be read whole"}`, w.Body.String())
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

func Test_GetGermlineCNVProfileHandler_GenomeNotYetSupported(t *testing.T) {
	repo := &MockCNVProfileRepository{strategy: "wgs", documents: cnvProfileDocuments}
	w := getCNVProfile(repo, &MockObjectStore{objects: cnvProfileObjects(t)}, "1", "1", "1")

	assert.Equal(t, http.StatusUnprocessableEntity, w.Code)
	assert.JSONEq(t, `{"status":422,"message":"cnv profile unsupported: only exome sequencings have one"}`, w.Body.String())
}

func Test_GetGermlineCNVProfileHandler_UnsupportedStrategy(t *testing.T) {
	repo := &MockCNVProfileRepository{strategy: "rnaseq", documents: cnvProfileDocuments}
	w := getCNVProfile(repo, &MockObjectStore{objects: cnvProfileObjects(t)}, "1", "1", "1")

	assert.Equal(t, http.StatusUnprocessableEntity, w.Code)
	assert.JSONEq(t, `{"status":422,"message":"cnv profile unsupported: only exome sequencings have one"}`, w.Body.String())
}

func Test_GetGermlineCNVProfileHandler_SequencingNotFound(t *testing.T) {
	repo := &MockCNVProfileRepository{notFound: true, documents: cnvProfileDocuments}
	w := getCNVProfile(repo, &MockObjectStore{objects: cnvProfileObjects(t)}, "1", "1", "1")

	assert.Equal(t, http.StatusNotFound, w.Code)
	assert.JSONEq(t, `{"status":404,"message":"sequencing not found"}`, w.Body.String())
}

func Test_GetGermlineCNVProfileHandler_SortsInGenomeOrder(t *testing.T) {
	repo := &MockCNVProfileRepository{
		documents: cnvProfileDocuments,
		segments: []types.CNVProfileSegment{
			{CnvID: "a", Chromosome: "X", Start: 10}, {CnvID: "b", Chromosome: "10", Start: 10},
			{CnvID: "c", Chromosome: "2", Start: 50}, {CnvID: "d", Chromosome: "2", Start: 10},
		},
		cytobands: []types.Cytoband{{Chromosome: "10", Cytoband: "p15.3"}, {Chromosome: "2", Cytoband: "p25.3"}},
	}
	w := getCNVProfile(repo, &MockObjectStore{objects: cnvProfileObjects(t)}, "1", "1", "1")

	require.Equal(t, http.StatusOK, w.Code)
	var profile types.CNVProfile
	require.NoError(t, json.Unmarshal(w.Body.Bytes(), &profile))
	var ids []string
	for _, segment := range profile.Segments {
		ids = append(ids, segment.CnvID)
	}
	assert.Equal(t, []string{"d", "c", "b", "a"}, ids)
	assert.Equal(t, "2", profile.Cytobands[0].Chromosome)
}
