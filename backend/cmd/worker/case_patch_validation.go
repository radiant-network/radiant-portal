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

// PatchCaseValidationRecord validates one PATCH entry that attaches
// already-existing sequencing experiments to an already-existing case, and
// optionally attaches bioinformatic tasks (with their documents) to it.
type PatchCaseValidationRecord struct {
	batchval.BaseValidationRecord
	Patch                  types.CaseBatchPatch
	CaseID                 *int
	SequencingExperiments  map[int]*types.SequencingExperiment
	DiagnosisLabCodeUpdate string
	Record                 *CaseValidationRecord
}

func (r *PatchCaseValidationRecord) GetBase() *batchval.BaseValidationRecord {
	return &r.BaseValidationRecord
}

func (r *PatchCaseValidationRecord) path() string {
	return fmt.Sprintf("%s[%d]", r.GetResourceType(), r.Index)
}

func validatePatchCaseRecord(ctx context.Context, bv *batchval.BatchValidationContext, cache *batchval.BatchValidationCache, patch types.CaseBatchPatch, index int) (*PatchCaseValidationRecord, error) {
	r := &PatchCaseValidationRecord{
		BaseValidationRecord:  batchval.BaseValidationRecord{Cache: cache, Index: index, ResourceType: types.PatchCaseBatchType},
		Patch:                 patch,
		SequencingExperiments: make(map[int]*types.SequencingExperiment),
	}

	project, err := cache.GetProjectByCode(ctx, patch.ProjectCode)
	if err != nil {
		return nil, fmt.Errorf("get project by code %q: %w", patch.ProjectCode, err)
	}
	if project == nil {
		r.AddErrors(fmt.Sprintf("Project %s for patch case %d does not exist.", patch.ProjectCode, index), CaseUnknownProject, r.path())
		return r, nil
	}

	c, err := cache.GetCaseBySubmitterCaseIdAndProjectId(ctx, patch.SubmitterCaseId, project.ID)
	if err != nil {
		return nil, fmt.Errorf("get case by submitter_case_id %q and project_id %d: %w", patch.SubmitterCaseId, project.ID, err)
	}
	if c == nil {
		r.AddErrors(fmt.Sprintf("Case (%s / %s) does not exist; cannot attach sequencing experiments.", patch.ProjectCode, patch.SubmitterCaseId), CaseNotFoundForAttach, r.path())
		return r, nil
	}
	r.CaseID = &c.ID

	if patch.DiagnosticLabCode != "" {
		lab, err := cache.GetOrganizationByCode(ctx, patch.DiagnosticLabCode)
		if err != nil {
			return nil, fmt.Errorf("get organization by code %q: %w", patch.DiagnosticLabCode, err)
		}
		if lab == nil {
			r.AddErrors(
				fmt.Sprintf("Diagnostic lab %q for case (%s / %s) does not exist.", patch.DiagnosticLabCode, patch.ProjectCode, patch.SubmitterCaseId),
				CaseUnknownDiagnosticLab, // CASE-004 — same code the POST path uses for an unknown lab.
				fmt.Sprintf("%s.diagnostic_lab_code", r.path()),
			)
		} else {
			r.DiagnosisLabCodeUpdate = patch.DiagnosticLabCode
		}
	}

	seqExps, err := resolveSequencingExperimentsForAttach(ctx, cache, patch.SequencingExperiments, &r.BaseValidationRecord, r.path())
	if err != nil {
		return nil, err
	}
	r.SequencingExperiments = seqExps

	if len(patch.Tasks) > 0 {
		if err := validatePatchTasks(ctx, bv, cache, patch, index, r); err != nil {
			return nil, err
		}
	}

	return r, nil
}

// resolveSequencingExperimentsForAttach looks up each incoming sequencing experiment by its
// natural key and returns the resolved entities keyed by id (for case_has_sequencing_experiment
// link creation). A missing experiment is reported as SEQ-007 against
// "<pathPrefix>.sequencing_experiments[j]" and skipped. Null array entries are skipped
// (binding is omitempty,dive — no element-level required). Shared by the PATCH and PUT
// (merge-if-present) case flows.
func resolveSequencingExperimentsForAttach(ctx context.Context, cache *batchval.BatchValidationCache, seqExps []*types.CaseSequencingExperimentBatch, base *batchval.BaseValidationRecord, pathPrefix string) (map[int]*types.SequencingExperiment, error) {
	resolved := make(map[int]*types.SequencingExperiment)
	for j, se := range seqExps {
		if se == nil {
			continue
		}
		seqExp, err := cache.GetSequencingExperimentByAliquotAndSubmitterSample(ctx, se.Aliquot, se.SubmitterSampleId, se.SampleOrganizationCode)
		if err != nil {
			return nil, fmt.Errorf("get sequencing experiment (%s / %s / %s): %w", se.SampleOrganizationCode, se.SubmitterSampleId, se.Aliquot, err)
		}
		if seqExp == nil {
			base.AddErrors(
				fmt.Sprintf("Sequencing experiment (%s / %s / %s) does not exist.", se.SampleOrganizationCode, se.SubmitterSampleId, se.Aliquot),
				SequencingExperimentNotFound,
				fmt.Sprintf("%s.sequencing_experiments[%d]", pathPrefix, j),
			)
			continue
		}
		resolved[seqExp.ID] = seqExp
	}
	return resolved, nil
}

// validatePatchTasks reuses the POST /cases/batch task machinery to validate the patch's
// tasks against the already-existing case. It drives a synthetic CaseValidationRecord
// (same package, same helpers) and merges its messages back onto the patch record so the
// batch report is identical to the POST path. The synthetic record is stored on
// r.Record for the persist phase. Tasks are only validated when the case exists.
func validatePatchTasks(ctx context.Context, bv *batchval.BatchValidationContext, cache *batchval.BatchValidationCache, patch types.CaseBatchPatch, index int, r *PatchCaseValidationRecord) error {
	if r.CaseID == nil {
		return nil // case missing — CASE-012 already raised; nothing to attach tasks to.
	}
	taskRecord, err := validateCaseTaskAttachments(ctx, bv, cache, patch.SubmitterCaseId, patch.ProjectCode, *r.CaseID, patch.SequencingExperiments, patch.Tasks, index)
	if err != nil {
		return err
	}
	if taskRecord != nil {
		r.Errors = append(r.Errors, taskRecord.Errors...)
		r.Warnings = append(r.Warnings, taskRecord.Warnings...)
		r.Infos = append(r.Infos, taskRecord.Infos...)
		r.Record = taskRecord
	}
	return nil
}

// validateCaseTaskAttachments validates the bioinformatic tasks to attach to an already-existing
// case, reusing the POST /cases/batch task machinery via a synthetic CaseValidationRecord. The
// aliquots referenced by the tasks are resolved against both the incoming sequencing experiments
// and those already attached to the case. Returns the synthetic record (whose Errors/Warnings/Infos
// the caller merges, and which the persist phase reuses via persistTask), or nil when there are no
// tasks to attach. Shared by the PATCH and PUT (merge-if-present) case flows.
func validateCaseTaskAttachments(ctx context.Context, bv *batchval.BatchValidationContext, cache *batchval.BatchValidationCache, submitterCaseId, projectCode string, caseID int, incomingSeqExps []*types.CaseSequencingExperimentBatch, incomingTasks []*types.CaseTaskBatch, index int) (*CaseValidationRecord, error) {
	// Drop null array entries up front — binding is omitempty,dive (no element-level required),
	// so the validators below (which assume non-nil) stay safe.
	tasks := make([]*types.CaseTaskBatch, 0, len(incomingTasks))
	for _, t := range incomingTasks {
		if t != nil {
			tasks = append(tasks, t)
		}
	}
	if len(tasks) == 0 {
		return nil, nil
	}
	seqExps := make([]*types.CaseSequencingExperimentBatch, 0, len(incomingSeqExps))
	seenAliquots := map[string]struct{}{}
	for _, se := range incomingSeqExps {
		if se != nil {
			seqExps = append(seqExps, se)
			seenAliquots[se.Aliquot] = struct{}{}
		}
	}

	attached, err := bv.SeqExpRepo.GetSequencingExperimentsByCaseId(ctx, caseID)
	if err != nil {
		return nil, fmt.Errorf("get sequencing experiments attached to case %d: %w", caseID, err)
	}
	for _, se := range attached {
		if _, ok := seenAliquots[se.Aliquot]; !ok {
			seqExps = append(seqExps, &types.CaseSequencingExperimentBatch{Aliquot: se.Aliquot})
			seenAliquots[se.Aliquot] = struct{}{}
		}
	}

	// Synthetic case carrying only what the task validators read: the tasks themselves and
	// the sequencing experiments their aliquots must resolve against (validateTaskAliquot
	// looks at Case.SequencingExperiments).
	taskCase := types.CaseBatch{
		SubmitterCaseId:       submitterCaseId,
		ProjectCode:           projectCode,
		SequencingExperiments: seqExps,
		Tasks:                 tasks,
	}
	taskRecord := NewCaseValidationRecord(bv, cache, taskCase, index)
	taskRecord.CaseID = &caseID

	if err := taskRecord.fetchTaskTypeCodes(ctx); err != nil {
		return nil, fmt.Errorf("fetch task type codes: %w", err)
	}
	if err := taskRecord.fetchDocumentCodes(ctx); err != nil {
		return nil, fmt.Errorf("fetch document codes: %w", err)
	}
	// Resolves sequencing experiments (by task aliquot), their existing task contexts, and
	// input/output documents already known to Radiant — needed by the validators below.
	if err := taskRecord.fetchFromTasks(ctx); err != nil {
		return nil, fmt.Errorf("fetch from tasks: %w", err)
	}
	if err := taskRecord.validateTasks(); err != nil {
		return nil, fmt.Errorf("validate tasks: %w", err)
	}
	if err := taskRecord.validateDocuments(); err != nil {
		return nil, fmt.Errorf("validate documents: %w", err)
	}
	return taskRecord, nil
}

// processPatchCaseBatch handles PATCH /cases/batch: it links existing
// sequencing experiments to an existing case (case_has_sequencing_experiment). It never
// creates the case — a missing case is CASE-012, a missing experiment is SEQ-007.
func processPatchCaseBatch(ctx context.Context, bv *batchval.BatchValidationContext, batch *types.Batch, db *gorm.DB) error {
	var patches []types.CaseBatchPatch
	if err := json.Unmarshal([]byte(batch.Payload), &patches); err != nil {
		batchval.ProcessUnexpectedError(ctx, batch, fmt.Errorf("error unmarshalling patch_case batch: %v", err), bv.BatchRepo)
		return nil
	}

	cache := batchval.NewBatchValidationCache(bv)
	var records []*PatchCaseValidationRecord
	for i, p := range patches {
		if err := ctx.Err(); err != nil {
			return err
		}
		rec, err := validatePatchCaseRecord(ctx, bv, cache, p, i)
		if err != nil {
			batchval.ProcessUnexpectedError(ctx, batch, fmt.Errorf("error validating patch_case batch: %v", err), bv.BatchRepo)
			return nil
		}
		records = append(records, rec)
	}

	slog.InfoContext(ctx, "patch_case batch processed", slog.String("batch_id", batch.ID), slog.Int("records", len(records)))

	if err := persistBatchAndPatchCaseRecords(ctx, db, batch, records); err != nil {
		if errors.Is(err, context.Canceled) {
			return err
		}
		batchval.ProcessUnexpectedError(ctx, batch, fmt.Errorf("error processing patch_case batch records: %v", err), bv.BatchRepo)
		return nil
	}
	return nil
}

func persistBatchAndPatchCaseRecords(ctx context.Context, db *gorm.DB, batch *types.Batch, records []*PatchCaseValidationRecord) error {
	return db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		batchRepo := postgres.NewBatchRepository(database.PostgresDB{DB: tx})
		rowsUpdated, err := batchval.UpdateBatch(ctx, batch, records, batchRepo)
		if err != nil {
			return err
		}
		if rowsUpdated == 0 {
			return fmt.Errorf("no rows updated when updating patch_case batch %v", batch.ID)
		}
		if batch.DryRun || batch.Status != types.BatchStatusSuccess {
			return nil
		}

		casesRepo := postgres.NewCasesRepository(database.PostgresDB{DB: tx})
		storageCtx := NewStorageContext(tx)
		storageCtx.TenantCode = batch.TenantCode
		for _, rec := range records {
			if rec.CaseID == nil {
				continue
			}
			if rec.DiagnosisLabCodeUpdate != "" {
				if err := casesRepo.UpdateCaseDiagnosisLabCode(ctx, *rec.CaseID, rec.DiagnosisLabCodeUpdate); err != nil {
					return fmt.Errorf("failed to update diagnosis_lab_code on case %d: %w", *rec.CaseID, err)
				}
			}
			for _, se := range rec.SequencingExperiments {
				chse := types.CaseHasSequencingExperiment{CaseID: *rec.CaseID, SequencingExperimentID: se.ID}
				if err := casesRepo.CreateCaseHasSequencingExperiment(ctx, &chse); err != nil {
					return fmt.Errorf("failed to attach sequencing experiment %d to case %d: %w", se.ID, *rec.CaseID, err)
				}
			}
			// Attach tasks + documents (task / task_context / document / task_has_document),
			// reusing the POST persist logic via the synthetic record built at validation time.
			if rec.Record != nil {
				if err := persistTask(ctx, storageCtx, rec.Record); err != nil {
					return fmt.Errorf("failed to persist tasks for patch case %d: %w", *rec.CaseID, err)
				}
			}
		}
		return nil
	})
}
