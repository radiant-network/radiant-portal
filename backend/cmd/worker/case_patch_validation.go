package main

import (
	"encoding/json"
	"fmt"

	"github.com/golang/glog"
	"github.com/radiant-network/radiant-api/internal/batchval"
	"github.com/radiant-network/radiant-api/internal/repository"
	"github.com/radiant-network/radiant-api/internal/types"
	"gorm.io/gorm"
)

// PatchCaseValidationRecord validates one PATCH entry that attaches
// already-existing sequencing experiments to an already-existing case.
type PatchCaseValidationRecord struct {
	batchval.BaseValidationRecord
	Patch                  types.CaseBatchPatch
	CaseID                 *int
	SequencingExperiments  map[int]*types.SequencingExperiment
	DiagnosisLabCodeUpdate string
}

func (r *PatchCaseValidationRecord) GetBase() *batchval.BaseValidationRecord {
	return &r.BaseValidationRecord
}

func (r *PatchCaseValidationRecord) GetResourceType() string {
	return types.PatchCaseBatchType
}

func (r *PatchCaseValidationRecord) path() string {
	return fmt.Sprintf("%s[%d]", r.GetResourceType(), r.Index)
}

func validatePatchCaseRecord(cache *batchval.BatchValidationCache, patch types.CaseBatchPatch, index int) (*PatchCaseValidationRecord, error) {
	r := &PatchCaseValidationRecord{
		BaseValidationRecord:  batchval.BaseValidationRecord{Cache: cache, Index: index},
		Patch:                 patch,
		SequencingExperiments: make(map[int]*types.SequencingExperiment),
	}

	project, err := cache.GetProjectByCode(patch.ProjectCode)
	if err != nil {
		return nil, fmt.Errorf("get project by code %q: %w", patch.ProjectCode, err)
	}
	if project == nil {
		r.AddErrors(fmt.Sprintf("Project %s for patch case %d does not exist.", patch.ProjectCode, index), CaseUnknownProject, r.path())
		return r, nil
	}

	c, err := cache.GetCaseBySubmitterCaseIdAndProjectId(patch.SubmitterCaseId, project.ID)
	if err != nil {
		return nil, fmt.Errorf("get case by submitter_case_id %q and project_id %d: %w", patch.SubmitterCaseId, project.ID, err)
	}
	if c == nil {
		r.AddErrors(fmt.Sprintf("Case (%s / %s) does not exist; cannot attach sequencing experiments.", patch.ProjectCode, patch.SubmitterCaseId), CaseNotFoundForAttach, r.path())
		return r, nil
	}
	r.CaseID = &c.ID

	if patch.DiagnosticLabCode != "" {
		lab, err := cache.GetOrganizationByCode(patch.DiagnosticLabCode)
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

	for j, se := range patch.SequencingExperiments {
		seqExp, err := cache.GetSequencingExperimentByAliquotAndSubmitterSample(se.Aliquot, se.SubmitterSampleId, se.SampleOrganizationCode)
		if err != nil {
			return nil, fmt.Errorf("get sequencing experiment (%s / %s / %s): %w", se.SampleOrganizationCode, se.SubmitterSampleId, se.Aliquot, err)
		}
		if seqExp == nil {
			r.AddErrors(
				fmt.Sprintf("Sequencing experiment (%s / %s / %s) does not exist.", se.SampleOrganizationCode, se.SubmitterSampleId, se.Aliquot),
				SequencingExperimentNotFound,
				fmt.Sprintf("%s.sequencing_experiments[%d]", r.path(), j),
			)
			continue
		}
		r.SequencingExperiments[seqExp.ID] = seqExp
	}

	return r, nil
}

// processPatchCaseBatch handles PATCH /cases/batch: it links existing
// sequencing experiments to an existing case (case_has_sequencing_experiment). It never
// creates the case — a missing case is CASE-012, a missing experiment is SEQ-007.
func processPatchCaseBatch(ctx *batchval.BatchValidationContext, batch *types.Batch, db *gorm.DB) {
	var patches []types.CaseBatchPatch
	if err := json.Unmarshal([]byte(batch.Payload), &patches); err != nil {
		batchval.ProcessUnexpectedError(batch, fmt.Errorf("error unmarshalling patch_case batch: %v", err), ctx.BatchRepo)
		return
	}

	cache := batchval.NewBatchValidationCache(ctx)
	var records []*PatchCaseValidationRecord
	for i, p := range patches {
		rec, err := validatePatchCaseRecord(cache, p, i)
		if err != nil {
			batchval.ProcessUnexpectedError(batch, fmt.Errorf("error validating patch_case batch: %v", err), ctx.BatchRepo)
			return
		}
		records = append(records, rec)
	}

	glog.Infof("Patch_case batch %v processed with %d records", batch.ID, len(records))

	if err := persistBatchAndPatchCaseRecords(db, batch, records); err != nil {
		batchval.ProcessUnexpectedError(batch, fmt.Errorf("error processing patch_case batch records: %v", err), ctx.BatchRepo)
		return
	}
}

func persistBatchAndPatchCaseRecords(db *gorm.DB, batch *types.Batch, records []*PatchCaseValidationRecord) error {
	return db.Transaction(func(tx *gorm.DB) error {
		batchRepo := repository.NewBatchRepository(tx)
		rowsUpdated, err := batchval.UpdateBatch(batch, records, batchRepo)
		if err != nil {
			return err
		}
		if rowsUpdated == 0 {
			return fmt.Errorf("no rows updated when updating patch_case batch %v", batch.ID)
		}
		if batch.DryRun || batch.Status != types.BatchStatusSuccess {
			return nil
		}

		casesRepo := repository.NewCasesRepository(tx)
		for _, rec := range records {
			if rec.CaseID == nil {
				continue
			}
			if rec.DiagnosisLabCodeUpdate != "" {
				if err := casesRepo.UpdateCaseDiagnosisLabCode(*rec.CaseID, rec.DiagnosisLabCodeUpdate); err != nil {
					return fmt.Errorf("failed to update diagnosis_lab_code on case %d: %w", *rec.CaseID, err)
				}
			}
			for _, se := range rec.SequencingExperiments {
				chse := types.CaseHasSequencingExperiment{CaseID: *rec.CaseID, SequencingExperimentID: se.ID}
				if err := casesRepo.CreateCaseHasSequencingExperiment(&chse); err != nil {
					return fmt.Errorf("failed to attach sequencing experiment %d to case %d: %w", se.ID, *rec.CaseID, err)
				}
			}
		}
		return nil
	})
}
