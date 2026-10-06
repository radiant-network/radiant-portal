package server

import (
	"bytes"
	"context"
	"errors"
	"io"
	"mime/multipart"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/stretchr/testify/assert"
)

type mockGenePanelUploader struct {
	result    *types.GenePanelUploadResult
	err       error
	called    bool
	gotTenant string
	gotFile   string
	gotStrict bool
}

func (m *mockGenePanelUploader) Upload(_ context.Context, tenantCode string, file io.Reader, strict bool) (*types.GenePanelUploadResult, error) {
	content, _ := io.ReadAll(file)
	m.called, m.gotTenant, m.gotFile, m.gotStrict = true, tenantCode, string(content), strict
	return m.result, m.err
}

func multipartBody(t *testing.T, field, content string) (*bytes.Buffer, string) {
	t.Helper()
	body := &bytes.Buffer{}
	writer := multipart.NewWriter(body)
	part, err := writer.CreateFormFile(field, "gene_panels.tsv")
	assert.NoError(t, err)
	_, err = part.Write([]byte(content))
	assert.NoError(t, err)
	assert.NoError(t, writer.Close())
	return body, writer.FormDataContentType()
}

func servePutGenePanels(uploader genePanelUploader, query string, body io.Reader, contentType string) *httptest.ResponseRecorder {
	router := gin.New()
	group := router.Group("/:tenant")
	group.Use(func(c *gin.Context) { c.Set(TenantContextKey, c.Param("tenant")) })
	group.PUT("/gene_panels", PutGenePanelsHandler(uploader))
	req, _ := http.NewRequest(http.MethodPut, "/radiant/gene_panels"+query, body)
	req.Header.Set("Content-Type", contentType)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)
	return w
}

func Test_PutGenePanelsHandler_PassesFileTenantAndStrict(t *testing.T) {
	uploader := &mockGenePanelUploader{result: &types.GenePanelUploadResult{Panels: 1, Genes: 2, Warnings: []types.GenePanelUploadWarning{
		{Line: 3, Symbol: "NOTAGENE", Message: "symbol matches no Ensembl gene, row skipped"},
	}}}
	body, contentType := multipartBody(t, "file", "symbol\tpanels\n")

	w := servePutGenePanels(uploader, "?strict=true", body, contentType)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, `{"panels":1,"genes":2,"warnings":[
		{"line":3,"symbol":"NOTAGENE","message":"symbol matches no Ensembl gene, row skipped"}
	]}`, w.Body.String())
	assert.Equal(t, "radiant", uploader.gotTenant)
	assert.Equal(t, "symbol\tpanels\n", uploader.gotFile)
	assert.True(t, uploader.gotStrict)
}

func Test_PutGenePanelsHandler_StrictDefaultsToFalse(t *testing.T) {
	uploader := &mockGenePanelUploader{result: &types.GenePanelUploadResult{Warnings: []types.GenePanelUploadWarning{}}}
	body, contentType := multipartBody(t, "file", "x")

	w := servePutGenePanels(uploader, "", body, contentType)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.False(t, uploader.gotStrict)
}

func Test_PutGenePanelsHandler_BadStrict(t *testing.T) {
	uploader := &mockGenePanelUploader{}
	body, contentType := multipartBody(t, "file", "x")

	w := servePutGenePanels(uploader, "?strict=maybe", body, contentType)

	assert.Equal(t, http.StatusBadRequest, w.Code)
	assert.JSONEq(t, `{"status":400,"message":"strict must be true or false"}`, w.Body.String())
	assert.False(t, uploader.called)
}

func Test_PutGenePanelsHandler_MissingFilePart(t *testing.T) {
	uploader := &mockGenePanelUploader{}
	body, contentType := multipartBody(t, "other", "x")

	w := servePutGenePanels(uploader, "", body, contentType)

	assert.Equal(t, http.StatusBadRequest, w.Code)
	assert.Contains(t, w.Body.String(), `"message":"file: http: no such file"`)
	assert.False(t, uploader.called)
}

func Test_PutGenePanelsHandler_NotMultipart(t *testing.T) {
	uploader := &mockGenePanelUploader{}

	w := servePutGenePanels(uploader, "", strings.NewReader("symbol\tpanels\n"), "text/tab-separated-values")

	assert.Equal(t, http.StatusBadRequest, w.Code)
	assert.False(t, uploader.called)
}

func Test_PutGenePanelsHandler_BodyTooLarge(t *testing.T) {
	uploader := &mockGenePanelUploader{}
	body, contentType := multipartBody(t, "file", strings.Repeat("a", GenePanelUploadMaxBytes))

	w := servePutGenePanels(uploader, "", body, contentType)

	assert.Equal(t, http.StatusRequestEntityTooLarge, w.Code)
	assert.JSONEq(t, `{"status":413,"message":"request body exceeds 10485760 bytes"}`, w.Body.String())
	assert.False(t, uploader.called)
}

func Test_PutGenePanelsHandler_BadFileGives400WithLine(t *testing.T) {
	uploader := &mockGenePanelUploader{err: &types.GenePanelFileError{Line: 4, Message: "symbol is empty"}}
	body, contentType := multipartBody(t, "file", "x")

	w := servePutGenePanels(uploader, "", body, contentType)

	assert.Equal(t, http.StatusBadRequest, w.Code)
	assert.JSONEq(t, `{"status":400,"message":"line 4: symbol is empty","detail":{"line":4}}`, w.Body.String())
}

func Test_PutGenePanelsHandler_UnmatchedGenesGives422WithWarnings(t *testing.T) {
	uploader := &mockGenePanelUploader{err: &types.UnmatchedGenesError{Warnings: []types.GenePanelUploadWarning{
		{Line: 3, Symbol: "NOTAGENE", Message: "symbol matches no Ensembl gene, row skipped"},
	}}}
	body, contentType := multipartBody(t, "file", "x")

	w := servePutGenePanels(uploader, "?strict=true", body, contentType)

	assert.Equal(t, http.StatusUnprocessableEntity, w.Code)
	assert.JSONEq(t, `{"status":422,"message":"1 row(s) match no Ensembl gene","detail":{"warnings":[
		{"line":3,"symbol":"NOTAGENE","message":"symbol matches no Ensembl gene, row skipped"}
	]}}`, w.Body.String())
}

func Test_PutGenePanelsHandler_ConflictGives409(t *testing.T) {
	uploader := &mockGenePanelUploader{err: &types.GenePanelConflictError{Message: "an uploaded panel missing from the file is used by the analysis catalog"}}
	body, contentType := multipartBody(t, "file", "x")

	w := servePutGenePanels(uploader, "", body, contentType)

	assert.Equal(t, http.StatusConflict, w.Code)
	assert.JSONEq(t, `{"status":409,"message":"an uploaded panel missing from the file is used by the analysis catalog"}`, w.Body.String())
}

func Test_PutGenePanelsHandler_OtherErrorGives500(t *testing.T) {
	uploader := &mockGenePanelUploader{err: errors.New("gene panels saved, but the gene panel mv refresh failed")}
	body, contentType := multipartBody(t, "file", "x")

	w := servePutGenePanels(uploader, "", body, contentType)

	assert.Equal(t, http.StatusInternalServerError, w.Code)
	assert.JSONEq(t, `{"status":500,"message":"Internal Server Error"}`, w.Body.String())
}
