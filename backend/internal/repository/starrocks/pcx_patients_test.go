package starrocks

import (
	"encoding/json"
	"fmt"
	"strings"
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
		radiantID, birthYear, cohort, dx, source := 3, 2015, "Atypical teratoid/rhabdoid tumor", "ATRT", "CBTN"
		vitalDays, dxDays, survival := 4000, 1000, 3000
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

func Test_SearchPcxPatients_FilterOnChildhood(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "pcx_patients"}, func(t *testing.T, env *testutils.Env) {
		patients, _ := searchPcxPatients(t, env, []types.SearchCriterion{{FieldName: "age_at_initial_dx_group", Value: []interface{}{"childhood"}}}, nil, nil)

		assert.Equal(t, []string{pcxPatientKey("1"), pcxPatientKey("4")}, pcxPatientKeys(patients))
	})
}

func Test_SearchPcxPatients_FilterOnJuvenile(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "pcx_patients"}, func(t *testing.T, env *testutils.Env) {
		patients, _ := searchPcxPatients(t, env, []types.SearchCriterion{{FieldName: "age_at_initial_dx_group", Value: []interface{}{"juvenile"}}}, nil, nil)

		assert.Equal(t, []string{pcxPatientKey("2")}, pcxPatientKeys(patients))
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

		assert.Equal(t, []string{pcxPatientKey("2"), pcxPatientKey("1")}, pcxPatientKeys(patients))
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
			ChemotherapyAgents: []types.FiltersValue{{Key: "carboplatin"}, {Key: "cisplatin"}, {Key: "methotrexate"}, {Key: "vincristine"}},
			GotRadiationEver:   []types.FiltersValue{{Key: "true", Label: "Yes"}, {Key: "false", Label: "No"}},
		}, *filters)
	})
}

func getPcxPatient(t *testing.T, env *testutils.Env, key string) *types.PatientEntity {
	t.Helper()
	repo := NewPcxPatientsRepository(database.StarrocksDB{DB: env.Starrocks})
	patient, err := repo.GetPatient(t.Context(), key)
	require.NoError(t, err)
	return patient
}

func getPcxPatientTreatments(t *testing.T, env *testutils.Env, key string) *types.PatientTreatments {
	t.Helper()
	repo := NewPcxPatientsRepository(database.StarrocksDB{DB: env.Starrocks})
	treatments, err := repo.GetPatientTreatments(t.Context(), key)
	require.NoError(t, err)
	return treatments
}

func getPcxPatientLaboratory(t *testing.T, env *testutils.Env, key string) *types.PatientLaboratory {
	t.Helper()
	repo := NewPcxPatientsRepository(database.StarrocksDB{DB: env.Starrocks})
	laboratory, err := repo.GetPatientLaboratory(t.Context(), key)
	require.NoError(t, err)
	return laboratory
}

func getPcxPatientImaging(t *testing.T, env *testutils.Env, key string) *types.PatientImaging {
	t.Helper()
	repo := NewPcxPatientsRepository(database.StarrocksDB{DB: env.Starrocks})
	imaging, err := repo.GetPatientImaging(t.Context(), key)
	require.NoError(t, err)
	return imaging
}

func getPcxPatientGenomics(t *testing.T, env *testutils.Env, key string) *types.PatientGenomics {
	t.Helper()
	repo := NewPcxPatientsRepository(database.StarrocksDB{DB: env.Starrocks})
	genomics, err := repo.GetPatientGenomics(t.Context(), key)
	require.NoError(t, err)
	return genomics
}

func assertJSON(t *testing.T, expected string, actual any) {
	t.Helper()
	actualJSON, err := json.Marshal(actual)
	require.NoError(t, err)
	assert.JSONEq(t, expected, string(actualJSON))
}

func Test_GetPcxPatient_UnknownKeyIsNil(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "pcx_patients"}, func(t *testing.T, env *testutils.Env) {
		assert.Nil(t, getPcxPatient(t, env, "00000000-0000-4000-8000-000000000999"))
		assert.Nil(t, getPcxPatient(t, env, "not-a-key"))
	})
}

func Test_GetPcxPatientTabs_UnknownKeyIsNil(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "pcx_patients"}, func(t *testing.T, env *testutils.Env) {
		key := "00000000-0000-4000-8000-000000000999"
		assert.Nil(t, getPcxPatientTreatments(t, env, key))
		assert.Nil(t, getPcxPatientLaboratory(t, env, key))
		assert.Nil(t, getPcxPatientImaging(t, env, key))
		assert.Nil(t, getPcxPatientGenomics(t, env, key))
	})
}

func Test_GetPcxPatient_EveryPartOfAPatientWithPhiAccess(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "pcx_patients"}, func(t *testing.T, env *testutils.Env) {
		patient := getPcxPatient(t, env, pcxPatientKey("1"))

		require.NotNil(t, patient)
		assertJSON(t, `{
			"patient_key": "00000000-0000-4000-8000-000000000001", "patient_id": "MRN-0002", "patient_id_type": "mrn",
			"can_read_phi": true, "radiant_patient_id": 3, "organization_code": "CHOP",
			"organization_name": "Children's Hospital of Philadelphia", "given_name": "Ada", "family_name": "Lovelace",
			"birth_year": 2015, "gender": "female", "cns_integrated_diagnosis": "ATRT", "cns_integrated_diagnosis_source": "CBTN",
			"vital_status": "alive",
			"birth_date": "2015-03-04", "race": "White", "ethnicity": "Not Hispanic or Latino", "postal_code": "19104",
			"diagnosis_type_cohort": "Atypical teratoid/rhabdoid tumor", "data_type_cohort": "radiant",
			"key_dates": {
				"initial_diagnosis": {"day": 1000, "date": "2017-11-29", "source": "clinical"},
				"latest_encounter": {"day": 4000, "date": "2026-01-10", "source": "registry"}
			},
			"initial_diagnosis_evidence_url": null,
			"vital_status_at": {"day": 4000, "date": "2026-01-10"},
			"events": [
				{"day": 1000, "date": "2017-11-29", "event_type": "initial_cns_tumor", "cns_diagnosis_category": "Atypical teratoid/rhabdoid tumor",
				 "cns_integrated_diagnosis": "ATRT", "cns_integrated_diagnosis_source": "CBTN", "tumor_locations": ["Ventricles", "Spine NOS"],
				 "tumor_location_other": "Not Applicable", "metastasis": "No", "metastasis_locations": [], "metastasis_location_other": "Not Applicable"},
				{"day": 2500, "date": "2021-11-14", "event_type": "progressive", "cns_diagnosis_category": "Atypical teratoid/rhabdoid tumor",
				 "cns_integrated_diagnosis": "ATRT", "cns_integrated_diagnosis_source": "CBTN", "tumor_locations": ["Cerebellum/Posterior Fossa"],
				 "tumor_location_other": "Not Applicable", "metastasis": "Yes", "metastasis_locations": ["Brain", "Spine"], "metastasis_location_other": null},
				{"day": null, "date": null, "event_type": "not_reported", "cns_diagnosis_category": "Not Reported",
				 "cns_integrated_diagnosis": null, "cns_integrated_diagnosis_source": "CBTN", "tumor_locations": [],
				 "tumor_location_other": "Not Applicable", "metastasis": "Not Reported", "metastasis_locations": [], "metastasis_location_other": "Not Applicable"}
			],
			"treatment_summary": {
				"initial_dx": {"day": 1000, "date": "2017-11-29"}, "first_event": {"day": 1000, "date": "2017-11-29"},
				"first_radiation_ever": {"day": 1047, "date": "2018-01-15"}, "initial_radiation": {"day": 1047, "date": "2018-01-15"},
				"first_chemo_ever": {"day": 1021, "date": "2017-12-20"}, "initial_chemo": {"day": 1021, "date": "2017-12-20"},
				"first_methotrexate_ever": {"day": null, "date": null},
				"had_initial_radiation": true, "had_initial_chemo": true, "had_initial_methotrexate": false,
				"initial_treatment_order": "chemo_before_radiation"
			}
		}`, patient)
	})
}

func Test_GetPcxPatientTreatments_EveryTreatmentOfAPatientWithPhiAccess(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "pcx_patients"}, func(t *testing.T, env *testutils.Env) {
		treatments := getPcxPatientTreatments(t, env, pcxPatientKey("1"))

		require.NotNil(t, treatments)
		assertJSON(t, `{
			"surgeries": [
				{"day": 1002, "date": "2017-12-01", "extent_of_tumor_resection": "Gross/Near total resection", "is_initial_treatment": true},
				{"day": null, "date": null, "extent_of_tumor_resection": "Partial resection", "is_initial_treatment": false}
			],
			"radiations": [
				{"start": {"day": 1047, "date": "2018-01-15"}, "stop": {"day": 1092, "date": "2018-03-01"},
				 "site": "Craniospinal with focal boost", "site_other": "Not Applicable", "type": "Protons", "type_other": "Not Applicable",
				 "craniospinal_dose": {"value": "3600", "unit": "cGy"}, "total_primary_dose": {"value": "5400", "unit": "cGy"},
				 "focal_boost_dose": {"value": "1800", "unit": "cGy"}, "is_initial_treatment": true},
				{"start": {"day": null, "date": null}, "stop": {"day": null, "date": null},
				 "site": "Focal/Tumor bed", "site_other": "Not Applicable", "type": "Photons", "type_other": "Not Applicable",
				 "craniospinal_dose": {"value": "Not Applicable", "unit": "Not Applicable"}, "total_primary_dose": {"value": "5040", "unit": "Gy"},
				 "focal_boost_dose": null, "is_initial_treatment": false}
			],
			"therapies": [
				{"start": {"day": 1021, "date": "2017-12-20"}, "stop": {"day": 1184, "date": "2018-06-01"},
				 "protocol_name_and_arm": "ACNS0333: Arm I", "protocol_name": "ACNS0333", "protocol_arm": "Arm I",
				 "chemotherapy_type": "Treatment follows a protocol and subject is enrolled on a protocol",
				 "chemotherapy_agents": ["carboplatin", "methotrexate", "vincristine"], "is_initial_treatment": true}
			],
			"trial_enrollments": [
				{"start": {"day": 1021, "date": "2017-12-20"}, "stop": {"day": 1184, "date": "2018-06-01"},
				 "protocol_name": "ACNS0333", "protocol_arm": "Arm I",
				 "chemotherapy_agents": ["carboplatin", "methotrexate", "vincristine"], "is_initial_treatment": true}
			]
		}`, treatments)
	})
}

func Test_GetPcxPatientImaging_SessionsOfAPatientWithPhiAccess(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "pcx_patients"}, func(t *testing.T, env *testutils.Env) {
		imaging := getPcxPatientImaging(t, env, pcxPatientKey("1"))

		require.NotNil(t, imaging)
		assertJSON(t, `{
			"sessions": [
				{"day": 999, "date": "2017-11-28", "session_id": "ses-1", "session_name": "MRI Brain", "anatomical_site": "Brain",
				 "imaging_modality": "MR", "flywheel_url": "https://flywheel.example/ses-1"},
				{"day": 1525, "date": "2019-02-01", "session_id": "ses-2", "session_name": "MRI Brain w/wo", "anatomical_site": "Brain",
				 "imaging_modality": "MR", "flywheel_url": "https://flywheel.example/ses-2"}
			]
		}`, imaging)
	})
}

func Test_GetPcxPatientLaboratory_LatestResultsOfAPatientWithPhiAccess(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "pcx_patients"}, func(t *testing.T, env *testutils.Env) {
		laboratory := getPcxPatientLaboratory(t, env, pcxPatientKey("1"))

		require.NotNil(t, laboratory)
		assertJSON(t, `{
			"cbc": {
				"day": 3960, "date": "2025-12-01",
				"wbc": {"value": 6.2, "unit": "10*3/uL"},
				"hemoglobin": {"value": 11.8, "unit": "g/dL"},
				"platelets": {"value": 245, "unit": "10*3/uL"},
				"anc": {"value": 2.9, "unit": "x10E9/L"}
			},
			"performance_status": [
				{"day": 3961, "date": "2025-12-02", "scale": "lansky", "score": 90,
				 "score_text": "90 - Minor restrictions in strenuous physical activity"}
			],
			"csf": {
				"protein": {"day": 3786, "date": "2025-06-10", "display": "<10 mg/dL", "value": 10, "comparator": "<", "unit": "mg/dL"},
				"glucose": {"day": 3786, "date": "2025-06-10", "display": "55 mg/dL", "value": 55, "comparator": null, "unit": "mg/dL"},
				"wbc": {"day": 3786, "date": "2025-06-10", "display": "2 /uL", "value": 2, "comparator": null, "unit": "/uL"},
				"rbc": {"day": null, "date": null, "display": null, "value": null, "comparator": null, "unit": null},
				"cytology": {"day": 3687, "date": "2025-03-01", "test_name": "Cytology, CSF", "malignant_cells": "negative",
				 "evidence_tier": "named", "multi_specimen_report": false},
				"cell_free_dna": {"day": 3687, "date": "2025-03-01"}
			}
		}`, laboratory)
	})
}

func Test_GetPcxPatient_HeaderMatchesTheList(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "pcx_patients"}, func(t *testing.T, env *testutils.Env) {
		listed, _ := searchPcxPatients(t, env, nil, nil, nil)
		for _, item := range listed {
			if item.PatientKey == pcxPatientKey("3") || item.PatientKey == pcxPatientKey("5") {
				continue // their list rows hold values the hand-written view fixtures do not back
			}
			patient := getPcxPatient(t, env, item.PatientKey)

			require.NotNil(t, patient, item.PatientKey)
			assert.Equal(t, item.PatientIdentity, patient.PatientIdentity, item.PatientKey)
			assert.Equal(t, item.BirthYear, patient.BirthYear, item.PatientKey)
			assert.Equal(t, item.Gender, patient.Gender, item.PatientKey)
			assert.Equal(t, item.DiagnosisTypeCohort, patient.DiagnosisTypeCohort, item.PatientKey)
			assert.Equal(t, item.CnsIntegratedDiagnosis, patient.CnsIntegratedDiagnosis, item.PatientKey)
			assert.Equal(t, item.CnsIntegratedDiagnosisSource, patient.CnsIntegratedDiagnosisSource, item.PatientKey)
			assert.Equal(t, item.VitalStatus, patient.VitalStatus, item.PatientKey)
		}
	})
}

func Test_GetPcxPatient_GenderIsTheApiCode(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "pcx_patients"}, func(t *testing.T, env *testutils.Env) {
		patient := getPcxPatient(t, env, pcxPatientKey("5"))

		require.NotNil(t, patient)
		assert.Equal(t, "not_reported", patient.Gender)
	})
}

func pcxInitialEventFixture(day *int, diagnosis *string) types.PatientEvent {
	return types.PatientEvent{PatientDayDate: types.PatientDayDate{Day: day}, EventType: "initial_cns_tumor", CnsIntegratedDiagnosis: diagnosis}
}

func Test_PcxInitialEvent_NoInitialEventIsNil(t *testing.T) {
	events := []types.PatientEvent{{PatientDayDate: types.PatientDayDate{Day: ptr(10)}, EventType: "progressive"}}

	assert.Nil(t, pcxInitialEvent(events))
}

func Test_PcxInitialEvent_EarliestKnownDayWins(t *testing.T) {
	events := []types.PatientEvent{
		pcxInitialEventFixture(ptr(200), ptr("A")),
		{PatientDayDate: types.PatientDayDate{Day: ptr(50)}, EventType: "progressive", CnsIntegratedDiagnosis: ptr("B")},
		pcxInitialEventFixture(ptr(100), ptr("C")),
	}

	assert.Equal(t, ptr("C"), pcxInitialEvent(events).CnsIntegratedDiagnosis)
}

func Test_PcxInitialEvent_UnknownDayLosesToKnownDay(t *testing.T) {
	events := []types.PatientEvent{pcxInitialEventFixture(nil, ptr("A")), pcxInitialEventFixture(ptr(300), ptr("B"))}

	assert.Equal(t, ptr("B"), pcxInitialEvent(events).CnsIntegratedDiagnosis)
}

func Test_PcxInitialEvent_UnknownDayIsKeptWhenAlone(t *testing.T) {
	events := []types.PatientEvent{pcxInitialEventFixture(nil, ptr("A"))}

	assert.Equal(t, ptr("A"), pcxInitialEvent(events).CnsIntegratedDiagnosis)
}

func Test_PcxInitialEvent_SameDaySortsOnDiagnosisNullFirst(t *testing.T) {
	events := []types.PatientEvent{
		pcxInitialEventFixture(ptr(100), ptr("Medulloblastoma")),
		pcxInitialEventFixture(ptr(100), ptr("ATRT")),
		pcxInitialEventFixture(ptr(100), nil),
	}

	assert.Nil(t, pcxInitialEvent(events).CnsIntegratedDiagnosis)
	assert.Equal(t, ptr("ATRT"), pcxInitialEvent(events[:2]).CnsIntegratedDiagnosis)
}

func Test_GetPcxPatient_RestrictedPatientHasNoDates(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "pcx_patients"}, func(t *testing.T, env *testutils.Env) {
		patient := getPcxPatient(t, env, pcxPatientKey("4"))

		require.NotNil(t, patient)
		assert.Equal(t, "C100004", patient.PatientID)
		assert.Equal(t, "research_id", patient.PatientIDType)
		assert.Nil(t, patient.BirthDate)
		assert.Equal(t, types.PatientDayDate{Day: ptr(3000)}, patient.VitalStatusAt)
		require.Len(t, patient.Events, 1)
		assert.Equal(t, types.PatientDayDate{Day: ptr(1000)}, patient.Events[0].PatientDayDate)
		assert.Equal(t, types.PatientKeyDate{PatientDayDate: types.PatientDayDate{Day: ptr(1000)}, Source: "clinical"}, patient.KeyDates.InitialDiagnosis)
		assert.Equal(t, types.PatientKeyDate{PatientDayDate: types.PatientDayDate{Day: ptr(3000)}, Source: "registry"}, patient.KeyDates.LatestEncounter)
	})
}

func Test_GetPcxPatientTreatments_RestrictedPatientHasNoDates(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "pcx_patients"}, func(t *testing.T, env *testutils.Env) {
		treatments := getPcxPatientTreatments(t, env, pcxPatientKey("4"))

		require.NotNil(t, treatments)
		require.Len(t, treatments.Surgeries, 1)
		assert.Equal(t, ptr(1003), treatments.Surgeries[0].Day)
		assert.Nil(t, treatments.Surgeries[0].Date)
	})
}

func Test_GetPcxPatientLaboratory_RestrictedPatientLabsHaveNoDates(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "pcx_patients"}, func(t *testing.T, env *testutils.Env) {
		laboratory := getPcxPatientLaboratory(t, env, pcxPatientKey("4"))

		require.NotNil(t, laboratory)
		assertJSON(t, `{
			"cbc": {
				"day": 2900, "date": null,
				"wbc": {"value": 4.1, "unit": "10*3/uL"},
				"hemoglobin": {"value": null, "unit": null},
				"platelets": {"value": 180, "unit": "10*3/uL"},
				"anc": {"value": 1500, "unit": "/uL"}
			},
			"performance_status": [
				{"day": 2950, "date": null, "scale": "karnofsky", "score": 70,
				 "score_text": "70 - Cares for self, unable to carry on normal activity"}
			],
			"csf": {
				"protein": {"day": 2920, "date": null, "display": "38 mg/dL", "value": 38, "comparator": null, "unit": "mg/dL"},
				"glucose": {"day": null, "date": null, "display": null, "value": null, "comparator": null, "unit": null},
				"wbc": {"day": 2920, "date": null, "display": "12 /uL", "value": 12, "comparator": null, "unit": "/uL"},
				"rbc": {"day": 2920, "date": null, "display": "150 /uL", "value": 150, "comparator": null, "unit": "/uL"},
				"cytology": {"day": 2925, "date": null, "test_name": "Body Fluid Cytology", "malignant_cells": "suspicious",
				 "evidence_tier": "text_confirmed", "multi_specimen_report": true},
				"cell_free_dna": {"day": null, "date": null}
			}
		}`, laboratory)
	})
}

func Test_GetPcxPatientLaboratory_UnknownPerformanceScaleIsSkipped(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "pcx_patients"}, func(t *testing.T, env *testutils.Env) {
		laboratory := getPcxPatientLaboratory(t, env, pcxPatientKey("2"))

		require.NotNil(t, laboratory)
		assert.Equal(t, []types.PatientPerformanceScore{}, laboratory.PerformanceStatus)
	})
}

func Test_GetPcxPatient_PatientWithoutClinicalDataHasEmptyLists(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "pcx_patients", Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		key := pcxPatientKey("3")
		patient := getPcxPatient(t, env, key)
		treatments := getPcxPatientTreatments(t, env, key)
		laboratory := getPcxPatientLaboratory(t, env, key)
		imaging := getPcxPatientImaging(t, env, key)
		genomics := getPcxPatientGenomics(t, env, key)

		require.NotNil(t, patient)
		assertJSON(t, `{"Events": [], "TreatmentSummary": null, "VitalStatusAt": {"day": null, "date": null}}`, struct {
			Events, TreatmentSummary any
			VitalStatusAt            types.PatientDayDate
		}{patient.Events, patient.TreatmentSummary, patient.VitalStatusAt})
		assertJSON(t, `{"surgeries": [], "radiations": [], "therapies": [], "trial_enrollments": []}`, treatments)
		assertJSON(t, `{"cbc": null, "performance_status": [], "csf": null}`, laboratory)
		assertJSON(t, `{"sessions": []}`, imaging)
		assertJSON(t, `{"cases": [], "interpretations": []}`, genomics)
	})
}

func pcxCaseRelationships(cases []types.PatientCase) map[int]string {
	relationships := map[int]string{}
	for _, c := range cases {
		relationships[c.CaseID] = c.Relationship
	}
	return relationships
}

func Test_GetPcxPatientGenomics_CasesAsProbandAreListedOnce(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "pcx_patients", Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		// Portal patient 3 is the proband of cases 1 and 70, and the family table lists it in both as well.
		genomics := getPcxPatientGenomics(t, env, pcxPatientKey("1"))

		require.NotNil(t, genomics)
		assert.Len(t, genomics.Cases, 2)
		assert.Equal(t, map[int]string{1: "proband", 70: "proband"}, pcxCaseRelationships(genomics.Cases))
		for _, c := range genomics.Cases {
			switch c.CaseID {
			case 1:
				assert.Equal(t, "in_progress", c.StatusCode)
				assert.Equal(t, ptr("routine"), c.PriorityCode)
				assert.Equal(t, "germline", c.CaseTypeCode)
				assert.Equal(t, "germline_family", c.CaseType, "case 1 has three members")
				assert.Equal(t, ptr("WGA"), c.AnalysisCatalogCode)
				assert.Equal(t, ptr("Whole Genome Analysis"), c.AnalysisCatalogName)
				assert.Equal(t, ptr("MONDO:0700092"), c.PrimaryConditionID)
				assert.Equal(t, ptr("neurodevelopmental disorder"), c.PrimaryConditionName)
				assert.Equal(t, ptr("CHUSJ"), c.OrderingOrganizationCode)
				assert.Equal(t, ptr("Centre hospitalier universitaire Sainte-Justine"), c.OrderingOrganizationName)
				assert.Equal(t, "CQGC", c.DiagnosisLabCode)
				assert.False(t, c.UpdatedOn.IsZero())
			case 70:
				assert.Equal(t, "germline_family", c.CaseType, "case 70 is a trio")
				assert.Equal(t, ptr("CHOP"), c.OrderingOrganizationCode)
				assert.Equal(t, ptr("Children Hospital of Philadelphia"), c.OrderingOrganizationName)
			}
		}
	})
}

func Test_GetPcxPatientGenomics_SoloGermlineCase(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "pcx_patients", Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		// Portal patient 22 is the only member of case 8.
		genomics := getPcxPatientGenomics(t, env, pcxPatientKey("4"))

		require.NotNil(t, genomics)
		require.Len(t, genomics.Cases, 1)
		assert.Equal(t, 8, genomics.Cases[0].CaseID)
		assert.Equal(t, "germline", genomics.Cases[0].CaseType)
	})
}

func Test_GetPcxPatientGenomics_CasesAsFamilyMember(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "pcx_patients", Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		genomics := getPcxPatientGenomics(t, env, pcxPatientKey("2"))

		require.NotNil(t, genomics)
		assert.Equal(t, map[int]string{4: "father"}, pcxCaseRelationships(genomics.Cases))
	})
}

func Test_SearchPcxPatients_PagePastTheLastMatchStillCounts(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "pcx_patients"}, func(t *testing.T, env *testutils.Env) {
		patients, count := searchPcxPatients(t, env, nil, &types.Pagination{Limit: 10, PageIndex: 3}, nil)

		assert.Empty(t, patients)
		assert.Equal(t, int64(5), count)
	})
}

func Test_FilterValues_NullArrayIsEmpty(t *testing.T) {
	values, err := filterValues(nil)

	require.NoError(t, err)
	assert.Equal(t, []types.FiltersValue{}, values)
}

func Test_FilterValues_SkipsNullsAndEmptyKeysAndSorts(t *testing.T) {
	values, err := filterValues(ptr(`["deceased", null, "", "alive"]`))

	require.NoError(t, err)
	assert.Equal(t, []types.FiltersValue{{Key: "alive"}, {Key: "deceased"}}, values)
}

func Test_FilterValues_InvalidJSONIsAnError(t *testing.T) {
	_, err := filterValues(ptr(`not json`))

	assert.Error(t, err)
}

func Test_OrganizationFilterValues_NullArrayIsEmpty(t *testing.T) {
	values, err := organizationFilterValues(nil)

	require.NoError(t, err)
	assert.Equal(t, []types.FiltersValue{}, values)
}

func Test_OrganizationFilterValues_OnePerCodeSortedByName(t *testing.T) {
	values, err := organizationFilterValues(ptr(`[["SCH", "Seattle"], [null, "Nowhere"], ["BCH", "Boston"], ["BCH", "Boston Children's"]]`))

	require.NoError(t, err)
	assert.Equal(t, []types.FiltersValue{{Key: "BCH", Label: "Boston Children's"}, {Key: "SCH", Label: "Seattle"}}, values)
}

func Test_OrganizationFilterValues_InvalidJSONIsAnError(t *testing.T) {
	_, err := organizationFilterValues(ptr(`[1, 2]`))

	assert.Error(t, err)
}

func Test_GetPcxPatientGenomics_InterpretationsOfItsCases(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "pcx_patients", Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		// Case 1 carries 3 germline and 3 somatic interpretations of locus 1000, on transcripts T001 and T002.
		genomics := getPcxPatientGenomics(t, env, pcxPatientKey("1"))

		require.NotNil(t, genomics)
		actual, err := json.Marshal(genomics.Interpretations)
		require.NoError(t, err)
		row := func(origin string, seq int, transcript, classification, updatedAt string) string {
			aa := map[string]string{"T001": "p.Val600Glu", "T002": "p.Val640Glu"}[transcript]
			return fmt.Sprintf(`{"origin": %q, "case_id": 1, "sequencing_id": %d, "locus_id": "1000", "hgvsg": "chr7:g.140753336A>T",
				"symbol": "BRAF", "aa_change": %q, "classification": %q, "analysis_catalog_code": "WGA",
				"analysis_catalog_name": "Whole Genome Analysis", "updated_at": %q}`, origin, seq, aa, classification, updatedAt)
		}
		assert.JSONEq(t, "["+strings.Join([]string{
			row("germline", 1, "T002", "LA6675-8", "2025-06-30T15:51:29Z"),
			row("somatic", 1, "T002", "Oncogenic", "2025-06-30T15:51:29Z"),
			row("germline", 2, "T001", "LA26332-9", "2025-06-27T19:51:00Z"),
			row("somatic", 2, "T001", "Likely Oncogenic", "2025-06-27T19:51:00Z"),
			row("germline", 1, "T001", "LA6668-3", "2025-05-23T14:57:36Z"),
			row("somatic", 1, "T001", "Oncogenic", "2025-05-23T14:57:36Z"),
		}, ",")+"]", string(actual))
	})
}

func Test_GetPcxPatientGenomics_NoInterpretationsOnItsCases(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "pcx_patients", Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		genomics := getPcxPatientGenomics(t, env, pcxPatientKey("2"))

		require.NotNil(t, genomics)
		assert.NotEmpty(t, genomics.Cases)
		assert.Equal(t, []types.PatientInterpretation{}, genomics.Interpretations)
	})
}
