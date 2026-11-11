package starrocks

import (
	"cmp"
	"fmt"
	"slices"
	"strconv"
	"strings"

	"github.com/radiant-network/radiant-api/internal/types"
)

// The PCX source values, as the secured views return them: ages are integers or text with sentinels (-1, Not
// Reported, Not Available, Not Applicable), flags are yes/no, lists are separated text. These turn them into the
// API's shapes (docs/adr/pcx_30/02-api-spec.md).

// pcxDay is a day (age in days) when the value is a non-negative integer, nil for any sentinel.
func pcxDay(value *string) *int {
	if value == nil {
		return nil
	}
	day, err := strconv.Atoi(strings.TrimSpace(*value))
	if err != nil || day < 0 {
		return nil
	}
	return &day
}

// pcxYesNo is nil for anything other than yes or no, e.g. Not Reported.
func pcxYesNo(value *string) *bool {
	if value == nil {
		return nil
	}
	switch strings.ToLower(strings.TrimSpace(*value)) {
	case "yes":
		yes := true
		return &yes
	case "no":
		no := false
		return &no
	}
	return nil
}

// pcxList splits a separated list; a lone Not Applicable (nothing to list) is an empty list.
func pcxList(value *string, separator string) []string {
	items := []string{}
	if value == nil || strings.EqualFold(strings.TrimSpace(*value), "Not Applicable") {
		return items
	}
	for _, item := range strings.Split(*value, separator) {
		if item = strings.TrimSpace(item); item != "" {
			items = append(items, item)
		}
	}
	return items
}

var pcxEventTypes = map[string]string{
	"initial cns tumor": "initial_cns_tumor",
	"progressive":       "progressive",
	"recurrence":        "recurrence",
	"second malignancy": "second_malignancy",
	"deceased":          "deceased",
	"unavailable":       "unavailable",
	"not reported":      "not_reported",
}

func pcxEventType(value *string) (string, error) {
	if value == nil {
		return "", fmt.Errorf("missing event type")
	}
	code, ok := pcxEventTypes[strings.ToLower(strings.TrimSpace(*value))]
	if !ok {
		return "", fmt.Errorf("unknown event type %q", *value)
	}
	return code, nil
}

var pcxPerformanceScales = map[string]string{"lansky": "lansky", "karnofsky": "karnofsky"}

func pcxPerformanceScale(value *string) (string, error) {
	if value == nil {
		return "", fmt.Errorf("missing performance status scale")
	}
	code, ok := pcxPerformanceScales[strings.ToLower(strings.TrimSpace(*value))]
	if !ok {
		return "", fmt.Errorf("unknown performance status scale %q", *value)
	}
	return code, nil
}

// pcxFocalBoost is the total to primary minus the craniospinal dose, only when both are numbers in the same unit.
func pcxFocalBoost(craniospinal, primary types.PatientDose) *types.PatientDose {
	if craniospinal.Value == nil || primary.Value == nil || craniospinal.Unit == nil || primary.Unit == nil ||
		*craniospinal.Unit != *primary.Unit {
		return nil
	}
	c, errC := strconv.ParseFloat(strings.TrimSpace(*craniospinal.Value), 64)
	p, errP := strconv.ParseFloat(strings.TrimSpace(*primary.Value), 64)
	if errC != nil || errP != nil {
		return nil
	}
	value := strconv.FormatFloat(p-c, 'f', -1, 64)
	unit := *primary.Unit
	return &types.PatientDose{Value: &value, Unit: &unit}
}

const pcxEnrolledOnProtocol = "treatment follows a protocol and subject is enrolled on a protocol"

// pcxTrialEnrollments lists one enrollment per therapy the patient was enrolled for, as the treatments timeline does.
// The most recent start comes first, an enrollment without a start day last.
func pcxTrialEnrollments(therapies []types.PatientTherapy) []types.PatientTrialEnrollment {
	enrollments := []types.PatientTrialEnrollment{}
	for _, therapy := range therapies {
		if therapy.ChemotherapyType == nil || !strings.EqualFold(strings.TrimSpace(*therapy.ChemotherapyType), pcxEnrolledOnProtocol) {
			continue
		}
		name := pcxTrimmed(therapy.ProtocolName)
		if name == "" {
			name = pcxTrimmed(therapy.ProtocolNameAndArm)
		}
		var arm *string
		if a := pcxTrimmed(therapy.ProtocolArm); a != "" && !strings.EqualFold(a, "Not Applicable") {
			arm = &a
		}
		enrollments = append(enrollments, types.PatientTrialEnrollment{Start: therapy.Start, Stop: therapy.Stop, ProtocolName: name,
			ProtocolArm: arm, ChemotherapyAgents: slices.Clone(therapy.ChemotherapyAgents),
			IsInitialTreatment: therapy.IsInitialTreatment != nil && *therapy.IsInitialTreatment})
	}
	slices.SortStableFunc(enrollments, func(a, b types.PatientTrialEnrollment) int {
		if a.Start.Day == nil || b.Start.Day == nil {
			return cmp.Compare(pcxUnknown(a.Start.Day), pcxUnknown(b.Start.Day))
		}
		return cmp.Compare(*b.Start.Day, *a.Start.Day)
	})
	return enrollments
}

func pcxUnknown(day *int) int {
	if day == nil {
		return 1
	}
	return 0
}

func pcxTrimmed(value *string) string {
	if value == nil {
		return ""
	}
	return strings.TrimSpace(*value)
}
