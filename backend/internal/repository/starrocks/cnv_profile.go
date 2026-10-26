package starrocks

import (
	"context"
	"fmt"
	"strings"

	"github.com/radiant-network/radiant-api/internal/database"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/internal/utils/joins"
	"gorm.io/gorm"
)

type CNVProfileRepository struct {
	db     *gorm.DB
	joiner joins.Joiner
}

func NewCNVProfileRepository(db database.StarrocksDB) *CNVProfileRepository {
	return &CNVProfileRepository{db: db.DB, joiner: joins.Starrocks()}
}

// CNVProfileFiles are the files the profile tracks are read from; ROH is optional.
type CNVProfileFiles struct {
	CopyRatio *types.CNVProfileDocument
	BAF       *types.CNVProfileDocument
	ROH       *types.CNVProfileDocument
}

// GetCNVProfileDocuments lists the igv files written for a sequencing by its germline variant
// calling task, like the IGV case tracks.
func (r *CNVProfileRepository) GetCNVProfileDocuments(ctx context.Context, seqID int) ([]types.CNVProfileDocument, error) {
	tx := r.db.WithContext(ctx).Table(fmt.Sprintf("%s %s", types.TaskContextTable.TenantQualifiedName(ctx), types.TaskContextTable.Alias))
	tx = r.joiner.TaskContextWithTask(tx)
	tx = r.joiner.TaskContextWithTaskHasDoc(tx)
	tx = r.joiner.TaskHasDocWithDocument(tx)
	tx = tx.Where(fmt.Sprintf(`%s.sequencing_experiment_id = ? AND %s.task_type_code = 'alignment_germline_variant_calling'
		AND thd.type = 'output' AND doc.data_type_code = 'igv' AND doc.format_code IN ('bw', 'bed')`,
		types.TaskContextTable.Alias, types.TaskTable.Alias), seqID)
	tx = tx.Select("tctx.task_id AS task_id, doc.name AS document_name, doc.format_code, doc.url")
	tx = tx.Order("tctx.task_id, doc.name")

	var documents []types.CNVProfileDocument
	if err := tx.Find(&documents).Error; err != nil {
		return nil, fmt.Errorf("error fetching cnv profile documents: %w", err)
	}
	return documents, nil
}

// GetExperimentalStrategy gives the experimental strategy code of a sequencing (wxs, wgs, ...),
// empty when there is no such sequencing.
func (r *CNVProfileRepository) GetExperimentalStrategy(ctx context.Context, seqID int) (string, error) {
	var strategies []string
	err := r.db.WithContext(ctx).
		Table(fmt.Sprintf("%s %s", types.SequencingExperimentTable.TenantQualifiedName(ctx), types.SequencingExperimentTable.Alias)).
		Where(fmt.Sprintf("%s.id = ?", types.SequencingExperimentTable.Alias), seqID).
		Pluck("experimental_strategy_code", &strategies).Error
	if err != nil {
		return "", fmt.Errorf("error fetching experimental strategy: %w", err)
	}
	if len(strategies) == 0 {
		return "", nil
	}
	return strategies[0], nil
}

// SelectCNVProfileFiles picks the copy ratio, BAF and ROH files. A rerun of the calling task
// writes them again: the latest task (highest id) wins.
func SelectCNVProfileFiles(documents []types.CNVProfileDocument) CNVProfileFiles {
	var files CNVProfileFiles
	pick := func(current **types.CNVProfileDocument, d *types.CNVProfileDocument) {
		if *current == nil || d.TaskID > (*current).TaskID {
			*current = d
		}
	}
	for i := range documents {
		d := &documents[i]
		name := strings.ToLower(d.DocumentName)
		switch {
		case d.FormatCode == "bw" && strings.HasSuffix(name, copyRatioSuffix):
			pick(&files.CopyRatio, d)
		case d.FormatCode == "bw" && strings.HasSuffix(name, bafSuffix):
			pick(&files.BAF, d)
		case d.FormatCode == "bed" && strings.HasSuffix(name, rohSuffix):
			pick(&files.ROH, d)
		}
	}
	return files
}

func (r *CNVProfileRepository) GetCNVProfileSegments(ctx context.Context, seqID int, taskID int) ([]types.CNVProfileSegment, error) {
	tx, err := prepareCNVQuery(ctx, r.db.WithContext(ctx), types.GermlineCNVOccurrenceTable, seqID, taskID, nil)
	if err != nil {
		return nil, fmt.Errorf("error during query preparation %w", err)
	}
	alias := types.GermlineCNVOccurrenceTable.Alias
	tx = tx.Select(fmt.Sprintf("%[1]s.cnv_id, %[1]s.chromosome, %[1]s.start, %[1]s.end, %[1]s.type, %[1]s.length, %[1]s.quality, %[1]s.filter, %[1]s.cn, %[1]s.sm", alias))
	tx = tx.Order(fmt.Sprintf("%[1]s.chromosome, %[1]s.start", alias))

	var segments []types.CNVProfileSegment
	if err := tx.Find(&segments).Error; err != nil {
		return nil, fmt.Errorf("error fetching cnv profile segments: %w", err)
	}
	return segments, nil
}

func (r *CNVProfileRepository) GetCytobands(ctx context.Context) ([]types.Cytoband, error) {
	tx := r.db.WithContext(ctx).Table(types.CytobandTable.TenantQualifiedName(ctx))
	tx = tx.Select("chromosome, cytoband, start, end, gie_stain")
	tx = tx.Order("chromosome, start")

	var cytobands []types.Cytoband
	if err := tx.Find(&cytobands).Error; err != nil {
		return nil, fmt.Errorf("error fetching cytobands: %w", err)
	}
	return cytobands, nil
}
