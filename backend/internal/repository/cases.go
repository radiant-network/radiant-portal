package repository

import (
	"fmt"
	"log"

	"github.com/Goldziher/go-utils/sliceutils"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/internal/utils"
	"gorm.io/gorm"
)

type Case = types.Case
type CaseResult = types.CaseResult
type AutocompleteResult = types.AutocompleteResult
type CaseFilters = types.CaseFilters

type CasesRepository struct {
	db *gorm.DB
}

type CasesDAO interface {
	SearchCases(userQuery types.ListQuery) (*[]CaseResult, error)
	CountCases(userQuery types.CountQuery) (*int64, error)
	SearchById(prefix string, limit int) (*[]AutocompleteResult, error)
	GetCasesFilters(userQuery types.AggQuery) (*CaseFilters, error)
}

func NewCasesRepository(db *gorm.DB) *CasesRepository {
	if db == nil {
		log.Fatal("CasesRepository: db is nil")
		return nil
	}
	return &CasesRepository{db: db}
}

func (r *CasesRepository) SearchCases(userQuery types.ListQuery) (*[]CaseResult, error) {
	var cases []CaseResult

	tx, err := prepareQuery(userQuery, r)
	if err != nil {
		return nil, fmt.Errorf("error during query preparation %w", err)
	}
	var columns = sliceutils.Map(userQuery.SelectedFields(), func(field types.Field, index int, slice []types.Field) string {
		return fmt.Sprintf("%s.%s as %s", field.Table.Alias, field.Name, field.GetAlias())
	})

	tx = tx.Select(columns)
	utils.AddLimitAndSort(tx, userQuery)

	if err = tx.Find(&cases).Error; err != nil {
		return nil, fmt.Errorf("error fetching cases: %w", err)
	}
	return &cases, nil
}

func (r *CasesRepository) CountCases(userQuery types.CountQuery) (*int64, error) {
	var count int64

	tx, err := prepareQuery(userQuery, r)
	if err != nil {
		return nil, fmt.Errorf("error during query preparation %w", err)
	}

	if err = tx.Count(&count).Error; err != nil {
		return nil, fmt.Errorf("error fetching cases: %w", err)
	}
	return &count, nil
}

func (r *CasesRepository) SearchById(prefix string, limit int) (*[]AutocompleteResult, error) {
	/**
	  	(SELECT "case_id" as type, id as value from `radiant_jdbc`.`public`.`cases` WHERE CAST(id AS TEXT) LIKE '1%')
	    UNION
	    (SELECT "patient_id" as type, proband_id as value from `radiant_jdbc`.`public`.`cases` WHERE CAST(proband_id AS TEXT) LIKE '1%')
	    UNION
	    (SELECT "mrn" as type, mrn as value from `radiant_jdbc`.`public`.`patient` WHERE mrn LIKE '1%')
	    UNION
	    (SELECT "request_id" as type, id as value from `radiant_jdbc`.`public`.`request` WHERE CAST(id AS TEXT) LIKE '1%')
	    ORDER BY value asc;
	*/
	var autocompleteResult []AutocompleteResult
	searchInput := fmt.Sprintf("%s%%", prefix)
	subQueryCaseId := r.db.Table(fmt.Sprintf("%s %s", types.CaseTable.Name, types.CaseTable.Alias))
	subQueryCaseId = subQueryCaseId.Select("\"case_id\" as type, id as value")
	subQueryCaseId = subQueryCaseId.Where("CAST(id AS TEXT) LIKE ?", searchInput)

	subQueryProbandId := r.db.Table(fmt.Sprintf("%s %s", types.CaseTable.Name, types.CaseTable.Alias))
	subQueryProbandId = subQueryProbandId.Select("\"patient_id\" as type, proband_id as value")
	subQueryProbandId = subQueryProbandId.Where("CAST(proband_id AS TEXT) LIKE ?", searchInput)

	subQueryMrn := r.db.Table(fmt.Sprintf("%s %s", types.PatientTable.Name, types.PatientTable.Alias))
	subQueryMrn = subQueryMrn.Select("\"mrn\" as type, mrn as value")
	subQueryMrn = subQueryMrn.Where("mrn LIKE ?", searchInput)

	subQueryRequestId := r.db.Table(fmt.Sprintf("%s %s", types.RequestTable.Name, types.RequestTable.Alias))
	subQueryRequestId = subQueryRequestId.Select("\"request_id\" as type, id as value")
	subQueryRequestId = subQueryRequestId.Where("CAST(id AS TEXT) LIKE ?", searchInput)

	tx := r.db.Table("(? UNION ? UNION ? UNION ?) autocompleteByIds", subQueryCaseId, subQueryProbandId, subQueryMrn, subQueryRequestId)
	tx = tx.Order("value asc, type asc")
	tx = tx.Limit(limit)
	if err := tx.Find(&autocompleteResult).Error; err != nil {
		return nil, fmt.Errorf("error searching for case autocomplete: %w", err)
	}
	return &autocompleteResult, nil
}

func (r *CasesRepository) GetCasesFilters(query types.AggQuery) (*CaseFilters, error) {

	var status []Aggregation
	var priority []Aggregation
	var caseAnalysis []Aggregation
	var project []Aggregation
	var requestedBy []Aggregation
	var performerLab []Aggregation

	txCases, err := prepareQuery(query, r)
	if err != nil {
		return nil, fmt.Errorf("error during query preparation %w", err)
	}
	txCases = txCases.Select("c.id, c.status_code, r.priority_code, c.case_analysis_id, c.project_id, c.performer_lab_id, r.ordering_organization_id")

	txStatus := r.db.Table(fmt.Sprintf("%s %s", types.StatusTable.Name, types.StatusTable.Alias))
	txStatus = txStatus.Select(fmt.Sprintf("%s.code as bucket, %s.name_en as label, count(distinct cases.id) as count", types.StatusTable.Alias, types.StatusTable.Alias))
	txStatus = txStatus.Joins(fmt.Sprintf("LEFT JOIN (?) cases ON cases.status_code = %s.code", types.StatusTable.Alias), txCases)
	txStatus = txStatus.Group(fmt.Sprintf("%s.code, %s.name_en", types.StatusTable.Alias, types.StatusTable.Alias))
	txStatus = txStatus.Order("count desc, bucket asc")
	if err := txStatus.Find(&status).Error; err != nil {
		return nil, fmt.Errorf("error fetching status: %w", err)
	}

	txPriority := r.db.Table(fmt.Sprintf("%s %s", types.PriorityTable.Name, types.PriorityTable.Alias))
	txPriority = txPriority.Select(fmt.Sprintf("%s.code as bucket, %s.name_en as label, count(distinct cases.id) as count", types.PriorityTable.Alias, types.PriorityTable.Alias))
	txPriority = txPriority.Joins(fmt.Sprintf("LEFT JOIN (?) cases ON cases.priority_code = %s.code", types.PriorityTable.Alias), txCases)
	txPriority = txPriority.Group(fmt.Sprintf("%s.code, %s.name_en", types.PriorityTable.Alias, types.PriorityTable.Alias))
	txPriority = txPriority.Order("count desc, bucket asc")
	if err := txPriority.Find(&priority).Error; err != nil {
		return nil, fmt.Errorf("error fetching priority: %w", err)
	}

	txCaseAnalysis := r.db.Table(fmt.Sprintf("%s %s", types.CaseAnalysisTable.Name, types.CaseAnalysisTable.Alias))
	txCaseAnalysis = txCaseAnalysis.Select(fmt.Sprintf("%s.code as bucket, %s.name as label, count(distinct cases.id) as count", types.CaseAnalysisTable.Alias, types.CaseAnalysisTable.Alias))
	txCaseAnalysis = txCaseAnalysis.Joins(fmt.Sprintf("LEFT JOIN (?) cases ON cases.case_analysis_id = %s.id", types.CaseAnalysisTable.Alias), txCases)
	txCaseAnalysis = txCaseAnalysis.Group(fmt.Sprintf("%s.code, %s.name", types.CaseAnalysisTable.Alias, types.CaseAnalysisTable.Alias))
	txCaseAnalysis = txCaseAnalysis.Order("count desc, bucket asc")
	if err := txCaseAnalysis.Find(&caseAnalysis).Error; err != nil {
		return nil, fmt.Errorf("error fetching case_analysis: %w", err)
	}

	txProject := r.db.Table(fmt.Sprintf("%s %s", types.ProjectTable.Name, types.ProjectTable.Alias))
	txProject = txProject.Select(fmt.Sprintf("%s.code as bucket, %s.name as label, count(distinct cases.id) as count", types.ProjectTable.Alias, types.ProjectTable.Alias))
	txProject = txProject.Joins(fmt.Sprintf("LEFT JOIN (?) cases ON cases.project_id = %s.id", types.ProjectTable.Alias), txCases)
	txProject = txProject.Group(fmt.Sprintf("%s.code, %s.name", types.ProjectTable.Alias, types.ProjectTable.Alias))
	txProject = txProject.Order("count desc, bucket asc")
	if err := txProject.Find(&project).Error; err != nil {
		return nil, fmt.Errorf("error fetching project: %w", err)
	}

	txPerformerLab := r.db.Table(fmt.Sprintf("%s %s", types.PerformerLabTable.Name, types.PerformerLabTable.Alias))
	txPerformerLab = txPerformerLab.Select(fmt.Sprintf("%s.code as bucket, %s.name as label, count(distinct cases.id) as count", types.PerformerLabTable.Alias, types.PerformerLabTable.Alias))
	txPerformerLab = txPerformerLab.Joins(fmt.Sprintf("LEFT JOIN (?) cases ON cases.performer_lab_id = %s.id", types.PerformerLabTable.Alias), txCases)
	txPerformerLab = txPerformerLab.Group(fmt.Sprintf("%s.code, %s.name", types.PerformerLabTable.Alias, types.PerformerLabTable.Alias))
	txPerformerLab = txPerformerLab.Order("count desc, bucket asc")
	if err := txPerformerLab.Find(&performerLab).Error; err != nil {
		return nil, fmt.Errorf("error fetching performer lab: %w", err)
	}

	txRequestedBy := r.db.Table(fmt.Sprintf("%s %s", types.OrderingOrganizationTable.Name, types.OrderingOrganizationTable.Alias))
	txRequestedBy = txRequestedBy.Select(fmt.Sprintf("%s.code as bucket, %s.name as label, count(distinct cases.id) as count", types.OrderingOrganizationTable.Alias, types.OrderingOrganizationTable.Alias))
	txRequestedBy = txRequestedBy.Joins(fmt.Sprintf("LEFT JOIN (?) cases ON cases.ordering_organization_id = %s.id", types.OrderingOrganizationTable.Alias), txCases)
	txRequestedBy = txRequestedBy.Group(fmt.Sprintf("%s.code, %s.name", types.OrderingOrganizationTable.Alias, types.OrderingOrganizationTable.Alias))
	txRequestedBy = txRequestedBy.Order("count desc, bucket asc")
	if err := txRequestedBy.Find(&requestedBy).Error; err != nil {
		return nil, fmt.Errorf("error fetching ordering org: %w", err)
	}

	return &CaseFilters{
		Status:       status,
		Priority:     priority,
		CaseAnalysis: caseAnalysis,
		Project:      project,
		PerformerLab: performerLab,
		RequestedBy:  requestedBy,
	}, nil
}

func prepareQuery(userQuery types.Query, r *CasesRepository) (*gorm.DB, error) {
	tx := r.db.Table(fmt.Sprintf("%s %s", types.CaseTable.Name, types.CaseTable.Alias))
	tx = joinWithRequest(tx)
	tx = joinWithPatient(tx, userQuery)
	tx = joinWithCaseAnalysis(tx)
	tx = joinWithProject(tx)
	if userQuery != nil {
		utils.AddWhere(userQuery, tx)

		if userQuery.HasFieldFromTables(types.PerformerLabTable) {
			tx = joinPerformerLab(tx)
		}
	}
	return tx, nil
}

func joinWithRequest(tx *gorm.DB) *gorm.DB {
	joinWithRequestSql := fmt.Sprintf("JOIN %s %s ON %s.request_id=%s.id", types.RequestTable.Name, types.RequestTable.Alias, types.CaseTable.Alias, types.RequestTable.Alias)
	joinWithOrderingOrganizationSql := fmt.Sprintf("JOIN %s %s ON %s.ordering_organization_id=%s.id", types.OrderingOrganizationTable.Name, types.OrderingOrganizationTable.Alias, types.RequestTable.Alias, types.OrderingOrganizationTable.Alias)
	return tx.Joins(joinWithRequestSql).Joins(joinWithOrderingOrganizationSql)
}

func joinWithPatient(tx *gorm.DB, userQuery types.Query) *gorm.DB {
	joinWithPatientSql := fmt.Sprintf("JOIN %s %s ON %s.proband_id=%s.id", types.PatientTable.Name, types.PatientTable.Alias, types.CaseTable.Alias, types.PatientTable.Alias)
	joinWithPatientManagingOrganizationSql := fmt.Sprintf("JOIN %s %s ON %s.managing_organization_id=%s.id", types.ManagingOrganizationTable.Name, types.ManagingOrganizationTable.Alias, types.PatientTable.Alias, types.ManagingOrganizationTable.Alias)
	if userQuery != nil && userQuery.HasFieldFromTables(types.ManagingOrganizationTable) {
		return tx.Joins(joinWithPatientSql).Joins(joinWithPatientManagingOrganizationSql)
	}
	return tx.Joins(joinWithPatientSql)
}

func joinWithCaseAnalysis(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("JOIN %s %s ON %s.case_analysis_id=%s.id", types.CaseAnalysisTable.Name, types.CaseAnalysisTable.Alias, types.CaseTable.Alias, types.CaseAnalysisTable.Alias))
}

func joinWithProject(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("JOIN %s %s ON %s.project_id=%s.id", types.ProjectTable.Name, types.ProjectTable.Alias, types.CaseTable.Alias, types.ProjectTable.Alias))
}

func joinPerformerLab(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("JOIN %s %s ON %s.performer_lab_id=%s.id", types.PerformerLabTable.Name, types.PerformerLabTable.Alias, types.CaseTable.Alias, types.PerformerLabTable.Alias))
}
