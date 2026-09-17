package server

import (
	"context"
	"errors"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/radiant-network/radiant-api/internal/beacon"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
)

var beaconTestCfg = beacon.Config{
	ID: "org.test.beacon", Name: "Test Beacon", Description: "d", Environment: "test", ProductionStatus: "TEST",
	PublicURL: "http://api.test", WelcomeURL: "http://docs.test",
	Organization: beacon.Organization{ID: "org.test", Name: "Test Org"},
}

type mockBeaconVariants struct {
	rows     []types.BeaconVariant
	err      error
	gotQuery beacon.VariantQuery
	gotSkip  int
	gotLimit int
	listed   bool
}

func (m *mockBeaconVariants) Exists(_ context.Context, q beacon.VariantQuery) (bool, error) {
	m.gotQuery = q
	return len(m.rows) > 0, m.err
}

func (m *mockBeaconVariants) Count(_ context.Context, q beacon.VariantQuery) (int64, error) {
	m.gotQuery = q
	return int64(len(m.rows)), m.err
}

func (m *mockBeaconVariants) List(_ context.Context, q beacon.VariantQuery, skip, limit int) ([]types.BeaconVariant, error) {
	m.gotQuery, m.gotSkip, m.gotLimit, m.listed = q, skip, limit, true
	return m.rows, m.err
}

func (m *mockBeaconVariants) GetByLocusID(_ context.Context, locusID int64) (*types.BeaconVariant, error) {
	if m.err != nil {
		return nil, m.err
	}
	for _, r := range m.rows {
		if r.LocusID == locusID {
			return &r, nil
		}
	}
	return nil, nil
}

type mockProjects struct {
	projects []types.Project
	err      error
}

func (m *mockProjects) ListByTenant(context.Context, string) ([]types.Project, error) {
	return m.projects, m.err
}

func (m *mockProjects) GetByCode(_ context.Context, _, code string) (*types.Project, error) {
	if m.err != nil {
		return nil, m.err
	}
	for _, p := range m.projects {
		if p.Code == code {
			return &p, nil
		}
	}
	return nil, nil
}

func beaconVariantRow() types.BeaconVariant {
	pc, pn, pf := 3, 412, 0.0073
	end := int64(7674220)
	return types.BeaconVariant{
		LocusID: 1001, Chromosome: "17", Start: 7674220, End: &end, Reference: "C", Alternate: "T", VariantClass: "SNV",
		Symbol: "TP53", Hgvsg: "chr17:g.7674220C>T", AaChange: "p.Arg175His",
		GermlinePcWgs: &pc, GermlinePnWgs: &pn, GermlinePfWgs: &pf,
	}
}

// beaconRouter registers the query routes the way setupRouter does, minus JWT verification.
func beaconRouter(variants beaconVariantsReader, projects projectsReader, canSearchCase bool) *gin.Engine {
	auth := &testutils.MockAuth{}
	actions := &mockAuthRepository{actionsHeld: map[string]bool{types.ActionSearchCase: canSearchCase, types.ActionViewKb: true}}
	r := tenantRouter()
	g := r.Group("/:tenant/beacon")
	g.Use(WithBeaconConfig(beaconTestCfg))
	g.GET("/g_variants", BeaconGenomicVariationsHandler(beaconTestCfg, variants, auth, actions))
	g.POST("/g_variants", BeaconGenomicVariationsPostHandler(beaconTestCfg, variants, auth, actions))
	g.GET("/g_variants/:id", BeaconGenomicVariationByIDHandler(beaconTestCfg, variants, auth, actions))
	g.GET("/datasets", BeaconDatasetsHandler(beaconTestCfg, projects))
	g.POST("/datasets", BeaconDatasetsPostHandler(beaconTestCfg, projects))
	g.GET("/datasets/:id", BeaconDatasetByIDHandler(beaconTestCfg, projects))
	return r
}

func beaconPublicRouter(repo tenantAccessChecker) *gin.Engine {
	r := gin.New()
	g := r.Group("/:tenant/beacon")
	g.Use(WithBeaconConfig(beaconTestCfg), RequireTenantExists(repo))
	g.GET("", BeaconInfoHandler(beaconTestCfg))
	g.GET("/info", BeaconInfoHandler(beaconTestCfg))
	g.GET("/service-info", BeaconServiceInfoHandler(beaconTestCfg))
	g.GET("/configuration", BeaconConfigurationHandler(beaconTestCfg))
	g.GET("/entry_types", BeaconEntryTypesHandler(beaconTestCfg))
	g.GET("/map", BeaconMapHandler(beaconTestCfg))
	g.GET("/filtering_terms", BeaconFilteringTermsHandler(beaconTestCfg))
	return r
}

func do(r *gin.Engine, method, path, body string) *httptest.ResponseRecorder {
	var reader *strings.Reader
	if body != "" {
		reader = strings.NewReader(body)
	} else {
		reader = strings.NewReader("")
	}
	req, _ := http.NewRequest(method, path, reader)
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)
	return w
}

const tp53Query = "/radiant/beacon/g_variants?referenceName=17&start=7674219&referenceBases=C&alternateBases=T"

func Test_BeaconInfo_Public(t *testing.T) {
	w := do(beaconPublicRouter(&mockAuthRepository{}), http.MethodGet, "/radiant/beacon/info", "")
	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, `{
	  "meta":{"beaconId":"org.test.beacon.radiant","apiVersion":"v2.0.0","returnedSchemas":[]},
	  "response":{"id":"org.test.beacon.radiant","name":"Test Beacon (radiant)","apiVersion":"v2.0.0","environment":"test",
	              "organization":{"id":"org.test","name":"Test Org"},"description":"d","version":"v2.0.0",
	              "welcomeUrl":"http://docs.test","alternativeUrl":"http://api.test/radiant/beacon","info":{"tenant":"radiant"}}}`, w.Body.String())
}

func Test_BeaconInfo_RootAliasAndServiceInfoSchema(t *testing.T) {
	r := beaconPublicRouter(&mockAuthRepository{})
	assert.Equal(t, http.StatusOK, do(r, http.MethodGet, "/radiant/beacon", "").Code)

	w := do(r, http.MethodGet, "/radiant/beacon/info?requestedSchema=ga4gh-service-info-v1.0", "")
	assert.Equal(t, http.StatusOK, w.Code)
	assert.Contains(t, w.Body.String(), `"type":{"group":"org.ga4gh","artifact":"beacon","version":"2.0.0"}`)
}

func Test_BeaconServiceInfo_Public(t *testing.T) {
	w := do(beaconPublicRouter(&mockAuthRepository{}), http.MethodGet, "/radiant/beacon/service-info", "")
	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, `{"id":"org.test.beacon.radiant","name":"Test Beacon (radiant)","type":{"group":"org.ga4gh","artifact":"beacon","version":"2.0.0"},
	  "description":"d","organization":{"name":"Test Org","url":""},"documentationUrl":"http://docs.test","environment":"test","version":"v2.0.0"}`, w.Body.String())
}

func Test_BeaconConfiguration_Public(t *testing.T) {
	w := do(beaconPublicRouter(&mockAuthRepository{}), http.MethodGet, "/radiant/beacon/configuration", "")
	assert.Equal(t, http.StatusOK, w.Code)
	body := w.Body.String()
	assert.Contains(t, body, `"productionStatus":"TEST"`)
	assert.Contains(t, body, `"securityLevels":["REGISTERED"]`)
	assert.Contains(t, body, `"defaultGranularity":"boolean"`)
	assert.Contains(t, body, `"genomicVariation":{"id":"genomicVariation"`)
	assert.Contains(t, body, `"dataset":{"id":"dataset"`)
}

func Test_BeaconEntryTypes_Public(t *testing.T) {
	w := do(beaconPublicRouter(&mockAuthRepository{}), http.MethodGet, "/radiant/beacon/entry_types", "")
	assert.Equal(t, http.StatusOK, w.Code)
	assert.Contains(t, w.Body.String(), `"entryTypes":{`)
}

func Test_BeaconMap_Public(t *testing.T) {
	w := do(beaconPublicRouter(&mockAuthRepository{}), http.MethodGet, "/radiant/beacon/map", "")
	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, `{
	  "meta":{"beaconId":"org.test.beacon.radiant","apiVersion":"v2.0.0","returnedSchemas":[]},
	  "response":{"$schema":"https://raw.githubusercontent.com/ga4gh-beacon/beacon-v2/main/framework/json/configuration/beaconMapSchema.json",
	    "endpointSets":{
	      "genomicVariation":{"entryType":"genomicVariation","rootUrl":"http://api.test/radiant/beacon/g_variants","singleEntryUrl":"http://api.test/radiant/beacon/g_variants/{id}"},
	      "dataset":{"entryType":"dataset","rootUrl":"http://api.test/radiant/beacon/datasets","singleEntryUrl":"http://api.test/radiant/beacon/datasets/{id}"}}}}`, w.Body.String())
}

func Test_BeaconFilteringTerms_Public_Empty(t *testing.T) {
	w := do(beaconPublicRouter(&mockAuthRepository{}), http.MethodGet, "/radiant/beacon/filtering_terms", "")
	assert.Equal(t, http.StatusOK, w.Code)
	assert.Contains(t, w.Body.String(), `"filteringTerms":[]`)
	assert.Contains(t, w.Body.String(), `"resources":[]`)
}

func Test_RequireTenantExists_UnknownTenant_404BeaconError(t *testing.T) {
	w := do(beaconPublicRouter(&mockAuthRepository{tenantNotFound: true}), http.MethodGet, "/nope/beacon/info", "")
	assert.Equal(t, http.StatusNotFound, w.Code)
	assert.JSONEq(t, `{"meta":{"beaconId":"org.test.beacon.nope","apiVersion":"v2.0.0","returnedSchemas":[]},"error":{"errorCode":404,"errorMessage":"unknown beacon: no such tenant"}}`, w.Body.String())
}

func Test_RequireTenantExists_RepoError_500BeaconError(t *testing.T) {
	w := do(beaconPublicRouter(&mockAuthRepository{tenantExistsErr: errors.New("db down")}), http.MethodGet, "/radiant/beacon/info", "")
	assert.Equal(t, http.StatusInternalServerError, w.Code)
	assert.JSONEq(t, `{"meta":{"beaconId":"org.test.beacon.radiant","apiVersion":"v2.0.0","returnedSchemas":[]},"error":{"errorCode":500,"errorMessage":"Internal Server Error"}}`, w.Body.String())
	assert.NotEmpty(t, w.Header().Get("X-Correlation-ID"))
}

func Test_BeaconGenomicVariations_GET_Boolean_Default(t *testing.T) {
	variants := &mockBeaconVariants{rows: []types.BeaconVariant{beaconVariantRow()}}
	w := do(beaconRouter(variants, &mockProjects{}, true), http.MethodGet, tp53Query, "")
	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, `{
	  "meta":{"beaconId":"org.test.beacon.radiant","apiVersion":"v2.0.0",
	          "returnedSchemas":[{"entityType":"genomicVariation","schema":"ga4gh-beacon-variant-v2.0.0"}],
	          "returnedGranularity":"boolean",
	          "receivedRequestSummary":{"apiVersion":"v2.0.0","requestedSchemas":[],"pagination":{"skip":0,"limit":10},
	             "requestedGranularity":"boolean","filters":[],
	             "requestParameters":{"referenceName":"17","start":[7674219],"referenceBases":"C","alternateBases":"T"},
	             "includeResultsetResponses":"HIT","testMode":false}},
	  "responseSummary":{"exists":true}}`, w.Body.String())
	assert.Equal(t, beacon.KindSequence, variants.gotQuery.Kind)
	assert.Equal(t, int64(7674220), variants.gotQuery.Start, "0-based request converted to the table's 1-based start")
}

func Test_BeaconGenomicVariations_GET_Count(t *testing.T) {
	variants := &mockBeaconVariants{rows: []types.BeaconVariant{beaconVariantRow()}}
	w := do(beaconRouter(variants, &mockProjects{}, true), http.MethodGet, tp53Query+"&requestedGranularity=count", "")
	assert.Equal(t, http.StatusOK, w.Code)
	assert.Contains(t, w.Body.String(), `"responseSummary":{"exists":true,"numTotalResults":1}`)
	assert.NotContains(t, w.Body.String(), `"resultSets"`)
	assert.False(t, variants.listed)
}

func Test_BeaconGenomicVariations_GET_Record(t *testing.T) {
	variants := &mockBeaconVariants{rows: []types.BeaconVariant{beaconVariantRow()}}
	w := do(beaconRouter(variants, &mockProjects{}, true), http.MethodGet, tp53Query+"&requestedGranularity=record&skip=0&limit=5", "")
	assert.Equal(t, http.StatusOK, w.Code)
	body := w.Body.String()
	assert.Contains(t, body, `"returnedGranularity":"record"`)
	assert.Contains(t, body, `"resultSets":[{"id":"radiant","setType":"dataset","exists":true,"resultsCount":1,"results":[{"variantInternalId":"1001"`)
	assert.Contains(t, body, `"sequence_id":"refseq:NC_000017.11"`)
	assert.Contains(t, body, `"start":{"type":"Number","value":7674219}`)
	assert.Contains(t, body, `"sourceReference":"http://api.test/radiant/beacon"`)
	assert.Equal(t, 5, variants.gotLimit)
}

func Test_BeaconGenomicVariations_GET_Record_ClampedToCountWithoutSearchCase(t *testing.T) {
	variants := &mockBeaconVariants{rows: []types.BeaconVariant{beaconVariantRow()}}
	w := do(beaconRouter(variants, &mockProjects{}, false), http.MethodGet, tp53Query+"&requestedGranularity=record", "")
	assert.Equal(t, http.StatusOK, w.Code)
	body := w.Body.String()
	assert.Contains(t, body, `"returnedGranularity":"count"`)
	assert.Contains(t, body, `"requestedGranularity":"record"`)
	assert.NotContains(t, body, `"resultSets"`)
	assert.False(t, variants.listed)
}

func Test_BeaconGenomicVariations_GET_NoMatch(t *testing.T) {
	w := do(beaconRouter(&mockBeaconVariants{}, &mockProjects{}, true), http.MethodGet, tp53Query+"&requestedGranularity=record", "")
	assert.Equal(t, http.StatusOK, w.Code)
	assert.Contains(t, w.Body.String(), `"responseSummary":{"exists":false,"numTotalResults":0}`)
	assert.Contains(t, w.Body.String(), `"response":{"resultSets":[]}`)
}

func Test_BeaconGenomicVariations_POST(t *testing.T) {
	variants := &mockBeaconVariants{rows: []types.BeaconVariant{beaconVariantRow()}}
	body := `{"meta":{"apiVersion":"v2.0.0"},"query":{"requestParameters":{"geneId":"TP53"},"requestedGranularity":"count"}}`
	w := do(beaconRouter(variants, &mockProjects{}, true), http.MethodPost, "/radiant/beacon/g_variants", body)
	assert.Equal(t, http.StatusOK, w.Code)
	assert.Contains(t, w.Body.String(), `"numTotalResults":1`)
	assert.Equal(t, beacon.KindGene, variants.gotQuery.Kind)
	assert.Equal(t, "TP53", variants.gotQuery.GeneSymbol)
}

func Test_BeaconGenomicVariations_NoParameters_400(t *testing.T) {
	w := do(beaconRouter(&mockBeaconVariants{}, &mockProjects{}, true), http.MethodGet, "/radiant/beacon/g_variants", "")
	assert.Equal(t, http.StatusBadRequest, w.Code)
	assert.Contains(t, w.Body.String(), `"errorCode":400`)
	assert.Contains(t, w.Body.String(), `"beaconId":"org.test.beacon.radiant"`)
}

func Test_BeaconGenomicVariations_Filters_400(t *testing.T) {
	w := do(beaconRouter(&mockBeaconVariants{}, &mockProjects{}, true), http.MethodGet, "/radiant/beacon/g_variants?geneId=TP53&filters=HP:0000001", "")
	assert.Equal(t, http.StatusBadRequest, w.Code)
}

func Test_BeaconGenomicVariations_Bracket_501(t *testing.T) {
	w := do(beaconRouter(&mockBeaconVariants{}, &mockProjects{}, true), http.MethodGet, "/radiant/beacon/g_variants?referenceName=17&start=1,2&end=3,4&variantType=DEL", "")
	assert.Equal(t, http.StatusNotImplemented, w.Code)
	assert.Contains(t, w.Body.String(), `"errorCode":501`)
}

func Test_BeaconGenomicVariations_RepoError_500Redacted(t *testing.T) {
	w := do(beaconRouter(&mockBeaconVariants{err: errors.New("starrocks exploded")}, &mockProjects{}, true), http.MethodGet, tp53Query, "")
	assert.Equal(t, http.StatusInternalServerError, w.Code)
	assert.JSONEq(t, `{"meta":{"beaconId":"org.test.beacon.radiant","apiVersion":"v2.0.0","returnedSchemas":[]},"error":{"errorCode":500,"errorMessage":"Internal Server Error"}}`, w.Body.String())
	assert.NotEmpty(t, w.Header().Get("X-Correlation-ID"))
}

func Test_BeaconGenomicVariations_ActionCheckError_500(t *testing.T) {
	r := tenantRouter()
	actions := &mockAuthRepository{actionErr: errors.New("pg down")}
	r.GET("/:tenant/beacon/g_variants", BeaconGenomicVariationsHandler(beaconTestCfg, &mockBeaconVariants{}, &testutils.MockAuth{}, actions))
	w := do(r, http.MethodGet, tp53Query, "")
	assert.Equal(t, http.StatusInternalServerError, w.Code)
}

func Test_BeaconGenomicVariationByID_Found(t *testing.T) {
	w := do(beaconRouter(&mockBeaconVariants{rows: []types.BeaconVariant{beaconVariantRow()}}, &mockProjects{}, true), http.MethodGet, "/radiant/beacon/g_variants/1001", "")
	assert.Equal(t, http.StatusOK, w.Code)
	assert.Contains(t, w.Body.String(), `"variantInternalId":"1001"`)
	assert.Contains(t, w.Body.String(), `"returnedGranularity":"record"`)
}

func Test_BeaconGenomicVariationByID_ClampedWithoutSearchCase(t *testing.T) {
	w := do(beaconRouter(&mockBeaconVariants{rows: []types.BeaconVariant{beaconVariantRow()}}, &mockProjects{}, false), http.MethodGet, "/radiant/beacon/g_variants/1001", "")
	assert.Equal(t, http.StatusOK, w.Code)
	assert.Contains(t, w.Body.String(), `"returnedGranularity":"count"`)
	assert.NotContains(t, w.Body.String(), `"variantInternalId"`)
}

func Test_BeaconGenomicVariationByID_NotFound(t *testing.T) {
	w := do(beaconRouter(&mockBeaconVariants{}, &mockProjects{}, true), http.MethodGet, "/radiant/beacon/g_variants/42", "")
	assert.Equal(t, http.StatusNotFound, w.Code)
	assert.Contains(t, w.Body.String(), `"errorCode":404`)
}

func Test_BeaconGenomicVariationByID_NotAnInteger_400(t *testing.T) {
	w := do(beaconRouter(&mockBeaconVariants{}, &mockProjects{}, true), http.MethodGet, "/radiant/beacon/g_variants/abc", "")
	assert.Equal(t, http.StatusBadRequest, w.Code)
}

func Test_BeaconGenomicVariationByID_RepoError_500(t *testing.T) {
	w := do(beaconRouter(&mockBeaconVariants{err: errors.New("boom")}, &mockProjects{}, true), http.MethodGet, "/radiant/beacon/g_variants/1", "")
	assert.Equal(t, http.StatusInternalServerError, w.Code)
}

var seededProjects = []types.Project{
	{ID: 1, Code: "N1", Name: "NeuroDev Phase I", Description: "Phase one"},
	{ID: 2, Code: "N2", Name: "NeuroDev Phase II", Description: "Phase two"},
}

func Test_BeaconDatasets_GET_RecordsByDefault(t *testing.T) {
	w := do(beaconRouter(&mockBeaconVariants{}, &mockProjects{projects: seededProjects}, false), http.MethodGet, "/radiant/beacon/datasets", "")
	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, `{
	  "meta":{"beaconId":"org.test.beacon.radiant","apiVersion":"v2.0.0",
	          "returnedSchemas":[{"entityType":"dataset","schema":"ga4gh-beacon-dataset-v2.0.0"}],"returnedGranularity":"record",
	          "receivedRequestSummary":{"apiVersion":"v2.0.0","requestedSchemas":[],"pagination":{"skip":0,"limit":10},"requestedGranularity":"record",
	             "filters":[],"requestParameters":{},"includeResultsetResponses":"HIT","testMode":false}},
	  "responseSummary":{"exists":true,"numTotalResults":2},
	  "response":{"resultSets":[{"id":"radiant","setType":"dataset","exists":true,"resultsCount":2,"results":[
	     {"id":"N1","name":"NeuroDev Phase I","description":"Phase one","info":{"radiant_project_id":1}},
	     {"id":"N2","name":"NeuroDev Phase II","description":"Phase two","info":{"radiant_project_id":2}}]}]}}`, w.Body.String())
}

func Test_BeaconDatasets_GET_Paginated(t *testing.T) {
	w := do(beaconRouter(&mockBeaconVariants{}, &mockProjects{projects: seededProjects}, false), http.MethodGet, "/radiant/beacon/datasets?skip=1&limit=1", "")
	assert.Equal(t, http.StatusOK, w.Code)
	assert.Contains(t, w.Body.String(), `"results":[{"id":"N2"`)
	assert.NotContains(t, w.Body.String(), `"id":"N1"`)
}

func Test_BeaconDatasets_POST_Count(t *testing.T) {
	w := do(beaconRouter(&mockBeaconVariants{}, &mockProjects{projects: seededProjects}, false), http.MethodPost, "/radiant/beacon/datasets", `{"query":{"requestedGranularity":"count"}}`)
	assert.Equal(t, http.StatusOK, w.Code)
	assert.Contains(t, w.Body.String(), `"responseSummary":{"exists":true,"numTotalResults":2}`)
	assert.NotContains(t, w.Body.String(), `"resultSets"`)
}

func Test_BeaconDatasets_BadGranularity_400(t *testing.T) {
	w := do(beaconRouter(&mockBeaconVariants{}, &mockProjects{}, false), http.MethodGet, "/radiant/beacon/datasets?requestedGranularity=nope", "")
	assert.Equal(t, http.StatusBadRequest, w.Code)
}

func Test_BeaconDatasets_RepoError_500(t *testing.T) {
	w := do(beaconRouter(&mockBeaconVariants{}, &mockProjects{err: errors.New("boom")}, false), http.MethodGet, "/radiant/beacon/datasets", "")
	assert.Equal(t, http.StatusInternalServerError, w.Code)
	assert.Contains(t, w.Body.String(), `"errorMessage":"Internal Server Error"`)
}

func Test_BeaconDatasetByID_Found(t *testing.T) {
	w := do(beaconRouter(&mockBeaconVariants{}, &mockProjects{projects: seededProjects}, false), http.MethodGet, "/radiant/beacon/datasets/N2", "")
	assert.Equal(t, http.StatusOK, w.Code)
	assert.Contains(t, w.Body.String(), `"results":[{"id":"N2","name":"NeuroDev Phase II"`)
}

func Test_BeaconDatasetByID_NotFound(t *testing.T) {
	w := do(beaconRouter(&mockBeaconVariants{}, &mockProjects{projects: seededProjects}, false), http.MethodGet, "/radiant/beacon/datasets/N9", "")
	assert.Equal(t, http.StatusNotFound, w.Code)
}

func Test_BeaconDatasetByID_RepoError_500(t *testing.T) {
	w := do(beaconRouter(&mockBeaconVariants{}, &mockProjects{err: errors.New("boom")}, false), http.MethodGet, "/radiant/beacon/datasets/N1", "")
	assert.Equal(t, http.StatusInternalServerError, w.Code)
}

func Test_BeaconConfigFromEnv_Defaults(t *testing.T) {
	cfg := BeaconConfigFromEnv()
	assert.Equal(t, "org.radiant-network.beacon", cfg.ID)
	assert.Equal(t, "DEV", cfg.ProductionStatus)
	assert.Equal(t, "http://localhost:8090/radiant/beacon", cfg.BaseURL("radiant"))
}

func Test_BeaconConfigFromEnv_Overrides(t *testing.T) {
	t.Setenv(beaconIDEnv, "org.example.beacon")
	t.Setenv(beaconPublicURLEnv, "https://api.example.org/")
	t.Setenv(beaconProductionStatusEnv, "PROD")
	t.Setenv(beaconOrgNameEnv, "Example")
	cfg := BeaconConfigFromEnv()
	assert.Equal(t, "org.example.beacon.radiant", cfg.BeaconID("radiant"))
	assert.Equal(t, "https://api.example.org/radiant/beacon", cfg.BaseURL("radiant"))
	assert.Equal(t, "PROD", cfg.ProductionStatus)
	assert.Equal(t, "Example", cfg.Organization.Name)
}
