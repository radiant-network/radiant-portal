package beacon

import (
	"net/http"
	"net/url"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func parseGET(t *testing.T, query string) (*Request, error) {
	values, err := url.ParseQuery(query)
	require.NoError(t, err)
	return ParseGET(values)
}

func requestErr(t *testing.T, err error) *RequestError {
	require.Error(t, err)
	var re *RequestError
	require.ErrorAs(t, err, &re)
	return re
}

func Test_ParseGET_SequenceQuery_ConvertsToOneBased(t *testing.T) {
	req, err := parseGET(t, "referenceName=17&start=7674219&referenceBases=c&alternateBases=t")
	require.NoError(t, err)
	assert.Equal(t, KindSequence, req.Query.Kind)
	assert.Equal(t, "17", req.Query.Chromosome)
	assert.Equal(t, int64(7674220), req.Query.Start)
	assert.Equal(t, "C", req.Query.ReferenceBases)
	assert.Equal(t, "T", req.Query.AlternateBases)
	assert.Equal(t, DefaultGranularity, req.Granularity)
	assert.Equal(t, IncludeHit, req.IncludeResultsetResponses)
	assert.Equal(t, Pagination{Skip: 0, Limit: DefaultLimit}, req.Pagination)
}

func Test_ParseGET_SequenceQuery_MissingAlternateBases_BadRequest(t *testing.T) {
	_, err := parseGET(t, "referenceName=17&start=7674219&referenceBases=C")
	assert.Equal(t, http.StatusBadRequest, requestErr(t, err).Status)
}

func Test_ParseGET_RangeQuery_EndIsInclusiveInternally(t *testing.T) {
	req, err := parseGET(t, "assemblyId=GRCh38&referenceName=chr17&start=7572837&end=7578641")
	require.NoError(t, err)
	assert.Equal(t, KindRange, req.Query.Kind)
	assert.Equal(t, int64(7572838), req.Query.Start)
	assert.Equal(t, int64(7578641), req.Query.End)
	assert.Empty(t, req.Query.ReferenceBases)
}

func Test_ParseGET_RangeQuery_EndBeforeStart_BadRequest(t *testing.T) {
	_, err := parseGET(t, "referenceName=17&start=100&end=100")
	assert.Equal(t, http.StatusBadRequest, requestErr(t, err).Status)
}

func Test_ParseGET_RangeQuery_WithVariantTypeAndLengths(t *testing.T) {
	req, err := parseGET(t, "referenceName=NC_000017.11&start=1&end=1000&variantType=DEL&variantMinLength=2&variantMaxLength=50")
	require.NoError(t, err)
	assert.Equal(t, "deletion", req.Query.VariantClass)
	assert.Equal(t, 2, req.Query.MinLength)
	assert.Equal(t, 50, req.Query.MaxLength)
}

func Test_ParseGET_GeneQuery(t *testing.T) {
	req, err := parseGET(t, "geneId=TP53&variantType=SNP")
	require.NoError(t, err)
	assert.Equal(t, KindGene, req.Query.Kind)
	assert.Equal(t, "TP53", req.Query.GeneSymbol)
	assert.Equal(t, "SNV", req.Query.VariantClass)
	assert.Empty(t, req.Query.Chromosome)
}

func Test_ParseGET_AminoacidQuery_NormalizedToHGVS(t *testing.T) {
	req, err := parseGET(t, "aminoacidChange=V600E")
	require.NoError(t, err)
	assert.Equal(t, KindAminoacid, req.Query.Kind)
	assert.Equal(t, "p.Val600Glu", req.Query.AminoacidChange)
}

func Test_ParseGET_GeneWithAminoacidChange_IsGeneQuery(t *testing.T) {
	req, err := parseGET(t, "geneId=BRAF&aminoacidChange=V600E")
	require.NoError(t, err)
	assert.Equal(t, KindGene, req.Query.Kind)
	assert.Equal(t, "p.Val600Glu", req.Query.AminoacidChange)
}

func Test_ParseGET_NoParameters_BadRequest(t *testing.T) {
	_, err := parseGET(t, "requestedGranularity=count")
	re := requestErr(t, err)
	assert.Equal(t, http.StatusBadRequest, re.Status)
	assert.Contains(t, re.Message, "no query parameters")
}

func Test_ParseGET_StartWithoutReferenceName_BadRequest(t *testing.T) {
	_, err := parseGET(t, "start=10")
	assert.Equal(t, http.StatusBadRequest, requestErr(t, err).Status)
}

func Test_ParseGET_BracketQuery_NotImplemented(t *testing.T) {
	_, err := parseGET(t, "referenceName=17&start=5000000,7676592&end=7669607,10000000&variantType=DEL")
	assert.Equal(t, http.StatusNotImplemented, requestErr(t, err).Status)
}

func Test_ParseGET_MateName_NotImplemented(t *testing.T) {
	_, err := parseGET(t, "referenceName=17&start=10&mateName=2")
	assert.Equal(t, http.StatusNotImplemented, requestErr(t, err).Status)
}

func Test_ParseGET_Filters_BadRequest(t *testing.T) {
	_, err := parseGET(t, "geneId=TP53&filters=HP:0001250")
	re := requestErr(t, err)
	assert.Equal(t, http.StatusBadRequest, re.Status)
	assert.Contains(t, re.Message, "filters")
}

func Test_ParseGET_DatasetIds_BadRequest(t *testing.T) {
	_, err := parseGET(t, "geneId=TP53&datasetIds=N1")
	assert.Equal(t, http.StatusBadRequest, requestErr(t, err).Status)
}

func Test_ParseGET_UnsupportedAssembly_BadRequest(t *testing.T) {
	_, err := parseGET(t, "assemblyId=GRCh37&geneId=TP53")
	assert.Equal(t, http.StatusBadRequest, requestErr(t, err).Status)
}

func Test_ParseGET_UnknownReferenceName_BadRequest(t *testing.T) {
	_, err := parseGET(t, "referenceName=27&start=1&referenceBases=A&alternateBases=T")
	assert.Equal(t, http.StatusBadRequest, requestErr(t, err).Status)
}

func Test_ParseGET_NonIntegerStart_BadRequest(t *testing.T) {
	_, err := parseGET(t, "referenceName=17&start=abc&referenceBases=A&alternateBases=T")
	assert.Equal(t, http.StatusBadRequest, requestErr(t, err).Status)
}

func Test_ParseGET_NegativeStart_BadRequest(t *testing.T) {
	_, err := parseGET(t, "referenceName=17&start=-1&referenceBases=A&alternateBases=T")
	assert.Equal(t, http.StatusBadRequest, requestErr(t, err).Status)
}

func Test_ParseGET_InvalidBases_BadRequest(t *testing.T) {
	_, err := parseGET(t, "referenceName=17&start=1&referenceBases=A&alternateBases=XYZ")
	assert.Equal(t, http.StatusBadRequest, requestErr(t, err).Status)
}

func Test_ParseGET_UnsupportedVariantType_BadRequest(t *testing.T) {
	_, err := parseGET(t, "geneId=TP53&variantType=CNV")
	assert.Equal(t, http.StatusBadRequest, requestErr(t, err).Status)
}

func Test_ParseGET_InvalidGranularity_BadRequest(t *testing.T) {
	_, err := parseGET(t, "geneId=TP53&requestedGranularity=everything")
	assert.Equal(t, http.StatusBadRequest, requestErr(t, err).Status)
}

func Test_ParseGET_InvalidInclude_BadRequest(t *testing.T) {
	_, err := parseGET(t, "geneId=TP53&includeResultsetResponses=SOME")
	assert.Equal(t, http.StatusBadRequest, requestErr(t, err).Status)
}

func Test_ParseGET_LimitAboveMax_BadRequest(t *testing.T) {
	_, err := parseGET(t, "geneId=TP53&limit=101")
	assert.Equal(t, http.StatusBadRequest, requestErr(t, err).Status)
}

func Test_ParseGET_NegativeSkip_BadRequest(t *testing.T) {
	_, err := parseGET(t, "geneId=TP53&skip=-1")
	assert.Equal(t, http.StatusBadRequest, requestErr(t, err).Status)
}

func Test_ParseGET_MaxLengthBelowMinLength_BadRequest(t *testing.T) {
	_, err := parseGET(t, "geneId=TP53&variantMinLength=10&variantMaxLength=5")
	assert.Equal(t, http.StatusBadRequest, requestErr(t, err).Status)
}

func Test_ParseGET_PaginationAndGranularity(t *testing.T) {
	req, err := parseGET(t, "geneId=TP53&skip=20&limit=5&requestedGranularity=record&includeResultsetResponses=all")
	require.NoError(t, err)
	assert.Equal(t, Pagination{Skip: 20, Limit: 5}, req.Pagination)
	assert.Equal(t, GranularityRecord, req.Granularity)
	assert.Equal(t, IncludeAll, req.IncludeResultsetResponses)
}

func Test_ParseGET_EchoesParametersInSummary(t *testing.T) {
	req, err := parseGET(t, "referenceName=17&start=7674219&referenceBases=C&alternateBases=T")
	require.NoError(t, err)
	summary := req.summary()
	assert.Equal(t, "17", summary.RequestParameters["referenceName"])
	assert.Equal(t, []int64{7674219}, summary.RequestParameters["start"])
	assert.Equal(t, []string{}, summary.Filters)
	assert.Equal(t, APIVersion, summary.APIVersion)
}

func Test_ParsePOST_SequenceQuery(t *testing.T) {
	body := `{"meta":{"apiVersion":"v2.0.0","requestedSchemas":[{"entityType":"genomicVariation","schema":"ga4gh-beacon-variant-v2.0.0"}]},
	          "query":{"requestParameters":{"referenceName":"NC_000017.11","start":[7674219],"referenceBases":"C","alternateBases":"T"},
	                   "requestedGranularity":"count","pagination":{"skip":0,"limit":25}}}`
	req, err := ParsePOST([]byte(body))
	require.NoError(t, err)
	assert.Equal(t, KindSequence, req.Query.Kind)
	assert.Equal(t, "17", req.Query.Chromosome)
	assert.Equal(t, int64(7674220), req.Query.Start)
	assert.Equal(t, GranularityCount, req.Granularity)
	assert.Equal(t, Pagination{Skip: 0, Limit: 25}, req.Pagination)
	assert.Len(t, req.RequestedSchemas, 1)
}

func Test_ParsePOST_StartAsNumericString(t *testing.T) {
	req, err := ParsePOST([]byte(`{"query":{"requestParameters":{"referenceName":"1","start":"10","end":"20"}}}`))
	require.NoError(t, err)
	assert.Equal(t, KindRange, req.Query.Kind)
	assert.Equal(t, int64(11), req.Query.Start)
	assert.Equal(t, int64(20), req.Query.End)
}

func Test_ParsePOST_DefaultsWhenMetaMissing(t *testing.T) {
	req, err := ParsePOST([]byte(`{"query":{"requestParameters":{"geneId":"TP53"}}}`))
	require.NoError(t, err)
	assert.Equal(t, APIVersion, req.APIVersion)
	assert.Equal(t, DefaultGranularity, req.Granularity)
	assert.Equal(t, DefaultLimit, req.Pagination.Limit)
}

func Test_ParsePOST_Filters_BadRequest(t *testing.T) {
	_, err := ParsePOST([]byte(`{"query":{"requestParameters":{"geneId":"TP53"},"filters":[{"id":"HP:0001250"}]}}`))
	assert.Equal(t, http.StatusBadRequest, requestErr(t, err).Status)
}

func Test_ParsePOST_BracketStart_NotImplemented(t *testing.T) {
	_, err := ParsePOST([]byte(`{"query":{"requestParameters":{"referenceName":"17","start":[1,2],"end":[3,4],"variantType":"DEL"}}}`))
	assert.Equal(t, http.StatusNotImplemented, requestErr(t, err).Status)
}

func Test_ParsePOST_NonStringParameter_BadRequest(t *testing.T) {
	_, err := ParsePOST([]byte(`{"query":{"requestParameters":{"geneId":123}}}`))
	assert.Equal(t, http.StatusBadRequest, requestErr(t, err).Status)
}

func Test_ParsePOST_FractionalStart_BadRequest(t *testing.T) {
	_, err := ParsePOST([]byte(`{"query":{"requestParameters":{"referenceName":"17","start":1.5,"referenceBases":"A","alternateBases":"T"}}}`))
	assert.Equal(t, http.StatusBadRequest, requestErr(t, err).Status)
}

func Test_ParsePOST_EmptyBody_BadRequest(t *testing.T) {
	_, err := ParsePOST([]byte("  "))
	assert.Equal(t, http.StatusBadRequest, requestErr(t, err).Status)
}

func Test_ParsePOST_InvalidJSON_BadRequest(t *testing.T) {
	_, err := ParsePOST([]byte(`{"query":`))
	assert.Equal(t, http.StatusBadRequest, requestErr(t, err).Status)
}

func Test_ParseCollectionGET_DefaultsToRecord(t *testing.T) {
	values, _ := url.ParseQuery("")
	req, err := ParseCollectionGET(values)
	require.NoError(t, err)
	assert.Equal(t, GranularityRecord, req.Granularity)
	assert.Equal(t, Pagination{Skip: 0, Limit: DefaultLimit}, req.Pagination)
	assert.Equal(t, IncludeHit, req.IncludeResultsetResponses)
}

func Test_ParseCollectionGET_ExplicitGranularityAndPaging(t *testing.T) {
	values, _ := url.ParseQuery("requestedGranularity=count&skip=1&limit=1")
	req, err := ParseCollectionGET(values)
	require.NoError(t, err)
	assert.Equal(t, GranularityCount, req.Granularity)
	assert.Equal(t, Pagination{Skip: 1, Limit: 1}, req.Pagination)
}

func Test_ParseCollectionGET_BadLimit_BadRequest(t *testing.T) {
	values, _ := url.ParseQuery("limit=0")
	_, err := ParseCollectionGET(values)
	assert.Equal(t, http.StatusBadRequest, requestErr(t, err).Status)
}

func Test_ParseCollectionPOST_EmptyBody_Defaults(t *testing.T) {
	req, err := ParseCollectionPOST(nil)
	require.NoError(t, err)
	assert.Equal(t, GranularityRecord, req.Granularity)
	assert.Equal(t, APIVersion, req.APIVersion)
}

func Test_ParseCollectionPOST_Body(t *testing.T) {
	req, err := ParseCollectionPOST([]byte(`{"meta":{"apiVersion":"v2.0.0"},"query":{"requestedGranularity":"boolean","pagination":{"skip":2,"limit":3}}}`))
	require.NoError(t, err)
	assert.Equal(t, GranularityBoolean, req.Granularity)
	assert.Equal(t, Pagination{Skip: 2, Limit: 3}, req.Pagination)
}

func Test_ParseCollectionPOST_InvalidJSON_BadRequest(t *testing.T) {
	_, err := ParseCollectionPOST([]byte(`{`))
	assert.Equal(t, http.StatusBadRequest, requestErr(t, err).Status)
}
