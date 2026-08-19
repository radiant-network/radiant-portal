package starrocks

import (
	"context"
	"fmt"
	"slices"
	"strings"

	"github.com/Goldziher/go-utils/sliceutils"
	"github.com/radiant-network/radiant-api/internal/database"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/internal/utils"
	"github.com/radiant-network/radiant-api/internal/utils/joins"
	"gorm.io/gorm"
)

type CaseResult = types.CaseResult
type AutocompleteResult = types.AutocompleteResult
type CaseFilters = types.CaseFilters
type CaseEntity = types.CaseEntity
type CaseSequencingExperiment = types.CaseSequencingExperiment
type CasePatientClinicalInformation = types.CasePatientClinicalInformation
type CaseTask = types.CaseTask

type CasesRepository struct {
	db     *gorm.DB
	joiner joins.Joiner
}

func NewCasesRepository(db database.StarrocksDB) *CasesRepository {
	return &CasesRepository{db: db.DB, joiner: joins.Starrocks()}
}

// GetCaseType returns the case_type_code (e.g., "germline" or "somatic") for a
// case. Used by handlers that need to dispatch to type-specific logic without
// duplicating the lookup.
func (r *CasesRepository) GetCaseType(ctx context.Context, caseID int) (string, error) {
	var caseType string
	tx := r.db.WithContext(ctx).Table(types.CaseTable.TenantQualifiedName(ctx))
	tx = tx.Select("case_type_code").Where("id = ?", caseID)
	err := tx.Scan(&caseType).Error
	return caseType, err
}

func (r *CasesRepository) SearchCases(ctx context.Context, userQuery types.ListQuery) (*[]CaseResult, *int64, error) {
	var cases []CaseResult
	var count int64

	db := r.db.WithContext(ctx)
	tx, err := prepareQuery(ctx, userQuery, r)
	if err != nil {
		return nil, nil, fmt.Errorf("error during query preparation %w", err)
	}
	var columns = sliceutils.Map(userQuery.SelectedFields(), func(field types.Field, index int, slice []types.Field) string {
		return fmt.Sprintf("%s.%s as %s", field.Table.Alias, field.Name, field.GetAlias())
	})

	columns = append(columns, "CASE WHEN c.case_type_code = 'somatic' OR members_count.distinct_members_count = 1 THEN c.case_type_code ELSE CONCAT(c.case_type_code, '_family') END AS case_type")
	columns = append(columns, "stg.case_id IS NOT NULL AS has_variants")
	if err = tx.Count(&count).Error; err != nil {
		return nil, nil, fmt.Errorf("error counting cases: %w", err)
	}

	txStg := db.Table(fmt.Sprintf("%s chse", types.CaseHasSequencingExperimentTable.TenantQualifiedName(ctx)))
	txStg = txStg.Select("DISTINCT(chse.case_id)")
	txStg = txStg.Where("se.ingested_at IS NOT NULL AND (se.task_type = 'radiant_germline_annotation' OR (se.task_type = 'radiant_somatic_annotation' AND se.histology_type = 'tumoral'))")
	txStg = txStg.Joins(fmt.Sprintf("JOIN %s se ON se.seq_id = chse.sequencing_experiment_id", types.SequencingTable.TenantQualifiedName(ctx)))

	// COUNT DISTINCT ignores NULL, so counting family_member_id alone drops every fetus-only row
	// and undercounts a prenatal case's members.
	txMembersCount := db.Table(types.FamilyTable.TenantQualifiedName(ctx)).Select("case_id, count(distinct CASE WHEN fetus_id IS NOT NULL THEN CONCAT('f:', fetus_id) ELSE CONCAT('p:', family_member_id) END) as distinct_members_count").Group("case_id")

	tx = tx.Joins(fmt.Sprintf("LEFT JOIN (?) stg ON stg.case_id=%s.id", types.CaseTable.Alias), txStg)
	tx = tx.Joins(fmt.Sprintf("LEFT JOIN (?) members_count ON members_count.case_id = %s.id", types.CaseTable.Alias), txMembersCount)
	tx = tx.Select(columns)
	utils.AddPaginationAndSort(tx, userQuery)

	if err = tx.Find(&cases).Error; err != nil {
		return nil, nil, fmt.Errorf("error fetching cases: %w", err)
	}
	return &cases, &count, nil
}

func (r *CasesRepository) SearchById(ctx context.Context, prefix string, limit int) (*[]AutocompleteResult, error) {
	var autocompleteResult []AutocompleteResult
	db := r.db.WithContext(ctx)
	searchInput := fmt.Sprintf("%s%%", prefix)
	subQueryCaseId := db.Table(fmt.Sprintf("%s %s", types.CaseTable.TenantQualifiedName(ctx), types.CaseTable.Alias))
	subQueryCaseId = subQueryCaseId.Select("\"case_id\" as type, id as value")
	subQueryCaseId = subQueryCaseId.Where("CAST(id AS TEXT) LIKE ?", searchInput)

	subQueryProbandId := db.Table(fmt.Sprintf("%s %s", types.PatientTable.TenantQualifiedName(ctx), types.PatientTable.Alias))
	subQueryProbandId = subQueryProbandId.Select("\"patient_id\" as type, id as value")
	subQueryProbandId = subQueryProbandId.Where("CAST(id AS TEXT) LIKE ?", searchInput)

	subQueryOrgPatID := db.Table(fmt.Sprintf("%s %s", types.PatientTable.TenantQualifiedName(ctx), types.PatientTable.Alias))
	subQueryOrgPatID = subQueryOrgPatID.Select("submitter_patient_id_type as type, submitter_patient_id as value")
	subQueryOrgPatID = subQueryOrgPatID.Where("LOWER(submitter_patient_id) LIKE ?", strings.ToLower(searchInput))

	subQuerySeqId := db.Table(fmt.Sprintf("%s %s", types.SequencingExperimentTable.TenantQualifiedName(ctx), types.SequencingExperimentTable.Alias))
	subQuerySeqId = subQuerySeqId.Select("\"sequencing_experiment_id\" as type, id as value")
	subQuerySeqId = subQuerySeqId.Where("CAST(id AS TEXT) LIKE ?", searchInput)

	tx := db.Table("(? UNION ? UNION ? UNION ?) autocompleteByIds", subQueryCaseId, subQueryProbandId, subQueryOrgPatID, subQuerySeqId)
	tx = tx.Order("value asc, type asc")
	tx = tx.Limit(limit)
	if err := tx.Find(&autocompleteResult).Error; err != nil {
		return nil, fmt.Errorf("error searching for case autocomplete: %w", err)
	}
	return &autocompleteResult, nil
}

func (r *CasesRepository) GetCasesFilters(ctx context.Context) (*CaseFilters, error) {
	db := r.db.WithContext(ctx)
	status, err := utils.GetFilter(db, types.StatusTable, "name_en", nil)
	if err != nil {
		return nil, err
	}

	priority, err := utils.GetFilter(db, types.PriorityTable, "name_en", nil)
	if err != nil {
		return nil, err
	}

	analysisCatalog, err := utils.GetFilter(db, types.AnalysisCatalogTable, "name", nil)
	if err != nil {
		return nil, err
	}

	project, err := utils.GetFilter(db, types.ProjectTable, "name", nil)
	if err != nil {
		return nil, err
	}

	caseCategory, err := utils.GetFilter(db, types.CaseCategoryTable, "name_en", nil)
	if err != nil {
		return nil, err
	}

	resolution, err := utils.GetFilter(db, types.ResolutionStatusTable, "name_en", nil)
	if err != nil {
		return nil, err
	}

	caseType, err := utils.GetFilter(db, types.CaseTypeTable, "name_en", nil)
	if err != nil {
		return nil, err
	}

	isDiagnosisLabCondition := fmt.Sprintf("%s.category_code = 'diagnostic_laboratory'", types.SequencingLabTable.Alias)
	diagnosisLab, err := utils.GetFilter(db, types.SequencingLabTable, "name", &isDiagnosisLabCondition)
	if err != nil {
		return nil, err
	}

	isOrderingOrg := fmt.Sprintf("%s.category_code IN ('healthcare_provider', 'research_institute')", types.OrderingOrganizationTable.Alias)
	orderingOrg, err := utils.GetFilter(db, types.OrderingOrganizationTable, "name", &isOrderingOrg)
	if err != nil {
		return nil, err
	}

	lifeStatus, err := utils.GetFilter(db, types.LifeStatusTable, "name_en", nil)
	if err != nil {
		return nil, err
	}

	panel, err := utils.GetFilter(db, types.PanelTable, "name", nil)
	if err != nil {
		return nil, err
	}

	return &CaseFilters{
		Status:               status,
		Priority:             priority,
		AnalysisCatalog:      analysisCatalog,
		Project:              project,
		DiagnosisLab:         diagnosisLab,
		OrderingOrganization: orderingOrg,
		CaseCategory:         caseCategory,
		ResolutionStatus:     resolution,
		CaseType:             caseType,
		LifeStatus:           lifeStatus,
		Panel:                panel,
	}, nil
}

func (r *CasesRepository) GetCaseEntity(ctx context.Context, caseId int) (*CaseEntity, error) {
	caseEntity, err := r.retrieveCaseLevelData(ctx, caseId)
	if err != nil {
		return nil, fmt.Errorf("error fetching case level data: %w", err)
	}

	sequencingExperiments, err := r.retrieveCaseSequencingExperiments(ctx, caseId)
	if err != nil {
		return nil, fmt.Errorf("error fetching sequencing experiments data: %w", err)
	}
	caseEntity.SequencingExperiments = *sequencingExperiments

	members, err := r.retrieveCasePatients(ctx, caseId)
	if err != nil {
		return nil, fmt.Errorf("error fetching members data: %w", err)
	}
	caseEntity.Members = *members

	tasks, err := r.retrieveCaseTasks(ctx, caseId)
	if err != nil {
		return nil, fmt.Errorf("error fetching tasks: %w", err)
	}
	caseEntity.Tasks = *tasks

	caseType := calculateCaseType(*caseEntity)
	caseEntity.CaseType = caseType

	return caseEntity, nil
}

func prepareQuery(ctx context.Context, userQuery types.Query, r *CasesRepository) (*gorm.DB, error) {
	tx := r.db.WithContext(ctx).Table(fmt.Sprintf("%s %s", types.CaseTable.TenantQualifiedName(ctx), types.CaseTable.Alias))
	tx = r.joiner.CaseWithProband(tx, userQuery)
	tx = r.joiner.CaseWithAnalysisCatalog(tx)
	tx = r.joiner.CaseWithProject(tx)
	if userQuery != nil {
		utils.AddWhere(userQuery, tx)

		if userQuery.HasFieldFromTables(types.PanelTable) {
			tx = r.joiner.AnalysisCatalogWithPanel(tx)
		}

		if userQuery.HasFieldFromTables(types.OrderingOrganizationTable) {
			tx = r.joiner.CaseWithOrderingOrganization(tx)
		}

		if userQuery.HasFieldFromTables(types.SequencingLabTable) {
			tx = r.joiner.CaseWithDiagnosisLab(tx)
		}

		if userQuery.HasFieldFromTables(types.MondoTable) {
			tx = r.joiner.CaseWithMondoTerm(tx)
		}

		if userQuery.HasFieldFromTables(types.PatientTable) {
			tx = r.joiner.CaseWithPatients(tx)
		}

		if userQuery.HasFieldFromTables(types.CaseHasSequencingExperimentTable) {
			tx = r.joiner.CaseWithCaseHasSeqExp(tx)
		}
	}
	return tx, nil
}

func (r *CasesRepository) retrieveCaseLevelData(ctx context.Context, caseId int) (*CaseEntity, error) {
	var caseEntity CaseEntity

	txCase := r.db.WithContext(ctx).Table(fmt.Sprintf("%s %s", types.CaseTable.TenantQualifiedName(ctx), types.CaseTable.Alias))
	txCase = r.joiner.CaseWithAnalysisCatalog(txCase)
	txCase = r.joiner.CaseWithCaseCategory(txCase)
	txCase = r.joiner.AnalysisCatalogWithPanel(txCase)
	txCase = r.joiner.CaseWithMondoTerm(txCase)
	txCase = r.joiner.CaseWithDiagnosisLab(txCase)
	txCase = r.joiner.CaseWithOrderingOrganization(txCase)
	txCase = r.joiner.CaseWithProject(txCase)
	txCase = txCase.Select("c.id as case_id, c.proband_id, c.case_type_code as case_type_code, ca.code as analysis_catalog_code, ca.name as analysis_catalog_name, c.created_on, c.updated_on, c.note, c.diagnosis_hypothesis, c.case_category_code, case_cat.name_en as case_category_name, mondo.id as primary_condition_id, mondo.name as primary_condition_name, lab.code as diagnosis_lab_code, lab.name as diagnosis_lab_name, c.status_code, order_org.code as ordering_organization_code, order_org.name as ordering_organization_name, c.priority_code, c.ordering_physician as prescriber, prj.code as project_code, prj.name as project_name, panel.code as panel_code, panel.name as panel_name")
	txCase = txCase.Where("c.id = ?", caseId)
	if err := txCase.Find(&caseEntity).Error; err != nil {
		return nil, fmt.Errorf("error fetching case entity: %w", err)
	}

	return &caseEntity, nil
}

func (r *CasesRepository) retrieveCaseSequencingExperiments(ctx context.Context, caseId int) (*[]CaseSequencingExperiment, error) {
	var sequencingExperiments []CaseSequencingExperiment

	db := r.db.WithContext(ctx)

	txSeqExp := db.Table(fmt.Sprintf("%s %s", types.CaseHasSequencingExperimentTable.TenantQualifiedName(ctx), types.CaseHasSequencingExperimentTable.Alias))
	txSeqExp = r.joiner.CaseHasSeqExpWithSequencingExperiment(txSeqExp)
	txSeqExp = r.joiner.SeqExpWithSample(txSeqExp)
	txSeqExp = r.joiner.SampleAndCaseHasSeqExpWithFamily(txSeqExp)
	// DISTINCT, not a direct join: staging is keyed (case_id, seq_id, task_id), so a tumor
	// sequencing carried by both a tumor-normal and a tumor-only task matches twice.
	txIngested := db.Table(types.SequencingTable.TenantQualifiedName(ctx)).
		Select("DISTINCT(seq_id)").
		Where("ingested_at is not null and (task_type = 'radiant_germline_annotation' OR (task_type = 'radiant_somatic_annotation' AND histology_type = 'tumoral')) and case_id = ?", caseId)
	txSeqExp = txSeqExp.Joins("LEFT JOIN (?) se ON se.seq_id = s.id", txIngested)
	txSeqExp = txSeqExp.Select("s.id as seq_id, spl.patient_id, f.relationship_to_proband_code as relationship_to_proband, f.affected_status_code, s.sample_id, spl.submitter_sample_id as sample_submitter_id, spl.type_code as sample_type_code, spl.histology_code, s.status_code, s.updated_on, s.experimental_strategy_code, se.seq_id is not null as has_variants")
	txSeqExp = txSeqExp.Where("chseq.case_id = ?", caseId)
	txSeqExp = txSeqExp.Order("affected_status_code asc, s.run_date desc, relationship_to_proband desc, seq_id desc")
	if err := txSeqExp.Find(&sequencingExperiments).Error; err != nil {
		return nil, fmt.Errorf("error fetching sequencing experiments: %w", err)
	}
	return &sequencingExperiments, nil
}

func (r *CasesRepository) retrieveCasePatients(ctx context.Context, caseId int) (*[]CasePatientClinicalInformation, error) {
	var members []CasePatientClinicalInformation
	var phenotypeObsCategoricals []types.PhenotypeObsCategorical

	db := r.db.WithContext(ctx)
	txMembers := db.Table(fmt.Sprintf("%s %s", types.FamilyTable.TenantQualifiedName(ctx), types.FamilyTable.Alias))
	txMembers = r.joiner.FamilyWithPatient(txMembers)
	txMembers = r.joiner.FamilyWithFetus(txMembers)
	txMembers = r.joiner.PatientWithManagingOrg(txMembers)
	txMembers = txMembers.Where("f.case_id = ?", caseId)
	txMembers = txMembers.Order("affected_status_code asc, relationship_to_proband_code desc")
	txMembers = txMembers.Select("p.id as patient_id, fetus.id as fetus_id, " +
		"COALESCE(p.last_name, '') as last_name, COALESCE(p.first_name, '') as first_name, " +
		"f.affected_status_code, f.relationship_to_proband_code as relationship_to_proband, " +
		"p.date_of_birth, fetus.last_menstrual_period, fetus.estimated_due_date, " +
		"COALESCE(p.life_status_code, fetus.life_status_code) as life_status_code, " +
		"COALESCE(p.sex_code, fetus.sex_code) as sex_code, " +
		"COALESCE(p.submitter_patient_id, '') as submitter_patient_id, COALESCE(p.jhn, '') as jhn, " +
		"COALESCE(mgmt_org.code, '') as organization_code, COALESCE(mgmt_org.name, '') as organization_name")
	if err := txMembers.Find(&members).Error; err != nil {
		return nil, fmt.Errorf("error retrieving case members: %w", err)
	}

	txObservations := db.Table(fmt.Sprintf("%s %s", types.ObsCategoricalTable.TenantQualifiedName(ctx), types.ObsCategoricalTable.Alias))
	txObservations = txObservations.Joins(fmt.Sprintf("LEFT JOIN %s hpo ON obs.observation_code = 'phenotype' AND hpo.id = obs.code_value", types.HPOTable.TenantQualifiedName(ctx)))
	txObservations = txObservations.Where("obs.observation_code = 'phenotype' AND obs.case_id = ?", caseId)
	txObservations = txObservations.Order("phenotype_name asc")
	txObservations = txObservations.Select("obs.patient_id, obs.fetus_id, COALESCE(hpo.id, obs.code_value) as phenotype_id, hpo.name as phenotype_name, obs.onset_code, obs.interpretation_code")
	if err := txObservations.Find(&phenotypeObsCategoricals).Error; err != nil {
		return nil, fmt.Errorf("error retrieving case phenotypes: %w", err)
	}

	phenotypesPerPatient := utils.GroupByProperty(phenotypeObsCategoricals, func(p types.PhenotypeObsCategorical) string {
		return subjectKey(p.PatientID, p.FetusID)
	})

	for i, m := range members {
		members[i].ObservedPhenotypes = make(types.JsonArray[types.Term], 0)
		members[i].NonObservedPhenotypes = make(types.JsonArray[types.Term], 0)

		phenotypes, ok := phenotypesPerPatient[subjectKey(m.PatientID, m.FetusID)]

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

	exams, err := r.retrieveCaseExams(ctx, caseId)
	if err != nil {
		return nil, err
	}
	examsPerPatient := utils.GroupByProperty(*exams, func(e types.ExamObservation) string {
		return subjectKey(e.PatientID, e.FetusID)
	})

	valueSets, err := r.retrieveCaseValueSetObservations(ctx, caseId)
	if err != nil {
		return nil, err
	}
	valueSetsPerPatient := utils.GroupByProperty(*valueSets, func(v types.ValueSetObsCategorical) string {
		return subjectKey(v.PatientID, v.FetusID)
	})

	notes, err := r.retrieveCaseNotes(ctx, caseId)
	if err != nil {
		return nil, err
	}
	notesPerPatient := utils.GroupByProperty(*notes, func(n types.SubjectNote) string {
		return subjectKey(n.PatientID, n.FetusID)
	})

	familyHistory, err := r.retrieveCaseFamilyHistory(ctx, caseId)
	if err != nil {
		return nil, err
	}
	familyHistoryPerPatient := utils.GroupByProperty(*familyHistory, func(f types.SubjectFamilyHistory) string {
		return subjectKey(&f.PatientID, nil)
	})

	for i, m := range members {
		key := subjectKey(m.PatientID, m.FetusID)

		members[i].Exams = make(types.JsonArray[types.CaseExam], 0)
		for _, exam := range examsPerPatient[key] {
			members[i].Exams = append(members[i].Exams, exam.CaseExam)
		}

		members[i].Ethnicities = make(types.JsonArray[types.ValueSetItem], 0)
		for _, valueSet := range valueSetsPerPatient[key] {
			switch valueSet.ObservationCode {
			case types.ObsCodeAncestry:
				members[i].Ethnicities = append(members[i].Ethnicities, valueSet.ValueSetItem)
			case types.ObsCodeConsanguinity:
				// gorm:"-" on the field: GORM reads a pointer-to-struct as a relation.
				coded := valueSet.ValueSetItem
				members[i].Consanguinity = &coded
			}
		}

		members[i].Notes = make(types.JsonArray[string], 0)
		for _, note := range notesPerPatient[key] {
			members[i].Notes = append(members[i].Notes, note.Value)
		}

		members[i].FamilyHistory = make(types.JsonArray[types.CaseFamilyHistory], 0)
		for _, entry := range familyHistoryPerPatient[key] {
			members[i].FamilyHistory = append(members[i].FamilyHistory, entry.CaseFamilyHistory)
		}
	}

	return &members, nil
}

func (r *CasesRepository) retrieveCaseValueSetObservations(ctx context.Context, caseId int) (*[]types.ValueSetObsCategorical, error) {
	var observations []types.ValueSetObsCategorical

	tx := r.db.WithContext(ctx).Table(fmt.Sprintf("%s %s", types.ObsCategoricalTable.TenantQualifiedName(ctx), types.ObsCategoricalTable.Alias))
	tx = tx.Joins(fmt.Sprintf("LEFT JOIN %s anc ON obs.observation_code = ? AND anc.code = obs.code_value", types.AncestryTable.TenantQualifiedName(ctx)), types.ObsCodeAncestry)
	tx = tx.Joins(fmt.Sprintf("LEFT JOIN %s cons ON obs.observation_code = ? AND cons.code = obs.code_value", types.ConsanguinityTable.TenantQualifiedName(ctx)), types.ObsCodeConsanguinity)
	tx = tx.Where("obs.observation_code IN ? AND obs.case_id = ?", []string{types.ObsCodeAncestry, types.ObsCodeConsanguinity}, caseId)
	tx = tx.Order("obs.observation_code asc, obs.code_value asc")
	tx = tx.Select("obs.patient_id, obs.fetus_id, obs.observation_code, " +
		"obs.code_value as code, " +
		"COALESCE(anc.name_en, cons.name_en) as name")
	if err := tx.Find(&observations).Error; err != nil {
		return nil, fmt.Errorf("error retrieving case value set observations: %w", err)
	}

	return &observations, nil
}

func (r *CasesRepository) retrieveCaseNotes(ctx context.Context, caseId int) (*[]types.SubjectNote, error) {
	var notes []types.SubjectNote

	tx := r.db.WithContext(ctx).Table(fmt.Sprintf("%s %s", types.ObsStringTable.TenantQualifiedName(ctx), types.ObsStringTable.Alias))
	tx = tx.Where("obs_string.observation_code = ? AND obs_string.case_id = ?", types.ObsCodeNote, caseId)
	tx = tx.Order("obs_string.id asc")
	tx = tx.Select("obs_string.patient_id, obs_string.fetus_id, obs_string.value as value")
	if err := tx.Find(&notes).Error; err != nil {
		return nil, fmt.Errorf("error retrieving case notes: %w", err)
	}

	return &notes, nil
}

func (r *CasesRepository) retrieveCaseFamilyHistory(ctx context.Context, caseId int) (*[]types.SubjectFamilyHistory, error) {
	var familyHistory []types.SubjectFamilyHistory

	tx := r.db.WithContext(ctx).Table(fmt.Sprintf("%s %s", types.FamilyHistoryTable.TenantQualifiedName(ctx), types.FamilyHistoryTable.Alias))
	tx = tx.Where("family_history.case_id = ?", caseId)
	tx = tx.Order("family_history.family_member_code asc, family_history.condition asc")
	tx = tx.Select("family_history.patient_id, family_history.family_member_code, family_history.condition")
	if err := tx.Find(&familyHistory).Error; err != nil {
		return nil, fmt.Errorf("error retrieving case family history: %w", err)
	}

	return &familyHistory, nil
}

func (r *CasesRepository) retrieveCaseExams(ctx context.Context, caseId int) (*[]types.ExamObservation, error) {
	var exams []types.ExamObservation

	db := r.db.WithContext(ctx)
	examTable := types.ExamTable.TenantQualifiedName(ctx)
	examJoin := fmt.Sprintf("LEFT JOIN %s %s ON %s.code = %%s.exam_code AND %s.tenant_code = %%s.tenant_code",
		examTable, types.ExamTable.Alias, types.ExamTable.Alias, types.ExamTable.Alias)

	// obs_categorical holds an abnormal exam's coded values, one row per value; obs_string the exams
	// with nothing to code — normal, abnormal without a value, and the free-text "other".
	subQueryCategorical := db.Table(fmt.Sprintf("%s %s", types.ObsCategoricalTable.TenantQualifiedName(ctx), types.ObsCategoricalTable.Alias))
	subQueryCategorical = subQueryCategorical.Joins(fmt.Sprintf(examJoin, "obs", "obs"))
	subQueryCategorical = subQueryCategorical.Joins(fmt.Sprintf("LEFT JOIN %s hpo ON hpo.id = obs.code_value", types.HPOTable.TenantQualifiedName(ctx)))
	subQueryCategorical = subQueryCategorical.Where("obs.observation_code = ? AND obs.case_id = ?", types.ObsCodeExam, caseId)
	subQueryCategorical = subQueryCategorical.Select("obs.patient_id, obs.fetus_id, obs.exam_code, " +
		"exam.name_en as name, obs.interpretation_code, " +
		"obs.code_value as value, hpo.name as value_name, obs.coding_system")

	subQueryText := db.Table(fmt.Sprintf("%s %s", types.ObsStringTable.TenantQualifiedName(ctx), types.ObsStringTable.Alias))
	subQueryText = subQueryText.Joins(fmt.Sprintf(examJoin, "obs_string", "obs_string"))
	subQueryText = subQueryText.Where("obs_string.observation_code = ? AND obs_string.case_id = ?", types.ObsCodeExam, caseId)
	subQueryText = subQueryText.Select("obs_string.patient_id, obs_string.fetus_id, obs_string.exam_code, " +
		"exam.name_en as name, obs_string.interpretation_code, " +
		"obs_string.value as value, CAST(NULL AS STRING) as value_name, CAST(NULL AS STRING) as coding_system")

	tx := db.Table("(? UNION ALL ?) exams", subQueryCategorical, subQueryText)
	tx = tx.Order("exam_code asc, value asc")
	if err := tx.Find(&exams).Error; err != nil {
		return nil, fmt.Errorf("error retrieving case exams: %w", err)
	}

	return &exams, nil
}

// patient.id and fetus.id are independent sequences that can produce the same number, so tag
// which subject owns the row rather than keying on the bare id. Neither set means a data
// anomaly — key it apart instead of dereferencing nil.
func subjectKey(patientID *int, fetusID *int) string {
	switch {
	case fetusID != nil:
		return fmt.Sprintf("f:%d", *fetusID)
	case patientID != nil:
		return fmt.Sprintf("p:%d", *patientID)
	default:
		return "unresolved"
	}
}

func (r *CasesRepository) retrieveCaseTasks(ctx context.Context, caseId int) (*[]CaseTask, error) {
	var tasks []CaseTask
	tx := r.db.WithContext(ctx).Table(fmt.Sprintf("%s %s", types.TaskContextTable.TenantQualifiedName(ctx), types.TaskContextTable.Alias))
	tx = r.joiner.TaskContextWithCaseHasSeqExp(tx)
	tx = r.joiner.TaskContextWithTask(tx)
	tx = tx.Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s.task_type_code = %s.code", types.TaskTypeTable.TenantQualifiedName(ctx), types.TaskTypeTable.Alias, types.TaskTable.Alias, types.TaskTypeTable.Alias))
	tx = r.joiner.TaskContextWithSeqExp(tx)
	tx = r.joiner.SeqExpWithSample(tx)
	tx = r.joiner.SampleAndCaseHasSeqExpWithFamily(tx)
	tx = tx.Where("chseq.case_id = ?", caseId)
	// spl.patient_id (the mother) is shared by her own sample and her fetus's — counting it alone
	// would collapse a task covering both into a single individual.
	tx = tx.Select("task.id, task.task_type_code as type_code, task.created_on, task_type.name_en as type_name, group_concat(f.relationship_to_proband_code) as patients_unparsed, count(distinct CASE WHEN spl.fetus_id IS NOT NULL THEN CONCAT(spl.patient_id, '-', spl.fetus_id) ELSE CAST(spl.patient_id AS TEXT) END) as patient_count")
	tx = tx.Group("task.id, task.task_type_code, task.created_on, task_type.name_en")
	tx = tx.Order("task.id asc")

	if err := tx.Find(&tasks).Error; err != nil {
		return nil, fmt.Errorf("error retrieving case tasks: %w", err)
	}

	for i, task := range tasks {
		patients := utils.SplitRemoveEmptyString(task.PatientsUnparsed, ",")
		patients = utils.RemoveDuplicates(patients)
		slices.Sort(patients)
		tasks[i].Patients = patients
	}

	return &tasks, nil
}

func calculateCaseType(caseEntity CaseEntity) string {
	if caseEntity.CaseTypeCode == "somatic" || len(caseEntity.Members) == 1 {
		return caseEntity.CaseTypeCode
	} else {
		return fmt.Sprintf("%s_family", caseEntity.CaseTypeCode)
	}
}
