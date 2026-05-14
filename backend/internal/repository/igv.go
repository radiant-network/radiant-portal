package repository

import (
	"fmt"
	"log"
	"strings"

	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/internal/utils"
	"gorm.io/gorm"
)

type IGVTrack = types.IGVTrack

type IGVRepository struct {
	db *gorm.DB
}

type IGVRepositoryDAO interface {
	GetIGV(caseID int) ([]IGVTrack, error)
}

func NewIGVRepository(db *gorm.DB) *IGVRepository {
	if db == nil {
		log.Print("GermlineCNVOccurrencesRepository: db is nil")
		return nil
	}
	return &IGVRepository{db: db}
}

// GetIGV returns the IGV tracks for a case. The caller is responsible for
// determining the case type (germline vs somatic) and dispatching to the
// appropriate preparation function.
func (r *IGVRepository) GetIGV(caseID int) ([]IGVTrack, error) {
	var tracks []IGVTrack

	alignmentFilter := fmt.Sprintf("%s.case_id=%d AND thd.type='output' AND (doc.data_type_code IN ('alignment', 'alignment_variant_calling') AND doc.format_code in ('cram', 'crai'))", types.CaseHasSequencingExperimentTable.Alias, caseID)

	tx := r.db.Table(fmt.Sprintf("%s %s", types.SequencingExperimentTable.FederationName, types.SequencingExperimentTable.Alias))
	tx.Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s.sequencing_experiment_id=%s.id", types.CaseHasSequencingExperimentTable.FederationName, types.CaseHasSequencingExperimentTable.Alias, types.CaseHasSequencingExperimentTable.Alias, types.SequencingExperimentTable.Alias))
	tx.Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s.sequencing_experiment_id=%s.id", types.TaskContextTable.FederationName, types.TaskContextTable.Alias, types.TaskContextTable.Alias, types.SequencingExperimentTable.Alias))
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
	var alignments []*types.IGVTrackEnriched

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
			alignments = append(alignments, m)
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

	result := types.IGVTracks{Alignment: make([]types.IGVTrackEnriched, len(alignments))}
	for i, m := range alignments {
		result.Alignment[i] = *m
	}
	return &result, nil
}
