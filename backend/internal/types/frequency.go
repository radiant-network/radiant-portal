package types

type ExternalFrequencies struct {
	Af     *float64 `json:"af,omitempty"`
	Ac     *int     `json:"ac,omitempty"`
	An     *int     `json:"an,omitempty"`
	Hom    *int     `json:"hom,omitempty"`
	Cohort string   `json:"cohort" validate:"required"`
} // @name ExternalFrequencies
