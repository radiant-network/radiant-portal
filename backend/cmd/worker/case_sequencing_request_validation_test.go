package main

import (
	"testing"

	"github.com/radiant-network/radiant-api/internal/batchval"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

// newSequencingRequestRecord builds a record whose patients block is already resolved, which is
// the state validateCaseSequencingRequests runs in (it depends on fetchPatients).
func newSequencingRequestRecord(t *testing.T, requests []*types.CaseSequencingRequestBatch, seqExps []*types.CaseSequencingExperimentBatch) *CaseValidationRecord {
	t.Helper()

	ctx := &batchval.BatchValidationContext{CasesRepo: &CaseValidationMockRepo{}}
	cr := NewCaseValidationRecord(ctx, batchval.NewBatchValidationCache(ctx), types.CaseBatch{
		SequencingRequests:    requests,
		SequencingExperiments: seqExps,
		Patients: []*types.CasePatientBatch{
			{SubmitterPatientId: "MRN-001", PatientOrganizationCode: "CHUSJ", RelationToProbandCode: "proband"},
		},
	}, 0)
	cr.StatusCodes = []string{"draft", "submitted", "completed", "revoke"}
	cr.Patients[batchval.PatientKey{OrganizationCode: "CHUSJ", SubmitterPatientId: "MRN-001"}] = &types.Patient{ID: 3}

	require.NoError(t, cr.fetchSequencingRequests(t.Context()))
	return cr
}

func validSequencingRequest() *types.CaseSequencingRequestBatch {
	return &types.CaseSequencingRequestBatch{
		SubmitterSequencingRequestId: "SR-001",
		ServiceCode:                  "75022",
		SubmitterPatientId:           "MRN-001",
		PatientOrganizationCode:      "CHUSJ",
		StatusCode:                   "submitted",
	}
}

func Test_validateCaseSequencingRequests_Valid(t *testing.T) {
	cr := newSequencingRequestRecord(t, []*types.CaseSequencingRequestBatch{validSequencingRequest()}, nil)

	cr.validateCaseSequencingRequests()

	assert.Empty(t, cr.Errors)
	resolved := cr.SequencingRequests["SR-001"]
	require.NotNil(t, resolved)
	require.NotNil(t, resolved.ServiceID)
	assert.Equal(t, 90, *resolved.ServiceID)
	require.NotNil(t, resolved.PatientID)
	assert.Equal(t, 3, *resolved.PatientID)
}

func Test_validateCaseSequencingRequests_NoBlockIsValid(t *testing.T) {
	cr := newSequencingRequestRecord(t, nil, nil)

	cr.validateCaseSequencingRequests()

	assert.Empty(t, cr.Errors, "the block is optional; existing payloads must keep validating")
}

func Test_validateCaseSequencingRequests_UnknownService(t *testing.T) {
	request := validSequencingRequest()
	request.ServiceCode = "WGA" // a case-level analysis code, not a sequencing service
	cr := newSequencingRequestRecord(t, []*types.CaseSequencingRequestBatch{request}, nil)

	cr.validateCaseSequencingRequests()

	require.Len(t, cr.Errors, 1)
	assert.Equal(t, SequencingRequestUnknownService, cr.Errors[0].Code)
	assert.Equal(t, "create_case[0].sequencing_requests[0]", cr.Errors[0].Path)
	assert.Contains(t, cr.Errors[0].Message, `Sequencing service "WGA"`)
}

func Test_validateCaseSequencingRequests_PatientNotInCase(t *testing.T) {
	request := validSequencingRequest()
	request.SubmitterPatientId = "MRN-999"
	cr := newSequencingRequestRecord(t, []*types.CaseSequencingRequestBatch{request}, nil)

	cr.validateCaseSequencingRequests()

	require.Len(t, cr.Errors, 1)
	assert.Equal(t, SequencingRequestPatientNotInCase, cr.Errors[0].Code)
	assert.Contains(t, cr.Errors[0].Message, "does not belong to create_case 0")
}

func Test_validateCaseSequencingRequests_UnknownStatus(t *testing.T) {
	request := validSequencingRequest()
	request.StatusCode = "on-hold" // the raw FHIR code; QLIN maps it to submitted
	cr := newSequencingRequestRecord(t, []*types.CaseSequencingRequestBatch{request}, nil)

	cr.validateCaseSequencingRequests()

	require.Len(t, cr.Errors, 1)
	assert.Equal(t, SequencingRequestUnknownStatus, cr.Errors[0].Code)
	assert.Contains(t, cr.Errors[0].Message, "is not a valid status code")
}

func Test_validateCaseSequencingRequests_MissingSubmitterId(t *testing.T) {
	request := validSequencingRequest()
	request.SubmitterSequencingRequestId = ""
	cr := newSequencingRequestRecord(t, []*types.CaseSequencingRequestBatch{request}, nil)

	cr.validateCaseSequencingRequests()

	require.NotEmpty(t, cr.Errors)
	assert.Equal(t, SequencingRequestInvalidField, cr.Errors[0].Code)
	assert.Contains(t, cr.Errors[0].Message, "submitter_sequencing_request_id")
}

func Test_validateCaseSequencingRequests_DuplicateSubmitterIdInBatch(t *testing.T) {
	cr := newSequencingRequestRecord(t, []*types.CaseSequencingRequestBatch{validSequencingRequest(), validSequencingRequest()}, nil)

	cr.validateCaseSequencingRequests()

	require.Len(t, cr.Errors, 1)
	assert.Equal(t, SequencingRequestDuplicateInBatch, cr.Errors[0].Code)
	assert.Equal(t, "create_case[0].sequencing_requests[1]", cr.Errors[0].Path)
}

func Test_validateSeqExpSequencingRequests_NamedRequestDeclared(t *testing.T) {
	seqExp := &types.CaseSequencingExperimentBatch{
		Aliquot:                      "ALQ-001",
		SampleOrganizationCode:       "CHUSJ",
		SubmitterSampleId:            "SP-001",
		SubmitterSequencingRequestId: "SR-001",
	}
	cr := newSequencingRequestRecord(t, []*types.CaseSequencingRequestBatch{validSequencingRequest()}, []*types.CaseSequencingExperimentBatch{seqExp})

	cr.validateSeqExpSequencingRequests()

	assert.Empty(t, cr.Errors)
}

func Test_validateSeqExpSequencingRequests_NamedRequestMissing(t *testing.T) {
	seqExp := &types.CaseSequencingExperimentBatch{
		Aliquot:                      "ALQ-001",
		SampleOrganizationCode:       "CHUSJ",
		SubmitterSampleId:            "SP-001",
		SubmitterSequencingRequestId: "SR-NOPE",
	}
	cr := newSequencingRequestRecord(t, []*types.CaseSequencingRequestBatch{validSequencingRequest()}, []*types.CaseSequencingExperimentBatch{seqExp})

	cr.validateSeqExpSequencingRequests()

	require.Len(t, cr.Errors, 1)
	assert.Equal(t, SequencingRequestNotFoundInCase, cr.Errors[0].Code)
	assert.Equal(t, "create_case[0].sequencing_experiments[0]", cr.Errors[0].Path)
}

// A CHOP-style delivery names no request at all.
func Test_validateSeqExpSequencingRequests_NoRequestNamed(t *testing.T) {
	seqExp := &types.CaseSequencingExperimentBatch{
		Aliquot:                "ALQ-001",
		SampleOrganizationCode: "CHUSJ",
		SubmitterSampleId:      "SP-001",
	}
	cr := newSequencingRequestRecord(t, nil, []*types.CaseSequencingExperimentBatch{seqExp})

	cr.validateSeqExpSequencingRequests()

	assert.Empty(t, cr.Errors)
}

func Test_fetchSequencingRequests_UnknownServiceLeavesServiceIDNil(t *testing.T) {
	request := validSequencingRequest()
	request.ServiceCode = "NOT-A-CODE"
	cr := newSequencingRequestRecord(t, []*types.CaseSequencingRequestBatch{request}, nil)

	resolved := cr.SequencingRequests["SR-001"]
	require.NotNil(t, resolved)
	assert.Nil(t, resolved.ServiceID)
	assert.NotNil(t, resolved.PatientID)
}
