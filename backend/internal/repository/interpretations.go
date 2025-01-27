package repository

import (
	"errors"
	"fmt"
	"html"
	"strings"

	"github.com/Ferlab-Ste-Justine/radiant-api/internal/types"
	"github.com/Goldziher/go-utils/sliceutils"
	"gorm.io/gorm"
)

type InterpretationsRepository struct {
	db *gorm.DB
}

type InterpretationsDAO interface {
	First(sequencingId string, locusId string, transcriptId string) (*types.InterpretationGerminal, error)
	CreateOrUpdate(interpretation *types.InterpretationGerminal) error
}

func NewInterpretationsRepository(db *gorm.DB) *InterpretationsRepository {
	return &InterpretationsRepository{db: db}
}

func mapToInterpretationGerminal(dao *types.InterpretationGerminalDAO) *types.InterpretationGerminal {
	interpretation := &types.InterpretationGerminal{
		ID:                dao.ID,
		SequencingId:      dao.SequencingId,
		LocusId:		   dao.LocusId,		
		TranscriptId:	   dao.TranscriptId,
		Condition:		   dao.Condition,
		Classification:    dao.Classification,
		ClassificationCriterias: strings.Split(dao.ClassificationCriterias, ","),
		TransmissionModes: strings.Split(dao.TransmissionModes, ","),
		Interpretation: html.UnescapeString(dao.Interpretation),
		Pubmed: make([]types.InterpretationPubmed, 0),
		CreatedBy: dao.CreatedBy,
		CreatedByName: dao.CreatedByName,
		CreatedAt: dao.CreatedAt,
		UpdatedBy: dao.UpdatedBy,
		UpdatedByName: dao.UpdatedByName,
		UpdatedAt: dao.UpdatedAt,
	}	
	sliceutils.ForEach(strings.Split(dao.Pubmed, ","), func(pubmed string, i int, slice []string) {
		interpretationPubmed := types.InterpretationPubmed{
			CitationID: pubmed,
			Citation: "",
		}
		interpretation.Pubmed = append(interpretation.Pubmed, interpretationPubmed)
	});
	return interpretation
}

func mapToInterpretationGerminalDAO(interpretation *types.InterpretationGerminal) *types.InterpretationGerminalDAO {
	return &types.InterpretationGerminalDAO{
		ID:                interpretation.ID,
		SequencingId:      interpretation.SequencingId,
		LocusId:		   interpretation.LocusId,		
		TranscriptId:	   interpretation.TranscriptId,
		Condition:		   interpretation.Condition,
		Classification:    interpretation.Classification,
		ClassificationCriterias: strings.Join(interpretation.ClassificationCriterias, ","),
		TransmissionModes: strings.Join(interpretation.TransmissionModes, ","),
		Interpretation: html.EscapeString(interpretation.Interpretation),
		Pubmed: strings.Join(sliceutils.Map(interpretation.Pubmed, func(pubmed types.InterpretationPubmed, i int, slice []types.InterpretationPubmed) string { return interpretation.Pubmed[i].CitationID }), ","),
		CreatedBy: interpretation.CreatedBy,
		CreatedByName: interpretation.CreatedByName,
		CreatedAt: interpretation.CreatedAt,
		UpdatedBy: interpretation.UpdatedBy,
		UpdatedByName: interpretation.UpdatedByName,
		UpdatedAt: interpretation.UpdatedAt,
	}	
}


func (r *InterpretationsRepository) First(sequencingId string, locus string, transcriptId string) (*types.InterpretationGerminal, error) {
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
	return mapToInterpretationGerminal(&dao), nil
}

func (r* InterpretationsRepository) CreateOrUpdate(interpretation *types.InterpretationGerminal) error {
	dao := mapToInterpretationGerminalDAO(interpretation)
	var res types.InterpretationGerminalDAO
	result := r.db.
		Table(types.InterpretationGerminalTable.Name).
		Where("sequencing_id = ? AND locus_id = ? AND transcript_id = ?", interpretation.SequencingId, interpretation.LocusId, interpretation.TranscriptId).
		Assign(dao).
		FirstOrCreate(&res)
	err := result.Error
	if err != nil {
		return err
	}
	fmt.Printf("Interpretation created or updated: %+v\n", res)
	interpretation.ID = res.ID
	return nil
}
