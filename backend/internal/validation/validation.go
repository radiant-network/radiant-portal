package validation

import (
	"fmt"
	"regexp"
	"slices"
	"strings"
	"time"

	"github.com/radiant-network/radiant-api/internal/repository"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/internal/utils"
	"gorm.io/gorm"
)

type ValidationRecord interface {
	GetBase() *BaseValidationRecord
	GetResourceType() string
}

type BatchValidationContext struct {
	BatchRepo     repository.BatchDAO
	CasesRepo     repository.CasesDAO
	DocRepo       repository.DocumentsDAO
	FamilyRepo    repository.FamilyDAO
	ObsCat        repository.ObservationCategoricalDAO
	OrgRepo       repository.OrganizationDAO
	PatientRepo   repository.PatientsDAO
	ProjectRepo   repository.ProjectDAO
	SampleRepo    repository.SamplesDAO
	SeqExpRepo    repository.SequencingExperimentDAO
	TaskRepo      repository.TaskDAO
	ValueSetsRepo repository.ValueSetsDAO
	S3FS          utils.FileMetadataGetter
}

func NewBatchValidationContext(db *gorm.DB) (*BatchValidationContext, error) {

	s3fs, err := utils.NewS3Store()
	if err != nil {
		return nil, err
	}

	return &BatchValidationContext{
		BatchRepo:     repository.NewBatchRepository(db),
		OrgRepo:       repository.NewOrganizationRepository(db),
		PatientRepo:   repository.NewPatientsRepository(db),
		ProjectRepo:   repository.NewProjectRepository(db),
		SampleRepo:    repository.NewSamplesRepository(db),
		SeqExpRepo:    repository.NewSequencingExperimentRepository(db),
		ValueSetsRepo: repository.NewValueSetsRepository(db),
		CasesRepo:     repository.NewCasesRepository(db),
		DocRepo:       repository.NewDocumentsRepository(db),
		FamilyRepo:    repository.NewFamilyRepository(db),
		ObsCat:        repository.NewObservationCategoricalRepository(db),
		TaskRepo:      repository.NewTaskRepository(db),
		S3FS:          s3fs,
	}, nil
}

type BaseValidationRecord struct {
	Context  *BatchValidationContext
	Index    int
	Skipped  bool
	Errors   []types.BatchMessage
	Warnings []types.BatchMessage
	Infos    []types.BatchMessage
}

func (r *BaseValidationRecord) AddErrors(message string, code string, path string) {
	r.Errors = append(r.Errors, types.BatchMessage{
		Code:    code,
		Message: message,
		Path:    path,
	})
}

func (r *BaseValidationRecord) AddWarnings(message string, code string, path string) {
	r.Warnings = append(r.Warnings, types.BatchMessage{
		Code:    code,
		Message: message,
		Path:    path,
	})
}

func (r *BaseValidationRecord) AddInfos(message string, code string, path string) {
	r.Infos = append(r.Infos, types.BatchMessage{
		Code:    code,
		Message: message,
		Path:    path,
	})
}

func (r *BaseValidationRecord) FormatCasesInvalidFieldMessage(fieldName, fieldResource string) string {
	return fmt.Sprintf("Invalid field %s for %s. Reason:",
		fieldName,
		fieldResource,
	)
}

func (r *BaseValidationRecord) ValidateRegexPattern(path, value, code, prefixMessage string, regExp *regexp.Regexp) {
	if regExp != nil && !regExp.MatchString(value) {
		r.AddErrors(fmt.Sprintf("%s does not match the regular expression `%s`.", prefixMessage, regExp.String()), code, path)
	}
}

func (r *BaseValidationRecord) ValidateTextLength(path, value, code, prefixMessage string, maxLength int) {
	if len(value) > maxLength {
		r.AddErrors(fmt.Sprintf("%s field is too long, maximum length allowed is %d.", prefixMessage, maxLength), code, path)
	}
}

func (r *BaseValidationRecord) ValidateStringField(value, fieldName, path, errorCode, resourceType string, maxLength int, re *regexp.Regexp, resourceIDs []string, isRequired bool) {
	if value == "" {
		if isRequired {
			msg := FormatInvalidField(resourceType, fieldName, "field is missing", resourceIDs)
			r.AddErrors(msg, errorCode, path)
		}
		return
	}

	prefix := strings.TrimSuffix(FormatInvalidField(resourceType, fieldName, "", resourceIDs), " .")
	r.ValidateTextLength(path, value, errorCode, prefix, maxLength)

	if re != nil {
		r.ValidateRegexPattern(path, value, errorCode, prefix, re)
	}
}

func ValidateUniquenessInBatch[K comparable](
	record ValidationRecord,
	key K,
	seenBatchMap map[K]struct{},
	duplicateCode string,
	ids []string,
) {
	if _, exists := seenBatchMap[key]; exists {
		message := FormatDuplicateInBatch(record.GetResourceType(), ids)
		path := FormatPath(record, "")
		record.GetBase().AddErrors(message, duplicateCode, path)
	} else {
		seenBatchMap[key] = struct{}{}
	}
}

func FormatFieldRegexpMatch(resourceType string, fieldName string, regExpStr string, resourceIds []string) string {
	reason := fmt.Sprintf("does not match the regular expression %s", regExpStr)
	return FormatInvalidField(resourceType, fieldName, reason, resourceIds)
}

func UpdateBatch[T interface{ GetBase() *BaseValidationRecord }](batch *types.Batch, records []T, r *repository.BatchRepository) (int64, error) {
	CopyRecordIntoBatch(batch, records)
	now := time.Now()
	batch.FinishedOn = &now
	return r.UpdateBatch(*batch)
}

func CopyRecordIntoBatch[T interface{ GetBase() *BaseValidationRecord }](batch *types.Batch, records []T) {
	skipped := 0
	created := 0
	errors := 0

	for _, record := range records {
		base := record.GetBase()
		batch.Report.Infos = slices.Concat(batch.Report.Infos, base.Infos)
		batch.Report.Errors = slices.Concat(batch.Report.Errors, base.Errors)
		batch.Report.Warnings = slices.Concat(batch.Report.Warnings, base.Warnings)

		if len(base.Errors) > 0 {
			errors += 1
			continue
		}
		if base.Skipped {
			skipped += 1
		} else if !batch.DryRun {
			created += 1
		}
	}
	if errors > 0 {
		skipped = len(records) - errors
		created = 0
	}
	summary := types.BatchSummary{Created: created, Skipped: skipped, Errors: errors}
	batch.Summary = summary
	if errors > 0 {
		batch.Status = types.BatchStatusError
	} else {
		batch.Status = types.BatchStatusSuccess
	}
}
