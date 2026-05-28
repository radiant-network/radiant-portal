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

// CaseSequencingExperimentValidationRecord validates one PATCH entry that attaches
// already-existing sequencing experiments to an already-existing case.
type CaseSequencingExperimentValidationRecord struct {
	batchval.BaseValidationRecord
	Patch                 types.CaseSequencingExperimentPatch
	CaseID                *int
	SequencingExperiments map[int]*types.SequencingExperiment
}

func (r *CaseSequencingExperimentValidationRecord) GetBase() *batchval.BaseValidationRecord {
	return &r.BaseValidationRecord
}

func (r *CaseSequencingExperimentValidationRecord) GetResourceType() string {
	return types.CaseSequencingExperimentBatchType
}

func (r *CaseSequencingExperimentValidationRecord) path() string {
	return fmt.Sprintf("%s[%d]", r.GetResourceType(), r.Index)
}

func validateCaseSequencingExperimentRecord(cache *batchval.BatchValidationCache, patch types.CaseSequencingExperimentPatch, index int) (*CaseSequencingExperimentValidationRecord, error) {
	r := &CaseSequencingExperimentValidationRecord{
		BaseValidationRecord:  batchval.BaseValidationRecord{Cache: cache, Index: index},
		Patch:                 patch,
		SequencingExperiments: make(map[int]*types.SequencingExperiment),
	}

	project, err := cache.GetProjectByCode(patch.ProjectCode)
	if err != nil {
		return nil, fmt.Errorf("get project by code %q: %w", patch.ProjectCode, err)
	}
	if project == nil {
		r.AddErrors(fmt.Sprintf("Project %s for case sequencing experiment %d does not exist.", patch.ProjectCode, index), CaseUnknownProject, r.path())
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

// processCaseSequencingExperimentBatch handles PATCH /cases/batch: it links existing
// sequencing experiments to an existing case (case_has_sequencing_experiment). It never
// creates the case — a missing case is CASE-012, a missing experiment is SEQ-007.
func processCaseSequencingExperimentBatch(ctx *batchval.BatchValidationContext, batch *types.Batch, db *gorm.DB) {
	var patches []types.CaseSequencingExperimentPatch
	if err := json.Unmarshal([]byte(batch.Payload), &patches); err != nil {
		batchval.ProcessUnexpectedError(batch, fmt.Errorf("error unmarshalling case sequencing experiment batch: %v", err), ctx.BatchRepo)
		return
	}

	cache := batchval.NewBatchValidationCache(ctx)
	var records []*CaseSequencingExperimentValidationRecord
	for i, p := range patches {
		rec, err := validateCaseSequencingExperimentRecord(cache, p, i)
		if err != nil {
			batchval.ProcessUnexpectedError(batch, fmt.Errorf("error validating case sequencing experiment batch: %v", err), ctx.BatchRepo)
			return
		}
		records = append(records, rec)
	}

	glog.Infof("Case sequencing experiment batch %v processed with %d records", batch.ID, len(records))

	if err := persistBatchAndCaseSequencingExperimentRecords(db, batch, records); err != nil {
		batchval.ProcessUnexpectedError(batch, fmt.Errorf("error processing case sequencing experiment batch records: %v", err), ctx.BatchRepo)
		return
	}
}

func persistBatchAndCaseSequencingExperimentRecords(db *gorm.DB, batch *types.Batch, records []*CaseSequencingExperimentValidationRecord) error {
	return db.Transaction(func(tx *gorm.DB) error {
		batchRepo := repository.NewBatchRepository(tx)
		rowsUpdated, err := batchval.UpdateBatch(batch, records, batchRepo)
		if err != nil {
			return err
		}
		if rowsUpdated == 0 {
			return fmt.Errorf("no rows updated when updating case sequencing experiment batch %v", batch.ID)
		}
		if batch.DryRun || batch.Status != types.BatchStatusSuccess {
			return nil
		}

		casesRepo := repository.NewCasesRepository(tx)
		for _, rec := range records {
			if rec.CaseID == nil {
				continue
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
