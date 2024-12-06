package repository

import (
	"fmt"
	"github.com/Ferlab-Ste-Justine/radiant-api/internal/types"
	"github.com/Goldziher/go-utils/sliceutils"
	"gorm.io/gorm"
	"log"
)

type Occurrence = types.Occurrence
type Aggregation = types.Aggregation
type Repository interface {
	CheckDatabaseConnection() string
	GetOccurrences(seqId int, userFilter types.ListQuery) ([]Occurrence, error)
	CountOccurrences(seqId int, userQuery types.CountQuery) (int64, error)
	AggregateOccurrences(seqId int, userQuery types.AggQuery) ([]Aggregation, error)
}

type MySQLRepository struct {
	db *gorm.DB
}

func New(db *gorm.DB) *MySQLRepository {
	return &MySQLRepository{db: db}
}

func (r *MySQLRepository) CheckDatabaseConnection() string {
	sqlDb, err := r.db.DB()
	if err != nil {
		log.Fatal("failed to get database object:", err)
		return "down"
	}

	if err = sqlDb.Ping(); err != nil {
		log.Fatal("failed to ping database", err)
		return "down"
	}
	return "up"
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
		tx = tx.Limit(l).Offset(userQuery.Pagination().Offset)
	} else {
		tx = tx.Limit(MinLimit)
	}
	addSort(tx, userQuery)
}

func addSort(tx *gorm.DB, userQuery types.ListQuery) {
	for _, sort := range userQuery.SortedFields() {
		s := fmt.Sprintf("%s.%s %s", sort.Field.Table.Alias, sort.Field.GetAlias(), sort.Order)
		tx = tx.Order(s)
	}
}
func addWhere(userQuery types.Query, tx *gorm.DB) {
	if userQuery.Filters() != nil {
		filters, params := userQuery.Filters().ToSQL()
		tx.Where(filters, params...)
	}
}

func addImplicitOccurrencesFilters(seqId int, r *MySQLRepository, part int) *gorm.DB {
	tx := r.db.Table("occurrences o").Where("o.seq_id = ? and o.part=? and has_alt", seqId, part)
	return tx
}
func joinWithVariants(userQuery types.Query, tx *gorm.DB) *gorm.DB {
	if userQuery.HasFieldFromTable(types.VariantTable) {
		tx = tx.Joins("JOIN variants v ON v.locus_id=o.locus_id")
	}
	return tx
}
func (r *MySQLRepository) GetPart(seqId int) (int, error) { //TODO cache
	tx := r.db.Table("sequencing_experiment").Where("seq_id = ?", seqId).Select("part")
	var part int
	err := tx.Scan(&part).Error
	if err != nil {
		return part, fmt.Errorf("error fetching part: %w", err)
	}
	return part, err
}

func (r *MySQLRepository) GetOccurrences(seqId int, userQuery types.ListQuery) ([]Occurrence, error) {
	var occurrences []Occurrence

	tx, part, err := prepareListOrCountQuery(seqId, userQuery, r)
	if err != nil {
		return nil, fmt.Errorf("error during query preparation %w", err)
	}
	var columns = sliceutils.Map(userQuery.SelectedFields(), func(field types.Field, index int, slice []types.Field) string {
		return fmt.Sprintf("%s.%s as %s", field.Table.Alias, field.Name, field.GetAlias())
	})

	if columns == nil {
		columns = []string{"o.locus_id"}
	}
	addLimitAndSort(tx, userQuery)
	if userQuery.HasFieldFromTable(types.VariantTable) {
		// we build a TOP-N query like :
		// SELECT o.locus_id, o.quality, o.ad_ratio, ...., v.variant_class, v.hgvsg... FROM occurrences o, variants v
		// WHERE o.locus_id in (
		//	SELECT o.locus_id FROM occurrences JOIN ... WHERE quality > 100 ORDER BY ad_ratio DESC LIMIT 10
		// ) AND o.seq_id=? AND o.part=? AND v.locus_id=o.locus_id ORDER BY ad_ratio DESC
		tx = tx.Select("o.locus_id")
		tx = r.db.Table("occurrences o, variants v").
			Select(columns).
			Where("o.seq_id = ? and part=? and v.locus_id = o.locus_id and o.locus_id in (?)", seqId, part, tx)

		addSort(tx, userQuery) //We re-apply the sort on the outer query

		err = tx.Find(&occurrences).Error
	} else {
		err = tx.Select(columns).Find(&occurrences).Error
	}
	if err != nil {
		err = fmt.Errorf("error fetching occurrences: %w", err)
		return nil, err
	}

	return occurrences, err

}

func prepareListOrCountQuery(seqId int, userQuery types.Query, r *MySQLRepository) (*gorm.DB, int, error) {
	part, err := r.GetPart(seqId)
	if err != nil {
		return nil, 0, fmt.Errorf("error during partition fetch %w", err)
	}
	tx := addImplicitOccurrencesFilters(seqId, r, part)
	if userQuery != nil {
		tx = joinWithVariants(userQuery, tx)
		if userQuery.HasFieldFromTable(types.ConsequenceFilterTable) {
			if userQuery.Filters() != nil {
				filters, params := userQuery.Filters().ToSQL()
				joinClause := "LEFT SEMI JOIN consequences_filter cf ON cf.locus_id=o.locus_id AND cf.part = o.part and (?)"
				tx = tx.Joins(joinClause, gorm.Expr(filters, params...))
			}

		} else {
			addWhere(userQuery, tx)
		}

	}
	return tx, part, nil
}

func (r *MySQLRepository) CountOccurrences(seqId int, userQuery types.CountQuery) (int64, error) {
	tx, _, err := prepareListOrCountQuery(seqId, userQuery, r)
	if err != nil {
		return 0, fmt.Errorf("error during query preparation %w", err)
	}
	var count int64
	err = tx.Count(&count).Error
	if err != nil {
		log.Print("error fetching occurrences:", err)
	}
	return count, err

}

func prepareAggQuery(seqId int, userQuery types.AggQuery, r *MySQLRepository) (*gorm.DB, int, error) {
	part, err := r.GetPart(seqId)
	if err != nil {
		return nil, 0, fmt.Errorf("error during partition fetch %w", err)
	}
	tx := addImplicitOccurrencesFilters(seqId, r, part)
	if userQuery != nil {
		tx = joinWithVariants(userQuery, tx)
		if userQuery.HasFieldFromTable(types.ConsequenceFilterTable) {
			joinClause := "JOIN consequences_filter cf ON cf.locus_id=o.locus_id AND cf.part = o.part"
			tx = tx.Joins(joinClause)
		}
		addWhere(userQuery, tx)

	}
	return tx, part, nil
}

func (r *MySQLRepository) AggregateOccurrences(seqId int, userQuery types.AggQuery) ([]Aggregation, error) {
	tx, _, err := prepareAggQuery(seqId, userQuery, r)
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
	} else if aggCol.Table == types.ConsequenceFilterTable {
		sel = fmt.Sprintf("%s.%s as bucket, count(distinct o.locus_id) as count", aggCol.Table.Alias, aggCol.Name)
	} else {
		sel = fmt.Sprintf("%s.%s as bucket, count(1) as count", aggCol.Table.Alias, aggCol.Name)
	}

	err = tx.Select(sel).Group("bucket").Order("count asc, bucket asc").Find(&aggregation).Error
	if err != nil {
		return aggregation, fmt.Errorf("error query aggragation: %w", err)
	}
	return aggregation, err
}
