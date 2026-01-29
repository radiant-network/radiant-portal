package main

import (
	"encoding/json"
	"fmt"
	"regexp"
	"slices"
	"time"

	"github.com/golang/glog"
	"github.com/radiant-network/radiant-api/internal/repository"
	"github.com/radiant-network/radiant-api/internal/types"
	"gorm.io/gorm"
)

const (
	AlphanumericIdentifierRegExp = "^[A-Za-z0-9\\-_.]+$" // Alphanumeric characters, hyphens, underscores and periods
)

var (
	AlphanumericIdentifierRegExpCompiled = regexp.MustCompile(AlphanumericIdentifierRegExp)
)

var EMPTY = struct{}{}

var AllowedStatusCode = map[string]struct{}{
	"unknown":     EMPTY,
	"draft":       EMPTY,
	"revoke":      EMPTY,
	"completed":   EMPTY,
	"incomplete":  EMPTY,
	"submitted":   EMPTY,
	"in_progress": EMPTY,
}

const (
	IdenticalSequencingExperimentInDBCode    = "SEQ-001"
	InvalidFieldValueCode                    = "SEQ-002"
	UnknownSequencingLabCode                 = "SEQ-003"
	ExistingAliquotForSequencingLabCode      = "SEQ-004"
	UnknownSampleForOrganizationCode         = "SEQ-005"
	IdenticalSequencingExperimentInBatchCode = "SEQ-006"
)

type SequencingExperimentKey struct {
	SampleOrganizationCode string
	SubmitterSampleId      string
	Aliquot                string
}

type SequencingExperimentValidationRecord struct {
	BaseValidationRecord
	SequencingExperiment    types.SequencingExperimentBatch
	SubmitterOrganizationID *int
	SampleID                *int
	SequencingLabID         *int
}

func (r *SequencingExperimentValidationRecord) GetBase() *BaseValidationRecord {
	return &r.BaseValidationRecord
}

func (r *SequencingExperimentValidationRecord) GetResourceType() string {
	return types.SequencingExperimentBatchType
}

func (r *SequencingExperimentValidationRecord) getPath(fieldName string) string {
	path := fmt.Sprintf("sequencing_experiment[%d]", r.Index)
	if fieldName != "" {
		path += "." + fieldName
	}
	return path
}

func (r *SequencingExperimentValidationRecord) getResId() []string {
	return []string{r.SequencingExperiment.SampleOrganizationCode, r.SequencingExperiment.SubmitterSampleId.String(), r.SequencingExperiment.Aliquot.String()}
}

func (r *SequencingExperimentValidationRecord) preFetchValidationInfo() error {
	soc, err := r.Context.OrgRepo.GetOrganizationByCode(r.SequencingExperiment.SampleOrganizationCode)
	if err != nil {
		return err
	}
	if soc != nil {
		r.SubmitterOrganizationID = &soc.ID
		sample, err := r.Context.SampleRepo.GetSampleBySubmitterSampleId(*r.SubmitterOrganizationID, r.SequencingExperiment.SubmitterSampleId.String())
		if err != nil {
			return err
		}
		if sample != nil {
			r.SampleID = &sample.ID
		}
	}

	sequencingLab, err := r.Context.OrgRepo.GetOrganizationByCode(r.SequencingExperiment.SequencingLabCode)
	if err != nil {
		return err
	}
	if sequencingLab != nil {
		r.SequencingLabID = &sequencingLab.ID
	}
	return nil
}

func (r *SequencingExperimentValidationRecord) verifyStringField(value string, fieldName string, maxLength int, re *regexp.Regexp, reSrc string, resourceIDs []string, isRequired bool) {
	if value == "" {
		if isRequired {
			msg := formatInvalidField(r, fieldName, "field is missing", resourceIDs)
			r.addErrors(msg, InvalidFieldValueCode, r.getPath(fieldName))
		}
		return
	}

	if len(value) > maxLength {
		msg := formatFieldTooLong(r, fieldName, maxLength, resourceIDs)
		r.addErrors(msg, InvalidFieldValueCode, r.getPath(fieldName))
	}

	if re != nil && !re.MatchString(value) {
		msg := formatFieldRegexpMatch(r, fieldName, reSrc, resourceIDs)
		r.addErrors(msg, InvalidFieldValueCode, r.getPath(fieldName))
	}
}

func (r *SequencingExperimentValidationRecord) validateAliquotField() {
	r.verifyStringField(r.SequencingExperiment.Aliquot.String(), "aliquot", TextMaxLength, AlphanumericIdentifierRegExpCompiled, AlphanumericIdentifierRegExp, r.getResId(), true)
}

func (r *SequencingExperimentValidationRecord) validateExperimentalStrategyCodeField() error {
	fieldName := "experimental_strategy_code"
	r.verifyStringField(r.SequencingExperiment.ExperimentalStrategyCode, fieldName, TextMaxLength, nil, "", r.getResId(), true)

	codes, err := r.Context.ValueSetsRepo.GetCodes(repository.ValueSetExperimentalStrategy)
	if err != nil {
		return fmt.Errorf("error fetching experimental strategy codes: %w", err)
	}
	if !slices.Contains(codes, r.SequencingExperiment.ExperimentalStrategyCode) {
		r.addErrors(formatInvalidField(r, fieldName, "value not allowed", r.getResId()), InvalidFieldValueCode, r.getPath(fieldName))
	}
	return nil
}

func (r *SequencingExperimentValidationRecord) validateSequencingReadTechnologyCodeField() error {
	fieldName := "sequencing_read_technology_code"
	r.verifyStringField(r.SequencingExperiment.SequencingReadTechnologyCode, fieldName, TextMaxLength, nil, "", r.getResId(), true)

	codes, err := r.Context.ValueSetsRepo.GetCodes(repository.ValueSetSequencingReadTechnology)
	if err != nil {
		return fmt.Errorf("error fetching sequencing read technology codes: %w", err)
	}
	if !slices.Contains(codes, r.SequencingExperiment.SequencingReadTechnologyCode) {
		r.addErrors(formatInvalidField(r, fieldName, "value not allowed", r.getResId()), InvalidFieldValueCode, r.getPath(fieldName))
	}
	return nil
}

func (r *SequencingExperimentValidationRecord) validateSequencingLabCodeField() {
	r.verifyStringField(r.SequencingExperiment.SequencingLabCode, "sequencing_lab_code", TextMaxLength, nil, "", r.getResId(), false)
}

func (r *SequencingExperimentValidationRecord) validateCaptureKitField() {
	r.verifyStringField(r.SequencingExperiment.CaptureKit.String(), "capture_kit", TextMaxLength, nil, "", r.getResId(), false)
}

func (r *SequencingExperimentValidationRecord) validateRunAliasField() {
	r.verifyStringField(r.SequencingExperiment.RunAlias.String(), "run_alias", TextMaxLength, AlphanumericIdentifierRegExpCompiled, AlphanumericIdentifierRegExp, r.getResId(), false)
}

func (r *SequencingExperimentValidationRecord) validateRunDateField() {
	if r.SequencingExperiment.RunDate == nil {
		return
	}

	fieldName := "run_date"
	resIds := []string{r.SequencingExperiment.SampleOrganizationCode, r.SequencingExperiment.SubmitterSampleId.String(), r.SequencingExperiment.Aliquot.String()}
	now := time.Now()

	if time.Time(*r.SequencingExperiment.RunDate).After(now) {
		r.addErrors(formatInvalidField(r, fieldName, "must be a past date", resIds), InvalidFieldValueCode, r.getPath(fieldName))
	}
}

func (r *SequencingExperimentValidationRecord) validateRunNameField() {
	r.verifyStringField(r.SequencingExperiment.RunName.String(), "run_name", TextMaxLength, nil, "", r.getResId(), false)
}

func (r *SequencingExperimentValidationRecord) validateStatusCodeField() error {
	fieldName := "status_code"
	r.verifyStringField(r.SequencingExperiment.StatusCode, fieldName, TextMaxLength, nil, "", r.getResId(), true)

	codes, err := r.Context.ValueSetsRepo.GetCodes(repository.ValueSetStatus)
	if err != nil {
		return fmt.Errorf("error fetching status codes: %w", err)
	}

	if !slices.Contains(codes, r.SequencingExperiment.StatusCode) {
		r.addErrors(formatInvalidField(r, fieldName, "value not allowed", r.getResId()), InvalidFieldValueCode, r.getPath(fieldName))
	}
	return nil
}

func (r *SequencingExperimentValidationRecord) validateSequencingLabCode() error {
	if r.SequencingLabID == nil {
		r.addErrors(
			fmt.Sprintf("Sequencing lab %s for sequencing %s does not exist.", r.SequencingExperiment.SequencingLabCode, r.SequencingExperiment.Aliquot.String()),
			UnknownSequencingLabCode,
			r.getPath("sequencing_lab_code"),
		)
	}
	return nil
}

func (r *SequencingExperimentValidationRecord) validatePlatformCodeField() error {
	fieldName := "platform_code"
	r.verifyStringField(r.SequencingExperiment.PlatformCode, fieldName, TextMaxLength, TextRegExpCompiled, TextRegExp, r.getResId(), true)

	codes, err := r.Context.ValueSetsRepo.GetCodes(repository.ValueSetPlatform)
	if err != nil {
		return fmt.Errorf("error fetching platform codes: %w", err)
	}
	if !slices.Contains(codes, r.SequencingExperiment.PlatformCode) {
		r.addErrors(formatInvalidField(r, fieldName, "value not allowed", r.getResId()), InvalidFieldValueCode, r.getPath(fieldName))
	}
	return nil
}

func (r *SequencingExperimentValidationRecord) validateExistingAliquotForSequencingLabCode() error {
	if r.SequencingLabID == nil || r.SampleID == nil {
		return nil
	}

	seqExps, err := r.Context.SeqExpRepo.GetSequencingExperimentByAliquot(r.SequencingExperiment.Aliquot.String())
	if err != nil {
		return err
	}
	key := fmt.Sprintf("%s / %s / %s", r.SequencingExperiment.SampleOrganizationCode, r.SequencingExperiment.SubmitterSampleId.String(), r.SequencingExperiment.Aliquot.String())
	for _, s := range seqExps {

		sample, err := r.Context.SampleRepo.GetSampleById(s.SampleID)
		if err != nil {
			return fmt.Errorf("error fetching sample by id %d: %w", s.SampleID, err)
		}

		sampleOrg, err := r.Context.OrgRepo.GetOrganizationById(sample.OrganizationId)
		if err != nil {
			return fmt.Errorf("error fetching organization by id %d: %w", sample.OrganizationId, err)
		}

		if s.SequencingLabID == *r.SequencingLabID {
			different := verifyIsDifferentField(sample.SubmitterSampleId, r.SequencingExperiment.SubmitterSampleId.String(), r, key, "submitter_sample_id")

			if sampleOrg != nil {
				different = verifyIsDifferentField(sampleOrg.Code, r.SequencingExperiment.SampleOrganizationCode, r, key, "sample_organization_code") || different
			} else {
				different = verifyIsDifferentField("", r.SequencingExperiment.SampleOrganizationCode, r, key, "sample_organization_code") || different
			}
			different = verifyIsDifferentField(s.StatusCode, r.SequencingExperiment.StatusCode, r, key, "status_code") || different
			different = verifyIsDifferentField(s.ExperimentalStrategyCode, r.SequencingExperiment.ExperimentalStrategyCode, r, key, "experimental_strategy_code") || different
			different = verifyIsDifferentField(s.SequencingReadTechnologyCode, r.SequencingExperiment.SequencingReadTechnologyCode, r, key, "sequencing_read_technology_code") || different
			different = verifyIsDifferentField(s.PlatformCode, r.SequencingExperiment.PlatformCode, r, key, "platform_code") || different
			different = verifyIsDifferentField(s.RunName, r.SequencingExperiment.RunName.String(), r, key, "run_name") || different
			different = verifyIsDifferentField(s.RunAlias, r.SequencingExperiment.RunAlias.String(), r, key, "run_alias") || different
			different = verifyIsDifferentField(s.CaptureKit, r.SequencingExperiment.CaptureKit.String(), r, key, "capture_kit") || different

			t := time.Time{}
			if r.SequencingExperiment.RunDate != nil {
				t = time.Time(*r.SequencingExperiment.RunDate)
			}

			if !t.Equal(s.RunDate) {
				different = true
				r.addWarnings(
					fmt.Sprintf("A sequencing with same ids (%s) has been found but with a different run_date (%v <> %v).", key, s.RunDate.UTC(), t.UTC()),
					ExistingAliquotForSequencingLabCode,
					r.getPath("run_date"),
				)
			}

			if !different {
				r.addInfos(
					fmt.Sprintf("Sequencing (%s / %s / %s) already exists, skipped.", r.SequencingExperiment.SampleOrganizationCode, r.SequencingExperiment.SubmitterSampleId, r.SequencingExperiment.Aliquot),
					IdenticalSequencingExperimentInDBCode,
					r.getPath(""),
				)
				r.Skipped = true
			}
			return nil
		}
	}
	return nil
}

func (r *SequencingExperimentValidationRecord) validateUnknownSampleForOrganizationCode() error {
	if r.SampleID == nil {
		r.addErrors(
			fmt.Sprintf("Sample (%s / %s) does not exist.", r.SequencingExperiment.SampleOrganizationCode, r.SequencingExperiment.SubmitterSampleId),
			UnknownSampleForOrganizationCode,
			r.getPath(""),
		)
	}
	return nil
}

func verifyIsDifferentField[T comparable](left T, right T, r *SequencingExperimentValidationRecord, key string, fieldName string) bool {
	if left == right {
		return false
	}

	msg := fmt.Sprintf("A sequencing with same ids (%s) has been found but with a different %s (%v <> %v).", key, fieldName, left, right)

	r.addWarnings(msg, ExistingAliquotForSequencingLabCode, r.getPath(fieldName))
	r.Skipped = true
	return true
}

func processSequencingExperimentBatch(ctx *BatchValidationContext, batch *types.Batch, db *gorm.DB) {
	payload := []byte(batch.Payload)
	var experimentsBatch []types.SequencingExperimentBatch

	if unexpectedErr := json.Unmarshal(payload, &experimentsBatch); unexpectedErr != nil {
		processUnexpectedError(batch, fmt.Errorf("error unmarshalling sequencing experiment batch: %v", unexpectedErr), ctx.BatchRepo)
		return
	}

	records, unexpectedErr := validateSequencingExperimentBatch(ctx, experimentsBatch)
	if unexpectedErr != nil {
		processUnexpectedError(batch, fmt.Errorf("error sequencing experiment batch validation: %v", unexpectedErr), ctx.BatchRepo)
		return
	}

	glog.Infof("Sequencing experiment batch %v processed with %d records", batch.ID, len(records))

	err := persistBatchAndSequencingExperimentRecords(db, batch, records)
	if err != nil {
		processUnexpectedError(batch, fmt.Errorf("error processing sequencing experiment batch records: %v", err), ctx.BatchRepo)
		return
	}
}

func persistBatchAndSequencingExperimentRecords(db *gorm.DB, batch *types.Batch, records []*SequencingExperimentValidationRecord) error {
	return db.Transaction(func(tx *gorm.DB) error {
		txRepoSeqExp := repository.NewSequencingExperimentRepository(tx)
		txRepoBatch := repository.NewBatchRepository(tx)
		rowsUpdated, unexpectedErrUpdate := updateBatch(batch, records, txRepoBatch)
		if unexpectedErrUpdate != nil {
			return unexpectedErrUpdate
		}
		if rowsUpdated == 0 {
			return fmt.Errorf("no rows updated when updating sequencing experiment batch %v", batch.ID)
		}
		if !batch.DryRun && batch.Status == types.BatchStatusSuccess {
			err := insertSequencingExperimentRecords(records, txRepoSeqExp)
			if err != nil {
				return fmt.Errorf("error during sequencing experiment insertion %w", err)
			}
		}
		return nil
	})
}

func insertSequencingExperimentRecords(records []*SequencingExperimentValidationRecord, repo repository.SequencingExperimentDAO) error {
	for _, record := range records {
		if !record.Skipped {
			seqExp := types.SequencingExperiment{
				SampleID:                     *record.SampleID,
				Aliquot:                      record.SequencingExperiment.Aliquot.String(),
				StatusCode:                   record.SequencingExperiment.StatusCode,
				ExperimentalStrategyCode:     record.SequencingExperiment.ExperimentalStrategyCode,
				SequencingReadTechnologyCode: record.SequencingExperiment.SequencingReadTechnologyCode,
				PlatformCode:                 record.SequencingExperiment.PlatformCode,
			}

			// nullable fields
			if record.SequencingExperiment.SequencingLabCode != "" {
				seqExp.SequencingLabID = *record.SequencingLabID
			}
			if record.SequencingExperiment.RunName != "" {
				seqExp.RunName = record.SequencingExperiment.RunName.String()
			}
			if record.SequencingExperiment.RunAlias != "" {
				seqExp.RunAlias = record.SequencingExperiment.RunAlias.String()
			}
			if record.SequencingExperiment.RunDate != nil {
				seqExp.RunDate = time.Time(*record.SequencingExperiment.RunDate)
			}
			if record.SequencingExperiment.CaptureKit != "" {
				seqExp.CaptureKit = record.SequencingExperiment.CaptureKit.String()
			}

			err := repo.CreateSequencingExperiment(&seqExp)
			if err != nil {
				return fmt.Errorf("create sequencing experiment :%w", err)
			}
		}
	}
	return nil
}

func validateSequencingExperimentBatch(ctx *BatchValidationContext, seqExps []types.SequencingExperimentBatch) ([]*SequencingExperimentValidationRecord, error) {
	var records []*SequencingExperimentValidationRecord
	visited := map[SequencingExperimentKey]struct{}{}

	for index, seqExp := range seqExps {
		key := SequencingExperimentKey{
			SampleOrganizationCode: seqExp.SampleOrganizationCode,
			SubmitterSampleId:      seqExp.SubmitterSampleId.String(),
			Aliquot:                seqExp.Aliquot.String(),
		}
		record, err := validateSequencingExperimentRecord(ctx, seqExp, index)
		if err != nil {
			return nil, fmt.Errorf("error during sequencing experiment validation: %v", err)
		}
		validateUniquenessInBatch(record, key, visited, IdenticalSequencingExperimentInBatchCode, []string{seqExp.SampleOrganizationCode, seqExp.SubmitterSampleId.String(), seqExp.Aliquot.String()})
		records = append(records, record)
	}
	return records, nil
}

func validateSequencingExperimentRecord(ctx *BatchValidationContext, seqExp types.SequencingExperimentBatch, index int) (*SequencingExperimentValidationRecord, error) {
	record := SequencingExperimentValidationRecord{
		BaseValidationRecord: BaseValidationRecord{
			Context: ctx,
			Index:   index,
		},
		SequencingExperiment: seqExp,
	}

	err := record.preFetchValidationInfo()
	if err != nil {
		return nil, fmt.Errorf("prefetch validation info: %w", err)
	}

	record.validateAliquotField()
	if err := record.validateExperimentalStrategyCodeField(); err != nil {
		return nil, fmt.Errorf("validate experimental strategy code: %w", err)
	}
	if err := record.validateSequencingReadTechnologyCodeField(); err != nil {
		return nil, fmt.Errorf("validate sequencing read technology code: %w", err)
	}
	record.validateSequencingLabCodeField()
	if err := record.validatePlatformCodeField(); err != nil {
		return nil, fmt.Errorf("validate platform code: %w", err)
	}
	record.validateCaptureKitField()
	record.validateRunAliasField()
	record.validateRunDateField()
	record.validateRunNameField()
	if err := record.validateStatusCodeField(); err != nil {
		return nil, fmt.Errorf("validate status code: %w", err)
	}

	if err := record.validateSequencingLabCode(); err != nil {
		return nil, fmt.Errorf("validate sequencing lab code: %w", err)
	}
	if err := record.validateExistingAliquotForSequencingLabCode(); err != nil {
		return nil, fmt.Errorf("validate existing aliquot: %w", err)
	}
	if err := record.validateUnknownSampleForOrganizationCode(); err != nil {
		return nil, fmt.Errorf("validate sample for organization: %w", err)
	}
	return &record, nil
}
