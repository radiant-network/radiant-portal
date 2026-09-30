package types

import (
	"errors"
	"fmt"
	"regexp"
	"time"
)

// caseGroupNamePattern is strict because the name becomes a manifest filename and an SMTP
// header value downstream: ASCII letters/digits/underscore/dot/dash, starts alphanumeric,
// 1-100 characters.
var caseGroupNamePattern = regexp.MustCompile(`^[A-Za-z0-9][A-Za-z0-9_.-]{0,99}$`)

type CaseGroup struct {
	ID         int `gorm:"primaryKey;autoIncrement"`
	TenantCode string
	Name       string
	CreatedOn  time.Time `gorm:"autoCreateTime"`
	CreatedBy  string
}

type CaseGroupCase struct {
	CaseGroupID int `gorm:"primaryKey"`
	CaseID      int `gorm:"primaryKey"`
}

var CaseGroupTable = Table{
	Name:  "case_group",
	Alias: "cg",
}

var CaseGroupCaseTable = Table{
	Name:  "case_group_case",
	Alias: "cgc",
}

func (CaseGroup) TableName() string {
	return CaseGroupTable.Name
}

func (CaseGroupCase) TableName() string {
	return CaseGroupCaseTable.Name
}

var ErrCaseGroupNotFound = errors.New("case group not found in this tenant")

// UnknownCaseIDsError lists the case ids of a request that do not exist in the tenant.
type UnknownCaseIDsError struct {
	IDs []int
}

func (e *UnknownCaseIDsError) Error() string {
	return fmt.Sprintf("unknown case ids in this tenant: %v", e.IDs)
}

func ValidateCaseGroupName(name string) error {
	if !caseGroupNamePattern.MatchString(name) {
		return fmt.Errorf("case group name %q is invalid: must start with a letter or digit and contain only letters, digits, underscores, dots, or dashes (max 100)", name)
	}
	return nil
}

// NormalizeCaseIDs deduplicates, keeping the client's order (first occurrence wins). Never nil: an
// empty group serializes as [].
func NormalizeCaseIDs(ids []int) []int {
	out := make([]int, 0, len(ids))
	seen := make(map[int]bool, len(ids))
	for _, id := range ids {
		if !seen[id] {
			seen[id] = true
			out = append(out, id)
		}
	}
	return out
}

// @Description Payload to create a case group, or overwrite the case list of an existing one
// @Description (same name in the tenant). An empty case_ids list is accepted and empties the group.
type CaseGroupRequest struct {
	Name    string `json:"name" binding:"required"`
	CaseIDs []int  `json:"case_ids" binding:"required"`
} // @name CaseGroupRequest

func (r CaseGroupRequest) Validate() error {
	return ValidateCaseGroupName(r.Name)
}

// @Description A named set of cases within a tenant.
type CaseGroupResponse struct {
	Name       string `json:"name" validate:"required"`
	TenantCode string `json:"tenant_code" validate:"required"`
	CaseIDs    []int  `json:"case_ids" validate:"required"`
} // @name CaseGroupResponse

func NewCaseGroupResponse(group CaseGroup, caseIDs []int) CaseGroupResponse {
	return CaseGroupResponse{Name: group.Name, TenantCode: group.TenantCode, CaseIDs: NormalizeCaseIDs(caseIDs)}
}

const (
	CaseGroupEmailSent               = "sent"
	CaseGroupEmailSkippedNoContact   = "skipped_no_contact"
	CaseGroupEmailSkippedNoDocuments = "skipped_no_documents"
	CaseGroupEmailFailed             = "failed"
)

// CaseGroupCaseRow is what the notification needs to know about one case of a group.
type CaseGroupCaseRow struct {
	CaseID              int
	PriorityCode        string
	AnalysisCatalogCode string
	DiagnosisLabCode    string
	DiagnosisLabName    string
}

// CaseGroupDocumentRow is one output document of a case, as it reaches the manifest. The same
// document comes back once per (sequencing experiment, sample) it was produced from.
type CaseGroupDocumentRow struct {
	DocumentID        int
	Name              string
	Size              int64
	DataTypeCode      string
	FormatCode        string
	SubmitterSampleID string
	PatientID         int
	CaseID            int
	DiagnosisLabCode  string
}

// @Description Values the tenant template was rendered with, echoed so a pipeline log explains the email.
type CaseGroupEmailContext struct {
	HasStat          bool     `json:"has_stat"`
	AnalysisCodes    []string `json:"analysis_codes" validate:"required"`
	CaseIDs          []int    `json:"case_ids" validate:"required"`
	ManifestFilename string   `json:"manifest_filename"`
} // @name CaseGroupEmailContext

// @Description Outcome of the notification for one diagnosis laboratory of the group.
type CaseGroupEmailReport struct {
	OrganizationCode string                `json:"organization_code" validate:"required"`
	Status           string                `json:"status" validate:"required" enums:"sent,skipped_no_contact,skipped_no_documents,failed"`
	Error            string                `json:"error,omitempty"`
	Recipients       []string              `json:"recipients" validate:"required"`
	CaseCount        int                   `json:"case_count"`
	DocumentCount    int                   `json:"document_count"`
	Template         string                `json:"template"`
	Context          CaseGroupEmailContext `json:"context"`
} // @name CaseGroupEmailReport

// @Description Report of a case group notification: the group and one entry per diagnosis laboratory.
type NotifyCaseGroupResponse struct {
	Group  CaseGroupResponse      `json:"group" validate:"required"`
	Emails []CaseGroupEmailReport `json:"emails" validate:"required"`
} // @name NotifyCaseGroupResponse
