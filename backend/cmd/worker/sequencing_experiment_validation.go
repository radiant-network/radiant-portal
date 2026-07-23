package main

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"log/slog"
	"regexp"
	"time"

	"github.com/radiant-network/radiant-api/internal/batchval"
	"github.com/radiant-network/radiant-api/internal/database"
	"github.com/radiant-network/radiant-api/internal/repository/postgres"
	"github.com/radiant-network/radiant-api/internal/types"
	"gorm.io/gorm"
)

const (
	AlphanumericIdentifierRegExp = "^[A-Za-z0-9\\-_.]+$" // Alphanumeric characters, hyphens, underscores and periods
)

var (
	AlphanumericIdentifierRegExpCompiled = regexp.MustCompile(AlphanumericIdentifierRegExp)
)

const (
	IdenticalSequencingExperimentInDBCode    = "SEQ-001"
	InvalidFieldValueCode                    = "SEQ-002"
	UnknownSequencingLabCode                 = "SEQ-003"
	ExistingAliquotForSequencingLabCode      = "SEQ-004"
	UnknownSampleForOrganizationCode         = "SEQ-005"
	IdenticalSequencingExperimentInBatchCode = "SEQ-006"
	SeqExpNotExistForUpdateCode              = "SEQ-007"
)

type SequencingExperimentValidationRecord struct {
	batchval.BaseValidationRecord

	SequencingExperiment      types.SequencingExperimentBatch
	SubmitterOrganizationCode *string
	SampleID                  *int
	SequencingLabCode         *string

	PlatformCodes                 []string
	ExperimentalStrategyCodes     []string
	SequencingReadTechnologyCodes []string
	StatusCodes                   []string
}

func (r *SequencingExperimentValidationRecord) GetBase() *batchval.BaseValidationRecord {
	return &r.BaseValidationRecord
}

func (r *SequencingExperimentValidationRecord) getPath(fieldName string) string {
	return batchval.FormatPath(r, fieldName)
}

func (r *SequencingExperimentValidationRecord) getUniqueIds() []string {
	return []string{r.SequencingExperiment.SampleOrganizationCode, r.SequencingExperiment.SubmitterSampleId.String(), r.SequencingExperiment.Aliquot.String()}
}

func (r *SequencingExperimentValidationRecord) preFetchValidationInfo(ctx context.Context) error {
	soc, err := r.Cache.GetOrganizationByCode(ctx, r.SequencingExperiment.SampleOrganizationCode)
	if err != nil {
		return fmt.Errorf("error fetching sample organization: %w", err)
	}
	if soc != nil {
		r.SubmitterOrganizationCode = &soc.Code
		sample, err := r.Cache.GetSampleByOrgCodeAndSubmitterSampleId(ctx, *r.SubmitterOrganizationCode, r.SequencingExperiment.SubmitterSampleId.String())
		if err != nil {
			return fmt.Errorf("error fetching sample: %w", err)
		}
		if sample != nil {
			r.SampleID = &sample.ID
		}
	}

	sequencingLab, err := r.Cache.GetOrganizationByCode(ctx, r.SequencingExperiment.SequencingLabCode)
	if err != nil {
		return fmt.Errorf("error fetching sequencing lab: %w", err)
	}
	if sequencingLab != nil {
		r.SequencingLabCode = &sequencingLab.Code
	}

	platformCodes, err := r.Cache.GetValueSetCodes(ctx, postgres.ValueSetPlatform)
	if err != nil {
		return fmt.Errorf("error fetching platform codes: %w", err)
	}
	r.PlatformCodes = platformCodes

	experimentalStrategyCodes, err := r.Cache.GetValueSetCodes(ctx, postgres.ValueSetExperimentalStrategy)
	if err != nil {
		return fmt.Errorf("error fetching experimental strategy codes: %w", err)
	}
	r.ExperimentalStrategyCodes = experimentalStrategyCodes

	sequencingReadTechnologyCodes, err := r.Cache.GetValueSetCodes(ctx, postgres.ValueSetSequencingReadTechnology)
	if err != nil {
		return fmt.Errorf("error fetching sequencing read technology codes: %w", err)
	}
	r.SequencingReadTechnologyCodes = sequencingReadTechnologyCodes

	statusCodes, err := r.Cache.GetValueSetCodes(ctx, postgres.ValueSetStatus)
	if err != nil {
		return fmt.Errorf("error fetching status codes: %w", err)
	}
	r.StatusCodes = statusCodes

	return nil
}

func (r *SequencingExperimentValidationRecord) validateAliquotField() {
	r.ValidateStringField(r.SequencingExperiment.Aliquot.String(), "aliquot", r.getPath("aliquot"), InvalidFieldValueCode, r.GetResourceType(), TextMaxLength, AlphanumericIdentifierRegExpCompiled, r.getUniqueIds(), true)
}

func (r *SequencingExperimentValidationRecord) validateExperimentalStrategyCodeField() error {
	fieldName := "experimental_strategy_code"
	r.ValidateStringField(r.SequencingExperiment.ExperimentalStrategyCode, fieldName, r.getPath(fieldName), InvalidFieldValueCode, r.GetResourceType(), TextMaxLength, nil, r.getUniqueIds(), true)
	r.ValidateCode(r.GetResourceType(), batchval.FormatPath(r, fieldName), fieldName, InvalidFieldValueCode, r.SequencingExperiment.ExperimentalStrategyCode, r.ExperimentalStrategyCodes, r.getUniqueIds(), true)
	return nil
}

func (r *SequencingExperimentValidationRecord) validateSequencingReadTechnologyCodeField() error {
	fieldName := "sequencing_read_technology_code"
	r.ValidateStringField(r.SequencingExperiment.SequencingReadTechnologyCode, fieldName, r.getPath(fieldName), InvalidFieldValueCode, r.GetResourceType(), TextMaxLength, nil, r.getUniqueIds(), true)
	r.ValidateCode(r.GetResourceType(), r.getPath(fieldName), fieldName, InvalidFieldValueCode, r.SequencingExperiment.SequencingReadTechnologyCode, r.SequencingReadTechnologyCodes, r.getUniqueIds(), true)
	return nil
}

func (r *SequencingExperimentValidationRecord) validateSequencingLabCodeField() {
	r.ValidateStringField(r.SequencingExperiment.SequencingLabCode, "sequencing_lab_code", r.getPath("sequencing_lab_code"), InvalidFieldValueCode, r.GetResourceType(), TextMaxLength, nil, r.getUniqueIds(), false)
}

func (r *SequencingExperimentValidationRecord) validateCaptureKitField() {
	r.ValidateStringField(r.SequencingExperiment.CaptureKit.String(), "capture_kit", r.getPath("capture_kit"), InvalidFieldValueCode, r.GetResourceType(), TextMaxLength, nil, r.getUniqueIds(), false)
}

func (r *SequencingExperimentValidationRecord) validateRunAliasField() {
	r.ValidateStringField(r.SequencingExperiment.RunAlias.String(), "run_alias", r.getPath("run_alias"), InvalidFieldValueCode, r.GetResourceType(), TextMaxLength, AlphanumericIdentifierRegExpCompiled, r.getUniqueIds(), false)
}

func (r *SequencingExperimentValidationRecord) validateRunDateField() {
	if r.SequencingExperiment.RunDate == nil {
		return
	}

	fieldName := "run_date"
	resIds := []string{r.SequencingExperiment.SampleOrganizationCode, r.SequencingExperiment.SubmitterSampleId.String(), r.SequencingExperiment.Aliquot.String()}
	now := time.Now()

	if time.Time(*r.SequencingExperiment.RunDate).After(now) {
		r.AddErrors(batchval.FormatInvalidField(r.GetResourceType(), fieldName, "must be a past date", resIds), InvalidFieldValueCode, r.getPath(fieldName))
	}
}

func (r *SequencingExperimentValidationRecord) validateRunNameField() {
	r.ValidateStringField(r.SequencingExperiment.RunName.String(), "run_name", r.getPath("run_name"), InvalidFieldValueCode, r.GetResourceType(), TextMaxLength, nil, r.getUniqueIds(), false)
}

func (r *SequencingExperimentValidationRecord) validateStatusCodeField() error {
	fieldName := "status_code"
	r.ValidateStringField(r.SequencingExperiment.StatusCode, fieldName, r.getPath(fieldName), InvalidFieldValueCode, r.GetResourceType(), TextMaxLength, nil, r.getUniqueIds(), true)
	r.ValidateCode(r.GetResourceType(), r.getPath(fieldName), fieldName, InvalidFieldValueCode, r.SequencingExperiment.StatusCode, r.StatusCodes, r.getUniqueIds(), true)
	return nil
}

func (r *SequencingExperimentValidationRecord) validateSequencingLabCode() error {
	if r.SequencingLabCode == nil {
		r.AddErrors(
			fmt.Sprintf("Sequencing lab %s for sequencing %s does not exist.", r.SequencingExperiment.SequencingLabCode, r.SequencingExperiment.Aliquot.String()),
			UnknownSequencingLabCode,
			r.getPath("sequencing_lab_code"),
		)
	}
	return nil
}

func (r *SequencingExperimentValidationRecord) validatePlatformCodeField() error {
	fieldName := "platform_code"
	r.ValidateStringField(r.SequencingExperiment.PlatformCode, fieldName, r.getPath(fieldName), InvalidFieldValueCode, r.GetResourceType(), TextMaxLength, TextRegExpCompiled, r.getUniqueIds(), true)
	r.ValidateCode(r.GetResourceType(), r.getPath("platform_code"), fieldName, InvalidFieldValueCode, r.SequencingExperiment.PlatformCode, r.PlatformCodes, r.getUniqueIds(), true)
	return nil
}

func (r *SequencingExperimentValidationRecord) validateExistingAliquotForSequencingLabCode(ctx context.Context) error {
	if r.SequencingLabCode == nil || r.SampleID == nil {
		return nil
	}

	seqExps, err := r.Cache.GetSequencingExperimentByAliquot(ctx, r.SequencingExperiment.Aliquot.String())
	if err != nil {
		return fmt.Errorf("error fetching sequencing experiments by aliquot: %w", err)
	}

	key := fmt.Sprintf("%s / %s / %s", r.SequencingExperiment.SampleOrganizationCode, r.SequencingExperiment.SubmitterSampleId.String(), r.SequencingExperiment.Aliquot.String())
	for _, s := range seqExps {

		sample, err := r.Cache.GetSampleById(ctx, s.SampleID)
		if err != nil {
			return fmt.Errorf("error fetching sample by id %d: %w", s.SampleID, err)
		}
		if sample == nil {
			continue
		}

		if s.SequencingLabCode == *r.SequencingLabCode {
			different := verifyIsDifferentField(sample.SubmitterSampleId, r.SequencingExperiment.SubmitterSampleId.String(), r, key, "submitter_sample_id")

			different = verifyIsDifferentField(sample.OrganizationCode, r.SequencingExperiment.SampleOrganizationCode, r, key, "sample_organization_code") || different
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
				r.AddWarnings(
					fmt.Sprintf("A sequencing with same ids (%s) has been found but with a different run_date (%v <> %v).", key, s.RunDate.UTC(), t.UTC()),
					ExistingAliquotForSequencingLabCode,
					r.getPath("run_date"),
				)
			}

			if !different {
				r.AddInfos(
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

func (r *SequencingExperimentValidationRecord) validateExistingSeqExpForUpdate(existing *types.SequencingExperiment) {
	if existing == nil {
		message := fmt.Sprintf("Sequencing experiment (%s / %s / %s) does not exist, cannot update.", r.SequencingExperiment.SampleOrganizationCode, r.SequencingExperiment.SubmitterSampleId, r.SequencingExperiment.Aliquot)
		r.AddErrors(message, SeqExpNotExistForUpdateCode, r.getPath(""))
		r.Skipped = true
	}
}

func (r *SequencingExperimentValidationRecord) validateUnknownSampleForOrganizationCode() error {
	if r.SampleID == nil {
		r.AddErrors(
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

	r.AddWarnings(msg, ExistingAliquotForSequencingLabCode, r.getPath(fieldName))
	r.Skipped = true
	return true
}

func processCreateSequencingExperimentBatch(ctx context.Context, bv *batchval.BatchValidationContext, batch *types.Batch, db *gorm.DB) error {
	payload := []byte(batch.Payload)
	var experimentsBatch []types.SequencingExperimentBatch

	if unexpectedErr := json.Unmarshal(payload, &experimentsBatch); unexpectedErr != nil {
		batchval.ProcessUnexpectedError(ctx, batch, fmt.Errorf("error unmarshalling sequencing experiment batch: %v", unexpectedErr), bv.BatchRepo)
		return nil
	}

	records, unexpectedErr := validateSequencingExperimentBatch(ctx, bv, experimentsBatch)
	if unexpectedErr != nil {
		if errors.Is(unexpectedErr, context.Canceled) {
			return unexpectedErr
		}
		batchval.ProcessUnexpectedError(ctx, batch, fmt.Errorf("error sequencing experiment batch validation: %v", unexpectedErr), bv.BatchRepo)
		return nil
	}

	slog.InfoContext(ctx, "sequencing_experiment batch processed", slog.String("batch_id", batch.ID), slog.Int("records", len(records)))

	if err := persistBatchAndSequencingExperimentRecords(ctx, db, batch, records); err != nil {
		if errors.Is(err, context.Canceled) {
			return err
		}
		batchval.ProcessUnexpectedError(ctx, batch, fmt.Errorf("error processing sequencing experiment batch records: %v", err), bv.BatchRepo)
		return nil
	}
	return nil
}

func persistBatchAndSequencingExperimentRecords(ctx context.Context, db *gorm.DB, batch *types.Batch, records []*SequencingExperimentValidationRecord) error {
	return db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		txRepoSeqExp := postgres.NewSequencingExperimentRepository(database.PostgresDB{DB: tx})
		txRepoBatch := postgres.NewBatchRepository(database.PostgresDB{DB: tx})
		rowsUpdated, unexpectedErrUpdate := batchval.UpdateBatch(ctx, batch, records, txRepoBatch)
		if unexpectedErrUpdate != nil {
			return unexpectedErrUpdate
		}
		if rowsUpdated == 0 {
			return fmt.Errorf("no rows updated when updating sequencing experiment batch %v", batch.ID)
		}
		if !batch.DryRun && batch.Status == types.BatchStatusSuccess {
			err := insertSequencingExperimentRecords(ctx, records, txRepoSeqExp, batch.TenantCode)
			if err != nil {
				return fmt.Errorf("error during sequencing experiment insertion %w", err)
			}
		}
		return nil
	})
}

type sequencingExperimentCreator interface {
	CreateSequencingExperiment(ctx context.Context, seqExp *types.SequencingExperiment) error
}

func insertSequencingExperimentRecords(ctx context.Context, records []*SequencingExperimentValidationRecord, repo sequencingExperimentCreator, tenantCode string) error {
	for _, record := range records {
		if !record.Skipped {
			seqExp := types.SequencingExperiment{
				SampleID:                     *record.SampleID,
				Aliquot:                      record.SequencingExperiment.Aliquot.String(),
				StatusCode:                   record.SequencingExperiment.StatusCode,
				ExperimentalStrategyCode:     record.SequencingExperiment.ExperimentalStrategyCode,
				SequencingReadTechnologyCode: record.SequencingExperiment.SequencingReadTechnologyCode,
				PlatformCode:                 record.SequencingExperiment.PlatformCode,
				TenantCode:                   tenantCode,
				SequencingLabCode:            record.SequencingExperiment.SequencingLabCode,
			}

			// nullable fields
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

			err := repo.CreateSequencingExperiment(ctx, &seqExp)
			if err != nil {
				return fmt.Errorf("create sequencing experiment :%w", err)
			}
		}
	}
	return nil
}

func validateSequencingExperimentBatch(ctx context.Context, bv *batchval.BatchValidationContext, seqExps []types.SequencingExperimentBatch) ([]*SequencingExperimentValidationRecord, error) {
	var records []*SequencingExperimentValidationRecord
	visited := map[batchval.SequencingExperimentKey]struct{}{}
	cache := batchval.NewBatchValidationCache(bv)

	for index, seqExp := range seqExps {
		if err := ctx.Err(); err != nil {
			return nil, err
		}
		key := batchval.SequencingExperimentKey{
			SampleOrganizationCode: seqExp.SampleOrganizationCode,
			SubmitterSampleId:      seqExp.SubmitterSampleId.String(),
			Aliquot:                seqExp.Aliquot.String(),
		}
		record, err := validateSequencingExperimentRecord(ctx, bv, cache, seqExp, index)
		if err != nil {
			return nil, fmt.Errorf("error during sequencing experiment validation: %v", err)
		}
		batchval.ValidateUniquenessInBatch(record, key, visited, IdenticalSequencingExperimentInBatchCode, []string{seqExp.SampleOrganizationCode, seqExp.SubmitterSampleId.String(), seqExp.Aliquot.String()})
		records = append(records, record)
	}
	return records, nil
}

func validateSequencingExperimentRecord(ctx context.Context, bv *batchval.BatchValidationContext, cache *batchval.BatchValidationCache, seqExp types.SequencingExperimentBatch, index int) (*SequencingExperimentValidationRecord, error) {

	record := SequencingExperimentValidationRecord{
		BaseValidationRecord: batchval.BaseValidationRecord{
			Context:      bv,
			Cache:        cache,
			ResourceType: types.CreateSequencingExperimentBatchType,
			Index:        index,
		},
		SequencingExperiment: seqExp,
	}

	err := record.preFetchValidationInfo(ctx)
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
	if err := record.validateExistingAliquotForSequencingLabCode(ctx); err != nil {
		return nil, fmt.Errorf("validate existing aliquot: %w", err)
	}
	if err := record.validateUnknownSampleForOrganizationCode(); err != nil {
		return nil, fmt.Errorf("validate sample for organization: %w", err)
	}
	return &record, nil
}

func processUpdateSequencingExperimentBatch(ctx context.Context, bv *batchval.BatchValidationContext, batch *types.Batch, db *gorm.DB) error {
	payload := []byte(batch.Payload)
	var experimentsBatch []types.SequencingExperimentBatch

	if unexpectedErr := json.Unmarshal(payload, &experimentsBatch); unexpectedErr != nil {
		batchval.ProcessUnexpectedError(ctx, batch, fmt.Errorf("error unmarshalling update sequencing experiment batch: %v", unexpectedErr), bv.BatchRepo)
		return nil
	}

	records, unexpectedErr := validateUpdateSequencingExperimentBatch(ctx, bv, experimentsBatch)
	if unexpectedErr != nil {
		if errors.Is(unexpectedErr, context.Canceled) {
			return unexpectedErr
		}
		batchval.ProcessUnexpectedError(ctx, batch, fmt.Errorf("error update sequencing experiment batch validation: %v", unexpectedErr), bv.BatchRepo)
		return nil
	}

	slog.InfoContext(ctx, "update sequencing_experiment batch processed", slog.String("batch_id", batch.ID), slog.Int("records", len(records)))

	if err := persistBatchAndUpdateSequencingExperimentRecords(ctx, db, batch, records); err != nil {
		if errors.Is(err, context.Canceled) {
			return err
		}
		batchval.ProcessUnexpectedError(ctx, batch, fmt.Errorf("error processing update sequencing experiment batch records: %v", err), bv.BatchRepo)
		return nil
	}
	return nil
}

func persistBatchAndUpdateSequencingExperimentRecords(ctx context.Context, db *gorm.DB, batch *types.Batch, records []*SequencingExperimentValidationRecord) error {
	return db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		txRepoSeqExp := postgres.NewSequencingExperimentRepository(database.PostgresDB{DB: tx})
		txRepoBatch := postgres.NewBatchRepository(database.PostgresDB{DB: tx})
		rowsUpdated, unexpectedErrUpdate := batchval.UpdateBatch(ctx, batch, records, txRepoBatch)
		if unexpectedErrUpdate != nil {
			return unexpectedErrUpdate
		}
		if rowsUpdated == 0 {
			return fmt.Errorf("no rows updated when updating update_sequencing_experiment batch %v", batch.ID)
		}
		if !batch.DryRun && batch.Status == types.BatchStatusSuccess {
			err := updateSequencingExperimentRecords(ctx, records, txRepoSeqExp, batch.TenantCode)
			if err != nil {
				return fmt.Errorf("error during sequencing experiment update %w", err)
			}
		}
		return nil
	})
}

type sequencingExperimentUpdater interface {
	UpdateSequencingExperiment(ctx context.Context, seqExp *types.SequencingExperiment) error
}

func updateSequencingExperimentRecords(ctx context.Context, records []*SequencingExperimentValidationRecord, repo sequencingExperimentUpdater, tenantCode string) error {
	for _, record := range records {
		if !record.Skipped {
			seqExp := types.SequencingExperiment{
				SampleID:                     *record.SampleID,
				Aliquot:                      record.SequencingExperiment.Aliquot.String(),
				StatusCode:                   record.SequencingExperiment.StatusCode,
				ExperimentalStrategyCode:     record.SequencingExperiment.ExperimentalStrategyCode,
				SequencingReadTechnologyCode: record.SequencingExperiment.SequencingReadTechnologyCode,
				PlatformCode:                 record.SequencingExperiment.PlatformCode,
				TenantCode:                   tenantCode,
				SequencingLabCode:            record.SequencingExperiment.SequencingLabCode,
				RunName:                      record.SequencingExperiment.RunName.String(),
				RunAlias:                     record.SequencingExperiment.RunAlias.String(),
				CaptureKit:                   record.SequencingExperiment.CaptureKit.String(),
			}
			if record.SequencingExperiment.RunDate != nil {
				seqExp.RunDate = time.Time(*record.SequencingExperiment.RunDate)
			}

			err := repo.UpdateSequencingExperiment(ctx, &seqExp)
			if err != nil {
				return fmt.Errorf("update sequencing experiment :%w", err)
			}
		}
	}
	return nil
}

// validateUpdateSequencingExperimentBatch mirrors validateSequencingExperimentBatch, but the
// duplicate-detection lookup (validateExistingAliquotForSequencingLabCode) is replaced by a direct
// natural-key lookup: a missing sequencing experiment is an error, not a silent skip.
func validateUpdateSequencingExperimentBatch(ctx context.Context, bv *batchval.BatchValidationContext, seqExps []types.SequencingExperimentBatch) ([]*SequencingExperimentValidationRecord, error) {
	var records []*SequencingExperimentValidationRecord
	visited := map[batchval.SequencingExperimentKey]struct{}{}
	cache := batchval.NewBatchValidationCache(bv)

	for index, seqExp := range seqExps {
		if err := ctx.Err(); err != nil {
			return nil, err
		}
		key := batchval.SequencingExperimentKey{
			SampleOrganizationCode: seqExp.SampleOrganizationCode,
			SubmitterSampleId:      seqExp.SubmitterSampleId.String(),
			Aliquot:                seqExp.Aliquot.String(),
		}
		record, err := validateUpdateSequencingExperimentRecord(ctx, bv, cache, seqExp, index)
		if err != nil {
			return nil, fmt.Errorf("error during update sequencing experiment validation: %v", err)
		}
		batchval.ValidateUniquenessInBatch(record, key, visited, IdenticalSequencingExperimentInBatchCode, []string{seqExp.SampleOrganizationCode, seqExp.SubmitterSampleId.String(), seqExp.Aliquot.String()})
		records = append(records, record)
	}
	return records, nil
}

func validateUpdateSequencingExperimentRecord(ctx context.Context, bv *batchval.BatchValidationContext, cache *batchval.BatchValidationCache, seqExp types.SequencingExperimentBatch, index int) (*SequencingExperimentValidationRecord, error) {
	record := SequencingExperimentValidationRecord{
		BaseValidationRecord: batchval.BaseValidationRecord{
			Context:      bv,
			Cache:        cache,
			ResourceType: types.UpdateSequencingExperimentBatchType,
			Index:        index,
		},
		SequencingExperiment: seqExp,
	}

	err := record.preFetchValidationInfo(ctx)
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
	if err := record.validateUnknownSampleForOrganizationCode(); err != nil {
		return nil, fmt.Errorf("validate sample for organization: %w", err)
	}

	existing, err := cache.GetSequencingExperimentByAliquotAndSubmitterSample(ctx, seqExp.Aliquot.String(), seqExp.SubmitterSampleId.String(), seqExp.SampleOrganizationCode)
	if err != nil {
		return nil, fmt.Errorf("get existing sequencing experiment: %w", err)
	}
	record.validateExistingSeqExpForUpdate(existing)

	return &record, nil
}
