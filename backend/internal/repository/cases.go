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

type CasesRepository struct {
	db *gorm.DB
}

type CasesDAO interface {
	SearchCases(userQuery types.ListQuery) (*[]CaseResult, error)
	CountCases(userQuery types.CountQuery) (*int64, error)
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
