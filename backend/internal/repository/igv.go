package repository

import (
	"fmt"
	"log"
	"strconv"
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

func (r *IGVRepository) GetIGV(caseID int) ([]IGVTrack, error) {
	var igvInternal []IGVTrack

	alignmentFilter := fmt.Sprintf("%s.case_id=%d AND thd.type='output' AND (doc.data_type_code IN ('alignment', 'alignment_variant_calling') AND doc.format_code in ('cram', 'crai'))", types.CaseHasSequencingExperimentTable.Alias, caseID)

	tx := r.db.Table(fmt.Sprintf("%s %s", types.SequencingExperimentTable.FederationName, types.SequencingExperimentTable.Alias))
	tx.Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s.sequencing_experiment_id=%s.id", types.CaseHasSequencingExperimentTable.FederationName, types.CaseHasSequencingExperimentTable.Alias, types.CaseHasSequencingExperimentTable.Alias, types.SequencingExperimentTable.Alias))
	tx.Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s.sequencing_experiment_id=%s.id", types.TaskContextTable.FederationName, types.TaskContextTable.Alias, types.TaskContextTable.Alias, types.SequencingExperimentTable.Alias))
	tx = utils.JoinCaseHasSeqExpWithCase(tx)
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
		"c.case_type_code",
	}

	tx.Select(columns)
	tx.Order("s.id, doc.data_type_code, doc.format_code")
	if err := tx.Find(&igvInternal).Error; err != nil {
		return []IGVTrack{}, err
	}

	return igvInternal, nil
}

func trackSuffix(t IGVTrack) string {
	if t.CaseTypeCode == "somatic" {
		switch t.HistologyCode {
		case "tumoral":
			return "Tumor"
		case "normal":
			return "Normal"
		}
	}
	// default (germline)
	return t.FamilyRole
}

func isLeadingTrack(t IGVTrack) bool {
	if t.CaseTypeCode == "somatic" {
		return t.HistologyCode == "tumoral"
	}
	return t.FamilyRole == "proband"
}

func PrepareIgvTracks(internalTracks []IGVTrack, presigner utils.PreSigner) (*types.IGVTracks, error) {
	type mergedTrack struct {
		enriched  types.IGVTrackEnriched
		isLeading bool
	}
	merged := map[string]*mergedTrack{}

	// Loop through tracks and merge pairs of cram/crai
	for _, r := range internalTracks {
		key := strings.Join([]string{
			r.DataTypeCode,
			strconv.Itoa(r.SequencingExperimentId),
		}, "|")

		m, exists := merged[key]
		if !exists {
			m = &mergedTrack{
				enriched: types.IGVTrackEnriched{
					PatientId:  r.PatientId,
					Type:       r.DataTypeCode,
					Sex:        r.SexCode,
					FamilyRole: r.FamilyRole,
				},
				isLeading: isLeadingTrack(r),
			}
			merged[key] = m
		}

		presigned, err := presigner.GeneratePreSignedURL(r.URL)
		if err != nil {
			return nil, err
		}

		switch r.FormatCode {
		case "cram":
			m.enriched.Name = fmt.Sprintf("Reads: %s %s", r.SampleId, trackSuffix(r))
			m.enriched.Format = r.FormatCode
			m.enriched.URL = presigned.URL
			m.enriched.URLExpireAt = presigned.URLExpireAt
		case "crai":
			m.enriched.IndexURL = presigned.URL
			m.enriched.IndexURLExpireAt = presigned.URLExpireAt
		}
	}

	result := types.IGVTracks{}
	for _, m := range merged {
		if m.enriched.Type != "alignment" {
			continue
		}
		if m.isLeading {
			result.Alignment = append([]types.IGVTrackEnriched{m.enriched}, result.Alignment...)
		} else {
			result.Alignment = append(result.Alignment, m.enriched)
		}
	}

	return &result, nil
}
