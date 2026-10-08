package starrocks

import (
	"testing"

	"github.com/radiant-network/radiant-api/internal/database"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func pcxPatientKey(n string) string {
	return "00000000-0000-4000-8000-00000000000" + n
}

func searchPcxPatients(t *testing.T, env *testutils.Env, criteria []types.SearchCriterion, pagination *types.Pagination, sort []types.SortBody) ([]types.PatientListItem, int64) {
	t.Helper()
	repo := NewPcxPatientsRepository(database.StarrocksDB{DB: env.Starrocks})
	if pagination == nil {
		pagination = &types.Pagination{Limit: 10}
	}
	query, err := types.NewListQueryFromCriteria(types.PcxPatientsQueryConfig, nil, criteria, pagination, sort)
	require.NoError(t, err)
	patients, count, err := repo.SearchPatients(t.Context(), query)
	require.NoError(t, err)
	return patients, count
}

func pcxPatientKeys(patients []types.PatientListItem) []string {
	keys := make([]string, len(patients))
	for i, p := range patients {
		keys[i] = p.PatientKey
	}
	return keys
}

func Test_SearchPcxPatients_DefaultSort_IdentifiablePatientsFirstThenOrganizationThenId(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "pcx_patients"}, func(t *testing.T, env *testutils.Env) {
		patients, count := searchPcxPatients(t, env, nil, nil, nil)

		assert.Equal(t, int64(5), count)
		assert.Equal(t, []string{pcxPatientKey("2"), pcxPatientKey("1"), pcxPatientKey("3"), pcxPatientKey("4"), pcxPatientKey("5")}, pcxPatientKeys(patients))
	})
}

func Test_SearchPcxPatients_MapsEveryColumn(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "pcx_patients"}, func(t *testing.T, env *testutils.Env) {
		patients, _ := searchPcxPatients(t, env, []types.SearchCriterion{{FieldName: "patient_id", Value: []interface{}{"MRN-0002"}}}, nil, nil)

		require.Len(t, patients, 1)
		radiantID, birthYear, dx, source := 11, 2015, "ATRT", "CBTN"
		vitalDays, dxDays, survival := 4000, 1000, 3000
		assert.Equal(t, types.PatientListItem{
			PatientIdentity: types.PatientIdentity{
				PatientKey: pcxPatientKey("1"), PatientID: "MRN-0002", PatientIDType: "mrn", CanReadPhi: true,
				RadiantPatientID: &radiantID, OrganizationCode: "CHOP", OrganizationName: "Children's Hospital of Philadelphia",
				GivenName: "Ada", FamilyName: "Lovelace",
			},
			BirthYear: &birthYear, Gender: "female", CnsIntegratedDiagnosis: &dx, CnsIntegratedDiagnosisSource: &source,
			VitalStatus: "alive", AgeAtVitalStatusDays: &vitalDays, AgeAtInitialDxDays: &dxDays, SurvivalDays: &survival,
			HasImaging: true, CaseCount: 2,
		}, patients[0])
	})
}

func Test_SearchPcxPatients_NullColumnsStayNil(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "pcx_patients"}, func(t *testing.T, env *testutils.Env) {
		patients, _ := searchPcxPatients(t, env, []types.SearchCriterion{{FieldName: "patient_id", Value: []interface{}{"C100005"}}}, nil, nil)

		require.Len(t, patients, 1)
		p := patients[0]
		assert.Nil(t, p.RadiantPatientID)
		assert.Nil(t, p.CnsIntegratedDiagnosis)
		assert.Nil(t, p.SurvivalDays)
		assert.False(t, p.CanReadPhi)
	})
}

func Test_SearchPcxPatients_FilterOnVitalStatus(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "pcx_patients"}, func(t *testing.T, env *testutils.Env) {
		patients, count := searchPcxPatients(t, env, []types.SearchCriterion{{FieldName: "vital_status", Value: []interface{}{"deceased"}}}, nil, nil)

		assert.Equal(t, int64(2), count)
		assert.Equal(t, []string{pcxPatientKey("2"), pcxPatientKey("4")}, pcxPatientKeys(patients))
	})
}

func Test_SearchPcxPatients_CriteriaAreAnded(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "pcx_patients"}, func(t *testing.T, env *testutils.Env) {
		patients, count := searchPcxPatients(t, env, []types.SearchCriterion{
			{FieldName: "organization_code", Value: []interface{}{"CHOP", "BCH"}},
			{FieldName: "cns_integrated_diagnosis", Value: []interface{}{"ATRT"}},
		}, nil, nil)

		assert.Equal(t, int64(2), count)
		assert.Equal(t, []string{pcxPatientKey("1"), pcxPatientKey("4")}, pcxPatientKeys(patients))
	})
}

func Test_SearchPcxPatients_PatientNameMatchesOnlyIdentifiablePatients(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "pcx_patients"}, func(t *testing.T, env *testutils.Env) {
		// Patient 5 carries the same name, but the caller cannot read its PHI.
		patients, count := searchPcxPatients(t, env, []types.SearchCriterion{{FieldName: "patient_name", Value: []interface{}{"Ada Lovelace"}}}, nil, nil)

		assert.Equal(t, int64(1), count)
		assert.Equal(t, []string{pcxPatientKey("1")}, pcxPatientKeys(patients))
	})
}

func Test_SearchPcxPatients_NoMatch(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "pcx_patients"}, func(t *testing.T, env *testutils.Env) {
		patients, count := searchPcxPatients(t, env, []types.SearchCriterion{{FieldName: "patient_id", Value: []interface{}{"unknown"}}}, nil, nil)

		assert.Equal(t, int64(0), count)
		assert.Empty(t, patients)
		assert.NotNil(t, patients)
	})
}

func Test_SearchPcxPatients_PageIndexCountsEveryMatch(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "pcx_patients"}, func(t *testing.T, env *testutils.Env) {
		patients, count := searchPcxPatients(t, env, nil, &types.Pagination{Limit: 2, PageIndex: 1}, nil)

		assert.Equal(t, int64(5), count)
		assert.Equal(t, []string{pcxPatientKey("3"), pcxPatientKey("4")}, pcxPatientKeys(patients))
	})
}

func Test_SearchPcxPatients_SortSurvivalDaysPutsUnknownLast(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "pcx_patients"}, func(t *testing.T, env *testutils.Env) {
		patients, _ := searchPcxPatients(t, env, nil, nil, []types.SortBody{{Field: "survival_days", Order: "asc"}})

		// Ties and unknown values fall back to patient_key.
		assert.Equal(t, []string{pcxPatientKey("4"), pcxPatientKey("1"), pcxPatientKey("2"), pcxPatientKey("3"), pcxPatientKey("5")}, pcxPatientKeys(patients))
	})
}
