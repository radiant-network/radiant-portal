package main

import (
	"encoding/json"
	"fmt"
	"regexp"
	"time"

	"github.com/golang/glog"
	"github.com/radiant-network/radiant-api/internal/repository"
	"github.com/radiant-network/radiant-api/internal/types"
	"gorm.io/gorm"
)

const (
	AliquotRegExp  = "^[A-Za-z0-9\\-_.]+$" // Alphanumeric characters, hyphens, underscores and periods
	RunAliasRegExp = "^[A-Za-z0-9\\-_.]+$"
)

var (
	AliquotRegExpCompiled  = regexp.MustCompile(AliquotRegExp)
	RunAliasRegExpCompiled = AliquotRegExpCompiled
)

var EMPTY = struct{}{}
var AllowedExperimentalStrategyCodes = map[string]struct{}{
	"wgs":          EMPTY,
	"wxs":          EMPTY,
	"rnaseq":       EMPTY,
	"targeted_dna": EMPTY,
}

var AllowedSequencingReadTechnologyCode = map[string]struct{}{
	"short_read": EMPTY,
	"long_read":  EMPTY,
}

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

func (r *SequencingExperimentValidationRecord) getPath() string {
	return fmt.Sprintf("sequencing_experiment[%d]", r.Index)
}

func (r *SequencingExperimentValidationRecord) getResId() []string {
	return []string{r.SequencingExperiment.SampleOrganizationCode, r.SequencingExperiment.SubmitterSampleId.String(), r.SequencingExperiment.Aliquot.String()}
}

func processSequencingExperimentBatch(batch *types.Batch, db *gorm.DB, repoOrganization repository.OrganizationDAO, repoSample repository.SamplesDAO, repoSequencingExperiment repository.SequencingExperimentDAO, repoBatch repository.BatchDAO) {
	payload := []byte(batch.Payload)
	var experimentsBatch []types.SequencingExperimentBatch

	if unexpectedErr := json.Unmarshal(payload, &experimentsBatch); unexpectedErr != nil {
		processUnexpectedError(batch, fmt.Errorf("error unmarshalling sequencing experiment batch: %v", unexpectedErr), repoBatch)
		return
	}

	records, unexpectedErr := validateSequencingExperimentBatch(experimentsBatch, repoOrganization, repoSample, repoSequencingExperiment)
	if unexpectedErr != nil {
		processUnexpectedError(batch, fmt.Errorf("error sequencing experiment batch validation: %v", unexpectedErr), repoBatch)
		return
	}

	glog.Infof("Sequencing experiment batch %v processed with %d records", batch.ID, len(records))

	err := persistBatchAndSequencingExperimentRecords(db, batch, records)
	if err != nil {
		processUnexpectedError(batch, fmt.Errorf("error processing sequencing experiment batch records: %v", err), repoBatch)
		return
	}
}

func verifyIdenticalField[T comparable](left T, right T, r *SequencingExperimentValidationRecord, key string, fieldName string) {
	if left == right {
		return
	}

	msg := fmt.Sprintf("A sequencing with same ids (%s) has been found but with a different %s (%v <> %v).", key, fieldName, left, right)

	r.addWarnings(msg, ExistingAliquotForSequencingLabCode, r.getPath())
	r.Skipped = true
}

func (r *SequencingExperimentValidationRecord) verifyStringField(value string, fieldName string, maxLength int, re *regexp.Regexp, reSrc string, resourceIDs []string, isRequired bool) {
	if value == "" {
		if isRequired {
			msg := formatInvalidField(r, fieldName, "field is missing", resourceIDs)
			r.addErrors(msg, InvalidFieldValueCode, r.getPath())
		}
		return
	}

	if len(value) > maxLength {
		msg := formatFieldTooLong(r, fieldName, maxLength, resourceIDs)
		r.addErrors(msg, InvalidFieldValueCode, r.getPath())
	}

	if re != nil && !re.MatchString(value) {
		msg := formatFieldRegexpMatch(r, fieldName, reSrc, resourceIDs)
		r.addErrors(msg, InvalidFieldValueCode, r.getPath())
	}
}

func (r *SequencingExperimentValidationRecord) validateAliquotField() {
	r.verifyStringField(r.SequencingExperiment.Aliquot.String(), "aliquot", TextMaxLength, AliquotRegExpCompiled, AliquotRegExp, r.getResId(), true)
}

func (r *SequencingExperimentValidationRecord) validateExperimentalStrategyCodeField() {
	r.verifyStringField(r.SequencingExperiment.ExperimentalStrategyCode, "experimental_strategy_code", TextMaxLength, nil, "", r.getResId(), true)

	if _, ok := AllowedExperimentalStrategyCodes[r.SequencingExperiment.ExperimentalStrategyCode]; !ok {
		r.addErrors(formatInvalidField(r, "experimental_strategy_code", "value not allowed", r.getResId()), InvalidFieldValueCode, r.getPath())
	}
}

func (r *SequencingExperimentValidationRecord) validateSequencingReadTechnologyCodeField() {
	r.verifyStringField(r.SequencingExperiment.SequencingReadTechnologyCode, "sequencing_read_technology_code", TextMaxLength, nil, "", r.getResId(), true)

	if _, ok := AllowedSequencingReadTechnologyCode[r.SequencingExperiment.SequencingReadTechnologyCode]; !ok {
		r.addErrors(formatInvalidField(r, "sequencing_read_technology_code", "value not allowed", r.getResId()), InvalidFieldValueCode, r.getPath())
	}
}

func (r *SequencingExperimentValidationRecord) validateSequencingLabCodeField() {
	r.verifyStringField(r.SequencingExperiment.SequencingLabCode, "sequencing_lab_code", TextMaxLength, nil, "", r.getResId(), false)
}

func (r *SequencingExperimentValidationRecord) validateCaptureKitField() {
	r.verifyStringField(r.SequencingExperiment.CaptureKit.String(), "capture_kit", TextMaxLength, nil, "", r.getResId(), false)
}

func (r *SequencingExperimentValidationRecord) validateRunAliasField() {
	r.verifyStringField(r.SequencingExperiment.RunAlias.String(), "run_alias", TextMaxLength, RunAliasRegExpCompiled, RunAliasRegExp, r.getResId(), false)
}

func (r *SequencingExperimentValidationRecord) validateRunDateField() {
	if r.SequencingExperiment.RunDate == nil {
		return
	}

	resIds := []string{r.SequencingExperiment.SampleOrganizationCode, r.SequencingExperiment.SubmitterSampleId.String(), r.SequencingExperiment.Aliquot.String()}
	now := time.Now()

	if time.Time(*r.SequencingExperiment.RunDate).After(now) {
		r.addErrors(formatInvalidField(r, "run_date", "must be a past date", resIds), InvalidFieldValueCode, r.getPath())
	}
}

func (r *SequencingExperimentValidationRecord) validateRunNameField() {
	r.verifyStringField(r.SequencingExperiment.RunName.String(), "run_name", TextMaxLength, nil, "", r.getResId(), false)
}

func (r *SequencingExperimentValidationRecord) validateStatusCodeField() {
	r.verifyStringField(r.SequencingExperiment.StatusCode, "status_code", TextMaxLength, nil, "", r.getResId(), false)

	if _, ok := AllowedStatusCode[r.SequencingExperiment.StatusCode]; !ok {
		r.addErrors(formatInvalidField(r, "status_code", "value not allowed", r.getResId()), InvalidFieldValueCode, r.getPath())
	}
}

func (r *SequencingExperimentValidationRecord) validateIdenticalSequencingExperiment(repoSeqExp repository.SequencingExperimentDAO) error {
	if r.SampleID == nil {
		return nil
	}

	seqExps, err := repoSeqExp.GetSequencingExperimentBySampleID(*r.SampleID)
	if err != nil {
		return err
	}

	for _, s := range seqExps {
		if s.Aliquot == r.SequencingExperiment.Aliquot.String() {
			r.addInfos(
				fmt.Sprintf("Sequencing (%s / %s / %s) already exists, skipped.", r.SequencingExperiment.SampleOrganizationCode, r.SequencingExperiment.SubmitterSampleId, r.SequencingExperiment.Aliquot),
				IdenticalSequencingExperimentInDBCode,
				r.getPath(),
			)
			r.Skipped = true
		}
	}
	return nil
}

func (r *SequencingExperimentValidationRecord) validateSequencingLabCode() error {
	if r.SequencingLabID == nil {
		r.addErrors(
			fmt.Sprintf("Sequencing lab %s for sequencing %s does not exist.", r.SequencingExperiment.SequencingLabCode, r.SequencingExperiment.Aliquot.String()),
			UnknownSequencingLabCode,
			r.getPath(),
		)
	}
	return nil
}

func (r *SequencingExperimentValidationRecord) validateExistingAliquotForSequencingLabCode(repoSeqExp repository.SequencingExperimentDAO) error {
	if r.SequencingLabID == nil || r.SampleID == nil {
		return nil
	}

	seqExps, err := repoSeqExp.GetSequencingExperimentByAliquot(r.SequencingExperiment.Aliquot.String())
	if err != nil {
		return err
	}
	key := fmt.Sprintf("%s / %s / %s", r.SequencingExperiment.SampleOrganizationCode, r.SequencingExperiment.SubmitterSampleId.String(), r.SequencingExperiment.Aliquot.String())
	for _, s := range seqExps {
		if s.SequencingLabID == *r.SequencingLabID {
			verifyIdenticalField(s.SampleID, *r.SampleID, r, key, "sample_id")
			verifyIdenticalField(s.StatusCode, r.SequencingExperiment.StatusCode, r, key, "status_code")
			verifyIdenticalField(s.ExperimentalStrategyCode, r.SequencingExperiment.ExperimentalStrategyCode, r, key, "experimental_strategy_code")
			verifyIdenticalField(s.SequencingReadTechnologyCode, r.SequencingExperiment.SequencingReadTechnologyCode, r, key, "sequencing_read_technology_code")
			verifyIdenticalField(s.PlatformCode, r.SequencingExperiment.PlatformCode, r, key, "platform_code")
			verifyIdenticalField(s.RunName, r.SequencingExperiment.RunName.String(), r, key, "run_name")
			verifyIdenticalField(s.RunAlias, r.SequencingExperiment.RunAlias.String(), r, key, "run_alias")
			verifyIdenticalField(s.CaptureKit, r.SequencingExperiment.CaptureKit.String(), r, key, "capture_kit")

			if !time.Time(*r.SequencingExperiment.RunDate).Equal(s.RunDate) {
				r.addWarnings(
					fmt.Sprintf("A sequencing with same ids (%s) has been found but with a different run_date (%v <> %v).", key, r.SequencingExperiment.RunDate, s.RunDate),
					ExistingAliquotForSequencingLabCode,
					r.getPath(),
				)
			}
		}
	}
	return nil
}

func (r *SequencingExperimentValidationRecord) validateUnknownSampleForOrganizationCode() error {
	if r.SampleID == nil {
		r.addErrors(
			fmt.Sprintf("Sample (%s / %s)  does not exist.", r.SequencingExperiment.SampleOrganizationCode, r.SequencingExperiment.SubmitterSampleId),
			UnknownSampleForOrganizationCode,
			r.getPath(),
		)
	}
	return nil
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

func validateSequencingExperimentBatch(seqExps []types.SequencingExperimentBatch, repoOrganization repository.OrganizationDAO, repoSample repository.SamplesDAO, repoSeqExp repository.SequencingExperimentDAO) ([]*SequencingExperimentValidationRecord, error) {
	var records []*SequencingExperimentValidationRecord
	visited := map[SequencingExperimentKey]struct{}{}

	for index, seqExp := range seqExps {
		key := SequencingExperimentKey{
			SampleOrganizationCode: seqExp.SampleOrganizationCode,
			SubmitterSampleId:      seqExp.SubmitterSampleId.String(),
			Aliquot:                seqExp.Aliquot.String(),
		}
		record, err := validateSequencingExperimentRecord(seqExp, index, repoOrganization, repoSample, repoSeqExp)
		if err != nil {
			return nil, fmt.Errorf("error during sequencing experiment validation: %v", err)
		}
		validateUniquenessInBatch(record, key, visited, IdenticalSequencingExperimentInBatchCode, []string{seqExp.SampleOrganizationCode, seqExp.SubmitterSampleId.String(), seqExp.Aliquot.String()})
		records = append(records, record)
	}
	return records, nil
}

func (r *SequencingExperimentValidationRecord) preFetchValidationInfo(repoOrg repository.OrganizationDAO, repoSample repository.SamplesDAO) error {
	soc, err := repoOrg.GetOrganizationByCode(r.SequencingExperiment.SampleOrganizationCode)
	if err != nil {
		return err
	}
	if soc != nil {
		r.SubmitterOrganizationID = &soc.ID
	}
	sample, err := repoSample.GetSampleBySubmitterSampleId(*r.SubmitterOrganizationID, r.SequencingExperiment.SubmitterSampleId.String())
	if err != nil {
		return err
	}
	if sample != nil {
		r.SampleID = &sample.ID
	}
	sequencingLab, err := repoOrg.GetOrganizationByCode(r.SequencingExperiment.SequencingLabCode)
	if err != nil {
		return err
	}
	if sequencingLab != nil {
		r.SequencingLabID = &sequencingLab.ID
	}
	return nil
}

func validateSequencingExperimentRecord(seqExp types.SequencingExperimentBatch, index int, repoOrg repository.OrganizationDAO, repoSample repository.SamplesDAO, repoSeqExp repository.SequencingExperimentDAO) (*SequencingExperimentValidationRecord, error) {
	record := SequencingExperimentValidationRecord{
		BaseValidationRecord: BaseValidationRecord{Index: index},
		SequencingExperiment: seqExp,
	}

	err := record.preFetchValidationInfo(repoOrg, repoSample)
	if err != nil {
		return nil, fmt.Errorf("prefetch validation info: %w", err)
	}

	record.validateAliquotField()
	record.validateExperimentalStrategyCodeField()
	record.validateSequencingReadTechnologyCodeField()
	record.validateSequencingLabCodeField()
	record.validateCaptureKitField()
	record.validateRunAliasField()
	record.validateRunDateField()
	record.validateRunNameField()
	record.validateStatusCodeField()

	if err := record.validateIdenticalSequencingExperiment(repoSeqExp); err != nil {
		return nil, fmt.Errorf("validate identical experiment: %w", err)
	}
	if err := record.validateSequencingLabCode(); err != nil {
		return nil, fmt.Errorf("validate sequencing lab code: %w", err)
	}
	if err := record.validateExistingAliquotForSequencingLabCode(repoSeqExp); err != nil {
		return nil, fmt.Errorf("validate existing aliquot: %w", err)
	}
	if err := record.validateUnknownSampleForOrganizationCode(); err != nil {
		return nil, fmt.Errorf("validate sample for organization: %w", err)
	}
	return &record, nil
}
