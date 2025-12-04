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
	AliquotRegExpCompiled    = regexp.MustCompile(AliquotRegExp)
	CaptureKitRegExpCompiled = AliquotRegExpCompiled
	RunAliasRegExpCompiled   = AliquotRegExpCompiled
)

var AllowedExperimentalStrategyCodes = map[string]bool{
	"wgs":          true,
	"wxs":          true,
	"rnaseq":       true,
	"targeted_dna": true,
}

var AllowedSequencingReadTechnologyCode = map[string]bool{
	"short_read": true,
	"long_read":  true,
}

var AllowedStatusCode = map[string]bool{
	"unknown":     true,
	"draft":       true,
	"revoke":      true,
	"completed":   true,
	"incomplete":  true,
	"submitted":   true,
	"in_progress": true,
}

const (
	IdenticalSequencingExperimentInDBCode    = "SEQ-001"
	InvalidFieldValueCode                    = "SEQ-002"
	UnknownSequencingLabCode                 = "SEQ-003"
	ExistingAliquotForSequencingLabCode      = "SEQ-004"
	UnknownSampleForOrganizationCode         = "SEQ-005"
	IdenticalSequencingExperimentInBatchCode = "SEQ-006"
)

type SequencingExperimentValidationRecord struct {
	BaseValidationRecord
	SequencingExperiment    types.SequencingExperimentBatch
	SubmitterOrganizationID *int
	SampleID                *int
	SequencingLabID         *int
}

func (r SequencingExperimentValidationRecord) GetBase() *BaseValidationRecord {
	return &r.BaseValidationRecord
}

func (r SequencingExperimentValidationRecord) GetResourceType() string {
	return types.SequencingExperimentBatchType
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

func verifyIdentical[T comparable](lVal T, rVal T, r *SequencingExperimentValidationRecord, key string, fieldName string) {
	if lVal != rVal {
		r.Warnings = append(r.Warnings, types.BatchMessage{
			Code:    ExistingAliquotForSequencingLabCode,
			Message: fmt.Sprintf("A sequencing with same ids (%s) has been found but with a different %s (%v <> %v).", key, fieldName, lVal, rVal),
			Path:    fmt.Sprintf("sequencing_experiments[%d]", r.Index),
		})
		r.Skipped = true
	}
}

func (r *SequencingExperimentValidationRecord) verifyStringField(value string, fieldName string, maxLength int, re *regexp.Regexp, reSrc string, resourceIDs []string, isRequired bool) {
	path := fmt.Sprintf("sequencing_experiments[%d]", r.Index)

	if value == "" {
		if isRequired {
			msg := formatInvalidField(r, fieldName, "field is missing", resourceIDs)
			r.addErrors(msg, InvalidFieldValueCode, path)
		}
		return
	}

	if len(value) > maxLength {
		msg := formatFieldTooLong(r, fieldName, maxLength, resourceIDs)
		r.addErrors(msg, InvalidFieldValueCode, path)
	}

	if re != nil && !re.MatchString(value) {
		msg := formatFieldRegexpMatch(r, fieldName, reSrc, resourceIDs)
		r.addErrors(msg, InvalidFieldValueCode, path)
	}
}

func (r *SequencingExperimentValidationRecord) validateAliquotField() {
	resIds := []string{r.SequencingExperiment.SampleOrganizationCode, r.SequencingExperiment.SubmitterSampleId.String(), r.SequencingExperiment.Aliquot.String()}
	r.verifyStringField(r.SequencingExperiment.Aliquot.String(), "aliquot", TextMaxLength, AliquotRegExpCompiled, AliquotRegExp, resIds, true)
}

func (r *SequencingExperimentValidationRecord) validateExperimentalStrategyCodeField() {
	resIds := []string{r.SequencingExperiment.SampleOrganizationCode, r.SequencingExperiment.SubmitterSampleId.String(), r.SequencingExperiment.Aliquot.String()}
	r.verifyStringField(r.SequencingExperiment.ExperimentalStrategyCode, "experimental_strategy_code", TextMaxLength, nil, "", resIds, true)

	if !AllowedExperimentalStrategyCodes[r.SequencingExperiment.ExperimentalStrategyCode] {
		r.Errors = append(r.Errors, types.BatchMessage{
			Code:    InvalidFieldValueCode,
			Message: formatInvalidField(r, "experimental_strategy_code", "value not allowed", resIds),
			Path:    fmt.Sprintf("sequencing_experiments[%d]", r.Index),
		})
	}
}

func (r *SequencingExperimentValidationRecord) validateSequencingReadTechnologyCodeField() {
	resIds := []string{r.SequencingExperiment.SampleOrganizationCode, r.SequencingExperiment.SubmitterSampleId.String(), r.SequencingExperiment.Aliquot.String()}
	r.verifyStringField(r.SequencingExperiment.SequencingReadTechnologyCode, "sequencing_read_technology_code", TextMaxLength, nil, "", resIds, true)

	if !AllowedSequencingReadTechnologyCode[r.SequencingExperiment.SequencingReadTechnologyCode] {
		r.Errors = append(r.Errors, types.BatchMessage{
			Code:    InvalidFieldValueCode,
			Message: formatInvalidField(r, "sequencing_read_technology_code", "value not allowed", resIds),
			Path:    fmt.Sprintf("sequencing_experiments[%d]", r.Index),
		})
	}
}

func (r *SequencingExperimentValidationRecord) validateSequencingLabCodeField() {
	resIds := []string{r.SequencingExperiment.SampleOrganizationCode, r.SequencingExperiment.SubmitterSampleId.String(), r.SequencingExperiment.Aliquot.String()}
	r.verifyStringField(r.SequencingExperiment.SequencingLabCode, "sequencing_lab_code", TextMaxLength, nil, "", resIds, false)
}

func (r *SequencingExperimentValidationRecord) validateCaptureKitField() {
	resIds := []string{r.SequencingExperiment.SampleOrganizationCode, r.SequencingExperiment.SubmitterSampleId.String(), r.SequencingExperiment.Aliquot.String()}
	r.verifyStringField(r.SequencingExperiment.CaptureKit.String(), "capture_kit", TextMaxLength, nil, "", resIds, false)
}

func (r *SequencingExperimentValidationRecord) validateRunAliasField() {
	resIds := []string{r.SequencingExperiment.Aliquot.String(), r.SequencingExperiment.SampleOrganizationCode, r.SequencingExperiment.SubmitterSampleId.String()}
	r.verifyStringField(r.SequencingExperiment.RunAlias.String(), "run_alias", TextMaxLength, RunAliasRegExpCompiled, RunAliasRegExp, resIds, false)
}

func (r *SequencingExperimentValidationRecord) validateRunDateField() {
	if r.SequencingExperiment.RunDate == nil {
		return
	}

	resIds := []string{r.SequencingExperiment.SampleOrganizationCode, r.SequencingExperiment.SubmitterSampleId.String(), r.SequencingExperiment.Aliquot.String()}
	now := time.Now()

	if time.Time(*r.SequencingExperiment.RunDate).After(now) {
		r.Errors = append(r.Errors, types.BatchMessage{
			Code:    InvalidFieldValueCode,
			Message: formatInvalidField(r, "run_date", "must be a past date", resIds),
			Path:    fmt.Sprintf("sequencing_experiments[%d]", r.Index),
		})
	}
}

func (r *SequencingExperimentValidationRecord) validateRunNameField() {
	resIds := []string{r.SequencingExperiment.Aliquot.String(), r.SequencingExperiment.SampleOrganizationCode, r.SequencingExperiment.SubmitterSampleId.String()}
	r.verifyStringField(r.SequencingExperiment.RunName.String(), "run_name", TextMaxLength, nil, "", resIds, false)
}

func (r *SequencingExperimentValidationRecord) validateStatusCodeField() {
	resIds := []string{r.SequencingExperiment.SampleOrganizationCode, r.SequencingExperiment.SubmitterSampleId.String(), r.SequencingExperiment.Aliquot.String()}
	r.verifyStringField(r.SequencingExperiment.StatusCode, "status_code", TextMaxLength, nil, "", resIds, false)

	if !AllowedStatusCode[r.SequencingExperiment.StatusCode] {
		r.Errors = append(r.Errors, types.BatchMessage{
			Code:    InvalidFieldValueCode,
			Message: formatInvalidField(r, "status_code", "value not allowed", resIds),
			Path:    fmt.Sprintf("sequencing_experiments[%d]", r.Index),
		})
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
			r.Infos = append(r.Infos, types.BatchMessage{
				Code:    IdenticalSequencingExperimentInDBCode,
				Message: fmt.Sprintf("Sequencing (%s / %s / %s) already exists, skipped.", r.SequencingExperiment.SampleOrganizationCode, r.SequencingExperiment.SubmitterSampleId, r.SequencingExperiment.Aliquot),
				Path:    fmt.Sprintf("sequencing_experiments[%d]", r.Index),
			})
			r.Skipped = true
		}
	}
	return nil
}

func (r *SequencingExperimentValidationRecord) validateSequencingLabCode(repoOrg repository.OrganizationDAO) error {
	if r.SequencingLabID == nil {
		r.Errors = append(r.Errors, types.BatchMessage{
			Code:    UnknownSequencingLabCode,
			Message: fmt.Sprintf("Sequencing lab %s for sequencing %s does not exist.", r.SequencingExperiment.SequencingLabCode, r.SequencingExperiment.Aliquot.String()),
			Path:    fmt.Sprintf("sequencing_experiments[%d]", r.Index),
		})
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
			verifyIdentical(s.SampleID, *r.SampleID, r, key, "sample_id")
			verifyIdentical(s.StatusCode, r.SequencingExperiment.StatusCode, r, key, "status_code")
			verifyIdentical(s.ExperimentalStrategyCode, r.SequencingExperiment.ExperimentalStrategyCode, r, key, "experimental_strategy_code")
			verifyIdentical(s.SequencingReadTechnologyCode, r.SequencingExperiment.SequencingReadTechnologyCode, r, key, "sequencing_read_technology_code")
			verifyIdentical(s.PlatformCode, r.SequencingExperiment.PlatformCode, r, key, "platform_code")
			verifyIdentical(s.RunName, r.SequencingExperiment.RunName.String(), r, key, "run_name")
			verifyIdentical(s.RunAlias, r.SequencingExperiment.RunAlias.String(), r, key, "run_alias")
			verifyIdentical(s.CaptureKit, r.SequencingExperiment.CaptureKit.String(), r, key, "capture_kit")

			if !time.Time(*r.SequencingExperiment.RunDate).Equal(s.RunDate) {
				r.Warnings = append(r.Warnings, types.BatchMessage{
					Code:    ExistingAliquotForSequencingLabCode,
					Message: fmt.Sprintf("A sequencing with same ids (%s) has been found but with a different run_date (%v <> %v).", key, r.SequencingExperiment.RunDate, s.RunDate),
					Path:    fmt.Sprintf("sequencing_experiments[%d]", r.Index),
				})
			}
		}
	}
	return nil
}

func (r *SequencingExperimentValidationRecord) validateUnknownSampleForOrganizationCode(repoSample repository.SamplesDAO) error {
	if r.SampleID == nil {
		r.Errors = append(r.Errors, types.BatchMessage{
			Code:    UnknownSampleForOrganizationCode,
			Message: fmt.Sprintf("Sample (%s / %s)  does not exist.", r.SequencingExperiment.SampleOrganizationCode, r.SequencingExperiment.SubmitterSampleId),
			Path:    fmt.Sprintf("sequencing_experiments[%d]", r.Index),
		})
	}
	return nil
}

func persistBatchAndSequencingExperimentRecords(db *gorm.DB, batch *types.Batch, records []SequencingExperimentValidationRecord) error {
	return db.Transaction(func(tx *gorm.DB) error {
		txRepoSeqExp := repository.NewSequencingExperimentRepository(tx)
		txRepoBatch := repository.NewBatchRepository(tx)
		rowsUpdated, unexpectedErrUpdate := updateBatch(batch, records, txRepoBatch)
		if unexpectedErrUpdate != nil {
			return unexpectedErrUpdate
		}
		if rowsUpdated == 0 {
			/* Logs directly, and return error to trigger rollback if the batch does not exist in db */
			return fmt.Errorf("no rows updated when updating sequencing experiment batch %v", batch.ID)
		}
		if !batch.DryRun && batch.Status == types.BatchStatusSuccess {
			err := insertSequencingExperimentRecords(records, txRepoSeqExp)
			if err != nil {
				return fmt.Errorf("error during sequencing experiment insertion %v", err)
			}
		}
		return nil
	})
}

func insertSequencingExperimentRecords(records []SequencingExperimentValidationRecord, repo repository.SequencingExperimentDAO) error {
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
				return err
			}
		}
	}
	return nil
}

func validateSequencingExperimentBatch(seqExps []types.SequencingExperimentBatch, repoOrganization repository.OrganizationDAO, repoSample repository.SamplesDAO, repoSeqExp repository.SequencingExperimentDAO) ([]SequencingExperimentValidationRecord, error) {
	var records []SequencingExperimentValidationRecord
	visited := map[string]bool{}

	for index, seqExp := range seqExps {
		key := fmt.Sprintf("%s / %s / %s", seqExp.SampleOrganizationCode, seqExp.SubmitterSampleId.String(), seqExp.Aliquot.String())
		record, err := validateSequencingExperimentRecord(seqExp, index, repoOrganization, repoSample, repoSeqExp)
		if err != nil {
			return nil, fmt.Errorf("error during sequencing experiment validation: %v", err)
		}

		if visited[key] {
			record.Errors = append(record.Errors, types.BatchMessage{
				Code:    IdenticalSequencingExperimentInBatchCode,
				Message: fmt.Sprintf("Sequencing (%s) appears multiple times in the batch.", key),
				Path:    fmt.Sprintf("sequencing_experiments[%d]", index),
			})
		} else {
			visited[key] = true
		}
		records = append(records, *record)
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
		return nil, err
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
		return nil, err
	}
	if err := record.validateSequencingLabCode(repoOrg); err != nil {
		return nil, err
	}
	if err := record.validateExistingAliquotForSequencingLabCode(repoSeqExp); err != nil {
		return nil, err
	}
	if err := record.validateUnknownSampleForOrganizationCode(repoSample); err != nil {
		return nil, err
	}
	return &record, nil
}
