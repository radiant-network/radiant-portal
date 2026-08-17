package main

import (
	"fmt"
	"testing"
	"time"

	"github.com/radiant-network/radiant-api/internal/batchval"
	"github.com/radiant-network/radiant-api/internal/repository/postgres"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/stretchr/testify/assert"
)

func Test_fetchFetusCodes_OK(t *testing.T) {
	mockContext := &batchval.BatchValidationContext{ValueSetsRepo: &CodesMockRepo{}}
	record := CaseValidationRecord{BaseValidationRecord: batchval.BaseValidationRecord{ResourceType: types.CreateCaseBatchType, Context: mockContext}}
	record.Cache = batchval.NewBatchValidationCache(mockContext)

	err := record.fetchFetusCodes(t.Context())
	assert.NoError(t, err)
	assert.Equal(t, []string{"male", "female", "unknown"}, record.SexCodes)
	assert.Equal(t, []string{"alive", "deceased", "unknown"}, record.LifeStatusCodes)
}

func Test_fetchFetusCodes_SexCodesError(t *testing.T) {
	mockRepo := &CodesMockRepo{
		GetCodesFunc: func(setType postgres.ValueSetType) ([]string, error) {
			if setType == postgres.ValueSetSex {
				return nil, fmt.Errorf("database connection failed")
			}
			return nil, nil
		},
	}
	mockContext := &batchval.BatchValidationContext{ValueSetsRepo: mockRepo}
	record := CaseValidationRecord{BaseValidationRecord: batchval.BaseValidationRecord{ResourceType: types.CreateCaseBatchType, Context: mockContext}}
	record.Cache = batchval.NewBatchValidationCache(mockContext)

	err := record.fetchFetusCodes(t.Context())
	assert.Error(t, err)
	assert.ErrorContains(t, err, "error retrieving sex codes")
}

func Test_fetchFetusCodes_LifeStatusCodesError(t *testing.T) {
	mockRepo := &CodesMockRepo{
		GetCodesFunc: func(setType postgres.ValueSetType) ([]string, error) {
			if setType == postgres.ValueSetLifeStatus {
				return nil, fmt.Errorf("database connection failed")
			}
			return nil, nil
		},
	}
	mockContext := &batchval.BatchValidationContext{ValueSetsRepo: mockRepo}
	record := CaseValidationRecord{BaseValidationRecord: batchval.BaseValidationRecord{ResourceType: types.CreateCaseBatchType, Context: mockContext}}
	record.Cache = batchval.NewBatchValidationCache(mockContext)

	err := record.fetchFetusCodes(t.Context())
	assert.Error(t, err)
	assert.ErrorContains(t, err, "error retrieving life status codes")
}

func Test_fetchPatientCodes_ExcludesFetusRelationship(t *testing.T) {
	mockRepo := &CodesMockRepo{
		GetCodesFunc: func(setType postgres.ValueSetType) ([]string, error) {
			if setType == postgres.ValueSetFamilyRelationship {
				return []string{"proband", "mother", "father", "sibling", "fetus"}, nil
			}
			return []string{"affected", "non_affected", "unknown"}, nil
		},
	}
	mockContext := &batchval.BatchValidationContext{ValueSetsRepo: mockRepo}
	record := CaseValidationRecord{BaseValidationRecord: batchval.BaseValidationRecord{ResourceType: types.CreateCaseBatchType, Context: mockContext}}
	record.Cache = batchval.NewBatchValidationCache(mockContext)

	err := record.fetchPatientCodes(t.Context())
	assert.NoError(t, err)
	assert.ElementsMatch(t, []string{"proband", "mother", "father", "sibling"}, record.PatientRelationshipToProbandCodes)
}

func newFetusValidationRecord(fetuses []*types.CaseFetusBatch) *CaseValidationRecord {
	return &CaseValidationRecord{
		BaseValidationRecord:       batchval.BaseValidationRecord{ResourceType: types.CreateCaseBatchType, Index: 0},
		Case:                       types.CaseBatch{Fetuses: fetuses},
		SexCodes:                   []string{"male", "female", "unknown"},
		LifeStatusCodes:            []string{"alive", "deceased", "unknown"},
		PatientAffectedStatusCodes: []string{"affected", "non_affected", "unknown"},
		ObservationCodes:           []string{"phenotype", "note"},
		OnsetCodes:                 []string{"antenatal", "unknown"},
		InterpretationCodes:        []string{"positive", "negative", "abnormal", "normal"},
	}
}

func Test_validateFetusSexCode_Valid(t *testing.T) {
	cr := newFetusValidationRecord([]*types.CaseFetusBatch{{SexCode: "male"}})
	cr.validateFetusSexCode(0)
	assert.Empty(t, cr.Errors)
}

func Test_validateFetusSexCode_Invalid(t *testing.T) {
	cr := newFetusValidationRecord([]*types.CaseFetusBatch{{SexCode: "not-a-sex"}})
	cr.validateFetusSexCode(0)
	assert.Len(t, cr.Errors, 1)
	assert.Equal(t, FetusInvalidField, cr.Errors[0].Code)
	assert.Equal(t, "create_case[0].fetuses[0].sex_code", cr.Errors[0].Path)
}

func Test_validateFetusSexCode_Missing(t *testing.T) {
	cr := newFetusValidationRecord([]*types.CaseFetusBatch{{SexCode: ""}})
	cr.validateFetusSexCode(0)
	assert.Len(t, cr.Errors, 1)
	assert.Equal(t, FetusInvalidField, cr.Errors[0].Code)
}

func Test_validateFetusLifeStatusCode_Valid(t *testing.T) {
	cr := newFetusValidationRecord([]*types.CaseFetusBatch{{LifeStatusCode: "alive"}})
	cr.validateFetusLifeStatusCode(0)
	assert.Empty(t, cr.Errors)
}

func Test_validateFetusLifeStatusCode_Invalid(t *testing.T) {
	cr := newFetusValidationRecord([]*types.CaseFetusBatch{{LifeStatusCode: "not-a-status"}})
	cr.validateFetusLifeStatusCode(0)
	assert.Len(t, cr.Errors, 1)
	assert.Equal(t, FetusInvalidField, cr.Errors[0].Code)
	assert.Equal(t, "create_case[0].fetuses[0].life_status_code", cr.Errors[0].Path)
}

func Test_validateFetusLifeStatusCode_Missing(t *testing.T) {
	cr := newFetusValidationRecord([]*types.CaseFetusBatch{{LifeStatusCode: ""}})
	cr.validateFetusLifeStatusCode(0)
	assert.Len(t, cr.Errors, 1)
	assert.Equal(t, FetusInvalidField, cr.Errors[0].Code)
}

func Test_validateFetusAffectedStatusCode_Valid(t *testing.T) {
	cr := newFetusValidationRecord([]*types.CaseFetusBatch{{AffectedStatusCode: "unknown"}})
	cr.validateFetusAffectedStatusCode(0)
	assert.Empty(t, cr.Errors)
}

func Test_validateFetusAffectedStatusCode_Invalid(t *testing.T) {
	cr := newFetusValidationRecord([]*types.CaseFetusBatch{{AffectedStatusCode: "super-affected"}})
	cr.validateFetusAffectedStatusCode(0)
	assert.Len(t, cr.Errors, 1)
	assert.Equal(t, FetusInvalidField, cr.Errors[0].Code)
}

func Test_validateFetusDates_ValidWithLastMenstrualPeriod(t *testing.T) {
	lmp := types.DateISO8601(time.Date(2026, time.February, 1, 0, 0, 0, 0, time.UTC))
	cr := newFetusValidationRecord([]*types.CaseFetusBatch{{LifeStatusCode: "alive", LastMenstrualPeriod: &lmp}})
	cr.validateFetusDates(0)
	assert.Empty(t, cr.Errors)
}

func Test_validateFetusDates_ValidWithEstimatedDueDate(t *testing.T) {
	edd := types.DateISO8601(time.Date(2026, time.November, 8, 0, 0, 0, 0, time.UTC))
	cr := newFetusValidationRecord([]*types.CaseFetusBatch{{LifeStatusCode: "unknown", EstimatedDueDate: &edd}})
	cr.validateFetusDates(0)
	assert.Empty(t, cr.Errors)
}

func Test_validateFetusDates_ValidWhenDeceasedWithNoDates(t *testing.T) {
	cr := newFetusValidationRecord([]*types.CaseFetusBatch{{LifeStatusCode: "deceased"}})
	cr.validateFetusDates(0)
	assert.Empty(t, cr.Errors)
}

func Test_validateFetusDates_InvalidWhenAliveWithNoDates(t *testing.T) {
	cr := newFetusValidationRecord([]*types.CaseFetusBatch{{LifeStatusCode: "alive"}})
	cr.validateFetusDates(0)
	assert.Len(t, cr.Errors, 1)
	assert.Equal(t, FetusInvalidField, cr.Errors[0].Code)
	assert.Equal(t, "create_case[0].fetuses[0]", cr.Errors[0].Path)
}

func Test_validateFetusDates_InvalidWhenUnknownLifeStatusWithNoDates(t *testing.T) {
	cr := newFetusValidationRecord([]*types.CaseFetusBatch{{LifeStatusCode: "unknown"}})
	cr.validateFetusDates(0)
	assert.Len(t, cr.Errors, 1)
	assert.Equal(t, FetusInvalidField, cr.Errors[0].Code)
}

func Test_validateFetusDates_InvalidWhenLastMenstrualPeriodInFuture(t *testing.T) {
	future := types.DateISO8601(todayUTC().AddDate(0, 0, 1))
	cr := newFetusValidationRecord([]*types.CaseFetusBatch{{LifeStatusCode: "alive", LastMenstrualPeriod: &future}})
	cr.validateFetusDates(0)
	assert.Len(t, cr.Errors, 1)
	assert.Equal(t, FetusInvalidField, cr.Errors[0].Code)
	assert.Equal(t, "create_case[0].fetuses[0].last_menstrual_period", cr.Errors[0].Path)
}

func Test_validateFetusDates_ValidWhenLastMenstrualPeriodIsToday(t *testing.T) {
	today := types.DateISO8601(todayUTC())
	cr := newFetusValidationRecord([]*types.CaseFetusBatch{{LifeStatusCode: "alive", LastMenstrualPeriod: &today}})
	cr.validateFetusDates(0)
	assert.Empty(t, cr.Errors)
}

func Test_validateFetusDates_ValidWhenEstimatedDueDateIsToday(t *testing.T) {
	today := types.DateISO8601(todayUTC())
	cr := newFetusValidationRecord([]*types.CaseFetusBatch{{LifeStatusCode: "alive", EstimatedDueDate: &today}})
	cr.validateFetusDates(0)
	assert.Empty(t, cr.Errors)
}

// A deceased fetus is exempt from "at least one date" but not from range checks: a recorded date
// still has to be a real date, whatever the life status.
func Test_validateFetusDates_InvalidWhenDeceasedWithFutureLastMenstrualPeriod(t *testing.T) {
	future := types.DateISO8601(todayUTC().AddDate(0, 0, 1))
	cr := newFetusValidationRecord([]*types.CaseFetusBatch{{LifeStatusCode: "deceased", LastMenstrualPeriod: &future}})
	cr.validateFetusDates(0)
	assert.Len(t, cr.Errors, 1)
	assert.Equal(t, "create_case[0].fetuses[0].last_menstrual_period", cr.Errors[0].Path)
}

func Test_validateFetusUniquenessInBatch_FirstOccurrence(t *testing.T) {
	cr := newFetusValidationRecord([]*types.CaseFetusBatch{{SubmitterFetusId: "F-1"}})
	seen := map[FetusKey]struct{}{}
	cr.validateFetusUniquenessInBatch(0, "ORG1", seen)
	assert.Empty(t, cr.Errors)
	assert.Contains(t, seen, FetusKey{OrganizationCode: "ORG1", SubmitterFetusId: "F-1"})
}

func Test_validateFetusUniquenessInBatch_Duplicate(t *testing.T) {
	cr := newFetusValidationRecord([]*types.CaseFetusBatch{{SubmitterFetusId: "F-1"}})
	seen := map[FetusKey]struct{}{{OrganizationCode: "ORG1", SubmitterFetusId: "F-1"}: {}}
	cr.validateFetusUniquenessInBatch(0, "ORG1", seen)
	assert.Len(t, cr.Errors, 1)
	assert.Equal(t, FetusDuplicateInBatchCode, cr.Errors[0].Code)
	assert.Equal(t, "create_case[0].fetuses[0]", cr.Errors[0].Path)
}

// Uniqueness is scoped by organization, so the same key under a different org is not a conflict.
func Test_validateFetusUniquenessInBatch_SameKeyDifferentOrg_NoConflict(t *testing.T) {
	cr := newFetusValidationRecord([]*types.CaseFetusBatch{{SubmitterFetusId: "F-1"}})
	seen := map[FetusKey]struct{}{{OrganizationCode: "ORG2", SubmitterFetusId: "F-1"}: {}}
	cr.validateFetusUniquenessInBatch(0, "ORG1", seen)
	assert.Empty(t, cr.Errors)
}

// End-to-end through validateCaseFetuses: the org is resolved from the proband, so two fetuses
// reusing a key under the same case's mother must be caught even without a pre-seeded map.
func Test_validateCaseFetuses_DuplicateSubmitterFetusIdAcrossFetuses(t *testing.T) {
	lmp := types.DateISO8601(time.Date(2026, time.February, 1, 0, 0, 0, 0, time.UTC))
	cr := newFetusValidationRecord([]*types.CaseFetusBatch{
		{SubmitterFetusId: "F-1", SexCode: "male", LifeStatusCode: "alive", AffectedStatusCode: "unknown", LastMenstrualPeriod: &lmp},
		{SubmitterFetusId: "F-1", SexCode: "female", LifeStatusCode: "alive", AffectedStatusCode: "unknown", LastMenstrualPeriod: &lmp},
	})
	cr.Case.Patients = []*types.CasePatientBatch{
		{SubmitterPatientId: "MRN-001", PatientOrganizationCode: "ORG1", RelationToProbandCode: "proband", AffectedStatusCode: "affected"},
	}
	cr.Patients = map[batchval.PatientKey]*types.Patient{
		{OrganizationCode: "ORG1", SubmitterPatientId: "MRN-001"}: {ID: 1, OrganizationCode: "ORG1"},
	}
	cr.Context = &batchval.BatchValidationContext{FetusRepo: &FetusMockRepo{}}

	err := cr.validateCaseFetuses(t.Context(), map[FetusKey]struct{}{}, nil)
	assert.NoError(t, err)
	assert.Len(t, cr.Errors, 1)
	assert.Equal(t, FetusDuplicateInBatchCode, cr.Errors[0].Code)
	assert.Equal(t, "create_case[0].fetuses[1]", cr.Errors[0].Path)
}

// End-to-end through validateCaseFetuses: a key that collides with another mother's fetus in the
// same organization must be caught before persistence, with a clean code rather than letting the
// create hit the fetus_org_submitter_id_key constraint directly.
func Test_validateCaseFetuses_OrgConflictWithAnotherMother(t *testing.T) {
	lmp := types.DateISO8601(time.Date(2026, time.February, 1, 0, 0, 0, 0, time.UTC))
	cr := newFetusValidationRecord([]*types.CaseFetusBatch{
		{SubmitterFetusId: "F-1", SexCode: "male", LifeStatusCode: "alive", AffectedStatusCode: "unknown", LastMenstrualPeriod: &lmp},
	})
	cr.Case.Patients = []*types.CasePatientBatch{
		{SubmitterPatientId: "MRN-001", PatientOrganizationCode: "ORG1", RelationToProbandCode: "proband", AffectedStatusCode: "affected"},
	}
	cr.Patients = map[batchval.PatientKey]*types.Patient{
		{OrganizationCode: "ORG1", SubmitterPatientId: "MRN-001"}: {ID: 1, OrganizationCode: "ORG1"},
	}
	cr.Context = &batchval.BatchValidationContext{FetusRepo: &FetusMockRepo{
		GetFetusByOrganizationAndSubmitterIdFunc: func(organizationCode, submitterFetusId, tenantCode string) (*types.Fetus, error) {
			return &types.Fetus{ID: 55, MotherID: 999, SubmitterFetusId: submitterFetusId, OrganizationCode: organizationCode}, nil
		},
	}}

	err := cr.validateCaseFetuses(t.Context(), map[FetusKey]struct{}{}, nil)
	assert.NoError(t, err)
	assert.Len(t, cr.Errors, 1)
	assert.Equal(t, FetusOrgConflictCode, cr.Errors[0].Code)
	assert.Equal(t, "create_case[0].fetuses[0]", cr.Errors[0].Path)
}

func Test_validateFetusOrgUniqueness_NoConflict(t *testing.T) {
	cr := newFetusValidationRecord([]*types.CaseFetusBatch{{SubmitterFetusId: "F-1"}})
	cr.Context = &batchval.BatchValidationContext{FetusRepo: &FetusMockRepo{}}
	err := cr.validateFetusOrgUniqueness(t.Context(), 0, "ORG1", nil)
	assert.NoError(t, err)
	assert.Empty(t, cr.Errors)
}

// Test_validateFetusOrgUniqueness_ScopesLookupToRecordTenant reproduces CLIN-6157 for fetus: the
// pre-check must scope its lookup to the batch's own tenant, so a same-key fetus resolved by the
// repo for another tenant (simulated here as "not found", per the widened
// fetus_org_submitter_id_key) is not reported as FETUS-004.
func Test_validateFetusOrgUniqueness_ScopesLookupToRecordTenant(t *testing.T) {
	cr := newFetusValidationRecord([]*types.CaseFetusBatch{{SubmitterFetusId: "F-1"}})
	cr.TenantCode = "tenant_b"
	var gotTenantCode string
	cr.Context = &batchval.BatchValidationContext{FetusRepo: &FetusMockRepo{
		GetFetusByOrganizationAndSubmitterIdFunc: func(organizationCode, submitterFetusId, tenantCode string) (*types.Fetus, error) {
			gotTenantCode = tenantCode
			return nil, nil
		},
	}}
	err := cr.validateFetusOrgUniqueness(t.Context(), 0, "ORG1", nil)
	assert.NoError(t, err)
	assert.Empty(t, cr.Errors)
	assert.Equal(t, "tenant_b", gotTenantCode)
}

func Test_validateFetusOrgUniqueness_ConflictWithAnotherMother(t *testing.T) {
	cr := newFetusValidationRecord([]*types.CaseFetusBatch{{SubmitterFetusId: "F-1"}})
	cr.Context = &batchval.BatchValidationContext{FetusRepo: &FetusMockRepo{
		GetFetusByOrganizationAndSubmitterIdFunc: func(organizationCode, submitterFetusId, tenantCode string) (*types.Fetus, error) {
			return &types.Fetus{ID: 99, MotherID: 42, SubmitterFetusId: submitterFetusId, OrganizationCode: organizationCode}, nil
		},
	}}
	err := cr.validateFetusOrgUniqueness(t.Context(), 0, "ORG1", nil)
	assert.NoError(t, err)
	assert.Len(t, cr.Errors, 1)
	assert.Equal(t, FetusOrgConflictCode, cr.Errors[0].Code)
	assert.Equal(t, "create_case[0].fetuses[0]", cr.Errors[0].Path)
}

// A key already attached to this case (e.g. an update in place) must not be looked up at all —
// resolving it there means correcting that row, not creating a new one.
func Test_validateFetusOrgUniqueness_ExemptWhenAlreadyOnThisCase(t *testing.T) {
	cr := newFetusValidationRecord([]*types.CaseFetusBatch{{SubmitterFetusId: "F-1"}})
	cr.Context = &batchval.BatchValidationContext{FetusRepo: &FetusMockRepo{
		GetFetusByOrganizationAndSubmitterIdFunc: func(organizationCode, submitterFetusId, tenantCode string) (*types.Fetus, error) {
			t.Fatal("must not look up a key already exempted by existingOnCase")
			return nil, nil
		},
	}}
	existingOnCase := map[string]*types.Fetus{"F-1": {ID: 7}}
	err := cr.validateFetusOrgUniqueness(t.Context(), 0, "ORG1", existingOnCase)
	assert.NoError(t, err)
	assert.Empty(t, cr.Errors)
}

func Test_validateFetusOrgUniqueness_PropagatesLookupError(t *testing.T) {
	cr := newFetusValidationRecord([]*types.CaseFetusBatch{{SubmitterFetusId: "F-1"}})
	cr.Context = &batchval.BatchValidationContext{FetusRepo: &FetusMockRepo{
		GetFetusByOrganizationAndSubmitterIdFunc: func(organizationCode, submitterFetusId, tenantCode string) (*types.Fetus, error) {
			return nil, fmt.Errorf("database connection failed")
		},
	}}
	err := cr.validateFetusOrgUniqueness(t.Context(), 0, "ORG1", nil)
	assert.Error(t, err)
	assert.Empty(t, cr.Errors)
}

func Test_validateFetusObservationsCategorical_Valid(t *testing.T) {
	cr := newFetusValidationRecord([]*types.CaseFetusBatch{{
		ObservationsCategorical: []*types.ObservationCategoricalBatch{
			{Code: "phenotype", System: "HPO", Value: "HP:0001631", OnsetCode: "antenatal", InterpretationCode: "positive"},
		},
	}})
	cr.validateFetusObservationsCategorical(0)
	assert.Empty(t, cr.Errors)
}

func Test_validateFetusObservationsCategorical_InvalidCode(t *testing.T) {
	cr := newFetusValidationRecord([]*types.CaseFetusBatch{{
		ObservationsCategorical: []*types.ObservationCategoricalBatch{
			{Code: "not-a-code", System: "HPO", Value: "HP:0001631", OnsetCode: "antenatal", InterpretationCode: "positive"},
		},
	}})
	cr.validateFetusObservationsCategorical(0)
	assert.Len(t, cr.Errors, 1)
	assert.Equal(t, ObservationInvalidField, cr.Errors[0].Code)
	assert.Equal(t, "create_case[0].fetuses[0].observations_categorical[0].code", cr.Errors[0].Path)
}

func Test_validateFetusObservationsText_Valid(t *testing.T) {
	cr := newFetusValidationRecord([]*types.CaseFetusBatch{{
		ObservationsText: []*types.ObservationTextBatch{{Code: "note", Value: "Free text note"}},
	}})
	cr.validateFetusObservationsText(0)
	assert.Empty(t, cr.Errors)
}

func Test_validateFetusObservationsText_FreeTextWithAccentsApostropheAndParentheses(t *testing.T) {
	cr := newFetusValidationRecord([]*types.CaseFetusBatch{{
		ObservationsText: []*types.ObservationTextBatch{
			{Code: "note", Value: "Échographie fœtale : clarté nucale élevée (OBS-001) ; suivi requis, l’œdème persiste"},
		},
	}})
	cr.validateFetusObservationsText(0)
	assert.Empty(t, cr.Errors)
}

func Test_validateFetusObservationsText_InvalidCode(t *testing.T) {
	cr := newFetusValidationRecord([]*types.CaseFetusBatch{{
		ObservationsText: []*types.ObservationTextBatch{{Code: "not-a-code", Value: "Free text note"}},
	}})
	cr.validateFetusObservationsText(0)
	assert.Len(t, cr.Errors, 1)
	assert.Equal(t, ObservationInvalidField, cr.Errors[0].Code)
	assert.Equal(t, "create_case[0].fetuses[0].observations_text[0].code", cr.Errors[0].Path)
}

func Test_validateCaseFetuses_MultipleFetuses(t *testing.T) {
	lmp := types.DateISO8601(time.Date(2026, time.February, 1, 0, 0, 0, 0, time.UTC))
	cr := newFetusValidationRecord([]*types.CaseFetusBatch{
		{SexCode: "male", LifeStatusCode: "alive", AffectedStatusCode: "unknown", LastMenstrualPeriod: &lmp},
		{SexCode: "not-a-sex", LifeStatusCode: "not-a-status", AffectedStatusCode: "unknown", LastMenstrualPeriod: &lmp},
	})
	err := cr.validateCaseFetuses(t.Context(), map[FetusKey]struct{}{}, nil)
	assert.NoError(t, err)
	assert.Len(t, cr.Errors, 2)
	assert.Equal(t, "create_case[0].fetuses[1].sex_code", cr.Errors[0].Path)
	assert.Equal(t, "create_case[0].fetuses[1].life_status_code", cr.Errors[1].Path)
}

// `dive` without `required` lets a null entry through binding, so the worker must report it as a
// validation error rather than nil-deref on it.
func Test_validateCaseFetuses_NullEntry(t *testing.T) {
	cr := newFetusValidationRecord([]*types.CaseFetusBatch{nil})
	err := cr.validateCaseFetuses(t.Context(), map[FetusKey]struct{}{}, nil)
	assert.NoError(t, err)
	assert.Len(t, cr.Errors, 1)
	assert.Equal(t, FetusInvalidField, cr.Errors[0].Code)
	assert.Equal(t, "create_case[0].fetuses[0]", cr.Errors[0].Path)
}

func Test_validateFetusObservationsCategorical_NullEntry(t *testing.T) {
	cr := newFetusValidationRecord([]*types.CaseFetusBatch{
		{ObservationsCategorical: []*types.ObservationCategoricalBatch{nil}},
	})
	cr.validateFetusObservationsCategorical(0)
	assert.Len(t, cr.Errors, 1)
	assert.Equal(t, ObservationInvalidField, cr.Errors[0].Code)
	assert.Equal(t, "create_case[0].fetuses[0].observations_categorical[0]", cr.Errors[0].Path)
}

func Test_validateFetusObservationsText_NullEntry(t *testing.T) {
	cr := newFetusValidationRecord([]*types.CaseFetusBatch{
		{ObservationsText: []*types.ObservationTextBatch{nil}},
	})
	cr.validateFetusObservationsText(0)
	assert.Len(t, cr.Errors, 1)
	assert.Equal(t, ObservationInvalidField, cr.Errors[0].Code)
	assert.Equal(t, "create_case[0].fetuses[0].observations_text[0]", cr.Errors[0].Path)
}

// A valid fetus whose observation entries are null: validateCaseFetuses reaches both arrays in the
// same pass, so it must survive them together.
func Test_validateCaseFetuses_NullObservationEntries(t *testing.T) {
	lmp := types.DateISO8601(time.Date(2026, time.February, 1, 0, 0, 0, 0, time.UTC))
	cr := newFetusValidationRecord([]*types.CaseFetusBatch{
		{
			SexCode:                 "male",
			LifeStatusCode:          "alive",
			AffectedStatusCode:      "affected",
			LastMenstrualPeriod:     &lmp,
			ObservationsCategorical: []*types.ObservationCategoricalBatch{nil},
			ObservationsText:        []*types.ObservationTextBatch{nil},
		},
	})
	err := cr.validateCaseFetuses(t.Context(), map[FetusKey]struct{}{}, nil)
	assert.NoError(t, err)
	assert.Len(t, cr.Errors, 2)
	assert.Equal(t, "create_case[0].fetuses[0].observations_categorical[0]", cr.Errors[0].Path)
	assert.Equal(t, "create_case[0].fetuses[0].observations_text[0]", cr.Errors[1].Path)
}

func Test_dateISO8601ToTimePtr_Nil(t *testing.T) {
	assert.Nil(t, dateISO8601ToTimePtr(nil))
}

func Test_dateISO8601ToTimePtr_Value(t *testing.T) {
	d := types.DateISO8601(time.Date(2026, time.February, 1, 0, 0, 0, 0, time.UTC))
	result := dateISO8601ToTimePtr(&d)
	assert.NotNil(t, result)
	assert.True(t, time.Time(d).Equal(*result))
}
