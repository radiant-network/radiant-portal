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
}

type CaseKey struct {
	ProjectCode     string
	SubmitterCaseID string
}

type StorageContext struct {
	CasesRepo  *repository.CasesRepository
	DocRepo    *repository.DocumentsRepository
	ObsCatRepo *repository.ObservationCategoricalRepository
	FamilyRepo *repository.FamilyRepository
	TaskRepo   *repository.TaskRepository
}

func NewStorageContext(db *gorm.DB) *StorageContext {
	return &StorageContext{
		CasesRepo:  repository.NewCasesRepository(db),
		DocRepo:    repository.NewDocumentsRepository(db),
		ObsCatRepo: repository.NewObservationCategoricalRepository(db),
		FamilyRepo: repository.NewFamilyRepository(db),
		TaskRepo:   repository.NewTaskRepository(db),
	}
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
	Documents             map[string]*types.Document
}

func NewCaseValidationRecord(ctx *BatchValidationContext, c types.CaseBatch, index int) *CaseValidationRecord {
	return &CaseValidationRecord{
		BaseValidationRecord: BaseValidationRecord{
			Index: index,
		},
		Case:      c,
		Context:   ctx,
		Patients:  make(map[string]*types.Patient),
		Documents: make(map[string]*types.Document),
	}
}

func (r *CaseValidationRecord) GetBase() *BaseValidationRecord {
	return &r.BaseValidationRecord
}

func (r *CaseValidationRecord) GetResourceType() string {
	return types.CaseBatchType
}

func (r *CaseValidationRecord) getProbandFromPatients() (*types.Patient, error) {
	for _, p := range r.Case.Patients {
		if p.RelationToProbandCode == "proband" {
			if patient, ok := r.Patients[fmt.Sprintf("%s/%s", p.PatientOrganizationCode, p.SubmitterPatientId)]; ok {
				return patient, nil
			} else {
				return nil, fmt.Errorf("failed to find proband patient for case %q", r.Case.SubmitterCaseId)
			}
		}
	}
	return nil, nil
}

func (r *CaseValidationRecord) fetchProject(ctx *BatchValidationContext) error {
	p, err := ctx.ProjectRepo.GetProjectByCode(r.Case.ProjectCode)
	if err != nil {
		return fmt.Errorf("get project by code %q: %w", r.Case.ProjectCode, err)
	}
	if p != nil {
		r.ProjectID = &p.ID
	}
	return nil
}

func (r *CaseValidationRecord) fetchAnalysisCatalog(ctx *BatchValidationContext) error {
	a, err := ctx.CasesRepo.GetCaseAnalysisCatalogIdByCode(r.Case.AnalysisCode)
	if err != nil {
		return fmt.Errorf("get analysis catalog by code %q: %w", r.Case.AnalysisCode, err)
	}
	if a != nil {
		r.AnalysisCatalogID = &a.ID
	}
	return nil
}

func (r *CaseValidationRecord) fetchOrganizations(ctx *BatchValidationContext) error {
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
	return nil
}

func (r *CaseValidationRecord) fetchPatients(ctx *BatchValidationContext) error {
	for _, cp := range r.Case.Patients {
		patients, err := ctx.PatientRepo.GetPatientByOrgCodeAndSubmitterPatientId(cp.PatientOrganizationCode, cp.SubmitterPatientId)
		if err != nil {
			return fmt.Errorf("failed to get patient by org code %q and submitter patient id %q: %w", cp.PatientOrganizationCode, cp.SubmitterPatientId, err)
		}
		if patients != nil {
			r.Patients[fmt.Sprintf("%s/%s", cp.PatientOrganizationCode, cp.SubmitterPatientId)] = patients
		}
	}
	return nil
}

func (r *CaseValidationRecord) fetchFromSequencingExperiments(ctx *BatchValidationContext) error {
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

func (r *CaseValidationRecord) fetchFromTasks(ctx *BatchValidationContext) error {
	for _, t := range r.Case.Tasks {
		aliquot := t.Aliquot
		seqs, err := ctx.SeqExpRepo.GetSequencingExperimentByAliquot(aliquot)
		if err != nil {
			return fmt.Errorf("failed to get sequencing experiment by aliquot %q for task %q: %w", aliquot, r.Case.SubmitterCaseId, err)
		}
		if seqs == nil {
			continue
		}

		for _, se := range seqs {
			r.SequencingExperiments = append(r.SequencingExperiments, &se)
		}

		for _, doc := range t.InputDocuments {
			d, err := ctx.DocRepo.GetDocumentByUrl(doc.Url)
			if err != nil {
				return fmt.Errorf("failed to get document by url %q for task %q: %w", doc.Url, r.Case.SubmitterCaseId, err)
			}
			if d != nil {
				r.Documents[doc.Url] = d
			}
		}
	}
	return nil
}

func (r *CaseValidationRecord) fetchValidationInfos() error {

	if err := r.fetchProject(r.Context); err != nil {
		return fmt.Errorf("failed to resolve project: %w", err)
	}
	if err := r.fetchAnalysisCatalog(r.Context); err != nil {
		return fmt.Errorf("failed to resolve analysis catalog: %w", err)
	}
	if err := r.fetchOrganizations(r.Context); err != nil {
		return fmt.Errorf("failed to resolve organizations: %w", err)
	}
	if err := r.fetchPatients(r.Context); err != nil {
		return fmt.Errorf("failed to resolve patients: %w", err)
	}
	if err := r.fetchFromSequencingExperiments(r.Context); err != nil {
		return fmt.Errorf("failed to resolve sequencing experiments: %w", err)
	}
	if err := r.fetchFromTasks(r.Context); err != nil {
		return fmt.Errorf("failed to resolve tasks: %w", err)
	}
	return nil
}

func persistBatchAndCaseRecords(db *gorm.DB, batch *types.Batch, records []*CaseValidationRecord) error {
	return db.Transaction(func(tx *gorm.DB) error {
		batchRepo := repository.NewBatchRepository(tx)
		txCtx := NewStorageContext(db)
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

		if err := persistCaseRecords(txCtx, records); err != nil {
			return fmt.Errorf("error during case insertion %w", err)
		}
		return nil
	})
}

func persistCase(ctx *StorageContext, cr *CaseValidationRecord) error {
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

	proband, err := cr.getProbandFromPatients()
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

	if err := ctx.CasesRepo.CreateCase(&c); err != nil {
		return fmt.Errorf("failed to persist case %w", err)
	}

	// Gorm automatically sets the ID on the struct after creation
	cr.CaseID = &c.ID

	// Persist CaseHasSequencingExperiment relationships
	for _, se := range cr.SequencingExperiments {
		chse := types.CaseHasSequencingExperiment{
			CaseID:                 *cr.CaseID,
			SequencingExperimentID: se.ID,
		}

		err := ctx.CasesRepo.CreateCaseHasSequencingExperiment(&chse)
		if err != nil {
			return fmt.Errorf("failed to persist case has sequencing experiment for case %q and sequencing experiment %q: %w", cr.SubmitterCaseID, se.ID, err)
		}
	}

	return nil
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

func persistCaseRecords(
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
		if record.CaseID == nil {
			return fmt.Errorf("case ID is nil after persisting case for case %q", record.Case.SubmitterCaseId)
		}
		if err := persistFamily(ctx, record); err != nil {
			return fmt.Errorf("failed to persist family for case %q: %w", record.Case.SubmitterCaseId, err)
		}
		if err := persistObservationCategorical(ctx, record); err != nil {
			return fmt.Errorf("failed to persist observations for case %q: %w", record.Case.SubmitterCaseId, err)
		}
		if err := persistTask(ctx, record); err != nil {
			return fmt.Errorf("failed to persist tasks for case %q: %w", record.Case.SubmitterCaseId, err)
		}
	}
	return nil
}

func persistFamily(ctx *StorageContext, cr *CaseValidationRecord) error {
	for _, p := range cr.Case.Patients {
		patient, ok := cr.Patients[fmt.Sprintf("%s/%s", p.PatientOrganizationCode, p.SubmitterPatientId)]
		if !ok {
			return fmt.Errorf("failed to find patient for family member %q in case %q", p.SubmitterPatientId, cr.Case.SubmitterCaseId)
		}
		familyMember := types.Family{
			CaseID:                    *cr.CaseID,
			FamilyMemberID:            patient.ID,
			RelationshipToProbandCode: p.RelationToProbandCode,
			AffectedStatusCode:        p.AffectedStatusCode,
		}
		if err := ctx.FamilyRepo.CreateFamily(&familyMember); err != nil {
			return fmt.Errorf("failed to persist family member %q for case %q: %w", p.SubmitterPatientId, cr.Case.SubmitterCaseId, err)
		}
	}
	return nil
}

func persistObservationCategorical(ctx *StorageContext, cr *CaseValidationRecord) error {
	for _, p := range cr.Case.Patients {

		patient, ok := cr.Patients[fmt.Sprintf("%s/%s", p.PatientOrganizationCode, p.SubmitterPatientId)]
		if !ok {
			return fmt.Errorf("failed to find patient for observations for patient %q in case %q", p.SubmitterPatientId, cr.Case.SubmitterCaseId)
		}

		for _, o := range p.ObservationsCategorical {
			obs := types.ObsCategorical{
				CaseID:             *cr.CaseID,
				PatientID:          patient.ID,
				ObservationCode:    o.Code,
				CodingSystem:       o.System,
				CodeValue:          o.Value,
				OnsetCode:          o.OnsetCode,
				InterpretationCode: o.InterpretationCode,
				Note:               o.Note,
			}

			if err := ctx.ObsCatRepo.CreateObservationCategorical(&obs); err != nil {
				return fmt.Errorf("failed to persist observation categorical for patient %q in case %q: %w", p.SubmitterPatientId, cr.Case.SubmitterCaseId, err)
			}
		}
	}
	return nil
}

func persistTask(ctx *StorageContext, cr *CaseValidationRecord) error {
	for _, t := range cr.Case.Tasks {
		task := types.Task{
			TaskTypeCode:    t.TypeCode,
			PipelineName:    t.PipelineName,
			PipelineVersion: t.PipelineVersion,
			GenomeBuild:     t.GenomeBuild,
		}
		err := ctx.TaskRepo.CreateTask(&task)
		if err != nil {
			return fmt.Errorf("failed to persist task for case %q: %w", cr.Case.SubmitterCaseId, err)
		}

		for _, se := range cr.SequencingExperiments {

			// Aliquot must match to create TaskContext relationship with SequencingExperiment and Task
			if se.Aliquot != t.Aliquot {
				continue
			}

			var c *int
			if _, isCaseRelated := CaseRelatedTaskTypes[t.TypeCode]; isCaseRelated {
				c = cr.CaseID
			}

			err := ctx.TaskRepo.CreateTaskContext(&types.TaskContext{
				TaskID:                 task.ID,
				SequencingExperimentID: &se.ID,
				CaseID:                 c,
			})
			if err != nil {
				return fmt.Errorf("failed to persist task context for case %q and task %q: %w", cr.Case.SubmitterCaseId, t.TypeCode, err)
			}
		}

		for _, doc := range t.InputDocuments {
			var documentID *int
			for _, d := range cr.Documents {
				if d.Url == doc.Url {
					documentID = &d.ID
					break
				}
			}
			if documentID == nil {
				return fmt.Errorf("failed to find input document by url %q for task %q in case %q", doc.Url, t.TypeCode, cr.Case.SubmitterCaseId)
			}

			err := ctx.TaskRepo.CreateTaskHasDocument(&types.TaskHasDocument{
				TaskID:     task.ID,
				DocumentID: *documentID,
				Type:       "input",
			})
			if err != nil {
				return fmt.Errorf("failed to persist task has document for case %q and task %q: %w", cr.Case.SubmitterCaseId, t.TypeCode, err)
			}
		}

		for _, doc := range t.OutputDocuments {
			d := types.Document{
				Name:             doc.Name,
				DataCategoryCode: doc.DataCategoryCode,
				DataTypeCode:     doc.DataTypeCode,
				FileFormatCode:   doc.FormatCode,
				Size:             doc.Size,
				Url:              doc.Url,
				Hash:             doc.Hash,
			}
			err := ctx.DocRepo.CreateDocument(&d)
			if err != nil {
				return fmt.Errorf("failed to persist document %q for case %q: %w", doc.Name, cr.Case.SubmitterCaseId, err)
			}

			err = ctx.TaskRepo.CreateTaskHasDocument(&types.TaskHasDocument{
				TaskID:     task.ID,
				DocumentID: d.ID,
				Type:       "output",
			})
			if err != nil {
				return fmt.Errorf("failed to persist task has document for case %q and task %q: %w", cr.Case.SubmitterCaseId, t.TypeCode, err)
			}
		}
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
	cr := NewCaseValidationRecord(ctx, c, index)
	if unexpectedErr := cr.fetchValidationInfos(); unexpectedErr != nil {
		return nil, fmt.Errorf("error during pre-fetching case validation info: %v", unexpectedErr)
	}

	// TODO: Add field-level validations here
	return cr, nil
}
