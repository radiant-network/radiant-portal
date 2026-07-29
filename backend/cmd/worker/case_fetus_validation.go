package main

import (
	"context"
	"fmt"
	"time"

	"github.com/radiant-network/radiant-api/internal/repository/postgres"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/internal/utils"
)

// Fetuses error codes
const (
	FetusInvalidField = "FETUS-001"
)

const RelationshipFetusCode = "fetus"

func (r *CaseValidationRecord) fetchFetusCodes(ctx context.Context) error {
	sexCodes, err := r.Cache.GetValueSetCodes(ctx, postgres.ValueSetSex)
	if err != nil {
		return fmt.Errorf("error retrieving sex codes: %v", err)
	}
	r.SexCodes = sexCodes

	lifeStatusCodes, err := r.Cache.GetValueSetCodes(ctx, postgres.ValueSetLifeStatus)
	if err != nil {
		return fmt.Errorf("error retrieving life status codes: %v", err)
	}
	r.LifeStatusCodes = lifeStatusCodes
	return nil
}

func (cr *CaseValidationRecord) formatFetusesFieldPath(fetusIndex *int, collectionName string, collectionIndex *int) string {
	return cr.formatFieldPath("fetuses", fetusIndex, collectionName, collectionIndex)
}

func (cr *CaseValidationRecord) validateFetusSexCode(fetusIndex int) {
	path := cr.formatFetusesFieldPath(&fetusIndex, "", nil) + ".sex_code"
	res := fmt.Sprintf("create_case %d - fetus %d", cr.Index, fetusIndex)
	cr.ValidateCode(res, path, "sex_code", FetusInvalidField, cr.Case.Fetuses[fetusIndex].SexCode, cr.SexCodes, []string{}, true)
}

func (cr *CaseValidationRecord) validateFetusLifeStatusCode(fetusIndex int) {
	path := cr.formatFetusesFieldPath(&fetusIndex, "", nil) + ".life_status_code"
	res := fmt.Sprintf("create_case %d - fetus %d", cr.Index, fetusIndex)
	cr.ValidateCode(res, path, "life_status_code", FetusInvalidField, cr.Case.Fetuses[fetusIndex].LifeStatusCode, cr.LifeStatusCodes, []string{}, true)
}

func (cr *CaseValidationRecord) validateFetusAffectedStatusCode(fetusIndex int) {
	path := cr.formatFetusesFieldPath(&fetusIndex, "", nil) + ".affected_status_code"
	res := fmt.Sprintf("create_case %d - fetus %d", cr.Index, fetusIndex)
	cr.ValidateCode(res, path, "affected_status_code", FetusInvalidField, cr.Case.Fetuses[fetusIndex].AffectedStatusCode, cr.PatientAffectedStatusCodes, []string{}, true)
}

func (cr *CaseValidationRecord) validateFetusObservationsCategorical(fetusIndex int) {
	for obsIndex, obs := range cr.Case.Fetuses[fetusIndex].ObservationsCategorical {
		obsPath := cr.formatFetusesFieldPath(&fetusIndex, "observations_categorical", &obsIndex)
		res := fmt.Sprintf("create_case %d - fetus %d - observations_categorical %d", cr.Index, fetusIndex, obsIndex)
		cr.validateObservationCategoricalItem(obs, obsPath, res)
	}
}

func (cr *CaseValidationRecord) validateFetusObservationsText(fetusIndex int) {
	for obsIndex, obs := range cr.Case.Fetuses[fetusIndex].ObservationsText {
		path := cr.formatFetusesFieldPath(&fetusIndex, "observations_text", &obsIndex)
		res := fmt.Sprintf("create_case %d - fetus %d - observations_text %d", cr.Index, fetusIndex, obsIndex)
		cr.ValidateCode(res, path+".code", "code", ObservationInvalidField, obs.Code, cr.ObservationCodes, []string{}, true)
		cr.ValidateStringField(obs.Value, "value", path+".value", ObservationInvalidField, res, TextMaxLength, TextRegExpCompiled, []string{}, true)
	}
}

func (cr *CaseValidationRecord) validateCaseFetuses() {
	for fetusIndex := range cr.Case.Fetuses {
		// `dive` alone accepts a null array entry, so a payload of `"fetuses": [null]` binds
		// fine and would nil-deref below. Reject it as a validation error instead.
		if cr.Case.Fetuses[fetusIndex] == nil {
			path := cr.formatFetusesFieldPath(&fetusIndex, "", nil)
			res := fmt.Sprintf("create_case %d - fetus %d", cr.Index, fetusIndex)
			cr.AddErrors(fmt.Sprintf("Invalid fetus for %s. Reason: entry is null.", res), FetusInvalidField, path)
			continue
		}
		cr.validateFetusSexCode(fetusIndex)
		cr.validateFetusLifeStatusCode(fetusIndex)
		cr.validateFetusAffectedStatusCode(fetusIndex)
		cr.validateFetusObservationsCategorical(fetusIndex)
		cr.validateFetusObservationsText(fetusIndex)
	}
}

func dateISO8601ToTimePtr(d *types.DateISO8601) *time.Time {
	if d == nil {
		return nil
	}
	t := time.Time(*d)
	return &t
}

// persistFetuses inserts one fetus row plus its family row and observations per CaseFetusBatch
// entry, all attached to the case's proband as mother.
func persistFetuses(ctx context.Context, sc *StorageContext, cr *CaseValidationRecord) error {
	if len(cr.Case.Fetuses) == 0 {
		return nil
	}

	proband, err := cr.getProbandFromPatients()
	if err != nil {
		return fmt.Errorf("failed to get proband patient for fetuses in create_case %d: %w", cr.Index, err)
	}
	if proband == nil {
		return fmt.Errorf("proband patient not found for fetuses in create_case %d", cr.Index)
	}

	for fetusIndex, fb := range cr.Case.Fetuses {
		fetus := types.Fetus{
			MotherID:            proband.ID,
			SexCode:             fb.SexCode,
			LifeStatusCode:      fb.LifeStatusCode,
			LastMenstrualPeriod: dateISO8601ToTimePtr(fb.LastMenstrualPeriod),
			EstimatedDueDate:    dateISO8601ToTimePtr(fb.EstimatedDueDate),
			TenantCode:          sc.TenantCode,
		}
		if err := sc.FetusRepo.CreateFetus(ctx, &fetus); err != nil {
			return fmt.Errorf("failed to persist fetus %d for create_case %d: %w", fetusIndex, cr.Index, err)
		}

		familyMember := types.Family{
			CaseID:                    *cr.CaseID,
			FetusID:                   utils.IntPtr(fetus.ID),
			RelationshipToProbandCode: RelationshipFetusCode,
			AffectedStatusCode:        fb.AffectedStatusCode,
			TenantCode:                sc.TenantCode,
		}
		if err := sc.FamilyRepo.CreateFamily(ctx, &familyMember); err != nil {
			return fmt.Errorf("failed to persist family for fetus %d in create_case %d: %w", fetusIndex, cr.Index, err)
		}

		if err := persistFetusObservationsCategorical(ctx, sc, cr, fetus.ID, fb); err != nil {
			return err
		}
		if err := persistFetusObservationsText(ctx, sc, cr, fetus.ID, fb); err != nil {
			return err
		}
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
		if err := sc.ObsCatRepo.CreateObservationCategorical(ctx, &obs); err != nil {
			return fmt.Errorf("failed to persist observation categorical for fetus %d in create_case %d: %w", fetusID, cr.Index, err)
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
		if err := sc.ObsStringRepo.CreateObservationString(ctx, &obs); err != nil {
			return fmt.Errorf("failed to persist observation text for fetus %d in create_case %d: %w", fetusID, cr.Index, err)
		}
	}
	return nil
}
