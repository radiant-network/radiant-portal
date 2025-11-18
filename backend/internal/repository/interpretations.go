package repository

import (
	"encoding/json"
	"errors"
	"fmt"
	"html"
	"log"
	"strings"

	"github.com/Goldziher/go-utils/sliceutils"
	"github.com/radiant-network/radiant-api/internal/client"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/internal/utils"
	"gorm.io/gorm"
)

type InterpretationsRepository struct {
	db           *gorm.DB
	pubmedClient client.PubmedClientService
}

type InterpretationsDAO interface {
	FirstGermline(caseId string, sequencingId string, locusId string, transcriptId string) (*types.InterpretationGermline, error)
	CreateOrUpdateGermline(interpretation *types.InterpretationGermline) error
	SearchGermline(analysisId []string, patientId []string, variantHash []string) ([]*types.InterpretationGermline, error)
	FirstSomatic(caseId string, sequencingId string, locusId string, transcriptId string) (*types.InterpretationSomatic, error)
	CreateOrUpdateSomatic(interpretation *types.InterpretationSomatic) error
	SearchSomatic(analysisId []string, patientId []string, variantHash []string) ([]*types.InterpretationSomatic, error)
	RetrieveGermlineInterpretationClassificationCounts(locusId int) (types.JsonMap[string, int], error)
}

func NewInterpretationsRepository(db *gorm.DB, pubmedClient client.PubmedClientService) *InterpretationsRepository {
	if db == nil {
		log.Fatal("InterpretationsRepository: db is nil")
		return nil
	}
	if pubmedClient == nil {
		log.Fatal("InterpretationsRepository: pubmedClient is nil")
		return nil
	}
	return &InterpretationsRepository{db: db, pubmedClient: pubmedClient}
}

// mappers, could be moved to a separate file
func (r *InterpretationsRepository) mapToInterpretationCommon(dao *types.InterpretationCommonDAO) (*types.InterpretationCommon, error) {
	pubmeds := utils.SplitRemoveEmptyString(dao.Pubmed, ",")
	interpretation := &types.InterpretationCommon{
		ID:             dao.ID,
		CaseId:         dao.CaseId,
		SequencingId:   dao.SequencingId,
		LocusId:        dao.LocusId,
		TranscriptId:   dao.TranscriptId,
		Interpretation: html.UnescapeString(dao.Interpretation),
		Pubmed:         make([]types.InterpretationPubmed, len(pubmeds)),
		Metadata:       types.InterpretationMetadata{},
		CreatedBy:      dao.CreatedBy,
		CreatedByName:  dao.CreatedByName,
		CreatedAt:      dao.CreatedAt,
		UpdatedBy:      dao.UpdatedBy,
		UpdatedByName:  dao.UpdatedByName,
		UpdatedAt:      dao.UpdatedAt,
	}
	if len(dao.Metadata) > 0 {
		if err := json.Unmarshal(dao.Metadata, &interpretation.Metadata); err != nil {
			return nil, fmt.Errorf("failed to unmarshal metadata from interpretation: %s", dao.Metadata)
		}
	}
	for i, v := range pubmeds {
		citation, _ := r.pubmedClient.GetCitationById(v)
		if citation == nil {
			return nil, fmt.Errorf("pubmed citation not found: %s", v)
		}
		interpretation.Pubmed[i] = types.InterpretationPubmed{CitationID: v, Citation: citation.Nlm.Format}
	}
	return interpretation, nil
}

func (r *InterpretationsRepository) mapToInterpretationCommonDAO(interpretation *types.InterpretationCommon) (*types.InterpretationCommonDAO, error) {
	metadata, err := json.Marshal(interpretation.Metadata)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal metadata from interpretation: %s", interpretation.Metadata)
	}

	common := &types.InterpretationCommonDAO{
		ID:             interpretation.ID,
		CaseId:         interpretation.CaseId,
		SequencingId:   interpretation.SequencingId,
		LocusId:        interpretation.LocusId,
		TranscriptId:   interpretation.TranscriptId,
		Interpretation: html.EscapeString(interpretation.Interpretation),
		Pubmed: strings.Join(sliceutils.Map(interpretation.Pubmed, func(pubmed types.InterpretationPubmed, i int, slice []types.InterpretationPubmed) string {
			return interpretation.Pubmed[i].CitationID
		}), ","),
		Metadata:      metadata,
		CreatedBy:     interpretation.CreatedBy,
		CreatedByName: interpretation.CreatedByName,
		CreatedAt:     interpretation.CreatedAt,
		UpdatedBy:     interpretation.UpdatedBy,
		UpdatedByName: interpretation.UpdatedByName,
		UpdatedAt:     interpretation.UpdatedAt,
	}
	for _, v := range interpretation.Pubmed {
		citation, _ := r.pubmedClient.GetCitationById(v.CitationID)
		if citation == nil {
			return nil, fmt.Errorf("pubmed citation not found: %s", v.CitationID)
		}
	}
	return common, nil
}

func (r *InterpretationsRepository) mapToInterpretationGermline(dao *types.InterpretationGermlineDAO) (*types.InterpretationGermline, error) {
	common, err := r.mapToInterpretationCommon(&dao.InterpretationCommonDAO)
	if err != nil {
		return nil, err
	}
	interpretation := &types.InterpretationGermline{
		InterpretationCommon:    *common,
		Condition:               dao.Condition,
		Classification:          dao.Classification,
		ClassificationCriterias: utils.SplitRemoveEmptyString(dao.ClassificationCriterias, ","),
		TransmissionModes:       utils.SplitRemoveEmptyString(dao.TransmissionModes, ","),
	}
	return interpretation, nil
}

func (r *InterpretationsRepository) mapToInterpretationGermlineDAO(interpretation *types.InterpretationGermline) (*types.InterpretationGermlineDAO, error) {
	common, err := r.mapToInterpretationCommonDAO(&interpretation.InterpretationCommon)
	if err != nil {
		return nil, err
	}
	dao := &types.InterpretationGermlineDAO{
		InterpretationCommonDAO: *common,
		Condition:               interpretation.Condition,
		Classification:          interpretation.Classification,
		ClassificationCriterias: strings.Join(interpretation.ClassificationCriterias, ","),
		TransmissionModes:       strings.Join(interpretation.TransmissionModes, ","),
	}
	return dao, nil
}

func (r *InterpretationsRepository) mapToInterpretationSomatic(dao *types.InterpretationSomaticDAO) (*types.InterpretationSomatic, error) {
	common, err := r.mapToInterpretationCommon(&dao.InterpretationCommonDAO)
	if err != nil {
		return nil, err
	}
	interpretation := &types.InterpretationSomatic{
		InterpretationCommon:                *common,
		TumoralType:                         dao.TumoralType,
		Oncogenicity:                        dao.Oncogenicity,
		OncogenicityClassificationCriterias: utils.SplitRemoveEmptyString(dao.OncogenicityClassificationCriterias, ","),
		ClinicalUtility:                     dao.ClinicalUtility,
	}
	return interpretation, nil
}

func (r *InterpretationsRepository) mapToInterpretationSomaticDAO(interpretation *types.InterpretationSomatic) (*types.InterpretationSomaticDAO, error) {
	common, err := r.mapToInterpretationCommonDAO(&interpretation.InterpretationCommon)
	if err != nil {
		return nil, err
	}
	dao := &types.InterpretationSomaticDAO{
		InterpretationCommonDAO:             *common,
		TumoralType:                         interpretation.TumoralType,
		Oncogenicity:                        interpretation.Oncogenicity,
		OncogenicityClassificationCriterias: strings.Join(interpretation.OncogenicityClassificationCriterias, ","),
		ClinicalUtility:                     interpretation.ClinicalUtility,
	}
	return dao, nil
}

func (r *InterpretationsRepository) FirstGermline(caseId string, sequencingId string, locus string, transcriptId string) (*types.InterpretationGermline, error) {
	var dao types.InterpretationGermlineDAO
	if result := r.db.
		Table(types.InterpretationGermlineTable.Name).
		Where("case_id = ? AND sequencing_id = ? AND locus_id = ? AND transcript_id = ?", caseId, sequencingId, locus, transcriptId).
		First(&dao); result.Error != nil {
		err := result.Error
		if !errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("error while fetching germline interpretation: %w", err)
		} else {
			return nil, nil
		}
	}
	mapped, err := r.mapToInterpretationGermline(&dao)
	if err != nil {
		return nil, err
	}
	return mapped, nil
}

func (r *InterpretationsRepository) CreateOrUpdateGermline(interpretation *types.InterpretationGermline) error {
	dao, err := r.mapToInterpretationGermlineDAO(interpretation)
	if err != nil {
		return err
	}
	existing, err := r.FirstGermline(interpretation.CaseId, interpretation.SequencingId, interpretation.LocusId, interpretation.TranscriptId)
	if err != nil {
		return err
	}
	query := r.db.
		Table(types.InterpretationGermlineTable.Name).
		Where("case_id = ? AND sequencing_id = ? AND locus_id = ? AND transcript_id = ?", interpretation.CaseId, interpretation.SequencingId, interpretation.LocusId, interpretation.TranscriptId)
	if existing != nil {
		dao.CreatedBy = existing.CreatedBy
		dao.CreatedByName = existing.CreatedByName
		dao.CreatedAt = existing.CreatedAt
		query.Select("*").Updates(dao) // select * to update all fields
	} else {
		query.Save(dao)
	}
	var res types.InterpretationGermlineDAO
	query.FirstOrCreate(&res)
	err = query.Error
	if err != nil {
		return fmt.Errorf("error while create/update germline interpretation: %w", err)
	}
	mapped, err := r.mapToInterpretationGermline(&res)
	if err != nil {
		return err
	}
	*interpretation = *mapped
	return nil
}

func (r *InterpretationsRepository) FirstSomatic(caseId string, sequencingId string, locus string, transcriptId string) (*types.InterpretationSomatic, error) {
	var dao types.InterpretationSomaticDAO
	if result := r.db.
		Table(types.InterpretationSomaticTable.Name).
		Where("case_id = ? AND sequencing_id = ? AND locus_id = ? AND transcript_id = ?", caseId, sequencingId, locus, transcriptId).
		First(&dao); result.Error != nil {
		err := result.Error
		if !errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("error while fetching somatic interpretation: %w", err)
		} else {
			return nil, nil
		}
	}
	mapped, err := r.mapToInterpretationSomatic(&dao)
	if err != nil {
		return nil, err
	}
	return mapped, nil
}

func (r *InterpretationsRepository) CreateOrUpdateSomatic(interpretation *types.InterpretationSomatic) error {
	dao, err := r.mapToInterpretationSomaticDAO(interpretation)
	if err != nil {
		return err
	}
	existing, err := r.FirstSomatic(interpretation.CaseId, interpretation.SequencingId, interpretation.LocusId, interpretation.TranscriptId)
	if err != nil {
		return err
	}
	query := r.db.Table(types.InterpretationSomaticTable.Name).
		Where("case_id = ? AND sequencing_id = ? AND locus_id = ? AND transcript_id = ?", interpretation.CaseId, interpretation.SequencingId, interpretation.LocusId, interpretation.TranscriptId)
	if existing != nil {
		dao.CreatedBy = existing.CreatedBy
		dao.CreatedByName = existing.CreatedByName
		query.Select("*").Updates(dao) // select * to update all fields
	} else {
		query.Save(dao)
	}
	var res types.InterpretationSomaticDAO
	query.FirstOrCreate(&res)
	err = query.Error
	if err != nil {
		return fmt.Errorf("error while create/update somatic interpretation: %w", err)
	}
	mapped, err := r.mapToInterpretationSomatic(&res)
	if err != nil {
		return err
	}
	*interpretation = *mapped
	return nil
}

func (r *InterpretationsRepository) SearchGermline(analysisId []string, patientId []string, variantHash []string) ([]*types.InterpretationGermline, error) {
	var dao []types.InterpretationGermlineDAO
	r.db.
		Table(types.InterpretationGermlineTable.Name).
		Where("metadata->>'analysis_id' IN ? OR metadata->>'patient_id' IN ? OR metadata->>'variant_hash' IN ?", analysisId, patientId, variantHash).
		Find(&dao)

	interpretations := make([]*types.InterpretationGermline, len(dao))
	for i, v := range dao {
		mapped, err := r.mapToInterpretationGermline(&v)
		if err != nil {
			return nil, err
		}
		interpretations[i] = mapped
	}

	return interpretations, nil
}

func (r *InterpretationsRepository) SearchSomatic(analysisId []string, patientId []string, variantHash []string) ([]*types.InterpretationSomatic, error) {
	var dao []types.InterpretationSomaticDAO
	r.db.
		Table(types.InterpretationSomaticTable.Name).
		Where("metadata->>'analysis_id' IN ? OR metadata->>'patient_id' IN ? OR metadata->>'variant_hash' IN ?", analysisId, patientId, variantHash).
		Find(&dao)

	interpretations := make([]*types.InterpretationSomatic, len(dao))
	for i, v := range dao {
		mapped, err := r.mapToInterpretationSomatic(&v)
		if err != nil {
			return nil, err
		}
		interpretations[i] = mapped
	}

	return interpretations, nil
}

func (r *InterpretationsRepository) RetrieveGermlineInterpretationClassificationCounts(locusId int) (types.JsonMap[string, int], error) {
	var classificationCounts []types.ClassificationCounts
	tx := r.db.Table("interpretation_germline")
	tx = tx.Select("classification, COUNT(1) as classification_count")
	tx = tx.Where("locus_id = ?", fmt.Sprintf("%d", locusId))
	tx = tx.Group("classification")
	tx = tx.Order("classification_count DESC")

	if err := tx.Find(&classificationCounts).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		} else {
			return nil, fmt.Errorf("error while fetching Germline Interpretation Classification Counts: %w", err)
		}
	} else if len(classificationCounts) == 0 {
		return nil, nil
	}

	results := make(map[string]int)
	for _, record := range classificationCounts {
		classification, err := types.GetLabelFromCode(record.Classification)
		if err != nil {
			return nil, fmt.Errorf("error while fetching Germline Interpretation Classification Counts: %w", err)
		}
		results[classification] = record.ClassificationCount
	}

	return results, nil
}
