package repository

import (
	"context"
	"errors"
	"fmt"
	"strings"

	"github.com/Goldziher/go-utils/sliceutils"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/internal/utils"
	"github.com/radiant-network/radiant-api/internal/utils/joins"
	"gorm.io/gorm"
)

type DocumentResult = types.DocumentResult
type DocumentFilters = types.DocumentFilters
type Document = types.Document

var INDEX_FORMATS = "('crai', 'tbi')"

type DocumentsRepository struct {
	db     *gorm.DB
	joiner joins.Joiner
}

func NewDocumentsRepository(db *gorm.DB) *DocumentsRepository {
	return &DocumentsRepository{db: db, joiner: joins.Starrocks()}
}

func (r *DocumentsRepository) CreateDocument(ctx context.Context, document *Document) error {
	return r.db.WithContext(ctx).Create(&document).Error
}

func (r *DocumentsRepository) GetDocumentByUrl(ctx context.Context, url string) (*Document, error) {
	var document Document
	txUrl := r.db.WithContext(ctx).Table(types.DocumentTable.Name).Where("url = ?", url)
	if err := txUrl.First(&document).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, fmt.Errorf("error while fetching document by url: %w", err)
	}
	return &document, nil
}

func (r *DocumentsRepository) SearchDocuments(ctx context.Context, userQuery types.ListQuery) (*[]DocumentResult, *int64, error) {
	var documents []DocumentResult
	var count int64

	tx := prepareDocumentsQuery(ctx, userQuery, r)
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

func (r *DocumentsRepository) SearchById(ctx context.Context, prefix string, limit int) (*[]AutocompleteResult, error) {
	/**
	  	(SELECT "document_id" as type, id as value from <schema>.document WHERE CAST(id AS TEXT) LIKE '1%')
		UNION
		(SELECT "name" as type, name as value from <schema>.document WHERE name LIKE '1%')
		UNION
		(SELECT "run_name" as type, run_name as value from <schema>.sequencing_experiment WHERE run_name LIKE '1%')
		UNION
		(SELECT "sample_id" as type, id as value from <schema>.sample WHERE CAST(id AS TEXT) LIKE '1%')
		UNION
		(SELECT "patient_id" as type, id as value from <schema>.patient WHERE CAST(id AS TEXT) LIKE '1%')
		UNION
		(SELECT "case_id" as type, id as value from <schema>.cases WHERE CAST(id AS TEXT) LIKE '1%')
		UNION
		(SELECT "seq_id" as type, id as value from <schema>.sequencing_experiment WHERE CAST(id AS TEXT) LIKE '1%')
		UNION
		(SELECT "task_id" as type, id as value from <schema>.task WHERE CAST(id AS TEXT) LIKE '1%')
		ORDER BY value asc, type asc;
	*/
	var autocompleteResult []AutocompleteResult
	searchInput := fmt.Sprintf("%s%%", prefix)
	db := r.db.WithContext(ctx)

	subQueryDocumentId := db.Table(fmt.Sprintf("%s %s", types.DocumentTable.TenantQualifiedName(ctx), types.DocumentTable.Alias))
	subQueryDocumentId = subQueryDocumentId.Select("\"document_id\" as type, id as value")
	subQueryDocumentId = subQueryDocumentId.Where("CAST(id AS TEXT) LIKE ?", searchInput)
	filterOutIndexFiles(subQueryDocumentId)

	subQueryDocumentName := db.Table(fmt.Sprintf("%s %s", types.DocumentTable.TenantQualifiedName(ctx), types.DocumentTable.Alias))
	subQueryDocumentName = subQueryDocumentName.Select("\"name\" as type, name as value")
	subQueryDocumentName = subQueryDocumentName.Where("name LIKE ?", searchInput)
	filterOutIndexFiles(subQueryDocumentName)

	subQueryRunName := db.Table(fmt.Sprintf("%s %s", types.SequencingExperimentTable.TenantQualifiedName(ctx), types.SequencingExperimentTable.Alias))
	subQueryRunName = subQueryRunName.Select("\"run_name\" as type, run_name as value")
	subQueryRunName = subQueryRunName.Where("LOWER(run_name) LIKE ?", strings.ToLower(searchInput))

	subQuerySampleId := db.Table(fmt.Sprintf("%s %s", types.SampleTable.TenantQualifiedName(ctx), types.SampleTable.Alias))
	subQuerySampleId = subQuerySampleId.Select("\"sample_id\" as type, id as value")
	subQuerySampleId = subQuerySampleId.Where("CAST(id AS TEXT) LIKE ?", searchInput)

	subQueryPatientId := db.Table(fmt.Sprintf("%s %s", types.PatientTable.TenantQualifiedName(ctx), types.PatientTable.Alias))
	subQueryPatientId = subQueryPatientId.Select("\"patient_id\" as type, id as value")
	subQueryPatientId = subQueryPatientId.Where("CAST(id AS TEXT) LIKE ?", searchInput)

	subQueryCaseId := db.Table(fmt.Sprintf("%s %s", types.CaseTable.TenantQualifiedName(ctx), types.CaseTable.Alias))
	subQueryCaseId = subQueryCaseId.Select("\"case_id\" as type, id as value")
	subQueryCaseId = subQueryCaseId.Where("CAST(id AS TEXT) LIKE ?", searchInput)

	subQuerySeqId := db.Table(fmt.Sprintf("%s %s", types.SequencingExperimentTable.TenantQualifiedName(ctx), types.SequencingExperimentTable.Alias))
	subQuerySeqId = subQuerySeqId.Select("\"seq_id\" as type, id as value")
	subQuerySeqId = subQuerySeqId.Where("CAST(id AS TEXT) LIKE ?", searchInput)

	subQueryTaskId := db.Table(fmt.Sprintf("%s %s", types.TaskTable.TenantQualifiedName(ctx), types.TaskTable.Alias))
	subQueryTaskId = subQueryTaskId.Select("\"task_id\" as type, id as value")
	subQueryTaskId = subQueryTaskId.Where("CAST(id AS TEXT) LIKE ?", searchInput)

	tx := db.Table("(? UNION ? UNION ? UNION ? UNION ? UNION ? UNION ? UNION ?) autocompleteByIds", subQueryDocumentId, subQueryDocumentName, subQueryRunName, subQuerySampleId, subQueryPatientId, subQueryCaseId, subQuerySeqId, subQueryTaskId)
	tx = tx.Order("value asc, type asc")
	tx = tx.Limit(limit)
	if err := tx.Find(&autocompleteResult).Error; err != nil {
		return nil, fmt.Errorf("error searching for document autocomplete: %w", err)
	}
	return &autocompleteResult, nil
}

func (r *DocumentsRepository) GetDocumentsFilters(ctx context.Context, withProjectAndLab bool) (*DocumentFilters, error) {

	db := r.db.WithContext(ctx)
	var project []types.FiltersValue
	var diagnosisLab []types.FiltersValue
	var relationship []types.FiltersValue
	var format []types.FiltersValue
	var dataType []types.FiltersValue
	var err error

	if withProjectAndLab {
		project, err = utils.GetFilter(db, types.ProjectTable, "name", nil)
		if err != nil {
			return nil, err
		}

		isDiagnosisLabCondition := fmt.Sprintf("%s.category_code = 'diagnostic_laboratory'", types.OrganizationTable.Alias)
		diagnosisLab, err = utils.GetFilter(db, types.OrganizationTable, "name", &isDiagnosisLabCondition)
		if err != nil {
			return nil, err
		}
	}

	relationship, err = utils.GetFilter(db, types.FamilyRelationshipTable, "name_en", nil)
	if err != nil {
		return nil, err
	}

	isNotIndexFormatCodeCondition := fmt.Sprintf("%s.code not in %s", types.FileFormatTable.Alias, INDEX_FORMATS)
	format, err = utils.GetFilter(db, types.FileFormatTable, "name_en", &isNotIndexFormatCodeCondition)
	if err != nil {
		return nil, err
	}

	dataType, err = utils.GetFilter(db, types.DataTypeTable, "name_en", nil)
	if err != nil {
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

func prepareDocumentsQuery(ctx context.Context, userQuery types.Query, r *DocumentsRepository) *gorm.DB {
	tx := r.db.WithContext(ctx).Table(fmt.Sprintf("%s %s", types.DocumentTable.TenantQualifiedName(ctx), types.DocumentTable.Alias))
	tx = r.joiner.DocumentWithTaskHasDocument(tx)
	tx = r.joiner.TaskHasDocWithTaskContext(tx)
	tx = r.joiner.TaskContextWithCaseHasSeqExp(tx)
	tx = r.joiner.CaseHasSeqExpWithSequencingExperiment(tx)
	tx = r.joiner.CaseHasSeqExpWithCase(tx)
	tx = r.joiner.CaseWithDiagnosisLab(tx)
	tx = r.joiner.SeqExpWithSample(tx)

	if userQuery.HasFieldFromTables(types.ProjectTable) {
		tx = r.joiner.CaseWithProject(tx)
	}

	tx = r.joiner.SampleAndCaseHasSeqExpWithFamily(tx)
	if userQuery.Filters() != nil {
		utils.AddWhere(userQuery, tx)
	}

	filterOutIndexFiles(tx)
	return tx
}

func filterOutIndexFiles(tx *gorm.DB) {
	tx.Where(fmt.Sprintf("%s.format_code not in %s", types.DocumentTable.Alias, INDEX_FORMATS))
}

func (r *DocumentsRepository) GetById(ctx context.Context, id int) (*Document, error) {
	var document Document
	// Keep Take (not First): First can build invalid SQL when the table name carries a database prefix.
	err := r.db.WithContext(ctx).Table(types.DocumentTable.TenantQualifiedName(ctx)).
		Where("id = ?", id).
		Where("format_code not in ?", []string{"crai", "tbi"}).
		Take(&document).Error

	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, fmt.Errorf("error while fetching document: %w", err)
	}
	return &document, nil
}
