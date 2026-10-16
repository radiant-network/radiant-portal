package starrocks

import (
	"encoding/json"
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
		radiantID, birthYear, dx, source := 3, 2015, "ATRT", "CBTN"
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

func Test_GetPcxPatient_UnknownKeyIsNil(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "pcx_patients", Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		assert.Nil(t, getPcxPatient(t, env, "00000000-0000-4000-8000-000000000999"))
		assert.Nil(t, getPcxPatient(t, env, "not-a-key"))
	})
}

func Test_GetPcxPatient_EveryPartOfAPatientWithPhiAccess(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "pcx_patients", Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		patient := getPcxPatient(t, env, pcxPatientKey("1"))

		require.NotNil(t, patient)
		patient.Cases = nil // asserted in Test_GetPcxPatient_Cases*
		actual, err := json.Marshal(patient)
		require.NoError(t, err)
		assert.JSONEq(t, `{
			"patient_key": "00000000-0000-4000-8000-000000000001", "patient_id": "MRN-0002", "patient_id_type": "mrn",
			"can_read_phi": true, "radiant_patient_id": 3, "organization_code": "CHOP",
			"organization_name": "Children's Hospital of Philadelphia", "given_name": "Ada", "family_name": "Lovelace",
			"birth_year": 2015, "gender": "female", "cns_integrated_diagnosis": "ATRT", "cns_integrated_diagnosis_source": "CBTN",
			"vital_status": "alive", "age_at_vital_status_days": 4000, "age_at_initial_dx_days": 1000, "survival_days": 3000,
			"has_imaging": true, "case_count": 2,
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
			"imaging": [
				{"day": 999, "date": "2017-11-28", "session_id": "ses-1", "session_name": "MRI Brain", "anatomical_site": "Brain",
				 "imaging_modality": "MR", "flywheel_url": "https://flywheel.example/ses-1"},
				{"day": 1525, "date": "2019-02-01", "session_id": "ses-2", "session_name": "MRI Brain w/wo", "anatomical_site": "Brain",
				 "imaging_modality": "MR", "flywheel_url": "https://flywheel.example/ses-2"}
			],
			"treatment_summary": {
				"initial_dx": {"day": 1000, "date": "2017-11-29"}, "first_event": {"day": 1000, "date": "2017-11-29"},
				"first_radiation_ever": {"day": 1047, "date": "2018-01-15"}, "initial_radiation": {"day": 1047, "date": "2018-01-15"},
				"first_chemo_ever": {"day": 1021, "date": "2017-12-20"}, "initial_chemo": {"day": 1021, "date": "2017-12-20"},
				"first_methotrexate_ever": {"day": null, "date": null},
				"had_initial_radiation": true, "had_initial_chemo": true, "had_initial_methotrexate": false,
				"initial_treatment_order": "chemo_before_radiation"
			},
			"cases": null
		}`, string(actual))
	})
}

func Test_GetPcxPatient_RestrictedPatientHasNoDates(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "pcx_patients", Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
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
		require.Len(t, patient.Surgeries, 1)
		assert.Nil(t, patient.Surgeries[0].Date)
	})
}

func Test_GetPcxPatient_PatientWithoutClinicalDataHasEmptyLists(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "pcx_patients", Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		patient := getPcxPatient(t, env, pcxPatientKey("3"))

		require.NotNil(t, patient)
		actual, err := json.Marshal(struct {
			Events, Surgeries, Radiations, Therapies, Imaging, Cases any
			TreatmentSummary                                         any
			VitalStatusAt                                            types.PatientDayDate
		}{patient.Events, patient.Surgeries, patient.Radiations, patient.Therapies, patient.Imaging, patient.Cases,
			patient.TreatmentSummary, patient.VitalStatusAt})
		require.NoError(t, err)
		assert.JSONEq(t, `{"Events": [], "Surgeries": [], "Radiations": [], "Therapies": [], "Imaging": [], "Cases": [],
			"TreatmentSummary": null, "VitalStatusAt": {"day": null, "date": null}}`, string(actual))
	})
}

func pcxCaseRelationships(cases []types.PatientCase) map[int]string {
	relationships := map[int]string{}
	for _, c := range cases {
		relationships[c.CaseID] = c.Relationship
	}
	return relationships
}

func Test_GetPcxPatient_CasesAsProbandAreListedOnce(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "pcx_patients", Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		// Portal patient 3 is the proband of cases 1 and 70, and the family table lists it in both as well.
		patient := getPcxPatient(t, env, pcxPatientKey("1"))

		require.NotNil(t, patient)
		assert.Len(t, patient.Cases, 2)
		assert.Equal(t, map[int]string{1: "proband", 70: "proband"}, pcxCaseRelationships(patient.Cases))
		for _, c := range patient.Cases {
			if c.CaseID == 1 {
				assert.Equal(t, "in_progress", c.StatusCode)
				assert.Equal(t, ptr("routine"), c.PriorityCode)
				assert.Equal(t, "germline", c.CaseTypeCode)
				assert.Equal(t, ptr("WGA"), c.AnalysisCatalogCode)
				assert.Equal(t, "CQGC", c.DiagnosisLabCode)
				assert.False(t, c.UpdatedOn.IsZero())
			}
		}
	})
}

func Test_GetPcxPatient_CasesAsFamilyMember(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "pcx_patients", Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		patient := getPcxPatient(t, env, pcxPatientKey("2"))

		require.NotNil(t, patient)
		assert.Equal(t, map[int]string{4: "father"}, pcxCaseRelationships(patient.Cases))
	})
}
