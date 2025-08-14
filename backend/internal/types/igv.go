package types

type IGVTrack struct {
	SequencingExperimentId int    `json:"sequencing_experiment_id"`
	PatientId              int    `json:"patient_id"`
	FamilyRole             string `json:"family_role"`
	SexCode                string `json:"sexcode"`
	DataTypeCode           string `json:"datatype_code"`
	FormatCode             string `json:"format_code"`
	URL                    string `json:"url" gorm:"column:url"`
}

type IGVTrackEnriched struct {
	PatientId        int    `json:"patient_id"`
	FamilyRole       string `json:"family_role"`
	Sex              string `json:"sex"`
	Type             string `json:"type"`
	Format           string `json:"format"`
	URL              string `json:"url"`
	URLExpireAt      int64  `json:"urlExpireAt"`
	IndexURL         string `json:"indexURL"`
	IndexURLExpireAt int64  `json:"indexURLExpireAt"`
	Name             string `json:"name"`
}

type IGVTracks struct {
	Alignment []IGVTrackEnriched `json:"alignment,omitempty"`
}
