package main

import (
	"context"
	"fmt"
	"time"

	"github.com/radiant-network/radiant-api/internal/batchval"
	"github.com/radiant-network/radiant-api/internal/repository/postgres"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/internal/utils"
)

// Fetuses error codes
const (
	FetusInvalidField         = "FETUS-001"
	FetusHasSample            = "FETUS-002"
	FetusDuplicateInBatchCode = "FETUS-003"
	FetusOrgConflictCode      = "FETUS-004"
)

// FetusKey scopes submitter_fetus_id uniqueness to the organization, mirroring
// patient.submitter_patient_id — a fetus has no organization of its own so it is resolved
// through its mother, but two different mothers submitted by the same organization cannot
// reuse a key.
type FetusKey struct {
	OrganizationCode string
	SubmitterFetusId string
}

const RelationshipFetusCode = "fetus"
const LifeStatusDeceased = "deceased"

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

// todayUTC returns midnight UTC for the current day, so a date-only value (DateISO8601 carries no
// time of day) compares against "today" rather than against the current instant — a due date of
// today must not read as "in the past" just because it's now afternoon.
func todayUTC() time.Time {
	now := time.Now().UTC()
	return time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, time.UTC)
}

func (cr *CaseValidationRecord) validateFetusDates(fetusIndex int) {
	fb := cr.Case.Fetuses[fetusIndex]
	res := fmt.Sprintf("create_case %d - fetus %d", cr.Index, fetusIndex)
	today := todayUTC()

	if fb.LastMenstrualPeriod != nil && time.Time(*fb.LastMenstrualPeriod).After(today) {
		path := cr.formatFetusesFieldPath(&fetusIndex, "", nil) + ".last_menstrual_period"
		cr.AddErrors(fmt.Sprintf("Invalid fetus for %s. Reason: last_menstrual_period cannot be in the future.", res), FetusInvalidField, path)
	}

	if fb.LifeStatusCode == LifeStatusDeceased {
		return
	}
	if fb.LastMenstrualPeriod != nil || fb.EstimatedDueDate != nil {
		return
	}
	path := cr.formatFetusesFieldPath(&fetusIndex, "", nil)
	cr.AddErrors(fmt.Sprintf("Invalid fetus for %s. Reason: either last_menstrual_period or estimated_due_date is required when the fetus is not deceased.", res), FetusInvalidField, path)
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
		if obs == nil {
			cr.addNullObservationError(res, path)
			continue
		}
		cr.ValidateCode(res, path+".code", "code", ObservationInvalidField, obs.Code, cr.ObservationCodes, []string{}, true)
		cr.ValidateStringField(obs.Value, "value", path+".value", ObservationInvalidField, res, FreeTextMaxLength, nil, []string{}, true)
	}
}

// validateCaseFetuses validates every fetus of the case. seenFetuses dedupes submitter_fetus_id
// across the whole request (two cases in the same payload can't create a fetus under the same
// organization with the same key, even under different mothers); existingOnCase exempts a key
// already attached to this case from the org-uniqueness check below, since that's an update in
// place, not a collision (empty on create, where nothing is exempt yet). The org is resolved from
// the proband; a case whose proband didn't resolve (already reported by validateCasePatients)
// skips both checks rather than failing here on an unrelated error.
func (cr *CaseValidationRecord) validateCaseFetuses(ctx context.Context, seenFetuses map[FetusKey]struct{}, existingOnCase map[string]*types.Fetus) error {
	proband, _ := cr.getProbandFromPatients()

	for fetusIndex := range cr.Case.Fetuses {
		if cr.Case.Fetuses[fetusIndex] == nil {
			path := cr.formatFetusesFieldPath(&fetusIndex, "", nil)
			res := fmt.Sprintf("create_case %d - fetus %d", cr.Index, fetusIndex)
			cr.AddErrors(fmt.Sprintf("Invalid fetus for %s. Reason: entry is null.", res), FetusInvalidField, path)
			continue
		}
		cr.validateFetusSexCode(fetusIndex)
		cr.validateFetusLifeStatusCode(fetusIndex)
		cr.validateFetusAffectedStatusCode(fetusIndex)
		cr.validateFetusDates(fetusIndex)
		cr.validateFetusObservationsCategorical(fetusIndex)
		cr.validateFetusObservationsText(fetusIndex)
		if proband != nil {
			cr.validateFetusUniquenessInBatch(fetusIndex, proband.OrganizationCode, seenFetuses)
			if err := cr.validateFetusOrgUniqueness(ctx, fetusIndex, proband.OrganizationCode, existingOnCase); err != nil {
				return err
			}
		}
	}
	return nil
}

func (cr *CaseValidationRecord) validateFetusUniquenessInBatch(fetusIndex int, organizationCode string, seenFetuses map[FetusKey]struct{}) {
	submitterFetusId := cr.Case.Fetuses[fetusIndex].SubmitterFetusId.String()
	key := FetusKey{OrganizationCode: organizationCode, SubmitterFetusId: submitterFetusId}
	if _, exists := seenFetuses[key]; exists {
		path := cr.formatFetusesFieldPath(&fetusIndex, "", nil)
		message := batchval.FormatDuplicateInBatch(cr.GetResourceType(), []string{organizationCode, submitterFetusId})
		cr.AddErrors(message, FetusDuplicateInBatchCode, path)
		return
	}
	seenFetuses[key] = struct{}{}
}

// validateFetusOrgUniqueness rejects a submitter_fetus_id that already belongs to a fetus of
// another case/mother under the same organization — the fetus_org_submitter_id_key constraint a
// create would otherwise violate with a raw duplicate-key error. existingOnCase exempts a key
// already attached to this case, since resolving it there means updating that row in place.
func (cr *CaseValidationRecord) validateFetusOrgUniqueness(ctx context.Context, fetusIndex int, organizationCode string, existingOnCase map[string]*types.Fetus) error {
	submitterFetusId := cr.Case.Fetuses[fetusIndex].SubmitterFetusId.String()
	if _, ok := existingOnCase[submitterFetusId]; ok {
		return nil
	}
	conflicting, err := cr.Context.FetusRepo.GetFetusByOrganizationAndSubmitterId(ctx, organizationCode, submitterFetusId, cr.TenantCode)
	if err != nil {
		return fmt.Errorf("check fetus organization uniqueness for %q: %w", submitterFetusId, err)
	}
	if conflicting != nil {
		path := cr.formatFetusesFieldPath(&fetusIndex, "", nil)
		res := fmt.Sprintf("create_case %d - fetus %d", cr.Index, fetusIndex)
		message := fmt.Sprintf("Invalid fetus for %s. Reason: submitter_fetus_id %q already exists for organization %q.", res, submitterFetusId, organizationCode)
		cr.AddErrors(message, FetusOrgConflictCode, path)
	}
	return nil
}

func dateISO8601ToTimePtr(d *types.DateISO8601) *time.Time {
	if d == nil {
		return nil
	}
	t := time.Time(*d)
	return &t
}

func persistFetuses(ctx context.Context, sc *StorageContext, cr *CaseValidationRecord, existing map[string]*types.Fetus) error {
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
			SubmitterFetusId:    fb.SubmitterFetusId.String(),
			MotherID:            proband.ID,
			OrganizationCode:    proband.OrganizationCode,
			SexCode:             fb.SexCode,
			LifeStatusCode:      fb.LifeStatusCode,
			LastMenstrualPeriod: dateISO8601ToTimePtr(fb.LastMenstrualPeriod),
			EstimatedDueDate:    dateISO8601ToTimePtr(fb.EstimatedDueDate),
			TenantCode:          sc.TenantCode,
		}
		if previous, ok := existing[fetus.SubmitterFetusId]; ok {
			fetus.ID = previous.ID
			if err := sc.FetusRepo.UpdateFetus(ctx, &fetus); err != nil {
				return fmt.Errorf("failed to update fetus %q for case %d: %w", fetus.SubmitterFetusId, cr.Index, err)
			}
		} else if err := sc.FetusRepo.CreateFetus(ctx, &fetus); err != nil {
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
