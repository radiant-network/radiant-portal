package starrocks

import (
	"testing"

	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func ptr[T any](v T) *T {
	return &v
}

func Test_pcxDay_KeepsNonNegativeIntegers(t *testing.T) {
	assert.Equal(t, ptr(0), pcxDay(ptr("0")))
	assert.Equal(t, ptr(4012), pcxDay(ptr(" 4012 ")))
}

func Test_pcxDay_SentinelsAreNil(t *testing.T) {
	for _, value := range []string{"-1", "", "Not Reported", "Not Available", "Not Applicable", "12.5"} {
		assert.Nil(t, pcxDay(ptr(value)), value)
	}
	assert.Nil(t, pcxDay(nil))
}

func Test_pcxYesNo_YesAndNo(t *testing.T) {
	assert.Equal(t, ptr(true), pcxYesNo(ptr("yes")))
	assert.Equal(t, ptr(false), pcxYesNo(ptr("No")))
}

func Test_pcxYesNo_AnythingElseIsNil(t *testing.T) {
	assert.Nil(t, pcxYesNo(ptr("Not Reported")))
	assert.Nil(t, pcxYesNo(ptr("")))
	assert.Nil(t, pcxYesNo(nil))
}

func Test_pcxList_SplitsAndTrims(t *testing.T) {
	assert.Equal(t, []string{"Spine NOS", "Temporal Lobe", "Ventricles"}, pcxList(ptr("Spine NOS; Temporal Lobe;;Ventricles"), ";"))
	assert.Equal(t, []string{"carboplatin", "cisplatin"}, pcxList(ptr("carboplatin,cisplatin"), ","))
}

func Test_pcxList_NotApplicableAndNilAreEmpty(t *testing.T) {
	assert.Equal(t, []string{}, pcxList(ptr("Not Applicable"), ";"))
	assert.Equal(t, []string{}, pcxList(nil, ";"))
}

func Test_pcxList_OtherSentinelsAreKept(t *testing.T) {
	assert.Equal(t, []string{"Unavailable"}, pcxList(ptr("Unavailable"), ";"))
}

func Test_pcxEventType_EveryKnownValue(t *testing.T) {
	for source, code := range map[string]string{
		"Initial CNS Tumor": "initial_cns_tumor", "Progressive": "progressive", "Recurrence": "recurrence",
		"Second Malignancy": "second_malignancy", "Deceased": "deceased", "Unavailable": "unavailable", "Not Reported": "not_reported",
	} {
		got, err := pcxEventType(ptr(source))
		require.NoError(t, err, source)
		assert.Equal(t, code, got, source)
	}
}

func Test_pcxEventType_UnknownIsAnError(t *testing.T) {
	_, err := pcxEventType(ptr("Relapse"))
	assert.ErrorContains(t, err, `unknown event type "Relapse"`)
}

func Test_pcxEventType_MissingIsAnError(t *testing.T) {
	_, err := pcxEventType(nil)
	assert.Error(t, err)
}

func Test_pcxPerformanceScale_EveryKnownValue(t *testing.T) {
	for source, code := range map[string]string{"Lansky": "lansky", "Karnofsky": "karnofsky", " KARNOFSKY ": "karnofsky"} {
		got, err := pcxPerformanceScale(ptr(source))
		require.NoError(t, err, source)
		assert.Equal(t, code, got, source)
	}
}

func Test_pcxPerformanceScale_UnknownIsAnError(t *testing.T) {
	_, err := pcxPerformanceScale(ptr("ECOG"))
	assert.ErrorContains(t, err, `unknown performance status scale "ECOG"`)
}

func Test_pcxPerformanceScale_EmptyIsAnError(t *testing.T) {
	_, err := pcxPerformanceScale(ptr(""))
	assert.ErrorContains(t, err, `unknown performance status scale ""`)
}

func Test_pcxPerformanceScale_MissingIsAnError(t *testing.T) {
	_, err := pcxPerformanceScale(nil)
	assert.Error(t, err)
}

func dose(value, unit string) types.PatientDose {
	return types.PatientDose{Value: &value, Unit: &unit}
}

func Test_pcxFocalBoost_PrimaryMinusCraniospinal(t *testing.T) {
	assert.Equal(t, &types.PatientDose{Value: ptr("1800"), Unit: ptr("cGy")}, pcxFocalBoost(dose("3600", "cGy"), dose("5400", "cGy")))
	assert.Equal(t, &types.PatientDose{Value: ptr("18.5"), Unit: ptr("Gy")}, pcxFocalBoost(dose("36", "Gy"), dose("54.5", "Gy")))
}

func Test_pcxFocalBoost_DifferentUnitsIsNil(t *testing.T) {
	assert.Nil(t, pcxFocalBoost(dose("36", "Gy"), dose("5400", "cGy")))
}

func Test_pcxFocalBoost_NonNumericIsNil(t *testing.T) {
	assert.Nil(t, pcxFocalBoost(dose("Not Applicable", "Not Applicable"), dose("5400", "Not Applicable")))
	assert.Nil(t, pcxFocalBoost(types.PatientDose{}, dose("5400", "cGy")))
}

func event(eventType string, day *int) types.PatientEvent {
	return types.PatientEvent{EventType: eventType, PatientDayDate: types.PatientDayDate{Day: day}}
}

func Test_pcxKeyDates_InitialDiagnosisFromTheSummaryWhenKnown(t *testing.T) {
	summary := &types.PatientTreatmentSummary{InitialDx: types.PatientDayDate{Day: ptr(900)}}
	keyDates := pcxKeyDates(summary, []types.PatientEvent{event("initial_cns_tumor", ptr(1000))}, types.PatientDayDate{})

	assert.Equal(t, types.PatientKeyDate{PatientDayDate: types.PatientDayDate{Day: ptr(900)}, Source: "clinical"}, keyDates.InitialDiagnosis)
}

func Test_pcxKeyDates_InitialDiagnosisFromTheFirstKnownInitialEventOtherwise(t *testing.T) {
	summary := &types.PatientTreatmentSummary{}
	events := []types.PatientEvent{event("initial_cns_tumor", ptr(1000)), event("initial_cns_tumor", ptr(1500)), event("initial_cns_tumor", nil)}

	assert.Equal(t, ptr(1000), pcxKeyDates(summary, events, types.PatientDayDate{}).InitialDiagnosis.Day)
	assert.Equal(t, ptr(1000), pcxKeyDates(nil, events, types.PatientDayDate{}).InitialDiagnosis.Day)
}

func Test_pcxKeyDates_LatestEncounterIsTheVitalStatus(t *testing.T) {
	events := []types.PatientEvent{event("initial_cns_tumor", ptr(1000)), event("progressive", ptr(5000))}
	vitalStatusAt := types.PatientDayDate{Day: ptr(4000)}

	assert.Equal(t, types.PatientKeyDate{PatientDayDate: vitalStatusAt, Source: "registry"}, pcxKeyDates(nil, events, vitalStatusAt).LatestEncounter)
}

func Test_pcxKeyDates_NoKnownDay(t *testing.T) {
	keyDates := pcxKeyDates(nil, []types.PatientEvent{event("unavailable", nil)}, types.PatientDayDate{})

	assert.Nil(t, keyDates.InitialDiagnosis.Day)
	assert.Nil(t, keyDates.LatestEncounter.Day)
	assert.Equal(t, "clinical", keyDates.InitialDiagnosis.Source)
	assert.Equal(t, "registry", keyDates.LatestEncounter.Source)
}

func enrolledTherapy(nameAndArm, name, arm string, start, stop *int, agents ...string) types.PatientTherapy {
	return types.PatientTherapy{
		Start: types.PatientDayDate{Day: start}, Stop: types.PatientDayDate{Day: stop},
		ProtocolNameAndArm: ptr(nameAndArm), ProtocolName: ptr(name), ProtocolArm: ptr(arm),
		ChemotherapyType:   ptr("Treatment follows a protocol and subject is enrolled on a protocol"),
		ChemotherapyAgents: agents,
	}
}

func Test_pcxTrialEnrollments_KeepsOnlyEnrolledTherapies(t *testing.T) {
	followed := enrolledTherapy("ACNS0333: Arm I", "ACNS0333", "Arm I", ptr(100), ptr(200))
	followed.ChemotherapyType = ptr("Treatment follows a protocol but subject is not enrolled")
	standard := enrolledTherapy("Not Applicable", "Not Applicable", "Not Applicable", ptr(100), ptr(200))
	standard.ChemotherapyType = ptr("Treatment follows other standard of care not associated with a current or past protocol")
	missing := enrolledTherapy("ACNS0333: Arm I", "ACNS0333", "Arm I", ptr(100), ptr(200))
	missing.ChemotherapyType = nil

	assert.Equal(t, []types.PatientTrialEnrollment{}, pcxTrialEnrollments([]types.PatientTherapy{followed, standard, missing}))
}

func Test_pcxTrialEnrollments_MergesTheTherapiesOfOneProtocolArm(t *testing.T) {
	initial := enrolledTherapy("ACNS0333: Arm I", "ACNS0333", "Arm I", ptr(300), nil, "carboplatin", "vincristine")
	initial.IsInitialTreatment = ptr(true)
	enrollments := pcxTrialEnrollments([]types.PatientTherapy{
		initial,
		enrolledTherapy("ACNS0333: Arm I", "ACNS0333", "Arm I", ptr(100), ptr(250), "vincristine", "methotrexate"),
		enrolledTherapy("ACNS0333: Arm I", "ACNS0333", "Arm I", nil, ptr(400)),
	})

	assert.Equal(t, []types.PatientTrialEnrollment{{
		Start: types.PatientDayDate{Day: ptr(100)}, Stop: types.PatientDayDate{Day: ptr(400)},
		ProtocolName: "ACNS0333", ProtocolArm: ptr("Arm I"),
		ChemotherapyAgents: []string{"carboplatin", "vincristine", "methotrexate"}, IsInitialTreatment: true,
	}}, enrollments)
}

func Test_pcxTrialEnrollments_KeepsTwoArmsOfOneProtocolApart(t *testing.T) {
	enrollments := pcxTrialEnrollments([]types.PatientTherapy{
		enrolledTherapy("ACNS0333: Arm I", "ACNS0333", "Arm I", ptr(100), ptr(200)),
		enrolledTherapy("ACNS0333: Arm II", "ACNS0333", "Arm II", ptr(100), ptr(200)),
	})

	require.Len(t, enrollments, 2)
	assert.Equal(t, ptr("Arm I"), enrollments[0].ProtocolArm)
	assert.Equal(t, ptr("Arm II"), enrollments[1].ProtocolArm)
}

func Test_pcxTrialEnrollments_NotApplicableArmIsNull(t *testing.T) {
	enrollments := pcxTrialEnrollments([]types.PatientTherapy{enrolledTherapy("SJMB12", "SJMB12", "Not Applicable", ptr(100), ptr(200))})

	require.Len(t, enrollments, 1)
	assert.Nil(t, enrollments[0].ProtocolArm)
}

func Test_pcxTrialEnrollments_MostRecentFirstUndatedLast(t *testing.T) {
	enrollments := pcxTrialEnrollments([]types.PatientTherapy{
		enrolledTherapy("A", "A", "Not Applicable", ptr(100), nil),
		enrolledTherapy("B", "B", "Not Applicable", nil, nil),
		enrolledTherapy("C", "C", "Not Applicable", ptr(900), nil),
	})

	names := make([]string, len(enrollments))
	for i, e := range enrollments {
		names[i] = e.ProtocolName
	}
	assert.Equal(t, []string{"C", "A", "B"}, names)
}
