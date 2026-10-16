package types

type IGVTrack struct {
	SequencingExperimentId int    `json:"sequencing_experiment_id"`
	TaskId                 int    `json:"task_id"`
	SampleId               string `json:"sample_id"`
	HistologyCode          string `json:"histology_code"`
	PatientId              int    `json:"patient_id"`
	FetusId                *int   `json:"fetus_id,omitempty"`
	FamilyRole             string `json:"family_role"`
	SexCode                string `json:"sexcode"`
	DataTypeCode           string `json:"datatype_code"`
	FormatCode             string `json:"format_code"`
	DocumentName           string `json:"document_name"`
	URL                    string `json:"url" gorm:"column:url"`
}

type IGVTrackEnriched struct {
	SequencingExperimentId int    `json:"sequencing_experiment_id" validate:"required"`
	PatientId              int    `json:"patient_id"`
	FetusId                *int   `json:"fetus_id,omitempty"`
	FamilyRole             string `json:"family_role"`
	Sex                    string `json:"sex"`
	Type                   string `json:"type"`
	Format                 string `json:"format"`
	URL                    string `json:"url"`
	URLExpireAt            int64  `json:"urlExpireAt"`
	IndexURL               string `json:"indexURL"`
	IndexURLExpireAt       int64  `json:"indexURLExpireAt"`
	Name                   string `json:"name"`
}

// IGVPublicTrack is a public reference file (ClinVar, DGV, ...) shared by every case, keyed in
// IGVTracks.PublicTracks by a fixed file id.
type IGVPublicTrack struct {
	URL              string `json:"url" validate:"required"`
	URLExpireAt      int64  `json:"urlExpireAt" validate:"required"`
	IndexURL         string `json:"indexURL" validate:"required"`
	IndexURLExpireAt int64  `json:"indexURLExpireAt" validate:"required"`
}

type IGVTracks struct {
	Alignment      []IGVTrackEnriched        `json:"alignment,omitempty"`
	CNV            []IGVTrackEnriched        `json:"cnv,omitempty"`
	Seg            []IGVTrackEnriched        `json:"seg,omitempty"`
	BAF            []IGVTrackEnriched        `json:"baf,omitempty"`
	ROH            []IGVTrackEnriched        `json:"roh,omitempty"`
	CaptureTargets []IGVTrackEnriched        `json:"capture_targets,omitempty"`
	PublicTracks   map[string]IGVPublicTrack `json:"public_tracks" validate:"required"`
}
