package server

import (
	"bytes"
	"context"
	"errors"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/stretchr/testify/assert"
)

type stubSNVVariantSearcher struct {
	hits   []types.VariantSearchHit
	err    error
	called bool
	seqId  int
	taskId int
	got    types.VariantIdentifier
}

func (s *stubSNVVariantSearcher) SearchVariants(_ context.Context, seqId int, taskId int, identifier types.VariantIdentifier) ([]types.VariantSearchHit, error) {
	s.called = true
	s.seqId, s.taskId, s.got = seqId, taskId, identifier
	return s.hits, s.err
}

func postVariantSearch(handler gin.HandlerFunc, kind string, caseId string, seqId string, taskId string, body string) *httptest.ResponseRecorder {
	router := gin.Default()
	router.POST("/:tenant/occurrences/"+kind+"/snv/:case_id/:seq_id/:task_id/search", handler)
	req, _ := http.NewRequest("POST", "/radiant/occurrences/"+kind+"/snv/"+caseId+"/"+seqId+"/"+taskId+"/search", bytes.NewBufferString(body))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)
	return w
}

func Test_OccurrencesGermlineSNVSearchHandler_Found(t *testing.T) {
	repo := &stubSNVVariantSearcher{hits: []types.VariantSearchHit{
		{Hgvsg: "chr11:g.5227002T>A", Locus: "11-5227002-T-A", Rsnumber: "rs334", ClinvarId: "15333", Symbol: "HBB", AaChange: "p.Glu7Val"},
		{Hgvsg: "chr11:g.5227002T>G", Locus: "11-5227002-T-G", Rsnumber: "rs334"},
	}}
	w := postVariantSearch(OccurrencesGermlineSNVSearchHandler(repo), "germline", "1", "2", "3", `{"input":"RS334"}`)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, `{
		"status": "found",
		"matched_field": "rsnumber",
		"normalized_input": "rs334",
		"variants": [
			{"hgvsg": "chr11:g.5227002T>A", "locus": "11-5227002-T-A", "rsnumber": "rs334", "clinvar_id": "15333", "symbol": "HBB", "aa_change": "p.Glu7Val"},
			{"hgvsg": "chr11:g.5227002T>G", "locus": "11-5227002-T-G", "rsnumber": "rs334"}
		]
	}`, w.Body.String())
	assert.Equal(t, 2, repo.seqId)
	assert.Equal(t, 3, repo.taskId)
	assert.Equal(t, types.VariantIdentifier{Field: types.VariantSearchFieldRsnumber, Value: "rs334"}, repo.got)
}

func Test_OccurrencesGermlineSNVSearchHandler_NotFoundInRun(t *testing.T) {
	repo := &stubSNVVariantSearcher{}
	w := postVariantSearch(OccurrencesGermlineSNVSearchHandler(repo), "germline", "1", "2", "3", `{"input":"8:43159045:g:a"}`)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, `{"status": "not_found_in_run", "matched_field": "locus", "normalized_input": "8-43159045-G-A", "variants": []}`, w.Body.String())
}

func Test_OccurrencesGermlineSNVSearchHandler_UnrecognizedFormat(t *testing.T) {
	repo := &stubSNVVariantSearcher{}
	w := postVariantSearch(OccurrencesGermlineSNVSearchHandler(repo), "germline", "1", "2", "3", `{"input":"("}`)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, `{"status": "unrecognized_format", "variants": []}`, w.Body.String())
	assert.False(t, repo.called, "no lookup for an input of no known format")
}

func Test_OccurrencesGermlineSNVSearchHandler_RepositoryError(t *testing.T) {
	repo := &stubSNVVariantSearcher{err: errors.New("starrocks down")}
	w := postVariantSearch(OccurrencesGermlineSNVSearchHandler(repo), "germline", "1", "2", "3", `{"input":"rs334"}`)

	assert.Equal(t, http.StatusInternalServerError, w.Code)
	assert.JSONEq(t, `{"status":500,"message":"Internal Server Error"}`, w.Body.String())
}

func Test_OccurrencesGermlineSNVSearchHandler_MissingInput(t *testing.T) {
	repo := &stubSNVVariantSearcher{}
	w := postVariantSearch(OccurrencesGermlineSNVSearchHandler(repo), "germline", "1", "2", "3", `{}`)

	assert.Equal(t, http.StatusBadRequest, w.Code)
	assert.False(t, repo.called)
}

func Test_OccurrencesGermlineSNVSearchHandler_InvalidCaseId(t *testing.T) {
	repo := &stubSNVVariantSearcher{}
	w := postVariantSearch(OccurrencesGermlineSNVSearchHandler(repo), "germline", "abc", "2", "3", `{"input":"rs334"}`)

	assert.Equal(t, http.StatusNotFound, w.Code)
	assert.False(t, repo.called)
}

func Test_OccurrencesGermlineSNVSearchHandler_InvalidSeqId(t *testing.T) {
	repo := &stubSNVVariantSearcher{}
	w := postVariantSearch(OccurrencesGermlineSNVSearchHandler(repo), "germline", "1", "abc", "3", `{"input":"rs334"}`)

	assert.Equal(t, http.StatusNotFound, w.Code)
	assert.False(t, repo.called)
}

func Test_OccurrencesGermlineSNVSearchHandler_InvalidTaskId(t *testing.T) {
	repo := &stubSNVVariantSearcher{}
	w := postVariantSearch(OccurrencesGermlineSNVSearchHandler(repo), "germline", "1", "2", "abc", `{"input":"rs334"}`)

	assert.Equal(t, http.StatusNotFound, w.Code)
	assert.False(t, repo.called)
}

func Test_OccurrencesSomaticSNVSearchHandler_Found(t *testing.T) {
	repo := &stubSNVVariantSearcher{hits: []types.VariantSearchHit{{Hgvsg: "chr7:g.140753336A>T", Locus: "7-140753336-A-T", Symbol: "BRAF", AaChange: "p.Val600Glu"}}}
	w := postVariantSearch(OccurrencesSomaticSNVSearchHandler(repo), "somatic", "71", "74", "74", `{"input":"7:g.140753336a>t"}`)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, `{
		"status": "found",
		"matched_field": "hgvsg",
		"normalized_input": "chr7:g.140753336A>T",
		"variants": [{"hgvsg": "chr7:g.140753336A>T", "locus": "7-140753336-A-T", "symbol": "BRAF", "aa_change": "p.Val600Glu"}]
	}`, w.Body.String())
	assert.Equal(t, 74, repo.seqId)
	assert.Equal(t, 74, repo.taskId)
}
