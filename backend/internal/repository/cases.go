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

type Case = types.Case
type CaseResult = types.CaseResult
type AutocompleteResult = types.AutocompleteResult
type CaseFilters = types.CaseFilters
type CaseEntity = types.CaseEntity
type CaseAssay = types.CaseAssay
type CasePatientClinicalInformation = types.CasePatientClinicalInformation

type CasesRepository struct {
	db *gorm.DB
}

type CasesDAO interface {
	SearchCases(userQuery types.ListQuery) (*[]CaseResult, *int64, error)
	SearchById(prefix string, limit int) (*[]AutocompleteResult, error)
	GetCasesFilters(userQuery types.AggQuery) (*CaseFilters, error)
	GetCaseEntity(caseId int) (*CaseEntity, error)
}

func NewCasesRepository(db *gorm.DB) *CasesRepository {
	if db == nil {
		log.Fatal("CasesRepository: db is nil")
		return nil
	}
	return &CasesRepository{db: db}
}

func (r *CasesRepository) SearchCases(userQuery types.ListQuery) (*[]CaseResult, *int64, error) {
	var cases []CaseResult
	var count int64

	tx, err := prepareQuery(userQuery, r)
	if err != nil {
		return nil, nil, fmt.Errorf("error during query preparation %w", err)
	}
	var columns = sliceutils.Map(userQuery.SelectedFields(), func(field types.Field, index int, slice []types.Field) string {
		return fmt.Sprintf("%s.%s as %s", field.Table.Alias, field.Name, field.GetAlias())
	})

	if err = tx.Count(&count).Error; err != nil {
		return nil, nil, fmt.Errorf("error counting cases: %w", err)
	}

	tx = tx.Select(columns)
	utils.AddLimitAndSort(tx, userQuery)

	if err = tx.Find(&cases).Error; err != nil {
		return nil, nil, fmt.Errorf("error fetching cases: %w", err)
	}
	return &cases, &count, nil
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
	subQueryMrn = subQueryMrn.Where("LOWER(mrn) LIKE ?", strings.ToLower(searchInput))

	//subQueryRequestId := r.db.Table(fmt.Sprintf("%s %s", types.RequestTable.Name, types.RequestTable.Alias))
	//subQueryRequestId = subQueryRequestId.Select("\"request_id\" as type, id as value")
	//subQueryRequestId = subQueryRequestId.Where("CAST(id AS TEXT) LIKE ?", searchInput)

	//tx := r.db.Table("(? UNION ? UNION ? UNION ?) autocompleteByIds", subQueryCaseId, subQueryProbandId, subQueryMrn, subQueryRequestId)
	tx := r.db.Table("(? UNION ? UNION ?) autocompleteByIds", subQueryCaseId, subQueryProbandId, subQueryMrn)
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

func (r *CasesRepository) GetCaseEntity(caseId int) (*CaseEntity, error) {
	var familyMembersIds []int
	caseEntity, err := r.retrieveCaseLevelData(caseId)
	if err != nil {
		return nil, fmt.Errorf("error fetching case level data: %w", err)
	}

	txFamilyMembersID := r.db.Table(fmt.Sprintf("%s %s", types.FamilyTable.Name, types.FamilyTable.Alias))
	txFamilyMembersID = txFamilyMembersID.Where("f.case_id = ?", caseId)
	if err := txFamilyMembersID.Distinct("f.family_member_id").Find(&familyMembersIds).Error; err != nil {
		return nil, fmt.Errorf("error retrieving family members ids: %w", err)
	}

	assays, err := r.retrieveCaseAssays(caseId)
	if err != nil {
		return nil, fmt.Errorf("error fetching assays data: %w", err)
	}
	caseEntity.Assays = *assays

	members, err := r.retrieveCasePatients(caseId, append(familyMembersIds, caseEntity.ProbandID))
	if err != nil {
		return nil, fmt.Errorf("error fetching members data: %w", err)
	}
	caseEntity.Members = *members

	caseEntity.Tasks = make(types.JsonArray[types.Task], 0) //TODO

	if caseEntity.CaseAnalysisType == "somatic" || len(familyMembersIds) == 0 {
		caseEntity.CaseType = caseEntity.CaseAnalysisType
	} else {
		caseEntity.CaseType = fmt.Sprintf("%s_family", caseEntity.CaseAnalysisType)
	}

	return caseEntity, nil
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

		if userQuery.HasFieldFromTables(types.MondoTable) {
			tx = joinMondoTerm(tx)
		}
	}
	return tx, nil
}

func joinWithRequest(tx *gorm.DB) *gorm.DB {
	joinWithRequestSql := fmt.Sprintf("LEFT JOIN %s %s ON %s.request_id=%s.id", types.RequestTable.Name, types.RequestTable.Alias, types.CaseTable.Alias, types.RequestTable.Alias)
	joinWithOrderingOrganizationSql := fmt.Sprintf("LEFT JOIN %s %s ON %s.ordering_organization_id=%s.id", types.OrderingOrganizationTable.Name, types.OrderingOrganizationTable.Alias, types.RequestTable.Alias, types.OrderingOrganizationTable.Alias)
	return tx.Joins(joinWithRequestSql).Joins(joinWithOrderingOrganizationSql)
}

func joinWithPatient(tx *gorm.DB, userQuery types.Query) *gorm.DB {
	joinWithPatientSql := fmt.Sprintf("LEFT JOIN %s %s ON %s.proband_id=%s.id", types.PatientTable.Name, types.PatientTable.Alias, types.CaseTable.Alias, types.PatientTable.Alias)
	joinWithPatientManagingOrganizationSql := fmt.Sprintf("LEFT JOIN %s %s ON %s.managing_organization_id=%s.id", types.ManagingOrganizationTable.Name, types.ManagingOrganizationTable.Alias, types.PatientTable.Alias, types.ManagingOrganizationTable.Alias)
	if userQuery != nil && userQuery.HasFieldFromTables(types.ManagingOrganizationTable) {
		return tx.Joins(joinWithPatientSql).Joins(joinWithPatientManagingOrganizationSql)
	}
	return tx.Joins(joinWithPatientSql)
}

func joinWithCaseAnalysis(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s.case_analysis_id=%s.id", types.CaseAnalysisTable.Name, types.CaseAnalysisTable.Alias, types.CaseTable.Alias, types.CaseAnalysisTable.Alias))
}

func joinWithProject(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s.project_id=%s.id", types.ProjectTable.Name, types.ProjectTable.Alias, types.CaseTable.Alias, types.ProjectTable.Alias))
}

func joinPerformerLab(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s.performer_lab_id=%s.id", types.PerformerLabTable.Name, types.PerformerLabTable.Alias, types.CaseTable.Alias, types.PerformerLabTable.Alias))
}

func joinMondoTerm(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s.primary_condition=%s.id", types.MondoTable.Name, types.MondoTable.Alias, types.CaseTable.Alias, types.MondoTable.Alias))
}

func (r *CasesRepository) retrieveCaseLevelData(caseId int) (*CaseEntity, error) {
	var caseEntity CaseEntity

	txCase := r.db.Table(fmt.Sprintf("%s %s", types.CaseTable.Name, types.CaseTable.Alias))
	txCase = joinWithCaseAnalysis(txCase)
	txCase = txCase.Select("c.id as case_id, c.proband_id, ca.code as case_analysis_code, ca.name as case_analysis_name, ca.type_code as case_analysis_type")
	txCase = txCase.Where("c.id = ?", caseId)
	if err := txCase.Find(&caseEntity).Error; err != nil {
		return nil, fmt.Errorf("error fetching case entity: %w", err)
	}

	return &caseEntity, nil
}

func (r *CasesRepository) retrieveCaseAssays(caseId int) (*[]CaseAssay, error) {
	var assays []CaseAssay

	txSeqExp := r.db.Table(fmt.Sprintf("%s %s", types.SequencingExperimentTable.Name, types.SequencingExperimentTable.Alias))
	txSeqExp = txSeqExp.Joins("LEFT JOIN radiant_jdbc.public.request r ON r.id = s.request_id")
	txSeqExp = txSeqExp.Joins("LEFT JOIN radiant_jdbc.public.family f ON s.patient_id = f.family_member_id AND s.case_id = f.case_id")
	txSeqExp = txSeqExp.Joins("LEFT JOIN radiant_jdbc.public.sample spl ON spl.id = s.sample_id")
	txSeqExp = txSeqExp.Joins("LEFT JOIN radiant_jdbc.public.experiment exp ON exp.id = s.experiment_id")
	txSeqExp = txSeqExp.Select("s.id as seq_id, r.id as request_id, s.patient_id, f.relationship_to_proband_code as relationship_to_proband, f.affected_status_code, s.sample_id, spl.submitter_sample_id as sample_submitter_id, s.status_code, s.updated_on, exp.experimental_strategy_code")
	txSeqExp = txSeqExp.Where("s.case_id = ?", caseId)
	txSeqExp = txSeqExp.Order("affected_status_code asc, s.run_date desc")
	if err := txSeqExp.Find(&assays).Error; err != nil {
		return nil, fmt.Errorf("error fetching sequencing experiments: %w", err)
	}
	return &assays, nil
}

func (r *CasesRepository) retrieveCasePatients(caseId int, memberIds []int) (*[]CasePatientClinicalInformation, error) {
	var members []CasePatientClinicalInformation
	var phenotypeObservationCodings []types.PhenotypeObservationCoding

	txMembers := r.db.Table(fmt.Sprintf("%s %s", types.PatientTable.Name, types.PatientTable.Alias))
	txMembers = txMembers.Joins("LEFT JOIN `radiant_jdbc`.`public`.`family` f on p.id = f.family_member_id")
	txMembers = txMembers.Joins("LEFT JOIN `radiant_jdbc`.`public`.`organization` mgmt_org on p.managing_organization_id = mgmt_org.id")
	txMembers = txMembers.Where("p.id in ?", memberIds)
	txMembers = txMembers.Order("affected_status_code asc")
	txMembers = txMembers.Select("p.id as patient_id, f.affected_status_code, f.relationship_to_proband_code as relationship_to_proband, p.date_of_birth, p.sex_code, p.mrn, mgmt_org.code as managing_organization_code, mgmt_org.name as managing_organization_name")
	if err := txMembers.Find(&members).Error; err != nil {
		return nil, fmt.Errorf("error retrieving case members: %w", err)
	}

	txObservations := r.db.Table(fmt.Sprintf("%s %s", types.ObservationCodingTable.Name, types.ObservationCodingTable.Alias))
	txObservations = txObservations.Joins("LEFT JOIN hpo_term hpo ON obs.observation_code = 'phenotype' AND hpo.id = obs.code_value")
	txObservations = txObservations.Where("obs.observation_code = 'phenotype' AND obs.case_id = ?", caseId)
	txObservations = txObservations.Order("phenotype_name asc")
	txObservations = txObservations.Select("obs.patient_id, hpo.id as phenotype_id, hpo.name as phenotype_name, obs.onset_code, obs.interpretation_code")
	if err := txObservations.Find(&phenotypeObservationCodings).Error; err != nil {
		return nil, fmt.Errorf("error retrieving case phenotypes: %w", err)
	}

	phenotypesPerPatient := utils.GroupByProperty(phenotypeObservationCodings, func(p types.PhenotypeObservationCoding) int {
		return p.PatientID
	})

	for i, m := range members {
		members[i].ObservedPhenotypes = make(types.JsonArray[types.Term], 0)
		members[i].NonObservedPhenotypes = make(types.JsonArray[types.Term], 0)

		phenotypes, ok := phenotypesPerPatient[m.PatientID]

		if ok {
			for _, phenotype := range phenotypes {
				term := types.Term{
					ID:        phenotype.PhenotypeID,
					Name:      phenotype.PhenotypeName,
					OnsetCode: phenotype.OnsetCode,
				}

				if phenotype.InterpretationCode == "positive" {
					members[i].ObservedPhenotypes = append(members[i].ObservedPhenotypes, term)
				} else {
					members[i].NonObservedPhenotypes = append(members[i].NonObservedPhenotypes, term)
				}
			}
		}
	}

	return &members, nil
}
