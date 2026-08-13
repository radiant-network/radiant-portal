package types

import "time"

// SequencingRequest is a sequencing service ordered for a patient of a case, before
// any physical run exists. CaseID is NOT NULL, so tenant isolation of the natural key
// (CaseID, SubmitterSequencingRequestID) follows from cases being tenant-scoped.
type SequencingRequest struct {
	ID                           int `gorm:"unique;primaryKey;autoIncrement"`
	ServiceID                    int
	Service                      ServiceCatalog `gorm:"foreignKey:ID;references:ServiceID"`
	CaseID                       int
	PatientID                    int
	Patient                      Patient `gorm:"foreignKey:ID;references:PatientID"`
	StatusCode                   string
	Status                       Status `gorm:"foreignKey:Code;references:StatusCode"`
	SubmitterSequencingRequestID string
	TenantCode                   string
	CreatedOn                    time.Time `gorm:"autoCreateTime"`
	UpdatedOn                    time.Time `gorm:"autoUpdateTime:milli"`
}

var SequencingRequestTable = Table{
	Name:           "sequencing_request",
	FederationName: "radiant_jdbc.public.sequencing_request",
	Alias:          "sr",
}

func (SequencingRequest) TableName() string {
	return SequencingRequestTable.Name
}

// CaseSequencingRequest - Sequencing request to display in a Case
// @Description Sequencing service requested for a case member, whether or not it has been delivered yet
// @Name CaseSequencingRequest
type CaseSequencingRequest struct {
	ID                           int       `json:"id" validate:"required"`
	SubmitterSequencingRequestID string    `json:"submitter_sequencing_request_id" validate:"required"`
	ServiceCode                  string    `json:"service_code" validate:"required"`
	ServiceName                  string    `json:"service_name,omitempty"`
	PatientID                    int       `json:"patient_id" validate:"required"`
	RelationshipToProband        string    `json:"relationship_to_proband" validate:"required"`
	AffectedStatusCode           string    `json:"affected_status_code" validate:"required"`
	StatusCode                   string    `json:"status_code" validate:"required"`
	CreatedOn                    time.Time `json:"created_on" validate:"required"`
	UpdatedOn                    time.Time `json:"updated_on" validate:"required"`
}
