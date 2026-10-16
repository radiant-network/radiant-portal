package starrocks

import (
	"fmt"
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
		radiantID, birthYear, cohort, dx, source := 11, 2015, "Atypical teratoid/rhabdoid tumor", "ATRT", "CBTN"
		vitalDays, dxDays, survival := 4000, 1826, 2174
		assert.Equal(t, types.PatientListItem{
			PatientIdentity: types.PatientIdentity{
				PatientKey: pcxPatientKey("1"), PatientID: "MRN-0002", PatientIDType: "mrn", CanReadPhi: true,
				RadiantPatientID: &radiantID, OrganizationCode: "CHOP", OrganizationName: "Children's Hospital of Philadelphia",
				GivenName: "Ada", FamilyName: "Lovelace",
			},
			BirthYear: &birthYear, Gender: "female", DiagnosisTypeCohort: &cohort, CnsIntegratedDiagnosis: &dx, CnsIntegratedDiagnosisSource: &source,
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
		assert.Nil(t, p.DiagnosisTypeCohort)
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

func Test_SearchPcxPatients_FilterOnDiagnosisTypeCohort(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "pcx_patients"}, func(t *testing.T, env *testutils.Env) {
		patients, count := searchPcxPatients(t, env, []types.SearchCriterion{{FieldName: "diagnosis_type_cohort", Value: []interface{}{"Medulloblastoma", "Ependymoma"}}}, nil, nil)

		assert.Equal(t, int64(2), count)
		assert.Equal(t, []string{pcxPatientKey("2"), pcxPatientKey("3")}, pcxPatientKeys(patients))
	})
}

func Test_SearchPcxPatients_ChildhoodEndsBeforeFiveYears(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "pcx_patients"}, func(t *testing.T, env *testutils.Env) {
		patients, _ := searchPcxPatients(t, env, []types.SearchCriterion{{FieldName: "age_at_initial_dx_group", Value: []interface{}{"childhood"}}}, nil, nil)

		assert.Equal(t, []string{pcxPatientKey("1")}, pcxPatientKeys(patients))
	})
}

func Test_SearchPcxPatients_JuvenileStartsAtFiveYears(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "pcx_patients"}, func(t *testing.T, env *testutils.Env) {
		patients, _ := searchPcxPatients(t, env, []types.SearchCriterion{{FieldName: "age_at_initial_dx_group", Value: []interface{}{"juvenile"}}}, nil, nil)

		assert.Equal(t, []string{pcxPatientKey("2"), pcxPatientKey("4")}, pcxPatientKeys(patients))
	})
}

func Test_AgeAtInitialDxGroupSQL_HpoOnsetBoundaries(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "pcx_patients"}, func(t *testing.T, env *testutils.Env) {
		cases := []struct {
			days interface{}
			want string
		}{
			{nil, "unknown"},
			{0, "congenital"},
			{1, "neonatal"},
			{27, "neonatal"},
			{28, "infantile"},
			{365, "infantile"},
			{366, "childhood"},
			{1826, "childhood"},
			{1827, "juvenile"},
			{5843, "juvenile"},
			{5844, "young_adult"},
			{14609, "young_adult"},
			{14610, "middle_age"},
			{21914, "middle_age"},
			{21915, "senior"},
		}
		for _, c := range cases {
			var got string
			err := env.Starrocks.Raw(fmt.Sprintf("SELECT %s FROM (SELECT CAST(? AS INT) AS age_at_initial_dx_days) t", ageAtInitialDxGroupSQL), c.days).Scan(&got).Error
			require.NoError(t, err)
			assert.Equalf(t, c.want, got, "age_at_initial_dx_days = %v", c.days)
		}
	})
}

func Test_SearchPcxPatients_UnknownAgeGroupMatchesPatientsWithoutAge(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "pcx_patients"}, func(t *testing.T, env *testutils.Env) {
		patients, _ := searchPcxPatients(t, env, []types.SearchCriterion{{FieldName: "age_at_initial_dx_group", Value: []interface{}{"unknown"}}}, nil, nil)

		assert.Equal(t, []string{pcxPatientKey("3"), pcxPatientKey("5")}, pcxPatientKeys(patients))
	})
}

func Test_SearchPcxPatients_FilterOnRadiationEver(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "pcx_patients"}, func(t *testing.T, env *testutils.Env) {
		patients, _ := searchPcxPatients(t, env, []types.SearchCriterion{{FieldName: "got_radiation_ever", Value: []interface{}{true}}}, nil, nil)

		assert.Equal(t, []string{pcxPatientKey("1"), pcxPatientKey("4")}, pcxPatientKeys(patients))
	})
}

func Test_SearchPcxPatients_BooleanFilterAcceptsStringValues(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "pcx_patients"}, func(t *testing.T, env *testutils.Env) {
		// The UI sends the filter keys as strings.
		patients, _ := searchPcxPatients(t, env, []types.SearchCriterion{{FieldName: "got_radiation_ever", Value: []interface{}{"false"}}}, nil, nil)

		assert.Equal(t, []string{pcxPatientKey("2"), pcxPatientKey("3"), pcxPatientKey("5")}, pcxPatientKeys(patients))
	})
}

func Test_SearchPcxPatients_ChemotherapyAgentMatchesPatientsWhoReceivedIt(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "pcx_patients"}, func(t *testing.T, env *testutils.Env) {
		patients, _ := searchPcxPatients(t, env, []types.SearchCriterion{{FieldName: "chemotherapy_agents", Value: []interface{}{"methotrexate"}}}, nil, nil)

		assert.Equal(t, []string{pcxPatientKey("2")}, pcxPatientKeys(patients))
	})
}

func Test_SearchPcxPatients_ChemotherapyAgentsMatchAnySelectedAgent(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "pcx_patients"}, func(t *testing.T, env *testutils.Env) {
		// Patients 3 and 5 have no therapy.
		patients, _ := searchPcxPatients(t, env, []types.SearchCriterion{{FieldName: "chemotherapy_agents", Value: []interface{}{"cisplatin", "methotrexate"}}}, nil, nil)

		assert.Equal(t, []string{pcxPatientKey("2"), pcxPatientKey("1"), pcxPatientKey("4")}, pcxPatientKeys(patients))
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

func autocompletePcxPatients(t *testing.T, env *testutils.Env, prefix string, limit int) []types.AutocompleteResult {
	t.Helper()
	repo := NewPcxPatientsRepository(database.StarrocksDB{DB: env.Starrocks})
	results, err := repo.AutocompletePatients(t.Context(), prefix, limit)
	require.NoError(t, err)
	return results
}

func Test_AutocompletePcxPatients_IdentifierPrefixIsCaseInsensitive(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "pcx_patients"}, func(t *testing.T, env *testutils.Env) {
		assert.Equal(t, []types.AutocompleteResult{
			{Type: "patient_id", Value: "MRN-0001"},
			{Type: "patient_id", Value: "MRN-0002"},
		}, autocompletePcxPatients(t, env, "mrn-000", 10))
	})
}

func Test_AutocompletePcxPatients_ResearchIdsOfRestrictedPatients(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "pcx_patients"}, func(t *testing.T, env *testutils.Env) {
		assert.Equal(t, []types.AutocompleteResult{
			{Type: "patient_id", Value: "C100004"},
			{Type: "patient_id", Value: "C100005"},
		}, autocompletePcxPatients(t, env, "C1", 10))
	})
}

func Test_AutocompletePcxPatients_NamesOnlyOfIdentifiablePatients(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "pcx_patients"}, func(t *testing.T, env *testutils.Env) {
		// Patient 5 is also named Ada Lovelace but restricted; patient 4's placeholder name is never suggested.
		assert.Equal(t, []types.AutocompleteResult{
			{Type: "patient_name", Value: "Ada Lovelace"},
			{Type: "patient_name", Value: "Alan Turing"},
		}, autocompletePcxPatients(t, env, "a", 10))
		assert.Empty(t, autocompletePcxPatients(t, env, "C100004_", 10))
	})
}

func Test_AutocompletePcxPatients_NameMatchesTheStartOfAnyWord(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "pcx_patients"}, func(t *testing.T, env *testutils.Env) {
		assert.Equal(t, []types.AutocompleteResult{{Type: "patient_name", Value: "Grace Hopper"}}, autocompletePcxPatients(t, env, "HOP", 10))
		assert.Equal(t, []types.AutocompleteResult{{Type: "patient_name", Value: "Ada Lovelace"}}, autocompletePcxPatients(t, env, "ada lov", 10))
	})
}

func Test_AutocompletePcxPatients_FamilyNameOnlyOfIdentifiablePatients(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "pcx_patients"}, func(t *testing.T, env *testutils.Env) {
		// Patient 5 is also named Ada Lovelace but restricted.
		assert.Equal(t, []types.AutocompleteResult{{Type: "patient_name", Value: "Ada Lovelace"}}, autocompletePcxPatients(t, env, "lovelace", 10))
	})
}

func Test_AutocompletePcxPatients_NameDoesNotMatchInsideAWord(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "pcx_patients"}, func(t *testing.T, env *testutils.Env) {
		assert.Empty(t, autocompletePcxPatients(t, env, "velace", 10))
		assert.Empty(t, autocompletePcxPatients(t, env, "ace", 10))
	})
}

func Test_AutocompletePcxPatients_LikeWildcardsAreLiteral(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "pcx_patients"}, func(t *testing.T, env *testutils.Env) {
		assert.Empty(t, autocompletePcxPatients(t, env, "MRN_", 10))
		assert.Empty(t, autocompletePcxPatients(t, env, "%", 10))
	})
}

func Test_AutocompletePcxPatients_OrderedByValueAndCapped(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "pcx_patients"}, func(t *testing.T, env *testutils.Env) {
		assert.Equal(t, []types.AutocompleteResult{{Type: "patient_id", Value: "MRN-0001"}}, autocompletePcxPatients(t, env, "MRN", 1))
	})
}

func Test_AutocompletePcxPatients_NoMatch(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "pcx_patients"}, func(t *testing.T, env *testutils.Env) {
		results := autocompletePcxPatients(t, env, "zzz", 10)
		assert.Empty(t, results)
		assert.NotNil(t, results)
	})
}

func Test_GetPcxPatientsFilters_DistinctValuesWithoutNulls(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "pcx_patients"}, func(t *testing.T, env *testutils.Env) {
		repo := NewPcxPatientsRepository(database.StarrocksDB{DB: env.Starrocks})

		filters, err := repo.GetPatientsFilters(t.Context())

		require.NoError(t, err)
		assert.Equal(t, types.PatientFilters{
			VitalStatus: []types.FiltersValue{{Key: "alive"}, {Key: "deceased"}},
			OrganizationCode: []types.FiltersValue{
				{Key: "BCH", Label: "Boston Children's Hospital"},
				{Key: "CHOP", Label: "Children's Hospital of Philadelphia"},
				{Key: "SCH", Label: "Seattle Children's Hospital"},
			},
			CnsIntegratedDiagnosis: []types.FiltersValue{{Key: "ATRT"}, {Key: "Ependymoma"}, {Key: "Medulloblastoma"}},
			DiagnosisTypeCohort:    []types.FiltersValue{{Key: "Atypical teratoid/rhabdoid tumor"}, {Key: "Ependymoma"}, {Key: "Medulloblastoma"}},
			AgeAtInitialDxGroup: []types.FiltersValue{
				{Key: "congenital"}, {Key: "neonatal"}, {Key: "infantile"}, {Key: "childhood"}, {Key: "juvenile"},
				{Key: "young_adult"}, {Key: "middle_age"}, {Key: "senior"}, {Key: "unknown"},
			},
			ChemotherapyAgents: []types.FiltersValue{{Key: "cisplatin"}, {Key: "methotrexate"}, {Key: "vincristine"}},
			GotRadiationEver:   []types.FiltersValue{{Key: "true", Label: "Yes"}, {Key: "false", Label: "No"}},
		}, *filters)
	})
}

func Test_SearchPcxPatients_PagePastTheLastMatchStillCounts(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "pcx_patients"}, func(t *testing.T, env *testutils.Env) {
		patients, count := searchPcxPatients(t, env, nil, &types.Pagination{Limit: 10, PageIndex: 3}, nil)

		assert.Empty(t, patients)
		assert.Equal(t, int64(5), count)
	})
}

func strPtr(s string) *string {
	return &s
}

func Test_FilterValues_NullArrayIsEmpty(t *testing.T) {
	values, err := filterValues(nil)

	require.NoError(t, err)
	assert.Equal(t, []types.FiltersValue{}, values)
}

func Test_FilterValues_SkipsNullsAndEmptyKeysAndSorts(t *testing.T) {
	values, err := filterValues(strPtr(`["deceased", null, "", "alive"]`))

	require.NoError(t, err)
	assert.Equal(t, []types.FiltersValue{{Key: "alive"}, {Key: "deceased"}}, values)
}

func Test_FilterValues_InvalidJSONIsAnError(t *testing.T) {
	_, err := filterValues(strPtr(`not json`))

	assert.Error(t, err)
}

func Test_OrganizationFilterValues_NullArrayIsEmpty(t *testing.T) {
	values, err := organizationFilterValues(nil)

	require.NoError(t, err)
	assert.Equal(t, []types.FiltersValue{}, values)
}

func Test_OrganizationFilterValues_OnePerCodeSortedByName(t *testing.T) {
	values, err := organizationFilterValues(strPtr(`[["SCH", "Seattle"], [null, "Nowhere"], ["BCH", "Boston"], ["BCH", "Boston Children's"]]`))

	require.NoError(t, err)
	assert.Equal(t, []types.FiltersValue{{Key: "BCH", Label: "Boston Children's"}, {Key: "SCH", Label: "Seattle"}}, values)
}

func Test_OrganizationFilterValues_InvalidJSONIsAnError(t *testing.T) {
	_, err := organizationFilterValues(strPtr(`[1, 2]`))

	assert.Error(t, err)
}
