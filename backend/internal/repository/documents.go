package repository

import (
	"fmt"
	"log"
	"strings"

	"github.com/Goldziher/go-utils/sliceutils"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/internal/utils"
	"gorm.io/gorm"
)

type DocumentResult = types.DocumentResult
type DocumentFilters = types.DocumentFilters

type DocumentsRepository struct {
	db *gorm.DB
}

type DocumentsDAO interface {
	SearchDocuments(userQuery types.ListQuery) (*[]DocumentResult, *int64, error)
	SearchById(prefix string, limit int) (*[]AutocompleteResult, error)
	GetDocumentsFilters(userQuery types.AggQuery) (*DocumentFilters, error)
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

	tx := prepareDocumentsQuery(userQuery, r)
	var columns = sliceutils.Map(userQuery.SelectedFields(), func(field types.Field, index int, slice []types.Field) string {
		return fmt.Sprintf("%s.%s as %s", field.Table.Alias, field.Name, field.GetAlias())
	})

	if err := tx.Count(&count).Error; err != nil {
		return nil, nil, fmt.Errorf("error counting documents: %w", err)
	}

	tx = tx.Select(columns)
	utils.AddLimitAndSort(tx, userQuery)

	if err := tx.Find(&documents).Error; err != nil {
		return nil, nil, fmt.Errorf("error fetching documents: %w", err)
	}

	return &documents, &count, nil
}

func (r *DocumentsRepository) SearchById(prefix string, limit int) (*[]AutocompleteResult, error) {
	/**
	  	(SELECT "document_id" as type, id as value from `radiant_jdbc`.`public`.`document` WHERE CAST(id AS TEXT) LIKE '1%')
		UNION
		(SELECT "run_name" as type, run_name as value from `radiant_jdbc`.`public`.`sequencing_experiment` WHERE run_name LIKE '1%')
		UNION
		(SELECT "sample_id" as type, id as value from `radiant_jdbc`.`public`.`sample` WHERE CAST(id AS TEXT) LIKE '1%')
		UNION
		(SELECT "patient_id" as type, id as value from `radiant_jdbc`.`public`.`patient` WHERE CAST(id AS TEXT) LIKE '1%')
		UNION
		(SELECT "case_id" as type, id as value from `radiant_jdbc`.`public`.`cases` WHERE CAST(id AS TEXT) LIKE '1%')
		UNION
		(SELECT "seq_id" as type, id as value from `radiant_jdbc`.`public`.`sequencing_experiment` WHERE CAST(id AS TEXT) LIKE '1%')
		UNION
		(SELECT "task_id" as type, id as value from `radiant_jdbc`.`public`.`task` WHERE CAST(id AS TEXT) LIKE '1%')
		ORDER BY value asc, type asc;
	*/
	var autocompleteResult []AutocompleteResult
	searchInput := fmt.Sprintf("%s%%", prefix)

	subQueryDocumentId := r.db.Table(fmt.Sprintf("%s %s", types.DocumentTable.Name, types.DocumentTable.Alias))
	subQueryDocumentId = subQueryDocumentId.Select("\"document_id\" as type, id as value")
	subQueryDocumentId = subQueryDocumentId.Where("CAST(id AS TEXT) LIKE ?", searchInput)

	subQueryRunName := r.db.Table(fmt.Sprintf("%s %s", types.SequencingExperimentTable.Name, types.SequencingExperimentTable.Alias))
	subQueryRunName = subQueryRunName.Select("\"run_name\" as type, run_name as value")
	subQueryRunName = subQueryRunName.Where("LOWER(run_name) LIKE ?", strings.ToLower(searchInput))

	subQuerySampleId := r.db.Table(fmt.Sprintf("%s %s", types.SampleTable.Name, types.SampleTable.Alias))
	subQuerySampleId = subQuerySampleId.Select("\"sample_id\" as type, id as value")
	subQuerySampleId = subQuerySampleId.Where("CAST(id AS TEXT) LIKE ?", searchInput)

	subQueryPatientId := r.db.Table(fmt.Sprintf("%s %s", types.PatientTable.Name, types.PatientTable.Alias))
	subQueryPatientId = subQueryPatientId.Select("\"patient_id\" as type, id as value")
	subQueryPatientId = subQueryPatientId.Where("CAST(id AS TEXT) LIKE ?", searchInput)

	subQueryCaseId := r.db.Table(fmt.Sprintf("%s %s", types.CaseTable.Name, types.CaseTable.Alias))
	subQueryCaseId = subQueryCaseId.Select("\"case_id\" as type, id as value")
	subQueryCaseId = subQueryCaseId.Where("CAST(id AS TEXT) LIKE ?", searchInput)

	subQuerySeqId := r.db.Table(fmt.Sprintf("%s %s", types.SequencingExperimentTable.Name, types.SequencingExperimentTable.Alias))
	subQuerySeqId = subQuerySeqId.Select("\"seq_id\" as type, id as value")
	subQuerySeqId = subQuerySeqId.Where("CAST(id AS TEXT) LIKE ?", searchInput)

	subQueryTaskId := r.db.Table(fmt.Sprintf("%s %s", types.TaskTable.Name, types.TaskTable.Alias))
	subQueryTaskId = subQueryTaskId.Select("\"task_id\" as type, id as value")
	subQueryTaskId = subQueryTaskId.Where("CAST(id AS TEXT) LIKE ?", searchInput)

	tx := r.db.Table("(? UNION ? UNION ? UNION ? UNION ? UNION ? UNION ?) autocompleteByIds", subQueryDocumentId, subQueryRunName, subQuerySampleId, subQueryPatientId, subQueryCaseId, subQuerySeqId, subQueryTaskId)
	tx = tx.Order("value asc, type asc")
	tx = tx.Limit(limit)
	if err := tx.Find(&autocompleteResult).Error; err != nil {
		return nil, fmt.Errorf("error searching for document autocomplete: %w", err)
	}
	return &autocompleteResult, nil
}

func (r *DocumentsRepository) GetDocumentsFilters(query types.AggQuery) (*DocumentFilters, error) {

	var project []Aggregation
	var performerLab []Aggregation
	var relationship []Aggregation
	var format []Aggregation
	var dataType []Aggregation

	txDocuments := prepareDocumentsQuery(query, r)
	txDocuments = txDocuments.Select("doc.id, c.project_id, c.performer_lab_id, f.relationship_to_proband_code, doc.format_code, doc.data_type_code")

	if err := r.getDocumentsFilter(txDocuments, &project, types.ProjectTable, "project_id", "id", "name"); err != nil {
		return nil, err
	}

	if err := r.getDocumentsFilter(txDocuments, &performerLab, types.PerformerLabTable, "performer_lab_id", "id", "name"); err != nil {
		return nil, err
	}

	if err := r.getDocumentsFilter(txDocuments, &relationship, types.FamilyRelationshipTable, "relationship_to_proband_code", "code", "name_en"); err != nil {
		return nil, err
	}

	if err := r.getDocumentsFilter(txDocuments, &format, types.FileFormatTable, "format_code", "code", "name_en"); err != nil {
		return nil, err
	}

	if err := r.getDocumentsFilter(txDocuments, &dataType, types.DataTypeTable, "data_type_code", "code", "name_en"); err != nil {
		return nil, err
	}

	return &DocumentFilters{
		Project:               project,
		PerformerLab:          performerLab,
		RelationshipToProband: relationship,
		Format:                format,
		DataType:              dataType,
	}, nil
}

func (r *DocumentsRepository) getDocumentsFilter(txDocument *gorm.DB, destination *[]Aggregation, filterTable types.Table, documentsJoinColumn string, filterJoinColumn string, filterLabelColumn string) error {
	txProject := r.db.Table(fmt.Sprintf("%s %s", filterTable.Name, filterTable.Alias))
	txProject = txProject.Select(fmt.Sprintf("%s.code as bucket, %s.%s as label, count(distinct documents.id) as count", filterTable.Alias, filterTable.Alias, filterLabelColumn))
	txProject = txProject.Joins(fmt.Sprintf("LEFT JOIN (?) documents ON documents.%s = %s.%s", documentsJoinColumn, filterTable.Alias, filterJoinColumn), txDocument)
	txProject = txProject.Group(fmt.Sprintf("%s.code, %s.%s", filterTable.Alias, filterTable.Alias, filterLabelColumn))
	txProject = txProject.Order("count desc, bucket asc")
	if err := txProject.Find(destination).Error; err != nil {
		return fmt.Errorf("error fetching filter %s: %w", filterTable.Name, err)
	}
	return nil
}

func prepareDocumentsQuery(userQuery types.Query, r *DocumentsRepository) *gorm.DB {
	tx := r.db.Table(fmt.Sprintf("%s %s", types.DocumentTable.Name, types.DocumentTable.Alias))
	tx = joinWithTaskHasDocument(tx)
	tx = joinWithTaskHasSequencingExperiment(tx)
	tx = joinWithSequencingExperiment(tx)
	tx = joinWithCase(tx)
	tx = joinWithPerformerLab(tx)

	if userQuery.HasFieldFromTables(types.SampleTable) {
		tx = joinWithSample(tx)
	}

	tx = joinWithFamilyRelationship(tx)
	if userQuery.Filters() != nil {
		utils.AddWhere(userQuery, tx)
	}
	return tx
}

func joinWithTaskHasDocument(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("INNER JOIN %s %s ON %s.document_id=%s.id", types.TaskHasDocumentTable.Name, types.TaskHasDocumentTable.Alias, types.TaskHasDocumentTable.Alias, types.DocumentTable.Alias))
}

func joinWithTaskHasSequencingExperiment(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("INNER JOIN %s %s ON %s.task_id=%s.task_id", types.TaskHasSequencingExperimentTable.Name, types.TaskHasSequencingExperimentTable.Alias, types.TaskHasDocumentTable.Alias, types.TaskHasSequencingExperimentTable.Alias))
}

func joinWithSequencingExperiment(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("INNER JOIN %s %s ON %s.sequencing_experiment_id=%s.id", types.SequencingExperimentTable.Name, types.SequencingExperimentTable.Alias, types.TaskHasSequencingExperimentTable.Alias, types.SequencingExperimentTable.Alias))
}

func joinWithCase(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("INNER JOIN %s %s ON %s.case_id=%s.id", types.CaseTable.Name, types.CaseTable.Alias, types.SequencingExperimentTable.Alias, types.CaseTable.Alias))
}

func joinWithSample(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s.sample_id=%s.id", types.SampleTable.Name, types.SampleTable.Alias, types.SequencingExperimentTable.Alias, types.SampleTable.Alias))
}

func joinWithFamilyRelationship(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s.family_member_id=%s.patient_id AND %s.case_id = %s.case_id", types.FamilyTable.Name, types.FamilyTable.Alias, types.FamilyTable.Alias, types.SequencingExperimentTable.Alias, types.FamilyTable.Alias, types.SequencingExperimentTable.Alias))
}
