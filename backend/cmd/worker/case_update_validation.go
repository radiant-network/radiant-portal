package main

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"log/slog"

	"github.com/radiant-network/radiant-api/internal/batchval"
	"github.com/radiant-network/radiant-api/internal/database"
	"github.com/radiant-network/radiant-api/internal/repository/postgres"
	"github.com/radiant-network/radiant-api/internal/types"
	"gorm.io/gorm"
)

const CaseNotFoundForUpdate = "CASE-013"

// UpdateCaseValidationRecord validates one PUT entry that replaces a case's scalar
// fields and clinical patient data, and — merge-if-present — attaches the sequencing
// experiments and tasks the payload carries. A missing case is CASE-013, the whole batch
// entry then fails atomically.
type UpdateCaseValidationRecord struct {
	batchval.BaseValidationRecord
	Update types.UpdateCaseBatch
	CaseID *int
	// Record carries the synthetic CaseValidationRecord that drives the reused POST
	// validators (scalar fields + clinical patients) and, on success, the resolved
	// patient IDs the persist phase needs.
	Record *CaseValidationRecord
	// SequencingExperiments are the resolved experiments to link to the case (empty when the
	// payload omits sequencing_experiments — links are then left untouched).
	SequencingExperiments map[int]*types.SequencingExperiment
	// TaskRecord is the synthetic record the task attachment reuses at persist time (nil when
	// the payload carries no tasks — existing tasks are then left untouched).
	TaskRecord *CaseValidationRecord
	// ExistingFetuses maps the case's current fetuses by submitter id, so the persist phase can
	// update a matching one in place instead of recreating it.
	ExistingFetuses map[string]*types.Fetus
	// FetusIDsToDelete are the case's fetuses the payload dropped. Validation refuses the batch when
	// a sample still points at one of them.
	FetusIDsToDelete []int
}

func (r *UpdateCaseValidationRecord) GetBase() *batchval.BaseValidationRecord {
	return &r.BaseValidationRecord
}

func (r *UpdateCaseValidationRecord) path() string {
	return fmt.Sprintf("%s[%d]", r.GetResourceType(), r.Index)
}

// validateUpdateCaseRecord looks up the project and case directly (mirroring
// validatePatchCaseRecord — a missing project/case is reported against the update_case[N]
// path, terminally), then reuses the POST /cases/batch validators — via a synthetic
// CaseValidationRecord — for the scalar field formats and clinical patient data (family,
// observations, family history), which apply identically whether the case is being
// created or updated.
func validateUpdateCaseRecord(ctx context.Context, bv *batchval.BatchValidationContext, cache *batchval.BatchValidationCache, update types.UpdateCaseBatch, index int) (*UpdateCaseValidationRecord, error) {
	r := &UpdateCaseValidationRecord{
		BaseValidationRecord: batchval.BaseValidationRecord{Context: bv, Cache: cache, Index: index, ResourceType: types.UpdateCaseBatchType},
		Update:               update,
	}

	project, err := cache.GetProjectByCode(ctx, update.ProjectCode)
	if err != nil {
		return nil, fmt.Errorf("get project by code %q: %w", update.ProjectCode, err)
	}
	if project == nil {
		r.AddErrors(fmt.Sprintf("Project %s for update case %d does not exist.", update.ProjectCode, index), CaseUnknownProject, r.path())
		return r, nil
	}

	c, err := cache.GetCaseBySubmitterCaseIdAndProjectId(ctx, update.SubmitterCaseId, project.ID)
	if err != nil {
		return nil, fmt.Errorf("get case by submitter_case_id %q and project_id %d: %w", update.SubmitterCaseId, project.ID, err)
	}
	if c == nil {
		r.AddErrors(fmt.Sprintf("Case (%s / %s) does not exist, cannot update.", update.ProjectCode, update.SubmitterCaseId), CaseNotFoundForUpdate, r.path())
		r.Skipped = true
		return r, nil
	}
	r.CaseID = &c.ID

	syntheticCase := types.CaseBatch{
		SubmitterCaseId:            update.SubmitterCaseId,
		Type:                       update.Type,
		StatusCode:                 update.StatusCode,
		ProjectCode:                update.ProjectCode,
		DiagnosticLabCode:          update.DiagnosticLabCode,
		PrimaryConditionCodeSystem: update.PrimaryConditionCodeSystem,
		PrimaryConditionValue:      update.PrimaryConditionValue,
		PriorityCode:               update.PriorityCode,
		CategoryCode:               update.CategoryCode,
		AnalysisCode:               update.AnalysisCode,
		ResolutionStatusCode:       update.ResolutionStatusCode,
		Note:                       update.Note,
		OrderingPhysician:          update.OrderingPhysician,
		OrderingOrganizationCode:   update.OrderingOrganizationCode,
		Patients:                   update.Patients,
		Fetuses:                    update.Fetuses,
	}
	cr := NewCaseValidationRecord(bv, cache, syntheticCase, index)
	cr.ProjectID = &project.ID
	cr.CaseID = r.CaseID

	if err := cr.fetchCodeInfos(ctx); err != nil {
		return nil, fmt.Errorf("failed to retrieve code infos: %w", err)
	}
	if err := cr.fetchAnalysisCatalog(ctx); err != nil {
		return nil, fmt.Errorf("failed to resolve analysis catalog: %w", err)
	}
	if err := cr.resolveOrganizations(ctx); err != nil {
		return nil, fmt.Errorf("failed to resolve organizations: %w", err)
	}
	if err := cr.fetchPatients(ctx); err != nil {
		return nil, fmt.Errorf("failed to resolve patients: %w", err)
	}

	cr.validateCaseCommonFields(batchval.FormatPath(cr, ""))
	if err := cr.validateCasePatients(); err != nil {
		return nil, fmt.Errorf("failed to validate case patients: %w", err)
	}
	if err := cr.validateCaseFetuses(); err != nil {
		return nil, fmt.Errorf("failed to validate case fetuses: %w", err)
	}

	// Reconcile the fetuses by submitter id: a key the payload still carries is updated in place, a
	// key it dropped is deleted. Deleting is the only destructive half, and sample.fetus_id has no
	// ON DELETE CASCADE — so refuse it here as a reportable error rather than let the persist phase
	// die on a raw FK violation. Updating a fetus that has a sample is fine, which is the point of
	// matching by key rather than recreating.
	existingFetuses, fetusErr := bv.FetusRepo.GetFetusesByCaseID(ctx, *r.CaseID)
	if fetusErr != nil {
		return nil, fmt.Errorf("get fetuses for case %d: %w", *r.CaseID, fetusErr)
	}
	r.ExistingFetuses = make(map[string]*types.Fetus, len(existingFetuses))
	for _, f := range existingFetuses {
		r.ExistingFetuses[f.SubmitterFetusId] = f
	}
	carried := make(map[string]bool, len(update.Fetuses))
	for _, fb := range update.Fetuses {
		if fb != nil {
			carried[fb.SubmitterFetusId.String()] = true
		}
	}
	for _, f := range existingFetuses {
		if !carried[f.SubmitterFetusId] {
			r.FetusIDsToDelete = append(r.FetusIDsToDelete, f.ID)
		}
	}
	blocked, sampleErr := bv.SampleRepo.GetFetusIDsWithSamples(ctx, r.FetusIDsToDelete)
	if sampleErr != nil {
		return nil, fmt.Errorf("check samples for fetuses of case %d: %w", *r.CaseID, sampleErr)
	}
	if len(blocked) > 0 {
		r.AddErrors(fmt.Sprintf(
			"Cannot remove fetus %v from update case %d: a sample is still attached to it. Keep it in \"fetuses\" to update it instead.",
			blocked, index), FetusHasSample, r.path())
	}

	r.Errors = append(r.Errors, cr.Errors...)
	r.Warnings = append(r.Warnings, cr.Warnings...)
	r.Infos = append(r.Infos, cr.Infos...)
	r.Record = cr

	// Merge-if-present: sequencing experiments + tasks are attached like the POST path only
	// when the payload carries them; when omitted/empty the case's existing links and tasks
	// are left untouched (never cleared). Reuses the PATCH attach validators.
	seqExps, err := resolveSequencingExperimentsForAttach(ctx, cache, update.SequencingExperiments, &r.BaseValidationRecord, r.path())
	if err != nil {
		return nil, err
	}
	r.SequencingExperiments = seqExps

	if len(update.Tasks) > 0 {
		taskRecord, err := validateCaseTaskAttachments(ctx, bv, cache, update.SubmitterCaseId, update.ProjectCode, *r.CaseID, update.SequencingExperiments, update.Tasks, index)
		if err != nil {
			return nil, err
		}
		if taskRecord != nil {
			r.Errors = append(r.Errors, taskRecord.Errors...)
			r.Warnings = append(r.Warnings, taskRecord.Warnings...)
			r.Infos = append(r.Infos, taskRecord.Infos...)
			r.TaskRecord = taskRecord
		}
	}

	return r, nil
}

func validateUpdateCaseBatch(ctx context.Context, bv *batchval.BatchValidationContext, updates []types.UpdateCaseBatch) ([]*UpdateCaseValidationRecord, error) {
	var records []*UpdateCaseValidationRecord
	cache := batchval.NewBatchValidationCache(bv)
	visited := map[CaseKey]struct{}{}

	for idx, u := range updates {
		if err := ctx.Err(); err != nil {
			return nil, err
		}

		record, err := validateUpdateCaseRecord(ctx, bv, cache, u, idx)
		if err != nil {
			return nil, fmt.Errorf("error during update case validation: %v", err)
		}

		key := CaseKey{ProjectCode: u.ProjectCode, SubmitterCaseID: u.SubmitterCaseId}
		batchval.ValidateUniquenessInBatch(record, key, visited, CaseIdenticalInBatch, []string{u.ProjectCode, u.SubmitterCaseId})
		records = append(records, record)
	}
	return records, nil
}

// processUpdateCaseBatch handles PUT /cases/batch: it replaces a case's scalar fields
// and clinical patient data (family, observations, family history). It never creates the
// case, and it never touches sequencing_experiments or tasks.
func processUpdateCaseBatch(ctx context.Context, bv *batchval.BatchValidationContext, batch *types.Batch, db *gorm.DB) error {
	var updates []types.UpdateCaseBatch
	if err := json.Unmarshal([]byte(batch.Payload), &updates); err != nil {
		batchval.ProcessUnexpectedError(ctx, batch, fmt.Errorf("error unmarshalling update_case batch: %v", err), bv.BatchRepo)
		return nil
	}

	records, unexpectedErr := validateUpdateCaseBatch(ctx, bv, updates)
	if unexpectedErr != nil {
		if errors.Is(unexpectedErr, context.Canceled) {
			return unexpectedErr
		}
		batchval.ProcessUnexpectedError(ctx, batch, fmt.Errorf("error update_case batch validation: %v", unexpectedErr), bv.BatchRepo)
		return nil
	}

	slog.InfoContext(ctx, "update_case batch processed", slog.String("batch_id", batch.ID), slog.Int("records", len(records)))

	if err := persistBatchAndUpdateCaseRecords(ctx, db, batch, records); err != nil {
		if errors.Is(err, context.Canceled) {
			return err
		}
		batchval.ProcessUnexpectedError(ctx, batch, fmt.Errorf("error processing update_case batch records: %v", err), bv.BatchRepo)
		return nil
	}
	return nil
}

func persistBatchAndUpdateCaseRecords(ctx context.Context, db *gorm.DB, batch *types.Batch, records []*UpdateCaseValidationRecord) error {
	return db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		batchRepo := postgres.NewBatchRepository(database.PostgresDB{DB: tx})
		rowsUpdated, err := batchval.UpdateBatch(ctx, batch, records, batchRepo)
		if err != nil {
			return err
		}
		if rowsUpdated == 0 {
			return fmt.Errorf("no rows updated when updating update_case batch %v", batch.ID)
		}
		if batch.DryRun || batch.Status != types.BatchStatusSuccess {
			return nil
		}

		storageCtx := NewStorageContext(tx)
		storageCtx.TenantCode = batch.TenantCode
		casesRepo := postgres.NewCasesRepository(database.PostgresDB{DB: tx})

		for _, rec := range records {
			if rec.Skipped || rec.CaseID == nil || rec.Record == nil {
				continue
			}
			if err := updateCaseAndReplaceClinicalData(ctx, storageCtx, casesRepo, rec); err != nil {
				return fmt.Errorf("failed to update case %d: %w", *rec.CaseID, err)
			}
		}
		return nil
	})
}

// updateCaseAndReplaceClinicalData updates the case row's scalar fields, then replaces its
// clinical children (family, obs_categorical, obs_string, family_history) with what the
// PUT body carries. Sequencing experiment links and tasks are merge-if-present: attached when
// the payload carried them (resolved at validation time), left untouched otherwise.
func updateCaseAndReplaceClinicalData(ctx context.Context, sc *StorageContext, casesRepo *postgres.CasesRepository, rec *UpdateCaseValidationRecord) error {
	caseID := *rec.CaseID
	u := rec.Update

	if err := casesRepo.UpdateCase(ctx, caseID, &types.Case{
		CaseTypeCode:             u.Type,
		StatusCode:               u.StatusCode,
		DiagnosisLabCode:         &u.DiagnosticLabCode,
		ConditionCodeSystem:      u.PrimaryConditionCodeSystem,
		PrimaryCondition:         u.PrimaryConditionValue,
		PriorityCode:             u.PriorityCode,
		CaseCategoryCode:         u.CategoryCode,
		AnalysisCatalogID:        *rec.Record.AnalysisCatalogID,
		ResolutionStatusCode:     u.ResolutionStatusCode,
		Note:                     u.Note,
		OrderingOrganizationCode: &u.OrderingOrganizationCode,
		OrderingPhysician:        u.OrderingPhysician,
	}); err != nil {
		return fmt.Errorf("failed to update case scalars: %w", err)
	}

	// Clinical children are wiped and rewritten from the payload. The fetus ROWS are deliberately
	// not part of that: they are reconciled by submitter id below, so their ids — and therefore
	// sample.fetus_id — survive. Only the family and observation rows pointing at them are rewritten.
	if err := sc.FamilyRepo.DeleteFamilyByCaseID(ctx, caseID); err != nil {
		return fmt.Errorf("failed to delete family for case %d: %w", caseID, err)
	}
	if err := sc.ObsCatRepo.DeleteObsCategoricalByCaseID(ctx, caseID); err != nil {
		return fmt.Errorf("failed to delete observations categorical for case %d: %w", caseID, err)
	}
	if err := sc.ObsStringRepo.DeleteObsStringByCaseID(ctx, caseID); err != nil {
		return fmt.Errorf("failed to delete observations text for case %d: %w", caseID, err)
	}
	if err := sc.FamilyHistoryRepo.DeleteFamilyHistoryByCaseID(ctx, caseID); err != nil {
		return fmt.Errorf("failed to delete family history for case %d: %w", caseID, err)
	}

	if err := persistFamily(ctx, sc, rec.Record); err != nil {
		return fmt.Errorf("failed to persist family: %w", err)
	}
	if err := persistObservationCategorical(ctx, sc, rec.Record); err != nil {
		return fmt.Errorf("failed to persist observations categorical: %w", err)
	}
	if err := persistObservationText(ctx, sc, rec.Record); err != nil {
		return fmt.Errorf("failed to persist observations text: %w", err)
	}
	if err := persistFamilyHistory(ctx, sc, rec.Record); err != nil {
		return fmt.Errorf("failed to persist family history: %w", err)
	}
	// The dropped fetuses' family rows and observations are already gone with the wipe above, so the
	// rows themselves can go now. Validation has refused any that a sample still points at.
	if err := sc.FetusRepo.DeleteFetusesByIDs(ctx, rec.FetusIDsToDelete); err != nil {
		return fmt.Errorf("failed to delete fetuses dropped from case %d: %w", caseID, err)
	}
	// After persistFamily: persistFetuses resolves the proband from the patients it just wrote.
	if err := persistFetuses(ctx, sc, rec.Record, rec.ExistingFetuses); err != nil {
		return fmt.Errorf("failed to persist fetuses: %w", err)
	}

	// Merge-if-present: attach the sequencing experiment links and tasks the payload carried
	// (mirrors the PATCH persist). When the payload omitted them these are empty/nil, so the
	// case's existing links and tasks stay untouched.
	for _, se := range rec.SequencingExperiments {
		chse := types.CaseHasSequencingExperiment{CaseID: caseID, SequencingExperimentID: se.ID}
		if err := casesRepo.CreateCaseHasSequencingExperiment(ctx, &chse); err != nil {
			return fmt.Errorf("failed to attach sequencing experiment %d to case %d: %w", se.ID, caseID, err)
		}
	}
	if rec.TaskRecord != nil {
		if err := persistTask(ctx, sc, rec.TaskRecord); err != nil {
			return fmt.Errorf("failed to persist tasks for case %d: %w", caseID, err)
		}
	}
	return nil
}
