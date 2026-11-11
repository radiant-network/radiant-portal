package types

type AutocompleteResult struct {
	Type  string `json:"type" validate:"required"`
	Value string `json:"value" validate:"required"`
}
