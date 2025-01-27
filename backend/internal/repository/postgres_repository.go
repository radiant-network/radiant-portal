package repository

import (
	"errors"
	"html"
	"log"
	"strings"

	"github.com/Ferlab-Ste-Justine/radiant-api/internal/types"
	"github.com/Goldziher/go-utils/sliceutils"

	"gorm.io/gorm"
)

type PostgresRepository struct {
	db *gorm.DB
}

type PostgresDAO interface {
	CheckDatabaseConnection() string
	FindInterpretationGermline(sequencingId string, locus string, transcriptId string) (*types.InterpretationGerminal, error)
	CreateInterpretationGermline(interpretation *types.InterpretationGerminal) error
	UpdateInterpretationGermline(interpretation *types.InterpretationGerminal) error
}

func NewPostgresRepository(db *gorm.DB) *PostgresRepository {
	return &PostgresRepository{db: db}
}

func (r *PostgresRepository) CheckDatabaseConnection() string {
	sqlDb, err := r.db.DB()
	if err != nil {
		log.Fatal("failed to get database object:", err)
		return "down"
	}

	if err = sqlDb.Ping(); err != nil {
		log.Fatal("failed to ping database", err)
		return "down"
	}
	return "up"
}

func mapToInterpretationGerminal(dao *types.InterpretationGerminalDAO) *types.InterpretationGerminal {
	interpretation := &types.InterpretationGerminal{
		ID:                dao.ID,
		SequencingID:      dao.SequencingID,
		LocusID:		   dao.LocusID,		
		TranscriptID:	   dao.TranscriptID,
		Condition:		   dao.Condition,
		Classification:    dao.Classification,
		ClassificationCriterias: strings.Split(dao.ClassificationCriterias, ","),
		TransmissionModes: strings.Split(dao.TransmissionModes, ","),
		Interpretation: html.UnescapeString(dao.Interpretation),
		Pubmed: make([]types.InterpretationPubmed, 0),
		CreatedBy: dao.CreatedBy,
		CreatedByName: dao.CreatedByName,
		CreatedAt: dao.CreatedAt,
		ModifiedBy: dao.ModifiedBy,
		ModifiedByName: dao.ModifiedByName,
		ModifiedAt: dao.ModifiedAt,
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
		SequencingID:      interpretation.SequencingID,
		LocusID:		   interpretation.LocusID,		
		TranscriptID:	   interpretation.TranscriptID,
		Condition:		   interpretation.Condition,
		Classification:    interpretation.Classification,
		ClassificationCriterias: strings.Join(interpretation.ClassificationCriterias, ","),
		TransmissionModes: strings.Join(interpretation.TransmissionModes, ","),
		Interpretation: html.EscapeString(interpretation.Interpretation),
		Pubmed: strings.Join(sliceutils.Map(interpretation.Pubmed, func(pubmed types.InterpretationPubmed, i int, slice []types.InterpretationPubmed) string { return interpretation.Pubmed[i].CitationID }), ","),
		CreatedBy: interpretation.CreatedBy,
		CreatedByName: interpretation.CreatedByName,
		CreatedAt: interpretation.CreatedAt,
		ModifiedBy: interpretation.ModifiedBy,
		ModifiedByName: interpretation.ModifiedByName,
		ModifiedAt: interpretation.ModifiedAt,
	}	
}


func (r *PostgresRepository) FindInterpretationGermline(sequencingId string, locus string, transcriptId string) (*types.InterpretationGerminal, error) {
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

func (r *PostgresRepository) CreateInterpretationGermline(interpretation *types.InterpretationGerminal) error {
	dao := mapToInterpretationGerminalDAO(interpretation)
	result := r.db.
		Table(types.InterpretationGerminalTable.Name).
		Create(&dao)
	err := result.Error
	if err != nil {
		return err
	}
	interpretation.ID = dao.ID
	return nil
}

func (r *PostgresRepository) UpdateInterpretationGermline(interpretation *types.InterpretationGerminal) error {
	dao := mapToInterpretationGerminalDAO(interpretation)
	result := r.db.
		Table(types.InterpretationGerminalTable.Name).
		Save(&dao)
	err := result.Error
	if err != nil {
		return err
	}
	return nil
}