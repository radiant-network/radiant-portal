package repository

import (
	"errors"
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
	FirstGermline(sequencingId string, locusId string, transcriptId string) (*types.InterpretationGerminal, error)
	CreateOrUpdateGermline(interpretation *types.InterpretationGerminal) error
	FirstSomatic(sequencingId string, locusId string, transcriptId string) (*types.InterpretationSomatic, error)
	CreateOrUpdateSomatic(interpretation *types.InterpretationSomatic) error
}

func NewInterpretationsRepository(db *gorm.DB, pubmedClient * client.PubmedClient) *InterpretationsRepository {
	return &InterpretationsRepository{db: db, pubmedClient: pubmedClient}
}

// mappers, could be moved to a separate file
func (r *InterpretationsRepository) mapToInterpretationCommon(dao *types.InterpretationCommonDAO) *types.InterpretationCommon {
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
	sliceutils.ForEach(strings.Split(dao.Pubmed, ","), func(pubmed string, i int, slice []string) {
		citation, _ := r.pubmedClient.GetCitationById(pubmed);
		interpretationPubmed := types.InterpretationPubmed{
			CitationID: pubmed,
			Citation: citation.Nlm.Format,
		}
		interpretation.Pubmed = append(interpretation.Pubmed, interpretationPubmed)
	});
	return interpretation
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

func (r *InterpretationsRepository) mapToInterpretationGerminal(dao *types.InterpretationGerminalDAO) *types.InterpretationGerminal {
	interpretation := &types.InterpretationGerminal{
		InterpretationCommon: *r.mapToInterpretationCommon(&dao.InterpretationCommonDAO),
		Condition:		   dao.Condition,
		Classification:    dao.Classification,
		ClassificationCriterias: strings.Split(dao.ClassificationCriterias, ","),
		TransmissionModes: strings.Split(dao.TransmissionModes, ","),
	}	
	return interpretation
}

func (r *InterpretationsRepository) mapToInterpretationGerminalDAO(interpretation *types.InterpretationGerminal) *types.InterpretationGerminalDAO {
	return &types.InterpretationGerminalDAO{
		InterpretationCommonDAO: *r.mapToInterpretationCommonDAO(&interpretation.InterpretationCommon),
		Condition:		   interpretation.Condition,
		Classification:    interpretation.Classification,
		ClassificationCriterias: strings.Join(interpretation.ClassificationCriterias, ","),
		TransmissionModes: strings.Join(interpretation.TransmissionModes, ","),
	}	
}

func (r *InterpretationsRepository) mapToInterpretationSomatic(dao *types.InterpretationSomaticDAO) *types.InterpretationSomatic {
	interpretation := &types.InterpretationSomatic{
		InterpretationCommon: *r.mapToInterpretationCommon(&dao.InterpretationCommonDAO),
		TumoralType:	   dao.TumoralType,
		Oncogenicity:      dao.Oncogenicity,
		OncogenicityClassificationCriterias: strings.Split(dao.OncogenicityClassificationCriterias, ","),
		ClinicalUtility: dao.ClinicalUtility,

	}	
	return interpretation
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

func (r *InterpretationsRepository) FirstGermline(sequencingId string, locus string, transcriptId string) (*types.InterpretationGerminal, error) {
	var dao types.InterpretationGerminalDAO
	if result := r.db.
		Table(types.InterpretationGerminalTable.Name).
		Where("sequencing_id = ? AND locus_id = ? AND transcript_id = ?", sequencingId, locus, transcriptId).
		First(&dao); result.Error != nil {
		err := result.Error
		if !errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, err
		} else {
			return nil, nil
		}
	}
	return r.mapToInterpretationGerminal(&dao), nil
}

func (r* InterpretationsRepository) CreateOrUpdateGermline(interpretation *types.InterpretationGerminal) error {
	dao := r.mapToInterpretationGerminalDAO(interpretation)
	existing, err := r.FirstGermline(interpretation.SequencingId, interpretation.LocusId, interpretation.TranscriptId)
	if err != nil {
		return err
	}
	if existing != nil {
		dao.CreatedBy = existing.CreatedBy
		dao.CreatedByName = existing.CreatedByName
	}
	var res types.InterpretationGerminalDAO
	result := r.db.
		Table(types.InterpretationGerminalTable.Name).
		Where("sequencing_id = ? AND locus_id = ? AND transcript_id = ?", interpretation.SequencingId, interpretation.LocusId, interpretation.TranscriptId).
		Assign(dao).
		FirstOrCreate(&res)
	err = result.Error
	if err != nil {
		return err
	}
	*interpretation = *r.mapToInterpretationGerminal(&res)
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
			return nil, err
		} else {
			return nil, nil
		}
	}
	return r.mapToInterpretationSomatic(&dao), nil
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
		return err
	}
	*interpretation = *r.mapToInterpretationSomatic(&res)
	return nil
}
