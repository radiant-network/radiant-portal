package repository

import (
	"fmt"
	"log"

	"github.com/Goldziher/go-utils/sliceutils"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/internal/utils"
	"gorm.io/gorm"
)

type DocumentResult = types.DocumentResult

type DocumentsRepository struct {
	db *gorm.DB
}

type DocumentsDAO interface {
	SearchDocuments(userQuery types.ListQuery) (*[]DocumentResult, *int64, error)
	//SearchById(prefix string, limit int) (*[]AutocompleteResult, error)
	//GetCasesFilters(userQuery types.AggQuery) (*CaseFilters, error)
}

func NewDocumentsRepository(db *gorm.DB) *DocumentsRepository {
	if db == nil {
		log.Print("DocumentsRepository: db is nil")
		return nil
	}
	return &DocumentsRepository{db: db}
}

func (r *DocumentsRepository) SearchDocuments(userQuery types.ListQuery) (*[]DocumentResult, *int64, error) {
	var documents []DocumentResult
	var count int64

	tx, err := prepareDocumentsQuery(userQuery, r)
	if err != nil {
		return nil, nil, fmt.Errorf("error during query preparation %w", err)
	}
	var columns = sliceutils.Map(userQuery.SelectedFields(), func(field types.Field, index int, slice []types.Field) string {
		return fmt.Sprintf("%s.%s as %s", field.Table.Alias, field.Name, field.GetAlias())
	})

	if err = tx.Count(&count).Error; err != nil {
		return nil, nil, fmt.Errorf("error counting documents: %w", err)
	}

	tx = tx.Select(columns)
	utils.AddLimitAndSort(tx, userQuery)

	if err = tx.Find(&documents).Error; err != nil {
		return nil, nil, fmt.Errorf("error fetching documents: %w", err)
	}
	return &documents, &count, nil
}

func prepareDocumentsQuery(userQuery types.Query, r *DocumentsRepository) (*gorm.DB, error) {
	tx := r.db.Table(fmt.Sprintf("%s %s", types.DocumentTable.Name, types.DocumentTable.Alias))
	tx = joinWithTaskHasDocument(tx)
	tx = joinWithTaskHasSequencingExperiment(tx)
	tx = joinWithSequencingExperiment(tx)
	tx = joinWithCase(tx)
	tx = joinWithPerformerLab(tx)
	tx = joinWithSample(tx)
	if userQuery != nil {
		utils.AddWhere(userQuery, tx)
	}
	return tx, nil
}

func joinWithTaskHasDocument(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s.document_id=%s.id", types.TaskHasDocumentTable.Name, types.TaskHasDocumentTable.Alias, types.TaskHasDocumentTable.Alias, types.DocumentTable.Alias))
}

func joinWithTaskHasSequencingExperiment(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s.task_id=%s.task_id", types.TaskHasSequencingExperimentTable.Name, types.TaskHasSequencingExperimentTable.Alias, types.TaskHasDocumentTable.Alias, types.TaskHasSequencingExperimentTable.Alias))
}

func joinWithSequencingExperiment(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s.sequencing_experiment_id=%s.id", types.SequencingExperimentTable.Name, types.SequencingExperimentTable.Alias, types.TaskHasSequencingExperimentTable.Alias, types.SequencingExperimentTable.Alias))
}

func joinWithCase(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s.case_id=%s.id", types.CaseTable.Name, types.CaseTable.Alias, types.SequencingExperimentTable.Alias, types.CaseTable.Alias))
}

func joinWithSample(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s.sample_id=%s.id", types.SampleTable.Name, types.SampleTable.Alias, types.SequencingExperimentTable.Alias, types.SampleTable.Alias))
}
