package types

type ExternalFrequencies struct {
	Af     *float64 `json:"af,omitempty"`
	Ac     *int     `json:"ac,omitempty"`
	An     *int     `json:"an,omitempty"`
	Hom    *int     `json:"hom,omitempty"`
	Cohort string   `json:"cohort" validate:"required"`
} // @name ExternalFrequencies

type InternalFrequencies struct {
	PcAll          *int     `json:"pc_all,omitempty"`
	PnAll          *int     `json:"pn_all,omitempty"`
	PfAll          *float64 `json:"pf_all,omitempty"`
	HomAll         *int     `json:"hom_all,omitempty"`
	PcAffected     *int     `json:"pc_affected,omitempty"`
	PnAffected     *int     `json:"pn_affected,omitempty"`
	PfAffected     *float64 `json:"pf_affected,omitempty"`
	HomAffected    *int     `json:"hom_affected,omitempty"`
	PcNonAffected  *int     `json:"pc_non_affected,omitempty"`
	PnNonAffected  *int     `json:"pn_non_affected,omitempty"`
	PfNonAffected  *float64 `json:"pf_non_affected,omitempty"`
	HomNonAffected *int     `json:"hom_non_affected,omitempty"`
}

type InternalFrequenciesSplitBy struct {
	SplitValue  string              `json:"split_value" validate:"required"`
	Frequencies InternalFrequencies `json:"frequencies" validate:"required"`
}
