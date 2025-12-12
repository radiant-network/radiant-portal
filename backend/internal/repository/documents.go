package repository

import (
	"errors"
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
type Document = types.Document

var INDEX_FORMATS = "('crai', 'tbi')"

type DocumentsRepository struct {
	db *gorm.DB
}

type DocumentsDAO interface {
	SearchDocuments(userQuery types.ListQuery) (*[]DocumentResult, *int64, error)
	SearchById(prefix string, limit int) (*[]AutocompleteResult, error)
	GetDocumentsFilters(userQuery types.AggQuery, withProjectAndLab bool) (*DocumentFilters, error)
	GetById(id int) (*Document, error)
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
		(SELECT "name" as type, name as value from `radiant_jdbc`.`public`.`document` WHERE name LIKE '1%')
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
	filterOutIndexFiles(subQueryDocumentId)

	subQueryDocumentName := r.db.Table(fmt.Sprintf("%s %s", types.DocumentTable.Name, types.DocumentTable.Alias))
	subQueryDocumentName = subQueryDocumentName.Select("\"name\" as type, name as value")
	subQueryDocumentName = subQueryDocumentName.Where("name LIKE ?", searchInput)
	filterOutIndexFiles(subQueryDocumentName)

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

	tx := r.db.Table("(? UNION ? UNION ? UNION ? UNION ? UNION ? UNION ? UNION ?) autocompleteByIds", subQueryDocumentId, subQueryDocumentName, subQueryRunName, subQuerySampleId, subQueryPatientId, subQueryCaseId, subQuerySeqId, subQueryTaskId)
	tx = tx.Order("value asc, type asc")
	tx = tx.Limit(limit)
	if err := tx.Find(&autocompleteResult).Error; err != nil {
		return nil, fmt.Errorf("error searching for document autocomplete: %w", err)
	}
	return &autocompleteResult, nil
}

func (r *DocumentsRepository) GetDocumentsFilters(query types.AggQuery, withProjectAndLab bool) (*DocumentFilters, error) {

	var project []Aggregation
	var diagnosisLab []Aggregation
	var relationship []Aggregation
	var format []Aggregation
	var dataType []Aggregation

	txDocuments := prepareDocumentsQuery(query, r)
	txDocuments = txDocuments.Select("doc.id, c.project_id, c.diagnosis_lab_id, f.relationship_to_proband_code, doc.format_code, doc.data_type_code")

	if withProjectAndLab {
		if err := r.getDocumentsFilter(txDocuments, &project, types.ProjectTable, "project_id", "id", "name", nil); err != nil {
			return nil, err
		}

		isDiagnosisLabCondition := fmt.Sprintf("%s.category_code = 'diagnostic_laboratory'", types.OrganizationTable.Alias)
		if err := r.getDocumentsFilter(txDocuments, &diagnosisLab, types.OrganizationTable, "diagnosis_lab_id", "id", "name", &isDiagnosisLabCondition); err != nil {
			return nil, err
		}
	}

	if err := r.getDocumentsFilter(txDocuments, &relationship, types.FamilyRelationshipTable, "relationship_to_proband_code", "code", "name_en", nil); err != nil {
		return nil, err
	}

	isNotIndexFormatCodeCondition := fmt.Sprintf("%s.code not in %s", types.FileFormatTable.Alias, INDEX_FORMATS)
	if err := r.getDocumentsFilter(txDocuments, &format, types.FileFormatTable, "format_code", "code", "name_en", &isNotIndexFormatCodeCondition); err != nil {
		return nil, err
	}

	if err := r.getDocumentsFilter(txDocuments, &dataType, types.DataTypeTable, "data_type_code", "code", "name_en", nil); err != nil {
		return nil, err
	}

	return &DocumentFilters{
		Project:               project,
		DiagnosisLab:          diagnosisLab,
		RelationshipToProband: relationship,
		Format:                format,
		DataType:              dataType,
	}, nil
}

func (r *DocumentsRepository) getDocumentsFilter(txDocument *gorm.DB, destination *[]Aggregation, filterTable types.Table, documentsJoinColumn string, filterJoinColumn string, filterLabelColumn string, filterCondition *string) error {
	tx := r.db.Table(fmt.Sprintf("%s %s", filterTable.Name, filterTable.Alias))
	tx = tx.Select(fmt.Sprintf("%s.code as bucket, %s.%s as label, count(distinct doc.id) as count", filterTable.Alias, filterTable.Alias, filterLabelColumn))
	tx = tx.Joins(fmt.Sprintf("LEFT JOIN (?) doc ON doc.%s = %s.%s", documentsJoinColumn, filterTable.Alias, filterJoinColumn), txDocument)
	tx = tx.Group(fmt.Sprintf("%s.code, %s.%s", filterTable.Alias, filterTable.Alias, filterLabelColumn))
	tx = tx.Order("count desc, bucket asc")
	if filterCondition != nil {
		tx = tx.Where(*filterCondition)
	}

	if err := tx.Find(destination).Error; err != nil {
		return fmt.Errorf("error fetching filter %s: %w", filterTable.Name, err)
	}
	return nil
}

func prepareDocumentsQuery(userQuery types.Query, r *DocumentsRepository) *gorm.DB {
	tx := r.db.Table(fmt.Sprintf("%s %s", types.DocumentTable.Name, types.DocumentTable.Alias))
	tx = utils.JoinWithTaskHasDocument(tx)
	tx = utils.JoinWithTaskContext(tx)
	tx = utils.JoinWithCaseHasSequencingExperiment(tx)
	tx = utils.JoinWithSequencingExperiment(tx)
	tx = utils.JoinWithCase(tx)
	tx = utils.JoinWithDiagnosisLab(tx)
	tx = utils.JoinWithSample(tx)

	if userQuery.HasFieldFromTables(types.ProjectTable) {
		tx = utils.JoinWithProject(tx)
	}

	tx = utils.JoinWithFamilyRelationship(tx)
	if userQuery.Filters() != nil {
		utils.AddWhere(userQuery, tx)
	}

	filterOutIndexFiles(tx)
	return tx
}

func filterOutIndexFiles(tx *gorm.DB) {
	tx.Where(fmt.Sprintf("%s.format_code not in %s", types.DocumentTable.Alias, INDEX_FORMATS))
}

func (r *DocumentsRepository) GetById(id int) (*Document, error) {
	var document Document
	err := r.db.Table(types.DocumentTable.Name).
		Where("id = ?", id).
		Where("format_code not in ?", []string{"crai", "tbi"}).
		First(&document).Error

	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, fmt.Errorf("error while fetching document: %w", err)
	}
	return &document, nil
}
