package repository

import (
	"log"

	"github.com/Ferlab-Ste-Justine/radiant-api/internal/types"

	"gorm.io/gorm"
)

type PostgresRepository struct {
	db *gorm.DB
}

type PostgresDAO interface {
	CheckDatabaseConnection() string
	FindInterpretationGermline(sequencingId string, locus string, transcriptId string) (*types.InterpretationGerminal, error)
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


func (r *PostgresRepository) FindInterpretationGermline(sequencingId string, locus string, transcriptId string) (*types.InterpretationGerminal, error) {
	var interpretation types.InterpretationGerminal
	if err := r.db.
		Table(types.InterpretationGerminalTable.Name).
		Where("sequencing_id = ? AND locus = ? AND transcript_id = ?", sequencingId, locus, transcriptId).
		Find(&interpretation).Error; err != nil {
		return nil, err
	}
	return &interpretation, nil
}