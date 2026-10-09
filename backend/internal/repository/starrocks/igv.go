package starrocks

import (
	"context"
	"fmt"
	"slices"
	"strings"

	"github.com/radiant-network/radiant-api/internal/database"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/internal/utils"
	"github.com/radiant-network/radiant-api/internal/utils/joins"
	"gorm.io/gorm"
)

type IGVTrack = types.IGVTrack

type IGVRepository struct {
	db     *gorm.DB
	joiner joins.Joiner
}

func NewIGVRepository(db database.StarrocksDB) *IGVRepository {
	return &IGVRepository{db: db.DB, joiner: joins.Starrocks()}
}

func (r *IGVRepository) GetIGV(ctx context.Context, caseID int) ([]IGVTrack, error) {
	var tracks []IGVTrack

	// CNV VCFs are taken from the variant-calling task only, as the ETL does
	// (staging_external_sequencing_experiment): the family-level CNV annotation task also writes a
	// gcnv VCF, with no index.
	trackFilter := fmt.Sprintf(`%s.case_id=%d AND thd.type='output' AND (
		(doc.data_type_code = 'alignment' AND doc.format_code IN ('cram', 'crai'))
		OR (doc.data_type_code = 'gcnv' AND doc.format_code IN ('vcf', 'tbi') AND %s.task_type_code = 'alignment_germline_variant_calling')
		OR (doc.data_type_code = 'scnv' AND doc.format_code IN ('vcf', 'tbi') AND %s.task_type_code = 'tumor_only_variant_calling')
		OR (doc.data_type_code = 'igv' AND doc.format_code IN ('bw', 'bed'))
	)`, types.CaseHasSequencingExperimentTable.Alias, caseID, types.TaskTable.Alias, types.TaskTable.Alias)

	tx := r.db.WithContext(ctx).Table(fmt.Sprintf("%s %s", types.SequencingExperimentTable.TenantQualifiedName(ctx), types.SequencingExperimentTable.Alias))
	tx.Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s.sequencing_experiment_id=%s.id", types.CaseHasSequencingExperimentTable.TenantQualifiedName(ctx), types.CaseHasSequencingExperimentTable.Alias, types.CaseHasSequencingExperimentTable.Alias, types.SequencingExperimentTable.Alias))
	tx.Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s.sequencing_experiment_id=%s.id", types.TaskContextTable.TenantQualifiedName(ctx), types.TaskContextTable.Alias, types.TaskContextTable.Alias, types.SequencingExperimentTable.Alias))
	tx = r.joiner.TaskContextWithTask(tx)
	tx = r.joiner.TaskContextWithTaskHasDoc(tx)
	tx = r.joiner.SeqExpWithSample(tx)
	tx = r.joiner.SampleAndCaseHasSeqExpWithFamily(tx)
	tx = r.joiner.TaskHasDocWithDocument(tx)
	tx = r.joiner.SampleWithPatient(tx)
	tx = r.joiner.SampleWithFetus(tx)
	tx.Where(trackFilter)

	columns := []string{
		"s.id AS sequencing_experiment_id",
		"tctx.task_id AS task_id",
		"spl.patient_id as patient_id",
		"spl.fetus_id as fetus_id",
		"spl.submitter_sample_id AS sample_id",
		"spl.histology_code AS histology_code",
		"f.relationship_to_proband_code AS family_role",
		"COALESCE(fetus.sex_code, p.sex_code) AS sex_code",
		"doc.data_type_code",
		"doc.format_code",
		"doc.name AS document_name",
		"doc.url",
	}

	tx.Select(columns)
	tx.Order("s.id, doc.data_type_code, doc.format_code, tctx.task_id, doc.name")
	if err := tx.Find(&tracks).Error; err != nil {
		return nil, err
	}
	return tracks, nil
}

// Transforms internal IGVTrack records to "IGVTracks" which match the IGV specification format.
// For germline, the tracks are labelled by family role (e.g. "proband", "mother", "father") and the
// proband tracks are listed first.
func PrepareGermlineIgvTracks(tracks []IGVTrack, presigner utils.PreSigner) (*types.IGVTracks, error) {
	return prepareIgvTracks(tracks, presigner,
		func(t IGVTrack) string { return t.FamilyRole },
		func(t IGVTrack) bool { return t.FamilyRole == "proband" })
}

// Transforms internal IGVTrack records to "IGVTracks" which match the IGV specification format.
// For somatic, the tracks are labelled by histology code (e.g. "tumoral", "normal") and the
// tumoral tracks are listed first.
func PrepareSomaticIgvTracks(tracks []IGVTrack, presigner utils.PreSigner) (*types.IGVTracks, error) {
	return prepareIgvTracks(tracks, presigner,
		func(t IGVTrack) string { return t.HistologyCode },
		func(t IGVTrack) bool { return t.HistologyCode == "tumoral" })
}

type igvTrackKind string

const (
	igvTrackAlignment      igvTrackKind = "Reads"
	igvTrackCNV            igvTrackKind = "CNVs"
	igvTrackSeg            igvTrackKind = "Seg"
	igvTrackBAF            igvTrackKind = "BAF"
	igvTrackROH            igvTrackKind = "ROH"
	igvTrackCaptureTargets igvTrackKind = "Capture targets"
)

// igvTrackKindOf tells the track of a document. Seg and BAF share igv/bw, ROH and capture
// targets share igv/bed: the document name suffix tells them apart. An igv document with
// another name gives no track.
func igvTrackKindOf(r IGVTrack) (igvTrackKind, bool) {
	switch r.DataTypeCode {
	case "alignment":
		return igvTrackAlignment, true
	case "gcnv", "scnv":
		return igvTrackCNV, true
	case "igv":
		name := strings.ToLower(r.DocumentName)
		switch {
		case r.FormatCode == "bw" && strings.HasSuffix(name, ".seg.bw"):
			return igvTrackSeg, true
		case r.FormatCode == "bw" && strings.HasSuffix(name, ".baf.bw"):
			return igvTrackBAF, true
		case r.FormatCode == "bed" && strings.HasSuffix(name, ".roh.bed"):
			return igvTrackROH, true
		case r.FormatCode == "bed" && strings.HasSuffix(name, "_targets.bed"):
			return igvTrackCaptureTargets, true
		}
	}
	return "", false
}

// HasIgvTracks tells whether the documents give at least one member track. Capture targets alone
// give none: they only frame the member tracks.
func HasIgvTracks(tracks []IGVTrack) bool {
	return slices.ContainsFunc(tracks, func(r IGVTrack) bool {
		kind, ok := igvTrackKindOf(r)
		return ok && kind != igvTrackCaptureTargets
	})
}

type igvTrackKey struct {
	kind                   igvTrackKind
	sequencingExperimentId int
}

type igvTaskFiles struct {
	data, index bool
}

// complete tells whether a task gives a usable track: the data file, plus its index for the
// indexed kinds (cram/crai, vcf/tbi). Seg, BAF, ROH and targets have no index.
func (f igvTaskFiles) complete(kind igvTrackKind) bool {
	if kind == igvTrackAlignment || kind == igvTrackCNV {
		return f.data && f.index
	}
	return f.data
}

// latestIgvTaskIds gives, per track, the task whose files make the track. A rerun of a task on the
// same sequencing writes a second data/index pair; mixing the data file of one run with the index
// of another breaks the track. The latest task (highest id) with a complete set of files wins; when
// no task is complete, the latest task wins, as before.
func latestIgvTaskIds(internalTracks []IGVTrack) map[igvTrackKey]int {
	filesByTask := map[igvTrackKey]map[int]igvTaskFiles{}
	for _, r := range internalTracks {
		kind, ok := igvTrackKindOf(r)
		if !ok {
			continue
		}
		key := igvTrackKey{kind: kind, sequencingExperimentId: r.SequencingExperimentId}
		if filesByTask[key] == nil {
			filesByTask[key] = map[int]igvTaskFiles{}
		}
		files := filesByTask[key][r.TaskId]
		switch r.FormatCode {
		case "crai", "tbi":
			files.index = true
		default:
			files.data = true
		}
		filesByTask[key][r.TaskId] = files
	}

	latest := map[igvTrackKey]int{}
	for key, tasks := range filesByTask {
		chosen, chosenComplete, set := 0, false, false
		for taskId, files := range tasks {
			complete := files.complete(key.kind)
			if !set || (complete && !chosenComplete) || (complete == chosenComplete && taskId > chosen) {
				chosen, chosenComplete, set = taskId, complete, true
			}
		}
		latest[key] = chosen
	}
	return latest
}

func prepareIgvTracks(internalTracks []IGVTrack, presigner utils.PreSigner, label func(IGVTrack) string, leading func(IGVTrack) bool) (*types.IGVTracks, error) {
	merged := map[igvTrackKey]*types.IGVTrackEnriched{}
	leadingSeqExps := map[int]bool{}
	latestTaskIds := latestIgvTaskIds(internalTracks)

	// Transform to enriched tracks, merging data/index pairs (cram/crai, vcf/tbi) together.
	for _, r := range internalTracks {
		kind, ok := igvTrackKindOf(r)
		if !ok {
			continue
		}
		key := igvTrackKey{kind: kind, sequencingExperimentId: r.SequencingExperimentId}
		if r.TaskId != latestTaskIds[key] {
			continue
		}
		lead := leading(r)
		// Capture targets are shown once, from the proband (or tumor) only.
		if kind == igvTrackCaptureTargets && !lead {
			continue
		}
		if lead {
			leadingSeqExps[r.SequencingExperimentId] = true
		}

		m, exists := merged[key]
		if !exists {
			name := fmt.Sprintf("%s: %s %s", kind, r.SampleId, label(r))
			if kind == igvTrackCaptureTargets {
				name = string(igvTrackCaptureTargets)
			}
			m = &types.IGVTrackEnriched{
				SequencingExperimentId: r.SequencingExperimentId,
				PatientId:              r.PatientId,
				FetusId:                r.FetusId,
				Type:                   r.DataTypeCode,
				Sex:                    r.SexCode,
				FamilyRole:             r.FamilyRole,
				Name:                   name,
			}
			merged[key] = m
		}

		presigned, err := presigner.GeneratePreSignedURL(r.URL)
		if err != nil {
			return nil, err
		}

		switch r.FormatCode {
		case "cram", "vcf", "bw", "bed":
			m.Format = r.FormatCode
			m.URL = presigned.URL
			m.URLExpireAt = presigned.URLExpireAt
		case "crai", "tbi":
			m.IndexURL = presigned.URL
			m.IndexURLExpireAt = presigned.URLExpireAt
		}
	}

	byKind := map[igvTrackKind][]types.IGVTrackEnriched{}
	for key, m := range merged {
		byKind[key.kind] = append(byKind[key.kind], *m)
	}
	isLeading := func(t types.IGVTrackEnriched) bool { return leadingSeqExps[t.SequencingExperimentId] }
	sorted := func(kind igvTrackKind) []types.IGVTrackEnriched {
		tracks := byKind[kind]
		utils.SortIgvTracksByLeadingThenName(tracks, isLeading)
		return tracks
	}

	result := types.IGVTracks{
		Alignment:      sorted(igvTrackAlignment),
		CNV:            sorted(igvTrackCNV),
		Seg:            sorted(igvTrackSeg),
		BAF:            sorted(igvTrackBAF),
		ROH:            sorted(igvTrackROH),
		CaptureTargets: sorted(igvTrackCaptureTargets),
	}
	// Several proband (or tumor) sequencings still give a single targets track: the lowest id.
	if len(result.CaptureTargets) > 1 {
		first := slices.MinFunc(result.CaptureTargets, func(a, b types.IGVTrackEnriched) int {
			return a.SequencingExperimentId - b.SequencingExperimentId
		})
		result.CaptureTargets = []types.IGVTrackEnriched{first}
	}
	return &result, nil
}
