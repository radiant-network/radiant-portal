package beacon

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"regexp"
	"strconv"
	"strings"
)

// Kind is the genomic variant query shape the framework documents. Bracket (fuzzy breakpoint)
// queries are recognized and refused: the SNV table has no imprecise positions to match.
type Kind string

const (
	KindSequence  Kind = "sequence"
	KindRange     Kind = "range"
	KindGene      Kind = "gene"
	KindAminoacid Kind = "aminoacid"
)

// VariantQuery is the parsed, validated query in Radiant's own coordinate convention:
// chromosome names are bare, Start and End are 1-based and inclusive, like snv__variant.
type VariantQuery struct {
	Kind            Kind
	Chromosome      string
	Start           int64
	End             int64
	ReferenceBases  string
	AlternateBases  string
	VariantClass    string
	GeneSymbol      string
	AminoacidChange string
	MinLength       int
	MaxLength       int
}

// Request is everything a query endpoint needs from one HTTP request, whichever method carried it.
type Request struct {
	Query                     VariantQuery
	Granularity               Granularity
	IncludeResultsetResponses string
	Pagination                Pagination
	APIVersion                string
	RequestedSchemas          []SchemaReference
	parameters                map[string]any
}

func (r Request) summary() *ReceivedRequestSummary {
	schemas := r.RequestedSchemas
	if schemas == nil {
		schemas = []SchemaReference{}
	}
	params := r.parameters
	if params == nil {
		params = map[string]any{}
	}
	return &ReceivedRequestSummary{
		APIVersion:                r.APIVersion,
		RequestedSchemas:          schemas,
		Pagination:                r.Pagination,
		RequestedGranularity:      r.Granularity,
		Filters:                   []string{},
		RequestParameters:         params,
		IncludeResultsetResponses: r.IncludeResultsetResponses,
	}
}

// RequestError is a client-side failure with the HTTP status the Beacon error envelope reports.
type RequestError struct {
	Status  int
	Message string
}

func (e *RequestError) Error() string { return e.Message }

func badRequest(format string, args ...any) *RequestError {
	return &RequestError{Status: http.StatusBadRequest, Message: fmt.Sprintf(format, args...)}
}

func notImplemented(format string, args ...any) *RequestError {
	return &RequestError{Status: http.StatusNotImplemented, Message: fmt.Sprintf(format, args...)}
}

const (
	DefaultLimit = 10
	MaxLimit     = 100
)

// Beacon coordinates are 0-based interbase; snv__variant is 1-based inclusive. These two pairs
// are the only place the conventions meet. If the table turns out to be 0-based, fix them here.
func beaconToInternalStart(start int64) int64 { return start + 1 }
func beaconToInternalEnd(end int64) int64     { return end }
func internalToBeaconStart(start int64) int64 { return start - 1 }
func internalToBeaconEnd(end int64) int64     { return end }

var basesPattern = regexp.MustCompile(`^[ACGTN]+$`)

// rawParams is the method-agnostic view of the request parameters before validation.
type rawParams struct {
	assemblyID, referenceName, referenceBases, alternateBases string
	variantType, geneID, aminoacidChange, mateName            string
	start, end                                                []int64
	minLength, maxLength                                      *int
	datasetIDs                                                []string
	filters                                                   int
	granularity, include, apiVersion                          string
	skip, limit                                               *int
	requestedSchemas                                          []SchemaReference
	echo                                                      map[string]any
}

// ParseGET reads the query string of a GET /g_variants request.
func ParseGET(values url.Values) (*Request, error) {
	raw := rawParams{echo: map[string]any{}}
	str := func(key string, dst *string) error {
		if v := strings.TrimSpace(values.Get(key)); v != "" {
			*dst = v
			raw.echo[key] = v
		}
		return nil
	}
	for key, dst := range map[string]*string{
		"assemblyId": &raw.assemblyID, "referenceName": &raw.referenceName,
		"referenceBases": &raw.referenceBases, "alternateBases": &raw.alternateBases,
		"variantType": &raw.variantType, "geneId": &raw.geneID,
		"aminoacidChange": &raw.aminoacidChange, "mateName": &raw.mateName,
	} {
		_ = str(key, dst)
	}
	var err error
	if raw.start, err = parseIntList(values.Get("start")); err != nil {
		return nil, badRequest("start: %v", err)
	}
	if raw.end, err = parseIntList(values.Get("end")); err != nil {
		return nil, badRequest("end: %v", err)
	}
	if len(raw.start) > 0 {
		raw.echo["start"] = raw.start
	}
	if len(raw.end) > 0 {
		raw.echo["end"] = raw.end
	}
	if raw.minLength, err = parseOptionalInt(values.Get("variantMinLength")); err != nil {
		return nil, badRequest("variantMinLength: %v", err)
	}
	if raw.maxLength, err = parseOptionalInt(values.Get("variantMaxLength")); err != nil {
		return nil, badRequest("variantMaxLength: %v", err)
	}
	if raw.skip, err = parseOptionalInt(values.Get("skip")); err != nil {
		return nil, badRequest("skip: %v", err)
	}
	if raw.limit, err = parseOptionalInt(values.Get("limit")); err != nil {
		return nil, badRequest("limit: %v", err)
	}
	raw.datasetIDs = splitList(values.Get("datasetIds"))
	raw.filters = len(splitList(values.Get("filters")))
	raw.granularity = values.Get("requestedGranularity")
	raw.include = values.Get("includeResultsetResponses")
	raw.apiVersion = APIVersion
	if s := values.Get("requestedSchema"); s != "" {
		raw.requestedSchemas = []SchemaReference{{EntityType: EntryTypeGenomicVariation, Schema: s}}
	}
	return raw.build()
}

// postBody is the framework's beaconRequestBody, restricted to what this beacon reads.
type postBody struct {
	Meta struct {
		APIVersion       string            `json:"apiVersion"`
		RequestedSchemas []SchemaReference `json:"requestedSchemas"`
	} `json:"meta"`
	Query struct {
		RequestParameters         map[string]any `json:"requestParameters"`
		Filters                   []any          `json:"filters"`
		IncludeResultsetResponses string         `json:"includeResultsetResponses"`
		Pagination                *Pagination    `json:"pagination"`
		RequestedGranularity      string         `json:"requestedGranularity"`
	} `json:"query"`
}

// ParsePOST reads the JSON body of a POST /g_variants request. Numeric parameters may arrive as
// numbers, numeric strings, or arrays of either, as the spec's examples do.
func ParsePOST(body []byte) (*Request, error) {
	var b postBody
	if len(strings.TrimSpace(string(body))) == 0 {
		return nil, badRequest("request body is empty")
	}
	if err := json.Unmarshal(body, &b); err != nil {
		return nil, badRequest("invalid JSON body: %v", err)
	}
	raw := rawParams{echo: map[string]any{}, apiVersion: b.Meta.APIVersion, requestedSchemas: b.Meta.RequestedSchemas}
	if raw.apiVersion == "" {
		raw.apiVersion = APIVersion
	}
	p := b.Query.RequestParameters
	for key, dst := range map[string]*string{
		"assemblyId": &raw.assemblyID, "referenceName": &raw.referenceName,
		"referenceBases": &raw.referenceBases, "alternateBases": &raw.alternateBases,
		"variantType": &raw.variantType, "geneId": &raw.geneID,
		"aminoacidChange": &raw.aminoacidChange, "mateName": &raw.mateName,
	} {
		v, ok := p[key]
		if !ok || v == nil {
			continue
		}
		s, isString := v.(string)
		if !isString {
			return nil, badRequest("%s must be a string", key)
		}
		if s = strings.TrimSpace(s); s != "" {
			*dst = s
			raw.echo[key] = s
		}
	}
	var err error
	if raw.start, err = anyToIntList(p["start"]); err != nil {
		return nil, badRequest("start: %v", err)
	}
	if raw.end, err = anyToIntList(p["end"]); err != nil {
		return nil, badRequest("end: %v", err)
	}
	if len(raw.start) > 0 {
		raw.echo["start"] = raw.start
	}
	if len(raw.end) > 0 {
		raw.echo["end"] = raw.end
	}
	if raw.minLength, err = anyToOptionalInt(p["variantMinLength"]); err != nil {
		return nil, badRequest("variantMinLength: %v", err)
	}
	if raw.maxLength, err = anyToOptionalInt(p["variantMaxLength"]); err != nil {
		return nil, badRequest("variantMaxLength: %v", err)
	}
	if ids, ok := p["datasetIds"]; ok && ids != nil {
		raw.datasetIDs = []string{fmt.Sprint(ids)}
	}
	raw.filters = len(b.Query.Filters)
	raw.granularity = b.Query.RequestedGranularity
	raw.include = b.Query.IncludeResultsetResponses
	if b.Query.Pagination != nil {
		skip, limit := b.Query.Pagination.Skip, b.Query.Pagination.Limit
		raw.skip = &skip
		if limit != 0 {
			raw.limit = &limit
		}
	}
	return raw.build()
}

// build validates the raw parameters and resolves the query kind. It refuses what phase 1 cannot
// honor (filters, dataset restriction, bracket and fusion queries) instead of ignoring it, so a
// client never mistakes a broader answer for the narrower one it asked for.
func (raw rawParams) build() (*Request, error) {
	if raw.filters > 0 {
		return nil, badRequest("filters are not supported by this beacon (see /filtering_terms)")
	}
	if len(raw.datasetIDs) > 0 {
		return nil, badRequest("datasetIds restriction is not supported by this beacon; every query spans the whole tenant")
	}
	if raw.mateName != "" {
		return nil, notImplemented("fusion (mateName) queries are not supported by this beacon")
	}
	if len(raw.start) > 1 || len(raw.end) > 1 {
		return nil, notImplemented("bracket queries (two start or end values) are not supported by this beacon")
	}
	if err := ParseAssemblyID(raw.assemblyID); err != nil {
		return nil, badRequest("%v", err)
	}

	granularity, err := ParseGranularity(raw.granularity)
	if err != nil {
		return nil, badRequest("%v", err)
	}
	include, err := parseInclude(raw.include)
	if err != nil {
		return nil, badRequest("%v", err)
	}
	pagination, err := parsePagination(raw.skip, raw.limit)
	if err != nil {
		return nil, badRequest("%v", err)
	}

	q := VariantQuery{}
	switch {
	case raw.geneID != "":
		q.Kind = KindGene
		q.GeneSymbol = raw.geneID
	case raw.aminoacidChange != "":
		q.Kind = KindAminoacid
	case raw.referenceName != "" && len(raw.start) == 1 && len(raw.end) == 1:
		q.Kind = KindRange
	case raw.referenceName != "" && len(raw.start) == 1:
		q.Kind = KindSequence
	case raw.referenceName != "" || len(raw.start) == 1 || len(raw.end) == 1:
		return nil, badRequest("a positional query needs referenceName and start (sequence query) or referenceName, start and end (range query)")
	default:
		return nil, badRequest("no query parameters: provide a sequence, range, gene (geneId) or aminoacidChange query")
	}

	if raw.referenceName != "" {
		if q.Chromosome, err = ParseReferenceName(raw.referenceName); err != nil {
			return nil, badRequest("%v", err)
		}
	}
	if len(raw.start) == 1 {
		if raw.start[0] < 0 {
			return nil, badRequest("start must be >= 0")
		}
		q.Start = beaconToInternalStart(raw.start[0])
	}
	if len(raw.end) == 1 {
		if raw.end[0] <= raw.start[0] {
			return nil, badRequest("end must be greater than start")
		}
		q.End = beaconToInternalEnd(raw.end[0])
	}
	if raw.referenceBases != "" {
		if q.ReferenceBases, err = parseBases("referenceBases", raw.referenceBases); err != nil {
			return nil, err
		}
	}
	if raw.alternateBases != "" {
		if q.AlternateBases, err = parseBases("alternateBases", raw.alternateBases); err != nil {
			return nil, err
		}
	}
	if q.Kind == KindSequence && (q.ReferenceBases == "" || q.AlternateBases == "") {
		return nil, badRequest("a sequence query needs referenceBases and alternateBases (add end for a range query)")
	}
	if raw.variantType != "" {
		if q.VariantClass, err = ParseVariantType(raw.variantType); err != nil {
			return nil, badRequest("%v", err)
		}
	}
	if raw.aminoacidChange != "" {
		if q.AminoacidChange, err = NormalizeAminoacidChange(raw.aminoacidChange); err != nil {
			return nil, badRequest("%v", err)
		}
	}
	if raw.minLength != nil {
		if *raw.minLength < 0 {
			return nil, badRequest("variantMinLength must be >= 0")
		}
		q.MinLength = *raw.minLength
	}
	if raw.maxLength != nil {
		if *raw.maxLength < 1 {
			return nil, badRequest("variantMaxLength must be >= 1")
		}
		if raw.minLength != nil && *raw.maxLength < *raw.minLength {
			return nil, badRequest("variantMaxLength must be >= variantMinLength")
		}
		q.MaxLength = *raw.maxLength
	}

	return &Request{
		Query:                     q,
		Granularity:               granularity,
		IncludeResultsetResponses: include,
		Pagination:                pagination,
		APIVersion:                raw.apiVersion,
		RequestedSchemas:          raw.requestedSchemas,
		parameters:                raw.echo,
	}, nil
}

func parseBases(name, value string) (string, error) {
	s := strings.ToUpper(strings.TrimSpace(value))
	if !basesPattern.MatchString(s) {
		return "", badRequest("%s %q must be a sequence of A, C, G, T or N", name, value)
	}
	return s, nil
}

func parseInclude(s string) (string, error) {
	switch v := strings.ToUpper(strings.TrimSpace(s)); v {
	case "":
		return IncludeHit, nil
	case IncludeHit, IncludeAll, IncludeNone, IncludeMiss:
		return v, nil
	default:
		return "", fmt.Errorf("unknown includeResultsetResponses %q (expected HIT, ALL, NONE or MISS)", s)
	}
}

func parsePagination(skip, limit *int) (Pagination, error) {
	p := Pagination{Skip: 0, Limit: DefaultLimit}
	if skip != nil {
		if *skip < 0 {
			return p, fmt.Errorf("skip must be >= 0")
		}
		p.Skip = *skip
	}
	if limit != nil {
		if *limit < 1 || *limit > MaxLimit {
			return p, fmt.Errorf("limit must be between 1 and %d", MaxLimit)
		}
		p.Limit = *limit
	}
	return p, nil
}

func splitList(s string) []string {
	var out []string
	for _, part := range strings.Split(s, ",") {
		if p := strings.TrimSpace(part); p != "" {
			out = append(out, p)
		}
	}
	return out
}

func parseIntList(s string) ([]int64, error) {
	var out []int64
	for _, part := range splitList(s) {
		n, err := strconv.ParseInt(part, 10, 64)
		if err != nil {
			return nil, fmt.Errorf("%q is not an integer", part)
		}
		out = append(out, n)
	}
	return out, nil
}

func parseOptionalInt(s string) (*int, error) {
	if strings.TrimSpace(s) == "" {
		return nil, nil
	}
	n, err := strconv.Atoi(strings.TrimSpace(s))
	if err != nil {
		return nil, fmt.Errorf("%q is not an integer", s)
	}
	return &n, nil
}

func anyToIntList(v any) ([]int64, error) {
	switch x := v.(type) {
	case nil:
		return nil, nil
	case []any:
		var out []int64
		for _, item := range x {
			n, err := anyToInt64(item)
			if err != nil {
				return nil, err
			}
			out = append(out, n)
		}
		return out, nil
	default:
		n, err := anyToInt64(x)
		if err != nil {
			return nil, err
		}
		return []int64{n}, nil
	}
}

func anyToInt64(v any) (int64, error) {
	switch x := v.(type) {
	case float64:
		if x != float64(int64(x)) {
			return 0, fmt.Errorf("%v is not an integer", x)
		}
		return int64(x), nil
	case string:
		n, err := strconv.ParseInt(strings.TrimSpace(x), 10, 64)
		if err != nil {
			return 0, fmt.Errorf("%q is not an integer", x)
		}
		return n, nil
	default:
		return 0, fmt.Errorf("%v is not an integer", v)
	}
}

func anyToOptionalInt(v any) (*int, error) {
	if v == nil {
		return nil, nil
	}
	n, err := anyToInt64(v)
	if err != nil {
		return nil, err
	}
	i := int(n)
	return &i, nil
}

// ParseCollectionGET reads the envelope parameters of a collection listing (datasets), which
// carries no genomic query. Listings default to record granularity: they are the catalog.
func ParseCollectionGET(values url.Values) (*Request, error) {
	skip, err := parseOptionalInt(values.Get("skip"))
	if err != nil {
		return nil, badRequest("skip: %v", err)
	}
	limit, err := parseOptionalInt(values.Get("limit"))
	if err != nil {
		return nil, badRequest("limit: %v", err)
	}
	return buildCollectionRequest(values.Get("requestedGranularity"), values.Get("includeResultsetResponses"), skip, limit, APIVersion, nil)
}

// ParseCollectionPOST is ParseCollectionGET for a Beacon request body.
func ParseCollectionPOST(body []byte) (*Request, error) {
	var b postBody
	if len(strings.TrimSpace(string(body))) > 0 {
		if err := json.Unmarshal(body, &b); err != nil {
			return nil, badRequest("invalid JSON body: %v", err)
		}
	}
	apiVersion := b.Meta.APIVersion
	if apiVersion == "" {
		apiVersion = APIVersion
	}
	var skip, limit *int
	if b.Query.Pagination != nil {
		s := b.Query.Pagination.Skip
		skip = &s
		if b.Query.Pagination.Limit != 0 {
			l := b.Query.Pagination.Limit
			limit = &l
		}
	}
	return buildCollectionRequest(b.Query.RequestedGranularity, b.Query.IncludeResultsetResponses, skip, limit, apiVersion, b.Meta.RequestedSchemas)
}

func buildCollectionRequest(granularity, include string, skip, limit *int, apiVersion string, schemas []SchemaReference) (*Request, error) {
	g := GranularityRecord
	if granularity != "" {
		var err error
		if g, err = ParseGranularity(granularity); err != nil {
			return nil, badRequest("%v", err)
		}
	}
	inc, err := parseInclude(include)
	if err != nil {
		return nil, badRequest("%v", err)
	}
	pagination, err := parsePagination(skip, limit)
	if err != nil {
		return nil, badRequest("%v", err)
	}
	return &Request{Granularity: g, IncludeResultsetResponses: inc, Pagination: pagination, APIVersion: apiVersion, RequestedSchemas: schemas, parameters: map[string]any{}}, nil
}
