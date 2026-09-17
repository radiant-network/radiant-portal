package beacon

// SchemaReference names the schema an entry type in a response follows.
type SchemaReference struct {
	EntityType string `json:"entityType"`
	Schema     string `json:"schema"`
} // @name BeaconSchemaReference

type Pagination struct {
	Skip  int `json:"skip"`
	Limit int `json:"limit"`
} // @name BeaconPagination

// ReceivedRequestSummary echoes the request as the beacon understood it, so a client can see
// what was actually answered (e.g. a clamped granularity).
type ReceivedRequestSummary struct {
	APIVersion                string            `json:"apiVersion"`
	RequestedSchemas          []SchemaReference `json:"requestedSchemas"`
	Pagination                Pagination        `json:"pagination"`
	RequestedGranularity      Granularity       `json:"requestedGranularity"`
	Filters                   []string          `json:"filters"`
	RequestParameters         map[string]any    `json:"requestParameters"`
	IncludeResultsetResponses string            `json:"includeResultsetResponses"`
	TestMode                  bool              `json:"testMode"`
} // @name BeaconReceivedRequestSummary

type Meta struct {
	BeaconID               string                  `json:"beaconId"`
	APIVersion             string                  `json:"apiVersion"`
	ReturnedSchemas        []SchemaReference       `json:"returnedSchemas"`
	ReturnedGranularity    Granularity             `json:"returnedGranularity,omitempty"`
	ReceivedRequestSummary *ReceivedRequestSummary `json:"receivedRequestSummary,omitempty"`
} // @name BeaconMeta

type ResponseSummary struct {
	Exists          bool   `json:"exists"`
	NumTotalResults *int64 `json:"numTotalResults,omitempty"`
} // @name BeaconResponseSummary

type ResultSet struct {
	ID           string `json:"id"`
	SetType      string `json:"setType"`
	Exists       bool   `json:"exists"`
	ResultsCount int64  `json:"resultsCount"`
	Results      []any  `json:"results"`
} // @name BeaconResultSet

type Resultsets struct {
	ResultSets []ResultSet `json:"resultSets"`
} // @name BeaconResultsets

// ResultsetsResponse is the one envelope for every granularity: a boolean answer carries only
// meta and exists, count adds numTotalResults, record adds the result sets.
type ResultsetsResponse struct {
	Meta            Meta            `json:"meta"`
	ResponseSummary ResponseSummary `json:"responseSummary"`
	Response        *Resultsets     `json:"response,omitempty"`
} // @name BeaconResultsetsResponse

type Error struct {
	ErrorCode    int    `json:"errorCode"`
	ErrorMessage string `json:"errorMessage"`
} // @name BeaconError

type ErrorResponse struct {
	Meta  Meta  `json:"meta"`
	Error Error `json:"error"`
} // @name BeaconErrorResponse

// Include* are the includeResultsetResponses values: which result sets a record response lists.
const (
	IncludeHit  = "HIT"
	IncludeAll  = "ALL"
	IncludeNone = "NONE"
	IncludeMiss = "MISS"
)

func infoMeta(beaconID string) Meta {
	return Meta{BeaconID: beaconID, APIVersion: APIVersion, ReturnedSchemas: []SchemaReference{}}
}

// NewErrorResponse wraps a failure in the framework's error envelope. The received request is
// omitted because a malformed request may be exactly what could not be summarized.
func NewErrorResponse(beaconID string, code int, message string) ErrorResponse {
	return ErrorResponse{Meta: infoMeta(beaconID), Error: Error{ErrorCode: code, ErrorMessage: message}}
}

// Answer is what a query resolved to, before it is shaped by granularity and inclusion rules.
type Answer struct {
	Exists  bool
	Count   int64
	Results []any
}

// NewResultsetsResponse shapes an answer for the granularity actually returned. The single result
// set is the tenant's whole catalog, typed as a dataset per the framework's setType convention.
func NewResultsetsResponse(beaconID string, req Request, returned Granularity, entityType, schema, setID string, a Answer) ResultsetsResponse {
	resp := ResultsetsResponse{
		Meta: Meta{
			BeaconID:               beaconID,
			APIVersion:             APIVersion,
			ReturnedSchemas:        []SchemaReference{{EntityType: entityType, Schema: schema}},
			ReturnedGranularity:    returned,
			ReceivedRequestSummary: req.summary(),
		},
		ResponseSummary: ResponseSummary{Exists: a.Exists},
	}
	if returned == GranularityBoolean {
		return resp
	}
	count := a.Count
	resp.ResponseSummary.NumTotalResults = &count
	if returned == GranularityCount {
		return resp
	}

	results := a.Results
	if results == nil {
		results = []any{}
	}
	set := ResultSet{ID: setID, SetType: EntryTypeDataset, Exists: a.Exists, ResultsCount: a.Count, Results: results}
	sets := []ResultSet{}
	switch req.IncludeResultsetResponses {
	case IncludeAll:
		sets = append(sets, set)
	case IncludeMiss:
		if !a.Exists {
			sets = append(sets, set)
		}
	case IncludeNone:
	default: // HIT
		if a.Exists {
			sets = append(sets, set)
		}
	}
	resp.Response = &Resultsets{ResultSets: sets}
	return resp
}
