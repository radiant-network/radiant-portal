package starrocks

import (
	"context"
	"errors"
	"fmt"

	"github.com/radiant-network/radiant-api/internal/database"
	"github.com/radiant-network/radiant-api/internal/types"
	"gorm.io/gorm"
)

// TranscriptReportRepository reads the StarRocks side of the transcript report: the
// (case, sequencing, task) context, the occurrences of N loci and the annotations they need.
type TranscriptReportRepository struct {
	db *gorm.DB
}

func NewTranscriptReportRepository(db database.StarrocksDB) *TranscriptReportRepository {
	return &TranscriptReportRepository{db: db.DB}
}

// GetGermlineReportContext resolves the partition and the identifiers printed in the report.
// It returns nil when the task is not a task of that sequencing of that case.
func (r *TranscriptReportRepository) GetGermlineReportContext(ctx context.Context, caseId int, seqId int, taskId int) (*types.ReportContext, error) {
	tx := r.db.WithContext(ctx).Table(fmt.Sprintf("%s sse", types.SequencingTable.TenantQualifiedName(ctx)))
	tx = tx.Joins(fmt.Sprintf("JOIN %s s ON s.id = sse.seq_id", types.SequencingExperimentTable.TenantQualifiedName(ctx)))
	tx = tx.Joins(fmt.Sprintf("JOIN %s spl ON spl.id = s.sample_id", types.SampleTable.TenantQualifiedName(ctx)))
	tx = tx.Joins(fmt.Sprintf("JOIN %s p ON p.id = spl.patient_id", types.PatientTable.TenantQualifiedName(ctx)))
	tx = tx.Joins(fmt.Sprintf("JOIN %s c ON c.id = sse.case_id", types.CaseTable.TenantQualifiedName(ctx)))
	tx = tx.Joins(fmt.Sprintf("JOIN %s t ON t.id = sse.task_id", types.TaskTable.TenantQualifiedName(ctx)))
	tx = tx.Select("sse.part, p.submitter_patient_id, spl.submitter_sample_id, c.proband_id = spl.patient_id AS is_proband, t.genome_build")
	tx = tx.Where("sse.case_id = ? AND sse.seq_id = ? AND sse.task_id = ?", caseId, seqId, taskId)

	var reportContext types.ReportContext
	if err := tx.Take(&reportContext).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, fmt.Errorf("fetch report context: %w", err)
	}
	return &reportContext, nil
}

// ListGermlineReportOccurrences returns the occurrences of the loci on that sequencing and task,
// with their variant and gnomAD frequency, ordered by locus id. Loci without an occurrence are absent.
func (r *TranscriptReportRepository) ListGermlineReportOccurrences(ctx context.Context, part int, seqId int, taskId int, locusIds []int) ([]types.ReportOccurrenceRow, error) {
	tx := r.db.WithContext(ctx).Table(fmt.Sprintf("%s o", types.GermlineSNVOccurrenceTable.TenantQualifiedName(ctx)))
	tx = tx.Joins(fmt.Sprintf("JOIN %s v ON v.locus_id = o.locus_id", types.VariantTable.TenantQualifiedName(ctx)))
	tx = tx.Joins(fmt.Sprintf("LEFT JOIN %s gnomad ON gnomad.locus_id = o.locus_id", types.GnomadGenomesV3Table.TenantQualifiedName(ctx)))
	tx = tx.Select("o.locus_id, v.hgvsg, v.rsnumber, v.chromosome, v.start, v.reference, v.alternate, v.symbol, " +
		"v.clinvar_name, v.clinvar_interpretation, o.zygosity, o.parental_origin, o.father_zygosity, o.mother_zygosity, " +
		"o.transmission_mode, o.ad_ratio, o.ad_alt, o.ad_total, " +
		"gnomad.af AS gnomad_af, gnomad.ac AS gnomad_ac, gnomad.an AS gnomad_an, gnomad.hom AS gnomad_hom")
	tx = tx.Where("o.part = ? AND o.seq_id = ? AND o.task_id = ? AND o.locus_id IN (?)", part, seqId, taskId, locusIds)
	tx = tx.Order("o.locus_id ASC")

	var rows []types.ReportOccurrenceRow
	if err := tx.Find(&rows).Error; err != nil {
		return nil, fmt.Errorf("fetch report occurrences: %w", err)
	}
	return rows, nil
}

// ListReportConsequences returns every consequence row of the loci, Ensembl and RefSeq alike.
// The report rows rule is applied by the caller.
func (r *TranscriptReportRepository) ListReportConsequences(ctx context.Context, locusIds []int) ([]types.ReportConsequenceRow, error) {
	tx := r.db.WithContext(ctx).Table(fmt.Sprintf("%s c", types.ConsequenceTable.TenantQualifiedName(ctx)))
	tx = tx.Select("c.locus_id, c.symbol, c.transcript_id, c.transcript_version, c.source, c.is_mane_select, c.is_mane_plus, " +
		"c.is_canonical, c.mane_select, c.mane_pair_transcript_id, c.exon_rank, c.exon_total, c.dna_change, c.aa_change, " +
		"c.revel_score, c.cadd_phred, c.consequences, c.vep_impact")
	tx = tx.Where("c.locus_id IN (?)", locusIds)
	tx = tx.Order("c.locus_id ASC, c.symbol ASC, c.transcript_id ASC")

	var rows []types.ReportConsequenceRow
	if err := tx.Find(&rows).Error; err != nil {
		return nil, fmt.Errorf("fetch report consequences: %w", err)
	}
	return rows, nil
}

// ListReportOmim returns the OMIM phenotypes of the symbols, ordered by symbol then phenotype id.
func (r *TranscriptReportRepository) ListReportOmim(ctx context.Context, symbols []string) ([]types.ReportOmimRow, error) {
	if len(symbols) == 0 {
		return nil, nil
	}
	tx := r.db.WithContext(ctx).Table(fmt.Sprintf("%s omim", types.OmimGenePanelTable.TenantQualifiedName(ctx)))
	tx = tx.Select("omim.symbol, omim.omim_phenotype_id, omim.panel, omim.inheritance_code")
	tx = tx.Where("omim.omim_phenotype_id IS NOT NULL AND omim.symbol IN (?)", symbols)
	tx = tx.Order("omim.symbol ASC, omim.omim_phenotype_id ASC")

	var rows []types.ReportOmimRow
	if err := tx.Find(&rows).Error; err != nil {
		return nil, fmt.Errorf("fetch report omim: %w", err)
	}
	return rows, nil
}
