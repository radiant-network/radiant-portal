package beacon

import (
	"encoding/json"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

var testCfg = Config{
	ID: "org.example.beacon", Name: "Example Beacon", Description: "desc", Environment: "test", ProductionStatus: "TEST",
	PublicURL: "https://api.example.org/", WelcomeURL: "https://example.org/docs",
	Organization: Organization{ID: "org.example", Name: "Example Org", WelcomeURL: "https://example.org", ContactURL: "mailto:x@example.org"},
}

func Test_Config_BeaconIDAndBaseURL(t *testing.T) {
	assert.Equal(t, "org.example.beacon.radiant", testCfg.BeaconID("radiant"))
	assert.Equal(t, "https://api.example.org/radiant/beacon", testCfg.BaseURL("radiant"))
}

func Test_NewInfoResponse(t *testing.T) {
	r := NewInfoResponse(testCfg, "radiant")
	assert.Equal(t, "org.example.beacon.radiant", r.Meta.BeaconID)
	assert.Equal(t, APIVersion, r.Meta.APIVersion)
	assert.Equal(t, []SchemaReference{}, r.Meta.ReturnedSchemas)
	assert.Equal(t, "Example Beacon (radiant)", r.Response.Name)
	assert.Equal(t, "https://api.example.org/radiant/beacon", r.Response.AlternativeURL)
	assert.Equal(t, "test", r.Response.Environment)
}

func Test_NewServiceInfo(t *testing.T) {
	s := NewServiceInfo(testCfg, "radiant")
	assert.Equal(t, ServiceType{Group: "org.ga4gh", Artifact: "beacon", Version: "2.0.0"}, s.Type)
	assert.Equal(t, "Example Org", s.Organization.Name)
}

func Test_NewConfigurationResponse(t *testing.T) {
	r := NewConfigurationResponse(testCfg, "radiant")
	assert.Equal(t, "TEST", r.Response.MaturityAttributes.ProductionStatus)
	assert.Equal(t, []string{"REGISTERED"}, r.Response.SecurityAttributes.SecurityLevels)
	assert.Equal(t, DefaultGranularity, r.Response.SecurityAttributes.DefaultGranularity)
	assert.Len(t, r.Response.EntryTypes, 2)
	assert.Equal(t, SchemaGenomicVariation, r.Response.EntryTypes[EntryTypeGenomicVariation].DefaultSchema.ID)
}

func Test_NewMapResponse(t *testing.T) {
	r := NewMapResponse(testCfg, "radiant")
	assert.Equal(t, "https://api.example.org/radiant/beacon/g_variants", r.Response.EndpointSets[EntryTypeGenomicVariation].RootURL)
	assert.Equal(t, "https://api.example.org/radiant/beacon/datasets/{id}", r.Response.EndpointSets[EntryTypeDataset].SingleEntryURL)
}

func Test_NewFilteringTermsResponse_Empty(t *testing.T) {
	r := NewFilteringTermsResponse(testCfg, "radiant")
	assert.Empty(t, r.Response.FilteringTerms)
	assert.NotNil(t, r.Response.Resources)
}

func Test_NewErrorResponse(t *testing.T) {
	r := NewErrorResponse("b", 400, "bad")
	assert.Equal(t, Error{ErrorCode: 400, ErrorMessage: "bad"}, r.Error)
	assert.Equal(t, "b", r.Meta.BeaconID)
}

func sampleRequest(include string) Request {
	return Request{Granularity: GranularityRecord, IncludeResultsetResponses: include, Pagination: Pagination{Limit: 10}, APIVersion: APIVersion}
}

func Test_NewResultsetsResponse_Boolean_OmitsCountAndSets(t *testing.T) {
	r := NewResultsetsResponse("b", sampleRequest(IncludeHit), GranularityBoolean, EntryTypeGenomicVariation, SchemaGenomicVariation, "radiant", Answer{Exists: true, Count: 3})
	assert.True(t, r.ResponseSummary.Exists)
	assert.Nil(t, r.ResponseSummary.NumTotalResults)
	assert.Nil(t, r.Response)
	assert.Equal(t, GranularityBoolean, r.Meta.ReturnedGranularity)
	assert.Equal(t, GranularityRecord, r.Meta.ReceivedRequestSummary.RequestedGranularity, "the summary echoes what was asked, meta says what was returned")
}

func Test_NewResultsetsResponse_Count(t *testing.T) {
	r := NewResultsetsResponse("b", sampleRequest(IncludeHit), GranularityCount, EntryTypeGenomicVariation, SchemaGenomicVariation, "radiant", Answer{Exists: true, Count: 3})
	require.NotNil(t, r.ResponseSummary.NumTotalResults)
	assert.Equal(t, int64(3), *r.ResponseSummary.NumTotalResults)
	assert.Nil(t, r.Response)
}

func Test_NewResultsetsResponse_Record_Hit(t *testing.T) {
	r := NewResultsetsResponse("b", sampleRequest(IncludeHit), GranularityRecord, EntryTypeGenomicVariation, SchemaGenomicVariation, "radiant", Answer{Exists: true, Count: 1, Results: []any{"doc"}})
	require.NotNil(t, r.Response)
	require.Len(t, r.Response.ResultSets, 1)
	set := r.Response.ResultSets[0]
	assert.Equal(t, "radiant", set.ID)
	assert.Equal(t, EntryTypeDataset, set.SetType)
	assert.Equal(t, int64(1), set.ResultsCount)
	assert.Equal(t, []any{"doc"}, set.Results)
}

func Test_NewResultsetsResponse_Record_HitWithNoMatch_EmptySets(t *testing.T) {
	r := NewResultsetsResponse("b", sampleRequest(IncludeHit), GranularityRecord, EntryTypeGenomicVariation, SchemaGenomicVariation, "radiant", Answer{})
	require.NotNil(t, r.Response)
	assert.Empty(t, r.Response.ResultSets)
	body, _ := json.Marshal(r)
	assert.Contains(t, string(body), `"resultSets":[]`)
}

func Test_NewResultsetsResponse_Record_MissAndAll(t *testing.T) {
	miss := NewResultsetsResponse("b", sampleRequest(IncludeMiss), GranularityRecord, EntryTypeGenomicVariation, SchemaGenomicVariation, "radiant", Answer{})
	require.Len(t, miss.Response.ResultSets, 1)
	assert.Equal(t, []any{}, miss.Response.ResultSets[0].Results, "results serialize as [] not null")

	missOnHit := NewResultsetsResponse("b", sampleRequest(IncludeMiss), GranularityRecord, EntryTypeGenomicVariation, SchemaGenomicVariation, "radiant", Answer{Exists: true, Count: 1})
	assert.Empty(t, missOnHit.Response.ResultSets)

	all := NewResultsetsResponse("b", sampleRequest(IncludeAll), GranularityRecord, EntryTypeGenomicVariation, SchemaGenomicVariation, "radiant", Answer{})
	assert.Len(t, all.Response.ResultSets, 1)
}

func Test_NewResultsetsResponse_Record_None(t *testing.T) {
	r := NewResultsetsResponse("b", sampleRequest(IncludeNone), GranularityRecord, EntryTypeGenomicVariation, SchemaGenomicVariation, "radiant", Answer{Exists: true, Count: 1, Results: []any{"doc"}})
	require.NotNil(t, r.Response)
	assert.Empty(t, r.Response.ResultSets)
}
