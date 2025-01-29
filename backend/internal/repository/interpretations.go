package repository

import (
	"errors"
	"fmt"
	"html"
	"strings"

	"github.com/Ferlab-Ste-Justine/radiant-api/internal/client"
	"github.com/Ferlab-Ste-Justine/radiant-api/internal/types"
	"github.com/Goldziher/go-utils/sliceutils"
	"gorm.io/gorm"
)

type InterpretationsRepository struct {
	db *gorm.DB
	pubmedClient * client.PubmedClient
}

type InterpretationsDAO interface {
	FirstGermline(sequencingId string, locusId string, transcriptId string) (*types.InterpretationGermline, error)
	CreateOrUpdateGermline(interpretation *types.InterpretationGermline) error
	FirstSomatic(sequencingId string, locusId string, transcriptId string) (*types.InterpretationSomatic, error)
	CreateOrUpdateSomatic(interpretation *types.InterpretationSomatic) error
}

func NewInterpretationsRepository(db *gorm.DB, pubmedClient * client.PubmedClient) *InterpretationsRepository {
	return &InterpretationsRepository{db: db, pubmedClient: pubmedClient}
}

// mappers, could be moved to a separate file
func (r *InterpretationsRepository) mapToInterpretationCommon(dao *types.InterpretationCommonDAO) (*types.InterpretationCommon, error) {
	pubmeds := strings.Split(dao.Pubmed, ",");
	interpretation:= &types.InterpretationCommon{
		ID:                dao.ID,
		SequencingId:      dao.SequencingId,
		LocusId:		   dao.LocusId,
		TranscriptId:	   dao.TranscriptId,
		Interpretation: html.UnescapeString(dao.Interpretation),
		Pubmed: make([]types.InterpretationPubmed, len(pubmeds)),
		CreatedBy: dao.CreatedBy,
		CreatedByName: dao.CreatedByName,
		CreatedAt: dao.CreatedAt,
		UpdatedBy: dao.UpdatedBy,
		UpdatedByName: dao.UpdatedByName,
		UpdatedAt: dao.UpdatedAt,
	};
	for i, v := range pubmeds {
		citation, _ := r.pubmedClient.GetCitationById(v);
		if citation == nil {
			return nil, fmt.Errorf("Pubmed citation not found: %s", v)
		}
		interpretation.Pubmed[i] = types.InterpretationPubmed{CitationID: v, Citation: citation.Nlm.Format}
	}
	return interpretation, nil
}

func (r *InterpretationsRepository) mapToInterpretationCommonDAO(interpretation *types.InterpretationCommon) *types.InterpretationCommonDAO {
	return &types.InterpretationCommonDAO{
		ID:                interpretation.ID,
		SequencingId:      interpretation.SequencingId,
		LocusId:		   interpretation.LocusId,		
		TranscriptId:	   interpretation.TranscriptId,
		Interpretation: html.EscapeString(interpretation.Interpretation),
		Pubmed: strings.Join(sliceutils.Map(interpretation.Pubmed, func(pubmed types.InterpretationPubmed, i int, slice []types.InterpretationPubmed) string { return interpretation.Pubmed[i].CitationID }), ","),
		CreatedBy: interpretation.CreatedBy,
		CreatedByName: interpretation.CreatedByName,
		CreatedAt: interpretation.CreatedAt,
		UpdatedBy: interpretation.UpdatedBy,
		UpdatedByName: interpretation.UpdatedByName,
		UpdatedAt: interpretation.UpdatedAt,
	};
}

func (r *InterpretationsRepository) mapToInterpretationGermline(dao *types.InterpretationGermlineDAO) (*types.InterpretationGermline, error) {
	common, err := r.mapToInterpretationCommon(&dao.InterpretationCommonDAO)
	if err != nil {
		return nil, err
	}
	interpretation := &types.InterpretationGermline{
		InterpretationCommon: *common,
		Condition:		   dao.Condition,
		Classification:    dao.Classification,
		ClassificationCriterias: strings.Split(dao.ClassificationCriterias, ","),
		TransmissionModes: strings.Split(dao.TransmissionModes, ","),
	}	
	return interpretation, nil
}

func (r *InterpretationsRepository) mapToInterpretationGermlineDAO(interpretation *types.InterpretationGermline) *types.InterpretationGermlineDAO {
	return &types.InterpretationGermlineDAO{
		InterpretationCommonDAO: *r.mapToInterpretationCommonDAO(&interpretation.InterpretationCommon),
		Condition:		   interpretation.Condition,
		Classification:    interpretation.Classification,
		ClassificationCriterias: strings.Join(interpretation.ClassificationCriterias, ","),
		TransmissionModes: strings.Join(interpretation.TransmissionModes, ","),
	}	
}

func (r *InterpretationsRepository) mapToInterpretationSomatic(dao *types.InterpretationSomaticDAO) (*types.InterpretationSomatic, error) {
	common, err := r.mapToInterpretationCommon(&dao.InterpretationCommonDAO)
	if err != nil {
		return nil, err
	}
	interpretation := &types.InterpretationSomatic{
		InterpretationCommon: *common,
		TumoralType:	   dao.TumoralType,
		Oncogenicity:      dao.Oncogenicity,
		OncogenicityClassificationCriterias: strings.Split(dao.OncogenicityClassificationCriterias, ","),
		ClinicalUtility: dao.ClinicalUtility,

	}	
	return interpretation, nil
}

func (r *InterpretationsRepository) mapToInterpretationSomaticDAO(interpretation *types.InterpretationSomatic) *types.InterpretationSomaticDAO {
	return &types.InterpretationSomaticDAO{
		InterpretationCommonDAO: *r.mapToInterpretationCommonDAO(&interpretation.InterpretationCommon),
		TumoralType:	   interpretation.TumoralType,
		Oncogenicity:      interpretation.Oncogenicity,
		OncogenicityClassificationCriterias: strings.Join(interpretation.OncogenicityClassificationCriterias, ","),
		ClinicalUtility: interpretation.ClinicalUtility,
	}	
}

func (r *InterpretationsRepository) FirstGermline(sequencingId string, locus string, transcriptId string) (*types.InterpretationGermline, error) {
	var dao types.InterpretationGermlineDAO
	if result := r.db.
		Table(types.InterpretationGermlineTable.Name).
		Where("sequencing_id = ? AND locus_id = ? AND transcript_id = ?", sequencingId, locus, transcriptId).
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

func (r* InterpretationsRepository) CreateOrUpdateGermline(interpretation *types.InterpretationGermline) error {
	dao := r.mapToInterpretationGermlineDAO(interpretation)
	existing, err := r.FirstGermline(interpretation.SequencingId, interpretation.LocusId, interpretation.TranscriptId)
	if err != nil {
		return err
	}
	if existing != nil {
		dao.CreatedBy = existing.CreatedBy
		dao.CreatedByName = existing.CreatedByName
	}
	var res types.InterpretationGermlineDAO
	result := r.db.
		Table(types.InterpretationGermlineTable.Name).
		Where("sequencing_id = ? AND locus_id = ? AND transcript_id = ?", interpretation.SequencingId, interpretation.LocusId, interpretation.TranscriptId).
		Assign(dao).
		FirstOrCreate(&res)
	err = result.Error
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

func (r *InterpretationsRepository) FirstSomatic(sequencingId string, locus string, transcriptId string) (*types.InterpretationSomatic, error) {
	var dao types.InterpretationSomaticDAO
	if result := r.db.
		Table(types.InterpretationSomaticTable.Name).
		Where("sequencing_id = ? AND locus_id = ? AND transcript_id = ?", sequencingId, locus, transcriptId).
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

func (r* InterpretationsRepository) CreateOrUpdateSomatic(interpretation *types.InterpretationSomatic) error {
	dao := r.mapToInterpretationSomaticDAO(interpretation)
	existing, err := r.FirstSomatic(interpretation.SequencingId, interpretation.LocusId, interpretation.TranscriptId)
	if err != nil {
		return err
	}
	if existing != nil {
		dao.CreatedBy = existing.CreatedBy
		dao.CreatedByName = existing.CreatedByName
	}
 	var res types.InterpretationSomaticDAO
	result := r.db.Table(types.InterpretationSomaticTable.Name).
		Where("sequencing_id = ? AND locus_id = ? AND transcript_id = ?", interpretation.SequencingId, interpretation.LocusId, interpretation.TranscriptId).
		Assign(dao).
		FirstOrCreate(&res)
	err = result.Error
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
