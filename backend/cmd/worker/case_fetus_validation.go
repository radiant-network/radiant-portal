package main

import (
	"context"
	"fmt"
	"time"

	"github.com/radiant-network/radiant-api/internal/repository"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/internal/utils"
)

// Fetus error codes
const (
	FetusInvalidField = "FETUS-001"
)

const RelationshipFetusCode = "fetus"

func (r *CaseValidationRecord) fetchFetusCodes(ctx context.Context) error {
	sexCodes, err := r.Cache.GetValueSetCodes(ctx, repository.ValueSetSex)
	if err != nil {
		return fmt.Errorf("error retrieving sex codes: %v", err)
	}
	r.SexCodes = sexCodes

	lifeStatusCodes, err := r.Cache.GetValueSetCodes(ctx, repository.ValueSetLifeStatus)
	if err != nil {
		return fmt.Errorf("error retrieving life status codes: %v", err)
	}
	r.LifeStatusCodes = lifeStatusCodes
	return nil
}

func (cr *CaseValidationRecord) formatFetusFieldPath(collectionName string, collectionIndex *int) string {
	return cr.formatFieldPath("fetus", nil, collectionName, collectionIndex)
}

func (cr *CaseValidationRecord) validateFetusSexCode() {
	path := cr.formatFetusFieldPath("", nil) + ".sex_code"
	res := fmt.Sprintf("create_case %d - fetus", cr.Index)
	cr.ValidateCode(res, path, "sex_code", FetusInvalidField, cr.Case.Fetus.SexCode, cr.SexCodes, []string{}, true)
}

func (cr *CaseValidationRecord) validateFetusLifeStatusCode() {
	path := cr.formatFetusFieldPath("", nil) + ".life_status_code"
	res := fmt.Sprintf("create_case %d - fetus", cr.Index)
	cr.ValidateCode(res, path, "life_status_code", FetusInvalidField, cr.Case.Fetus.LifeStatusCode, cr.LifeStatusCodes, []string{}, true)
}

func (cr *CaseValidationRecord) validateFetusAffectedStatusCode() {
	path := cr.formatFetusFieldPath("", nil) + ".affected_status_code"
	res := fmt.Sprintf("create_case %d - fetus", cr.Index)
	cr.ValidateCode(res, path, "affected_status_code", FetusInvalidField, cr.Case.Fetus.AffectedStatusCode, cr.PatientAffectedStatusCodes, []string{}, true)
}

func (cr *CaseValidationRecord) validateFetusObservationsCategorical() {
	for obsIndex, obs := range cr.Case.Fetus.ObservationsCategorical {
		obsPath := cr.formatFetusFieldPath("observations_categorical", &obsIndex)
		res := fmt.Sprintf("create_case %d - fetus - observations_categorical %d", cr.Index, obsIndex)
		cr.validateObservationCategoricalItem(obs, obsPath, res)
	}
}

func (cr *CaseValidationRecord) validateFetusObservationsText() {
	for obsIndex, obs := range cr.Case.Fetus.ObservationsText {
		path := cr.formatFetusFieldPath("observations_text", &obsIndex)
		res := fmt.Sprintf("create_case %d - fetus - observations_text %d", cr.Index, obsIndex)
		cr.ValidateCode(res, path+".code", "code", ObservationInvalidField, obs.Code, cr.ObservationCodes, []string{}, true)
		cr.ValidateStringField(obs.Value, "value", path+".value", ObservationInvalidField, res, TextMaxLength, TextRegExpCompiled, []string{}, true)
	}
}

// validateCaseFetuses validates the case's fetus, if present. A case has at most one fetus.
func (cr *CaseValidationRecord) validateCaseFetuses() error {
	if cr.Case.Fetus == nil {
		return nil
	}
	cr.validateFetusSexCode()
	cr.validateFetusLifeStatusCode()
	cr.validateFetusAffectedStatusCode()
	cr.validateFetusObservationsCategorical()
	cr.validateFetusObservationsText()
	return nil
}

// exactlyOneSubjectSet mirrors the DB's obs_*_subject_xor / family_member_subject_xor CHECK
// constraints: a clinical row belongs to exactly one subject, the mother (patientID) or her
// fetus (fetusID), never both or neither. The worker enforces this itself before insert so a bug
// surfaces as a clear internal error instead of a raw constraint violation.
func exactlyOneSubjectSet(patientID, fetusID *int) bool {
	return (patientID != nil) != (fetusID != nil)
}

// dateISO8601ToTimePtr converts the wire date type to the *time.Time the fetus table's nullable
// date columns use, preserving nil for an omitted date.
func dateISO8601ToTimePtr(d *types.DateISO8601) *time.Time {
	if d == nil {
		return nil
	}
	t := time.Time(*d)
	return &t
}

// persistFetus inserts the case's fetus row and its family row (relationship "fetus",
// family_member_id NULL, fetus_id set), then the fetus's nested observations. A case's fetus
// always belongs to the case's proband — there is no per-fetus mother reference in the wire
// payload. No-op if the case has no fetus.
func persistFetus(ctx context.Context, sc *StorageContext, cr *CaseValidationRecord) error {
	fb := cr.Case.Fetus
	if fb == nil {
		return nil
	}

	proband, err := cr.getProbandFromPatients()
	if err != nil {
		return fmt.Errorf("failed to get proband patient for fetus in create_case %d: %w", cr.Index, err)
	}
	if proband == nil {
		return fmt.Errorf("proband patient not found for fetus in create_case %d", cr.Index)
	}

	fetus := types.Fetus{
		MotherID:            proband.ID,
		SexCode:             fb.SexCode,
		LifeStatusCode:      fb.LifeStatusCode,
		LastMenstrualPeriod: dateISO8601ToTimePtr(fb.LastMenstrualPeriod),
		EstimatedDueDate:    dateISO8601ToTimePtr(fb.EstimatedDueDate),
		TenantCode:          sc.TenantCode,
	}
	if err := sc.FetusRepo.CreateFetus(ctx, &fetus); err != nil {
		return fmt.Errorf("failed to persist fetus for create_case %d: %w", cr.Index, err)
	}

	familyMember := types.Family{
		CaseID:                    *cr.CaseID,
		FetusID:                   utils.IntPtr(fetus.ID),
		RelationshipToProbandCode: RelationshipFetusCode,
		AffectedStatusCode:        fb.AffectedStatusCode,
		TenantCode:                sc.TenantCode,
	}
	if !exactlyOneSubjectSet(familyMember.FamilyMemberID, familyMember.FetusID) {
		return fmt.Errorf("family row for fetus in create_case %d has an invalid subject (family_member_id and fetus_id must be mutually exclusive)", cr.Index)
	}
	if err := sc.FamilyRepo.CreateFamily(ctx, &familyMember); err != nil {
		return fmt.Errorf("failed to persist family for fetus in create_case %d: %w", cr.Index, err)
	}

	if err := persistFetusObservationsCategorical(ctx, sc, cr, fetus.ID, fb); err != nil {
		return err
	}
	if err := persistFetusObservationsText(ctx, sc, cr, fetus.ID, fb); err != nil {
		return err
	}
	return nil
}

func persistFetusObservationsCategorical(ctx context.Context, sc *StorageContext, cr *CaseValidationRecord, fetusID int, fb *types.CaseFetusBatch) error {
	for _, o := range fb.ObservationsCategorical {
		obs := types.ObsCategorical{
			CaseID:             *cr.CaseID,
			FetusID:            utils.IntPtr(fetusID),
			ObservationCode:    o.Code,
			CodingSystem:       o.System,
			CodeValue:          o.Value,
			OnsetCode:          utils.NilIfEmpty(o.OnsetCode),
			InterpretationCode: utils.NilIfEmpty(o.InterpretationCode),
			Note:               o.Note,
			ExamCode:           utils.NilIfEmpty(o.ExamCode),
			TenantCode:         sc.TenantCode,
		}
		if !exactlyOneSubjectSet(obs.PatientID, obs.FetusID) {
			return fmt.Errorf("observation categorical for fetus in create_case %d has an invalid subject (patient_id and fetus_id must be mutually exclusive)", cr.Index)
		}
		if err := sc.ObsCatRepo.CreateObservationCategorical(ctx, &obs); err != nil {
			return fmt.Errorf("failed to persist observation categorical for fetus in create_case %d: %w", cr.Index, err)
		}
	}
	return nil
}

func persistFetusObservationsText(ctx context.Context, sc *StorageContext, cr *CaseValidationRecord, fetusID int, fb *types.CaseFetusBatch) error {
	for _, o := range fb.ObservationsText {
		obs := types.ObsString{
			CaseID:             *cr.CaseID,
			FetusID:            utils.IntPtr(fetusID),
			ObservationCode:    o.Code,
			Value:              o.Value,
			InterpretationCode: utils.NilIfEmpty(o.InterpretationCode),
			ExamCode:           utils.NilIfEmpty(o.ExamCode),
			TenantCode:         sc.TenantCode,
		}
		if !exactlyOneSubjectSet(obs.PatientID, obs.FetusID) {
			return fmt.Errorf("observation text for fetus in create_case %d has an invalid subject (patient_id and fetus_id must be mutually exclusive)", cr.Index)
		}
		if err := sc.ObsStringRepo.CreateObservationString(ctx, &obs); err != nil {
			return fmt.Errorf("failed to persist observation text for fetus in create_case %d: %w", cr.Index, err)
		}
	}
	return nil
}
