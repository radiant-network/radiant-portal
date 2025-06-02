package repository

import (
	"errors"
	"fmt"
	"log"

	"github.com/Ferlab-Ste-Justine/radiant-api/internal/types"
	"github.com/Goldziher/go-utils/sliceutils"
	"gorm.io/gorm"
)

type Occurrence = types.Occurrence
type Aggregation = types.Aggregation
type Statistics = types.Statistics
type ExpendedOccurrence = types.ExpendedOccurrence
type OmimGenePanel = types.OmimGenePanel
type Consequence = types.Consequence
type Transcript = types.Transcript

type OccurrencesRepository struct {
	db *gorm.DB
}

type OccurrencesDAO interface {
	GetOccurrences(seqId int, userFilter types.ListQuery) ([]Occurrence, error)
	CountOccurrences(seqId int, userQuery types.CountQuery) (int64, error)
	AggregateOccurrences(seqId int, userQuery types.AggQuery) ([]Aggregation, error)
	GetStatisticsOccurrences(seqId int, userQuery types.StatisticsQuery) (*Statistics, error)
	GetExpendedOccurrence(seqId int, locusId int) (*ExpendedOccurrence, error)
}

func NewOccurrencesRepository(db *gorm.DB) *OccurrencesRepository {
	if db == nil {
		log.Fatal("OccurrencesRepository: db is nil")
		return nil
	}
	return &OccurrencesRepository{db: db}
}

const (
	MinLimit = 10
	MaxLimit = 200
)

func addLimitAndSort(tx *gorm.DB, userQuery types.ListQuery) {
	if userQuery.Pagination() != nil {
		var l int
		if userQuery.Pagination().Limit < MaxLimit {
			l = userQuery.Pagination().Limit
		} else {
			l = MaxLimit
		}
		if userQuery.Pagination().PageIndex != 0 {
			tx = tx.Limit(l).Offset(userQuery.Pagination().PageIndex * l)
		} else {
			tx = tx.Limit(l).Offset(userQuery.Pagination().Offset)
		}
	} else {
		tx = tx.Limit(MinLimit)
	}
	addSort(tx, userQuery)
}

func addSort(tx *gorm.DB, userQuery types.ListQuery) {
	for _, sort := range userQuery.SortedFields() {
		s := fmt.Sprintf("%s.%s %s", sort.Field.Table.Alias, sort.Field.GetName(), sort.Order)
		tx = tx.Order(s)
	}
}
func addWhere(userQuery types.Query, tx *gorm.DB) {
	if userQuery.Filters() != nil {
		filters, params := userQuery.Filters().ToSQL(nil)
		tx.Where(filters, params...)
	}
}

func addImplicitOccurrencesFilters(seqId int, r *OccurrencesRepository, part int) *gorm.DB {
	tx := r.db.Table("germline__snv__occurrence o").Where("o.seq_id = ? and o.part=?", seqId, part)
	return tx
}
func joinWithVariants(tx *gorm.DB) *gorm.DB {
	return tx.Joins("JOIN germline__snv__variant v ON v.locus_id=o.locus_id")
}
func (r *OccurrencesRepository) GetPart(seqId int) (int, error) { //TODO cache
	tx := r.db.Table("sequencing_experiment").Where("seq_id = ?", seqId).Select("part")
	var part int
	err := tx.Scan(&part).Error
	if err != nil {
		return part, fmt.Errorf("error fetching part: %w", err)
	}
	return part, err
}

func (r *OccurrencesRepository) GetOccurrences(seqId int, userQuery types.ListQuery) ([]Occurrence, error) {
	var occurrences []Occurrence

	tx, part, err := prepareListOrCountQuery(seqId, userQuery, r)
	if err != nil {
		return nil, fmt.Errorf("error during query preparation %w", err)
	}
	var columns = sliceutils.Map(userQuery.SelectedFields(), func(field types.Field, index int, slice []types.Field) string {
		return fmt.Sprintf("%s.%s as %s", field.Table.Alias, field.Name, field.GetAlias())
	})

	addLimitAndSort(tx, userQuery)
	// we build a TOP-N query like :
	// SELECT o.locus_id, o.quality, o.ad_ratio, ...., v.variant_class, v.hgvsg... FROM germline__snv__occurrence o, germline__snv__variant v
	// WHERE o.locus_id in (
	//	SELECT o.locus_id FROM germline__snv__occurrence JOIN ... WHERE quality > 100 ORDER BY ad_ratio DESC LIMIT 10
	// ) AND o.seq_id=? AND o.part=? AND v.locus_id=o.locus_id ORDER BY ad_ratio DESC
	tx = tx.Select("o.locus_id")
	tx = r.db.Table("germline__snv__occurrence o, germline__snv__variant v").
		Select(columns).
		Where("o.seq_id = ? and part=? and v.locus_id = o.locus_id and o.locus_id in (?)", seqId, part, tx)

	addSort(tx, userQuery) //We re-apply the sort on the outer query

	if err = tx.Find(&occurrences).Error; err != nil {
		return nil, fmt.Errorf("error fetching occurrences: %w", err)
	}
	return occurrences, nil
}

func prepareListOrCountQuery(seqId int, userQuery types.Query, r *OccurrencesRepository) (*gorm.DB, int, error) {
	part, err := r.GetPart(seqId)
	if err != nil {
		return nil, 0, fmt.Errorf("error during partition fetch %w", err)
	}
	tx := addImplicitOccurrencesFilters(seqId, r, part)
	if userQuery != nil {
		tx = joinWithVariants(tx)

		if userQuery.Filters() != nil && (userQuery.HasFieldFromTables(types.ConsequenceFilterTable) || userQuery.HasFieldFromTables(types.GenePanelsTables...)) {
			if userQuery.HasFieldFromTables(types.GenePanelsTables...) {
				// In this case we need to build a subquery that join the consequences_filter_partitioned table with the gene panels tables
				// This subquery will join the consequences_filter_partitioned table with the gene panels tables on symbol column and will be used to filter the occurrences

				// Example of the generated query:
				// SELECT o.locus_id as locus_id, ... FROM occurrences o
				// LEFT SEMI JOIN (
				//		SELECT cf.locus_id,cf.part,om.panel as omim_gene_panel,hpo.panel as hpo_gene_panel,cf.impact_score as impact_score
				//		FROM consequences_filter_partitioned cf
				//		LEFT JOIN omim_gene_panel om ON om.symbol=cf.symbol
				//		LEFT JOIN hpo_gene_panel hpo ON hpo.symbol=cf.symbol
				//		WHERE part = 1
				//	) cf ON cf.locus_id=o.locus_id
				//		AND cf.part = o.part
				//		AND ((cf.impact_score > 2 AND cf.omim_gene_panel IN ('panel1', 'panel2') AND cf.hpo_gene_panel = 'hpo_panel1'))
				//	WHERE o.seq_id = 1 and o.part=1 and has_alt
				//	ORDER BY o.locus_id asc LIMIT 10

				selectedPanelsField := userQuery.GetFieldsFromTables(types.GenePanelsTables...)
				selectedPanelsTables := getDistinctTablesFromFields(selectedPanelsField)

				consequenceFilterTable := r.db.Table("germline__snv__consequence_filter_partitioned cf").Where("part = ?", part)

				// overrideTableAliases will be used to override the table aliases when generating the filter. The sub-query will contain the columns with their aliases.
				// For instance panel column from omim_gene_panel will be aliased as omim_gene_panel in the subquery.
				// And in order to filter the occurrences we need to use the same alias.
				// We also need to use the table alias that corresponds to the table in the subquery.
				overrideTableAliases := map[string]string{"cf": "cf"}
				for _, panelsTable := range selectedPanelsTables {
					consequenceFilterTable = consequenceFilterTable.
						Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s.symbol=cf.symbol", panelsTable.Name, panelsTable.Alias, panelsTable.Alias))
					overrideTableAliases[panelsTable.Alias] = "cf"
				}

				selectedConsequencesFields := userQuery.GetFieldsFromTables(types.ConsequenceFilterTable)
				allSelectedFields := append(selectedPanelsField, selectedConsequencesFields...)
				selectedCols := []string{"cf.locus_id", "cf.part"}
				for _, field := range allSelectedFields {
					selectedCols = append(selectedCols, fmt.Sprintf("%s.%s as %s", field.Table.Alias, field.Name, field.GetAlias()))
				}
				consequenceFilterTable = consequenceFilterTable.Select(selectedCols)

				sqlFilters, params := userQuery.Filters().ToSQL(overrideTableAliases)
				joinClause := "LEFT SEMI JOIN (?) cf ON cf.locus_id=o.locus_id AND cf.part = o.part AND (?)"
				tx = tx.Joins(joinClause, consequenceFilterTable, gorm.Expr(sqlFilters, params...))

			} else {
				filters, params := userQuery.Filters().ToSQL(nil)
				joinClause := "LEFT SEMI JOIN germline__snv__consequence_filter_partitioned cf ON cf.locus_id=o.locus_id AND cf.part = o.part and (?)"
				tx = tx.Joins(joinClause, gorm.Expr(filters, params...))
			}

		} else {
			addWhere(userQuery, tx)
		}

	}
	return tx, part, nil
}

func getDistinctTablesFromFields(selectedPanelsField []types.Field) []types.Table {
	selectedPanelsTables := sliceutils.Unique(sliceutils.Map(selectedPanelsField, func(field types.Field, index int, slice []types.Field) types.Table {
		return field.Table
	}))
	return selectedPanelsTables
}

func (r *OccurrencesRepository) CountOccurrences(seqId int, userQuery types.CountQuery) (int64, error) {
	tx, _, err := prepareListOrCountQuery(seqId, userQuery, r)
	if err != nil {
		return 0, fmt.Errorf("error during query preparation %w", err)
	}
	var count int64
	if err = tx.Count(&count).Error; err != nil {
		return 0, fmt.Errorf("error fetching occurrences: %w", err)
	}
	return count, nil
}

func prepareAggOrStatisticsQuery(seqId int, userQuery types.Query, r *OccurrencesRepository) (*gorm.DB, int, error) {
	part, err := r.GetPart(seqId)
	if err != nil {
		return nil, 0, fmt.Errorf("error during partition fetch %w", err)
	}
	tx := addImplicitOccurrencesFilters(seqId, r, part)
	if userQuery != nil {
		tx = joinWithVariants(tx)
		if userQuery.HasFieldFromTables(types.ConsequenceFilterTable) || userQuery.HasFieldFromTables(types.GenePanelsTables...) {
			joinClause := "LEFT JOIN germline__snv__consequence_filter_partitioned cf ON cf.locus_id=o.locus_id AND cf.part = o.part"
			tx = tx.Joins(joinClause)
			selectedPanelsTables := getDistinctTablesFromFields(userQuery.GetFieldsFromTables(types.GenePanelsTables...))
			for _, panelsTable := range selectedPanelsTables {
				tx = tx.
					Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s.symbol=cf.symbol", panelsTable.Name, panelsTable.Alias, panelsTable.Alias))
			}
		}
		addWhere(userQuery, tx)

	}
	return tx, part, nil
}

func (r *OccurrencesRepository) AggregateOccurrences(seqId int, userQuery types.AggQuery) ([]Aggregation, error) {
	tx, _, err := prepareAggOrStatisticsQuery(seqId, userQuery, r)
	var aggregation []Aggregation
	if err != nil {
		return aggregation, fmt.Errorf("error during query preparation %w", err)
	}
	aggCol := userQuery.GetAggregateField()
	var sel string
	if aggCol.IsArray() {
		//Example :  select unnest  as bucket, count(distinct o.locus_id) as c from occurrences o
		//join variants v on v.locus_id=o.locus_id
		//join unnest(v.clinvar_interpretation) as unnest  on true where o.seq_id=4586 and o.part=11 and o.has_alt
		//group by bucket order by 2;
		unnestJoin := fmt.Sprintf("join unnest(%s.%s) as unnest on true", aggCol.Table.Alias, aggCol.Name)
		tx = tx.Joins(unnestJoin)
		sel = "unnest as bucket, count(distinct o.locus_id) as count"
	} else {
		sel = fmt.Sprintf("%s.%s as bucket, count(distinct o.locus_id) as count", aggCol.Table.Alias, aggCol.Name)
	}

	tx = tx.Select(sel).
		Where(fmt.Sprintf("%s.%s is not null", aggCol.Table.Alias, aggCol.Name)). //We don't want to count null values
		Group("bucket").Order("count asc, bucket asc")
	if err = tx.Find(&aggregation).Error; err != nil {
		return nil, fmt.Errorf("error query aggragation: %w", err)
	}
	return aggregation, nil
}

func (r *OccurrencesRepository) GetStatisticsOccurrences(seqId int, userQuery types.StatisticsQuery) (*types.Statistics, error) {
	tx, _, err := prepareAggOrStatisticsQuery(seqId, userQuery, r)
	var statistics Statistics
	if err != nil {
		return &statistics, fmt.Errorf("error during query preparation %w", err)
	}
	targetCol := userQuery.GetTargetedField()
	sel := fmt.Sprintf("MIN(%s.%s) as min, MAX(%s.%s) as max", targetCol.Table.Alias, targetCol.Name, targetCol.Table.Alias, targetCol.Name)
	tx = tx.Select(sel)
	if err = tx.Find(&statistics).Error; err != nil {
		return nil, fmt.Errorf("error query statistics: %w", err)
	}
	return &statistics, nil
}

func (r *OccurrencesRepository) GetExpendedOccurrence(seqId int, locusId int) (*ExpendedOccurrence, error) {
	tx := r.db.Table("germline__snv__occurrence o")
	tx = tx.Joins("JOIN germline__snv__consequence c ON o.locus_id=c.locus_id AND o.seq_id = ? AND o.locus_id = ? AND c.is_picked = true", seqId, locusId)
	tx = tx.Joins("JOIN germline__snv__variant v ON o.locus_id=v.locus_id")
	tx = tx.Select("c.locus_id, v.hgvsg, v.chromosome, v.start, v.end, v.symbol, v.transcript_id, v.is_canonical, v.is_mane_select, v.is_mane_plus, c.exon_rank, c.exon_total, v.dna_change, v.vep_impact, v.consequences, v.aa_change, v.rsnumber, v.clinvar_interpretation, c.gnomad_pli, c.gnomad_loeuf, c.spliceai_type, c.spliceai_ds, v.pf, v.gnomad_v3_af, c.sift_pred, c.sift_score, c.revel_score, c.fathmm_pred, c.fathmm_score, c.cadd_phred, c.cadd_score, c.dann_score, o.zygosity, o.transmission_mode, o.parental_origin, o.father_calls, o.mother_calls, o.info_qd, o.ad_alt, o.ad_total, o.filter, o.gq")

	var expendedOccurrence ExpendedOccurrence
	if err := tx.First(&expendedOccurrence).Error; err != nil {
		if !errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("error while fetching expended occurrence: %w", err)
		} else {
			return nil, nil
		}
	}

	txOmim := r.db.Table("omim_gene_panel omim")
	txOmim = txOmim.Select("omim.omim_phenotype_id, omim.panel, omim.inheritance_code")
	txOmim = txOmim.Where("omim.omim_phenotype_id is not null and omim.symbol = ?", expendedOccurrence.Symbol)
	txOmim = txOmim.Order("omim.omim_phenotype_id asc")

	var omimConditions []OmimGenePanel
	errOmim := txOmim.Find(&omimConditions).Error
	if errOmim != nil {
		if !errors.Is(errOmim, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("error while fetching omim conditions: %w", errOmim)
		} else {
			return &expendedOccurrence, errOmim
		}
	}
	expendedOccurrence.OmimConditions = omimConditions
	return &expendedOccurrence, nil
}
