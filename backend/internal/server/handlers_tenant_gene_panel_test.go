package server

import (
	"bytes"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/stretchr/testify/assert"
)

const tenantGenePanelFilterBody = `{"sqon":{"op":"in","content":{"field":"tenant_gene_panel","value":["ONCO"]}}}`
const tenantGenePanelAggregateBody = `{"field":"tenant_gene_panel","sqon":{"op":"and","content":[]}}`
const tenantGenePanelStatisticsBody = `{"field":"start","sqon":{"op":"in","content":{"field":"tenant_gene_panel","value":["ONCO"]}}}`

// bindTenantViews mirrors RequireTenantAccess with TENANT_VIEWS_READ_ENABLED on: it binds the
// path tenant to the request context.
func bindTenantViews(c *gin.Context) {
	c.Request = c.Request.WithContext(types.ContextWithTenant(c.Request.Context(), c.Param("tenant")))
	c.Next()
}

func postTenantGenePanel(router *gin.Engine, path string, body string) *httptest.ResponseRecorder {
	req, _ := http.NewRequest("POST", path, bytes.NewBufferString(body))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)
	return w
}

func Test_OccurrencesGermlineSNVListHandler_Rejects_TenantGenePanel_Without_TenantViews(t *testing.T) {
	router := gin.Default()
	router.POST("/:tenant/occurrences/germline/snv/:case_id/:seq_id/:task_id/list", OccurrencesGermlineSNVListHandler(&occurrenceFiltersRecorder{}))

	w := postTenantGenePanel(router, "/radiant/occurrences/germline/snv/1/1/1/list", tenantGenePanelFilterBody)

	assert.Equal(t, http.StatusBadRequest, w.Code)
	assert.JSONEq(t, `{"status":400,"message":"error during build list query from sqon unauthorized or unknown field: tenant_gene_panel"}`, w.Body.String())
}

func Test_OccurrencesGermlineSNVListHandler_Accepts_TenantGenePanel_With_TenantViews(t *testing.T) {
	repo := &occurrenceFiltersRecorder{}
	router := gin.Default()
	router.POST("/:tenant/occurrences/germline/snv/:case_id/:seq_id/:task_id/list", bindTenantViews, OccurrencesGermlineSNVListHandler(repo))

	w := postTenantGenePanel(router, "/radiant/occurrences/germline/snv/1/1/1/list", tenantGenePanelFilterBody)

	assert.Equal(t, http.StatusOK, w.Code)
	if assert.NotNil(t, repo.listQuery) {
		assert.True(t, repo.listQuery.HasFieldFromTables(types.TenantGenePanelTable))
	}
}

func Test_OccurrencesGermlineSNVCountHandler_Rejects_TenantGenePanel_Without_TenantViews(t *testing.T) {
	router := gin.Default()
	router.POST("/:tenant/occurrences/germline/snv/:case_id/:seq_id/:task_id/count", OccurrencesGermlineSNVCountHandler(&occurrenceFiltersRecorder{}))

	w := postTenantGenePanel(router, "/radiant/occurrences/germline/snv/1/1/1/count", tenantGenePanelFilterBody)

	assert.Equal(t, http.StatusBadRequest, w.Code)
	assert.JSONEq(t, `{"status":400,"message":"error during build list query unauthorized or unknown field: tenant_gene_panel"}`, w.Body.String())
}

func Test_OccurrencesGermlineSNVCountHandler_Accepts_TenantGenePanel_With_TenantViews(t *testing.T) {
	repo := &occurrenceFiltersRecorder{}
	router := gin.Default()
	router.POST("/:tenant/occurrences/germline/snv/:case_id/:seq_id/:task_id/count", bindTenantViews, OccurrencesGermlineSNVCountHandler(repo))

	w := postTenantGenePanel(router, "/radiant/occurrences/germline/snv/1/1/1/count", tenantGenePanelFilterBody)

	assert.Equal(t, http.StatusOK, w.Code)
	if assert.NotNil(t, repo.countQuery) {
		assert.True(t, repo.countQuery.HasFieldFromTables(types.TenantGenePanelTable))
	}
}

func Test_OccurrencesGermlineSNVAggregateHandler_Rejects_TenantGenePanel_Without_TenantViews(t *testing.T) {
	router := gin.Default()
	router.POST("/:tenant/occurrences/germline/snv/:case_id/:seq_id/:task_id/aggregate", OccurrencesGermlineSNVAggregateHandler(&MockRepository{}, &MockFacetsRepository{}))

	w := postTenantGenePanel(router, "/radiant/occurrences/germline/snv/1/1/1/aggregate", tenantGenePanelAggregateBody)

	assert.Equal(t, http.StatusBadRequest, w.Code)
	assert.JSONEq(t, `{"status":400,"message":"error during build aggregation tenant_gene_panel can not be aggregated"}`, w.Body.String())
}

func Test_OccurrencesGermlineSNVAggregateHandler_Accepts_TenantGenePanel_With_TenantViews(t *testing.T) {
	router := gin.Default()
	router.POST("/:tenant/occurrences/germline/snv/:case_id/:seq_id/:task_id/aggregate", bindTenantViews, OccurrencesGermlineSNVAggregateHandler(&MockRepository{}, &MockFacetsRepository{}))

	w := postTenantGenePanel(router, "/radiant/occurrences/germline/snv/1/1/1/aggregate", tenantGenePanelAggregateBody)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, `[{"key": "insertion", "count": 479564}, {"key": "deletion", "count": 495942}]`, w.Body.String())
}

func Test_OccurrencesGermlineSNVStatisticsHandler_Rejects_TenantGenePanel_Without_TenantViews(t *testing.T) {
	router := gin.Default()
	router.POST("/:tenant/occurrences/germline/snv/:case_id/:seq_id/:task_id/statistics", OccurrencesGermlineSNVStatisticsHandler(&MockRepository{}))

	w := postTenantGenePanel(router, "/radiant/occurrences/germline/snv/1/1/1/statistics", tenantGenePanelStatisticsBody)

	assert.Equal(t, http.StatusBadRequest, w.Code)
	assert.JSONEq(t, `{"status":400,"message":"error during build statistics query unauthorized or unknown field: tenant_gene_panel"}`, w.Body.String())
}

func Test_OccurrencesSomaticSNVListHandler_Rejects_TenantGenePanel_Without_TenantViews(t *testing.T) {
	router := gin.Default()
	router.POST("/:tenant/occurrences/somatic/snv/:case_id/:seq_id/:task_id/list", OccurrencesSomaticSNVListHandler(&MockSomaticSNVOccurrencesRepository{}))

	w := postTenantGenePanel(router, "/radiant/occurrences/somatic/snv/1/1/1/list", tenantGenePanelFilterBody)

	assert.Equal(t, http.StatusBadRequest, w.Code)
	assert.JSONEq(t, `{"status":400,"message":"error during build list query from sqon unauthorized or unknown field: tenant_gene_panel"}`, w.Body.String())
}

func Test_OccurrencesSomaticSNVListHandler_Accepts_TenantGenePanel_With_TenantViews(t *testing.T) {
	router := gin.Default()
	router.POST("/:tenant/occurrences/somatic/snv/:case_id/:seq_id/:task_id/list", bindTenantViews, OccurrencesSomaticSNVListHandler(&MockSomaticSNVOccurrencesRepository{}))

	w := postTenantGenePanel(router, "/radiant/occurrences/somatic/snv/1/1/1/list", tenantGenePanelFilterBody)

	assert.Equal(t, http.StatusOK, w.Code)
}

func Test_OccurrencesSomaticSNVCountHandler_Rejects_TenantGenePanel_Without_TenantViews(t *testing.T) {
	router := gin.Default()
	router.POST("/:tenant/occurrences/somatic/snv/:case_id/:seq_id/:task_id/count", OccurrencesSomaticSNVCountHandler(&MockSomaticSNVOccurrencesRepository{}))

	w := postTenantGenePanel(router, "/radiant/occurrences/somatic/snv/1/1/1/count", tenantGenePanelFilterBody)

	assert.Equal(t, http.StatusBadRequest, w.Code)
	assert.JSONEq(t, `{"status":400,"message":"error during build list query unauthorized or unknown field: tenant_gene_panel"}`, w.Body.String())
}

func Test_OccurrencesSomaticSNVCountHandler_Accepts_TenantGenePanel_With_TenantViews(t *testing.T) {
	router := gin.Default()
	router.POST("/:tenant/occurrences/somatic/snv/:case_id/:seq_id/:task_id/count", bindTenantViews, OccurrencesSomaticSNVCountHandler(&MockSomaticSNVOccurrencesRepository{}))

	w := postTenantGenePanel(router, "/radiant/occurrences/somatic/snv/1/1/1/count", tenantGenePanelFilterBody)

	assert.Equal(t, http.StatusOK, w.Code)
}

func Test_OccurrencesSomaticSNVAggregateHandler_Rejects_TenantGenePanel_Without_TenantViews(t *testing.T) {
	router := gin.Default()
	router.POST("/:tenant/occurrences/somatic/snv/:case_id/:seq_id/:task_id/aggregate", OccurrencesSomaticSNVAggregateHandler(&MockSomaticSNVOccurrencesRepository{}, &MockFacetsRepository{}))

	w := postTenantGenePanel(router, "/radiant/occurrences/somatic/snv/1/1/1/aggregate", tenantGenePanelAggregateBody)

	assert.Equal(t, http.StatusBadRequest, w.Code)
	assert.JSONEq(t, `{"status":400,"message":"error during build aggregation tenant_gene_panel can not be aggregated"}`, w.Body.String())
}

func Test_OccurrencesSomaticSNVAggregateHandler_Accepts_TenantGenePanel_With_TenantViews(t *testing.T) {
	router := gin.Default()
	router.POST("/:tenant/occurrences/somatic/snv/:case_id/:seq_id/:task_id/aggregate", bindTenantViews, OccurrencesSomaticSNVAggregateHandler(&MockSomaticSNVOccurrencesRepository{}, &MockFacetsRepository{}))

	w := postTenantGenePanel(router, "/radiant/occurrences/somatic/snv/1/1/1/aggregate", tenantGenePanelAggregateBody)

	assert.Equal(t, http.StatusOK, w.Code)
}

func Test_OccurrencesSomaticSNVStatisticsHandler_Rejects_TenantGenePanel_Without_TenantViews(t *testing.T) {
	router := gin.Default()
	router.POST("/:tenant/occurrences/somatic/snv/:case_id/:seq_id/:task_id/statistics", OccurrencesSomaticSNVStatisticsHandler(&MockSomaticSNVOccurrencesRepository{}))

	w := postTenantGenePanel(router, "/radiant/occurrences/somatic/snv/1/1/1/statistics", tenantGenePanelStatisticsBody)

	assert.Equal(t, http.StatusBadRequest, w.Code)
	assert.JSONEq(t, `{"status":400,"message":"error during build statistics query unauthorized or unknown field: tenant_gene_panel"}`, w.Body.String())
}
