package repository

import (
	"fmt"

	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/internal/utils"
	"gorm.io/gorm"
)

func AddImplicitSNVOccurrencesFilters(snvTable types.Table, seqId int, db *gorm.DB, part int) *gorm.DB {
	alias := snvTable.Alias
	tx := db.Table(fmt.Sprintf("%s %s", snvTable.Name, alias))
	switch snvTable {
	case types.GermlineSNVOccurrenceTable:
		tx = tx.Where(fmt.Sprintf("%s.seq_id = ? and %s.part=?", alias, alias), seqId, part)
		break
	case types.SomaticSNVOccurrenceTable:
		tx = tx.Where(fmt.Sprintf("%s.tumor_seq_id = ? and %s.part=?", alias, alias), seqId, part)
		break
	}
	return tx
}

func JoinSNVOccurrencesWithVariants(snvTable types.Table, tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("JOIN %s %s ON %s.locus_id=%s.locus_id", types.VariantTable.Name, types.VariantTable.Alias, types.VariantTable.Alias, snvTable.Alias))
}

func JoinSNVOccurrencesWithTopMedBravo(snvTable types.Table, tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("LEFT JOIN topmed_bravo topmed ON topmed.locus_id=%s.locus_id", snvTable.Alias))
}

func JoinSNVOccurrencesWithThousandGenomes(snvTable types.Table, tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("LEFT JOIN 1000_genomes 1000_genomes ON 1000_genomes.locus_id=%s.locus_id", snvTable.Alias))
}

func PrepareSNVListOrCountQuery(snvTable types.Table, seqId int, userQuery types.Query, db *gorm.DB) (*gorm.DB, int, error) {
	part, err := utils.GetSequencingPart(seqId, db)
	if err != nil {
		return nil, 0, fmt.Errorf("error during partition fetch %w", err)
	}
	tx := AddImplicitSNVOccurrencesFilters(snvTable, seqId, db, part)
	if userQuery != nil {
		tx = JoinSNVOccurrencesWithVariants(snvTable, tx)

		if userQuery.HasFieldFromTables(types.TopmedTable) {
			tx = JoinSNVOccurrencesWithTopMedBravo(snvTable, tx)
		}

		if userQuery.HasFieldFromTables(types.ThousandGenomesTable) {
			tx = JoinSNVOccurrencesWithThousandGenomes(snvTable, tx)
		}

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
				selectedPanelsTables := utils.GetDistinctTablesFromFields(selectedPanelsField)

				consequenceFilterTable := db.Table("snv__consequence_filter_partitioned cf").Where("part = ?", part)

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
				joinClause := fmt.Sprintf("LEFT SEMI JOIN (?) cf ON cf.locus_id=%s.locus_id AND cf.part = %s.part AND (?)", snvTable.Alias, snvTable.Alias)
				tx = tx.Joins(joinClause, consequenceFilterTable, gorm.Expr(sqlFilters, params...))

			} else {
				filters, params := userQuery.Filters().ToSQL(nil)
				joinClause := fmt.Sprintf("LEFT SEMI JOIN snv__consequence_filter_partitioned cf ON cf.locus_id=%s.locus_id AND cf.part = %s.part and (?)", snvTable.Alias, snvTable.Alias)
				tx = tx.Joins(joinClause, gorm.Expr(filters, params...))
			}

		} else {
			utils.AddWhere(userQuery, tx)
		}

	}
	return tx, part, nil
}

func PrepareSNVAggOrStatisticsQuery(snvTable types.Table, seqId int, userQuery types.Query, db *gorm.DB) (*gorm.DB, int, error) {
	part, err := utils.GetSequencingPart(seqId, db)
	if err != nil {
		return nil, 0, fmt.Errorf("error during partition fetch %w", err)
	}
	tx := AddImplicitSNVOccurrencesFilters(snvTable, seqId, db, part)
	if userQuery != nil {
		tx = JoinSNVOccurrencesWithVariants(snvTable, tx)
		if userQuery.HasFieldFromTables(types.ConsequenceFilterTable) || userQuery.HasFieldFromTables(types.GenePanelsTables...) {
			joinClause := fmt.Sprintf("LEFT JOIN snv__consequence_filter_partitioned cf ON cf.locus_id=%s.locus_id AND cf.part = %s.part", snvTable.Alias, snvTable.Alias)
			tx = tx.Joins(joinClause)
			selectedPanelsTables := utils.GetDistinctTablesFromFields(userQuery.GetFieldsFromTables(types.GenePanelsTables...))
			for _, panelsTable := range selectedPanelsTables {
				tx = tx.
					Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s.symbol=cf.symbol", panelsTable.Name, panelsTable.Alias, panelsTable.Alias))
			}
		}
		if userQuery.HasFieldFromTables(types.TopmedTable) {
			tx = JoinSNVOccurrencesWithTopMedBravo(snvTable, tx)
		}
		if userQuery.HasFieldFromTables(types.ThousandGenomesTable) {
			tx = JoinSNVOccurrencesWithThousandGenomes(snvTable, tx)
		}
		utils.AddWhere(userQuery, tx)

	}
	return tx, part, nil
}

func CountSNV(snvTable types.Table, seqId int, userQuery types.CountQuery, db *gorm.DB) (int64, error) {
	tx, _, err := PrepareSNVListOrCountQuery(snvTable, seqId, userQuery, db)
	if err != nil {
		return 0, fmt.Errorf("error during query preparation %w", err)
	}
	var count int64
	if err = tx.Count(&count).Error; err != nil {
		return 0, fmt.Errorf("error counting occurrences: %w", err)
	}
	return count, nil
}

func AggregateSNV(snvTable types.Table, seqId int, userQuery types.AggQuery, db *gorm.DB) ([]Aggregation, error) {
	tx, _, err := PrepareSNVAggOrStatisticsQuery(snvTable, seqId, userQuery, db)
	var aggregation []Aggregation
	if err != nil {
		return aggregation, fmt.Errorf("error during query preparation %w", err)
	}
	aggCol := userQuery.GetAggregateField()
	var sel string
	if aggCol.IsArray {
		//Example :  select unnest  as bucket, count(distinct o.locus_id) as c from occurrences o
		//join variants v on v.locus_id=o.locus_id
		//join unnest(v.clinvar_interpretation) as unnest  on true where o.seq_id=4586 and o.part=11 and o.has_alt
		//group by bucket order by 2;
		unnestJoin := fmt.Sprintf("join unnest(%s.%s) as unnest on true", aggCol.Table.Alias, aggCol.Name)
		tx = tx.Joins(unnestJoin)
		sel = fmt.Sprintf("unnest as bucket, count(distinct %s.locus_id) as count", snvTable.Alias)
	} else {
		sel = fmt.Sprintf("%s.%s as bucket, count(distinct %s.locus_id) as count", aggCol.Table.Alias, aggCol.Name, snvTable.Alias)
	}

	tx = tx.Select(sel).
		Where(fmt.Sprintf("%s.%s is not null", aggCol.Table.Alias, aggCol.Name)). //We don't want to count null values
		Group("bucket").Order("count asc, bucket asc")
	if err = tx.Find(&aggregation).Error; err != nil {
		return nil, fmt.Errorf("error query aggragation: %w", err)
	}
	return aggregation, nil
}

func StatisticsSNV(snvTable types.Table, seqId int, userQuery types.StatisticsQuery, db *gorm.DB) (*types.Statistics, error) {
	tx, _, err := PrepareSNVAggOrStatisticsQuery(snvTable, seqId, userQuery, db)
	var statistics types.Statistics
	if err != nil {
		return &statistics, fmt.Errorf("error during query preparation %w", err)
	}
	targetCol := userQuery.GetTargetedField()
	var sel string
	if targetCol.IsArray {
		sel = fmt.Sprintf("MIN(ARRAY_MIN(%s.%s)) as min, MAX(ARRAY_MAX(%s.%s)) as max", targetCol.Table.Alias, targetCol.Name, targetCol.Table.Alias, targetCol.Name)
	} else {
		sel = fmt.Sprintf("MIN(%s.%s) as min, MAX(%s.%s) as max", targetCol.Table.Alias, targetCol.Name, targetCol.Table.Alias, targetCol.Name)
	}
	tx = tx.Select(sel)
	if err = tx.Find(&statistics).Error; err != nil {
		return nil, fmt.Errorf("error query statistics: %w", err)
	}
	statistics.Type = targetCol.Type
	return &statistics, nil
}
