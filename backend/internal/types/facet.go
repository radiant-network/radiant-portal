package types

type Facet struct {
	Name   string   `json:"name"`
	Values []string `json:"values"`
}

// FacetsQueryParam represents the query parameters for variant facet retrieval
// @Description FacetsQueryParam represents the query parameters for variant facet retrieval
type FacetsQueryParam struct {
	Facets []string `json:"facets" form:"facets" binding:"required" validate:"min=1"`
} //@Name FacetsQueryParam
