package main

import (
	"encoding/json"
	"fmt"

	"github.com/golang/glog"
	"github.com/radiant-network/radiant-api/internal/repository"
	"github.com/radiant-network/radiant-api/internal/types"
	"gorm.io/gorm"
)

const (
	IdenticalCaseInBatchCode = "CASE-001"
)

var CaseRelatedTaskTypes = map[string]struct{}{
	"family_variant_calling":     {},
	"tumor_only_variant_calling": {},
	//"alignment_somatic_variant_calling": {}, // NOT SUPPORTED YET
}

type CaseKey struct {
	ProjectCode     string
	SubmitterCaseID string
}

type StorageContext struct {
	CasesRepo   *repository.CasesRepository
	OrgRepo     *repository.OrganizationRepository
	PatientRepo *repository.PatientsRepository
	ProjectRepo *repository.ProjectRepository
	SeqExpRepo  *repository.SequencingExperimentRepository
	DocRepo     *repository.DocumentsRepository
	ObsCat      *repository.ObservationCategoricalRepository
	FamilyRepo  *repository.FamilyRepository
	TaskRepo    *repository.TaskRepository
}

type CaseValidationRecord struct {
	BaseValidationRecord
	Context                *BatchValidationContext
	Case                   types.CaseBatch
	CaseID                 *int
	ProjectID              *int
	SubmitterCaseID        string
	AnalysisCatalogID      *int
	OrderingOrganizationID *int
	DiagnosisLabID         *int

	// Necessary to persist the case
	Patients              map[string]*types.Patient
	SequencingExperiments []*types.SequencingExperiment
	TaskHasDocuments      []*types.TaskHasDocument
}

func (r *CaseValidationRecord) GetBase() *BaseValidationRecord {
	return &r.BaseValidationRecord
}

func (r *CaseValidationRecord) GetResourceType() string {
	return types.CaseBatchType
}

func (r *CaseValidationRecord) preFetchValidationInfo(
	ctx *BatchValidationContext,
) error {
	p, err := ctx.ProjectRepo.GetProjectByCode(r.Case.ProjectCode)
	if err != nil {
		return fmt.Errorf("get project by code %q: %w", r.Case.ProjectCode, err)
	}
	if p != nil {
		r.ProjectID = &p.ID
	}

	a, err := ctx.CasesRepo.GetCaseAnalysisCatalogIdByCode(r.Case.AnalysisCode)
	if err != nil {
		return fmt.Errorf("get analysis catalog by code %q: %w", r.Case.AnalysisCode, err)
	}
	if a != nil {
		r.AnalysisCatalogID = &a.ID
	}

	org, err := ctx.OrgRepo.GetOrganizationByCode(r.Case.OrderingOrganizationCode)
	if err != nil {
		return fmt.Errorf("get organization by code %q: %w", r.Case.OrderingOrganizationCode, err)
	}
	if org != nil {
		r.OrderingOrganizationID = &org.ID
	}

	diagnosisLabOrg, err := ctx.OrgRepo.GetOrganizationByCode(r.Case.DiagnosticLabCode)
	if err != nil {
		return fmt.Errorf("get organization by code %q: %w", r.Case.DiagnosticLabCode, err)
	}
	if diagnosisLabOrg != nil {
		r.DiagnosisLabID = &diagnosisLabOrg.ID
	}

	for _, cp := range r.Case.Patients {
		patients, err := ctx.PatientRepo.GetPatientByOrgCodeAndSubmitterPatientId(cp.PatientOrganizationCode, cp.SubmitterPatientId)
		if err != nil {
			return fmt.Errorf("failed to get patient by org code %q and submitter patient id %q: %w", cp.PatientOrganizationCode, cp.SubmitterPatientId, err)
		}
		if patients != nil {
			r.Patients[fmt.Sprintf("%s/%s", cp.PatientOrganizationCode, cp.SubmitterPatientId)] = patients
		}
	}

	for _, se := range r.Case.SequencingExperiments {
		seqExp, err := ctx.SeqExpRepo.GetSequencingExperimentByAliquotAndSubmitterSample(se.Aliquot, se.SubmitterSampleId, se.SampleOrganizationCode)
		if err != nil {
			return fmt.Errorf("failed to get sequencing experiment by aliquot, submitter sample id and sample organization code %q: %w", se.Aliquot, err)
		}
		if seqExp == nil {
			continue
		}
		r.SequencingExperiments = append(r.SequencingExperiments, seqExp)
	}

	return nil
}

func validateCaseBatch(ctx *BatchValidationContext, cases []types.CaseBatch) ([]*CaseValidationRecord, error) {
	var records []*CaseValidationRecord
	visited := map[CaseKey]struct{}{}

	for idx, c := range cases {
		key := CaseKey{
			ProjectCode:     c.ProjectCode,
			SubmitterCaseID: c.SubmitterCaseId,
		}

		record, err := validateCaseRecord(ctx, c, idx)
		if err != nil {
			return nil, fmt.Errorf("error during case validation: %v", err)
		}

		validateUniquenessInBatch(record, key, visited, IdenticalCaseInBatchCode, []string{c.ProjectCode, c.SubmitterCaseId})
		records = append(records, record)
	}
	return records, nil
}

func validateCaseRecord(
	ctx *BatchValidationContext,
	c types.CaseBatch,
	index int,
) (*CaseValidationRecord, error) {
	cr := CaseValidationRecord{
		BaseValidationRecord: BaseValidationRecord{Index: index},
		Case:                 c,
		ProjectID:            nil,
		SubmitterCaseID:      "",
		Patients:             make(map[string]*types.Patient),
		Context:              ctx,
	}

	if unexpectedErr := cr.preFetchValidationInfo(ctx); unexpectedErr != nil {
		return nil, fmt.Errorf("error during pre-fetching case validation info: %v", unexpectedErr)
	}

	// TODO: Add field-level validations here

	return &cr, nil
}

func processCaseBatch(ctx *BatchValidationContext, batch *types.Batch, db *gorm.DB) {
	payload := []byte(batch.Payload)
	var caseBatches []types.CaseBatch

	if unexpectedErr := json.Unmarshal(payload, &caseBatches); unexpectedErr != nil {
		processUnexpectedError(batch, fmt.Errorf("error unmarshalling case batch: %v", unexpectedErr), ctx.BatchRepo)
		return
	}

	records, unexpectedErr := validateCaseBatch(ctx, caseBatches)
	if unexpectedErr != nil {
		processUnexpectedError(batch, fmt.Errorf("error case batch validation: %v", unexpectedErr), ctx.BatchRepo)
		return
	}

	glog.Infof("Case batch %v processed with %d records", batch.ID, len(records))

	err := persistBatchAndCaseRecords(db, batch, records)
	if err != nil {
		processUnexpectedError(batch, fmt.Errorf("error processing case batch records: %v", err), ctx.BatchRepo)
		return
	}
}

func getProbandPatient(caseRecord *CaseValidationRecord) (*types.Patient, error) {
	if caseRecord == nil {
		return nil, nil
	}

	for _, p := range caseRecord.Case.Patients {
		if p.RelationToProbandCode == "proband" {
			if patient, ok := caseRecord.Patients[fmt.Sprintf("%s/%s", p.PatientOrganizationCode, p.SubmitterPatientId)]; ok {
				return patient, nil
			} else {
				return nil, fmt.Errorf("failed to find proband patient for case %q", caseRecord.Case.SubmitterCaseId)
			}
		}
	}

	return nil, nil
}

func persistCase(sctx *StorageContext, cr *CaseValidationRecord) error {
	if cr == nil {
		return nil
	}

	if cr.ProjectID == nil {
		return fmt.Errorf("project ID is nil for case %q", cr.Case.SubmitterCaseId)
	}

	if cr.AnalysisCatalogID == nil {
		return fmt.Errorf("analysis catalog ID is nil for case %q", cr.Case.SubmitterCaseId)
	}

	if cr.OrderingOrganizationID == nil {
		return fmt.Errorf("ordering organization ID is nil for case %q", cr.Case.SubmitterCaseId)
	}

	if cr.DiagnosisLabID == nil {
		return fmt.Errorf("diagnosis lab ID is nil for case %q", cr.Case.SubmitterCaseId)
	}

	proband, err := getProbandPatient(cr)
	if err != nil {
		return fmt.Errorf("failed to get proband patient %w", err)
	}
	if proband == nil {
		return fmt.Errorf("proband patient not found for case %q", cr.Case.SubmitterCaseId)
	}

	c := types.Case{
		ProbandID:              proband.ID,
		ProjectID:              *cr.ProjectID,
		AnalysisCatalogID:      *cr.AnalysisCatalogID,
		CaseTypeCode:           cr.Case.Type,
		CaseCategoryCode:       cr.Case.CategoryCode,
		PriorityCode:           cr.Case.PriorityCode,
		StatusCode:             cr.Case.StatusCode,
		ResolutionStatusCode:   cr.Case.ResolutionStatusCode,
		PrimaryCondition:       cr.Case.PrimaryConditionValue,
		ConditionCodeSystem:    cr.Case.PrimaryConditionCodeSystem,
		OrderingPhysician:      cr.Case.OrderingPhysician,
		OrderingOrganizationID: *cr.OrderingOrganizationID,
		DiagnosisLabID:         *cr.DiagnosisLabID,
		SubmitterCaseID:        cr.Case.SubmitterCaseId,
		Note:                   cr.Case.Note,
	}

	if err := sctx.CasesRepo.CreateCase(&c); err != nil {
		return fmt.Errorf("failed to persist case %w", err)
	}

	// Gorm automatically sets the ID on the struct after creation
	cr.CaseID = &c.ID

	return nil
}

func insertCaseRecords(
	ctx *StorageContext,
	records []*CaseValidationRecord,
) error {
	for _, record := range records {
		if record.Skipped {
			continue
		}

		if err := persistCase(ctx, record); err != nil {
			return fmt.Errorf("failed to persist case for case %q: %w", record.Case.SubmitterCaseId, err)
		}
		//if err := persistFamily(ctx, record); err != nil {
		//	return fmt.Errorf("failed to persist family for case %q: %w", record.Case.SubmitterCaseId, err)
		//}
		//if err := persistObservationCategorical(ctx, record); err != nil {
		//	return fmt.Errorf("failed to persist observations for case %q: %w", record.Case.SubmitterCaseId, err)
		//}
		//if err := persistCaseHasSequencingExperiment(ctx, record); err != nil {
		//	return fmt.Errorf("failed to persist sequencing experiments for case %q: %w", record.Case.SubmitterCaseId, err)
		//}
		//if err := persistTask(ctx, record); err != nil {
		//	return fmt.Errorf("failed to persist tasks for case %q: %w", record.Case.SubmitterCaseId, err)
		//}
	}
	return nil
}

func persistBatchAndCaseRecords(db *gorm.DB, batch *types.Batch, records []*CaseValidationRecord) error {
	return db.Transaction(func(tx *gorm.DB) error {
		batchRepo := repository.NewBatchRepository(tx)
		txCtx := StorageContext{
			CasesRepo:   repository.NewCasesRepository(tx),
			OrgRepo:     repository.NewOrganizationRepository(tx),
			PatientRepo: repository.NewPatientsRepository(tx),
			ProjectRepo: repository.NewProjectRepository(tx),
			SeqExpRepo:  repository.NewSequencingExperimentRepository(tx),
			DocRepo:     repository.NewDocumentsRepository(tx),
			ObsCat:      repository.NewObservationCategoricalRepository(tx),
			FamilyRepo:  repository.NewFamilyRepository(tx),
			TaskRepo:    repository.NewTaskRepository(tx),
		}
		rowsUpdated, unexpectedErrUpdate := updateBatch(batch, records, batchRepo)
		if unexpectedErrUpdate != nil {
			return unexpectedErrUpdate
		}
		if rowsUpdated == 0 {
			return fmt.Errorf("no rows updated when updating case batch %v", batch.ID)
		}
		if batch.DryRun || batch.Status != types.BatchStatusSuccess {
			return nil
		}

		if err := insertCaseRecords(&txCtx, records); err != nil {
			return fmt.Errorf("error during case insertion %w", err)
		}
		return nil
	})
}
