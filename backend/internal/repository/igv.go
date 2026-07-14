package repository

import (
	"context"
	"fmt"
	"strings"

	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/internal/utils"
	"gorm.io/gorm"
)

type IGVTrack = types.IGVTrack

type IGVRepository struct {
	db *gorm.DB
}

func NewIGVRepository(db *gorm.DB) *IGVRepository {
	return &IGVRepository{db: db}
}

func (r *IGVRepository) GetIGV(ctx context.Context, caseID int) ([]IGVTrack, error) {
	var tracks []IGVTrack

	alignmentFilter := fmt.Sprintf("%s.case_id=%d AND thd.type='output' AND (doc.data_type_code IN ('alignment', 'alignment_variant_calling') AND doc.format_code in ('cram', 'crai'))", types.CaseHasSequencingExperimentTable.Alias, caseID)

	tx := r.db.WithContext(ctx).Table(fmt.Sprintf("%s %s", types.SequencingExperimentTable.TenantQualifiedName(ctx), types.SequencingExperimentTable.Alias))
	tx.Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s.sequencing_experiment_id=%s.id", types.CaseHasSequencingExperimentTable.TenantQualifiedName(ctx), types.CaseHasSequencingExperimentTable.Alias, types.CaseHasSequencingExperimentTable.Alias, types.SequencingExperimentTable.Alias))
	tx.Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s.sequencing_experiment_id=%s.id", types.TaskContextTable.TenantQualifiedName(ctx), types.TaskContextTable.Alias, types.TaskContextTable.Alias, types.SequencingExperimentTable.Alias))
	tx = utils.JoinTaskContextWithTaskHasDoc(tx)
	tx = utils.JoinSeqExpWithSample(tx)
	tx = utils.JoinSampleAndCaseHasSeqExpWithFamily(tx)
	tx = utils.JoinTaskHasDocWithDocument(tx)
	tx = utils.JoinFamilyWithPatient(tx)
	tx.Where(alignmentFilter)

	columns := []string{
		"s.id AS sequencing_experiment_id",
		"p.id as patient_id",
		"spl.submitter_sample_id AS sample_id",
		"spl.histology_code AS histology_code",
		"f.relationship_to_proband_code AS family_role",
		"p.sex_code",
		"doc.data_type_code",
		"doc.format_code",
		"doc.url",
	}

	tx.Select(columns)
	tx.Order("s.id, doc.data_type_code, doc.format_code")
	if err := tx.Find(&tracks).Error; err != nil {
		return nil, err
	}
	return tracks, nil
}

// Transforms internal IGVTrack records to "IGVTracks" which match the IGV specification format.
// For germline, the tracks are labelled by family role (e.g. "proband", "mother", "father") and the
// proband track is listed first.
func PrepareGermlineIgvTracks(tracks []IGVTrack, presigner utils.PreSigner) (*types.IGVTracks, error) {
	result, err := prepareIgvTracks(tracks, presigner, func(t IGVTrack) string { return t.FamilyRole })
	if err != nil {
		return nil, err
	}
	utils.SortIgvTracksByLeadingThenName(result.Alignment, func(t types.IGVTrackEnriched) bool {
		return t.FamilyRole == "proband"
	})
	return result, nil
}

// Transforms internal IGVTrack records to "IGVTracks" which match the IGV specification format.
// For somatic, the tracks are labelled by histology code (e.g. "tumoral", "normal") and the
// tumoral track is listed first.
func PrepareSomaticIgvTracks(tracks []IGVTrack, presigner utils.PreSigner) (*types.IGVTracks, error) {
	result, err := prepareIgvTracks(tracks, presigner, func(t IGVTrack) string { return t.HistologyCode })
	if err != nil {
		return nil, err
	}
	utils.SortIgvTracksByLeadingThenName(result.Alignment, func(t types.IGVTrackEnriched) bool {
		return strings.HasSuffix(t.Name, " tumoral")
	})
	return result, nil
}

func prepareIgvTracks(internalTracks []IGVTrack, presigner utils.PreSigner, suffix func(IGVTrack) string) (*types.IGVTracks, error) {
	merged := map[int]*types.IGVTrackEnriched{}

	// Transform to enriched tracks, merging cram/crai pairs together.
	for _, r := range internalTracks {
		// we only support alignment tracks for now
		if r.DataTypeCode != "alignment" {
			continue
		}

		m, exists := merged[r.SequencingExperimentId]
		if !exists {
			m = &types.IGVTrackEnriched{
				PatientId:  r.PatientId,
				Type:       r.DataTypeCode,
				Sex:        r.SexCode,
				FamilyRole: r.FamilyRole,
				Name:       fmt.Sprintf("Reads: %s %s", r.SampleId, suffix(r)),
			}
			merged[r.SequencingExperimentId] = m
		}

		presigned, err := presigner.GeneratePreSignedURL(r.URL)
		if err != nil {
			return nil, err
		}

		switch r.FormatCode {
		case "cram":
			m.Format = r.FormatCode
			m.URL = presigned.URL
			m.URLExpireAt = presigned.URLExpireAt
		case "crai":
			m.IndexURL = presigned.URL
			m.IndexURLExpireAt = presigned.URLExpireAt
		}
	}

	result := types.IGVTracks{Alignment: make([]types.IGVTrackEnriched, 0, len(merged))}
	for _, m := range merged {
		result.Alignment = append(result.Alignment, *m)
	}
	return &result, nil
}
