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
	tx = utils.JoinTaskContextWithTaskHasDoc(tx)
	tx = utils.JoinSeqExpWithSample(tx)
	tx.Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s.family_member_id=%s.patient_id AND %s.case_id = %s.case_id", types.FamilyTable.FederationName, types.FamilyTable.Alias, types.FamilyTable.Alias, types.SampleTable.Alias, types.FamilyTable.Alias, types.CaseHasSequencingExperimentTable.Alias))
	tx = utils.JoinTaskHasDocWithDocument(tx)
	tx = utils.JoinFamilyWithPatient(tx)
	tx.Where(alignmentFilter)

	columns := []string{
		"s.id AS sequencing_experiment_id",
		"p.id as patient_id",
		"spl.submitter_sample_id AS sample_id",
		"f.relationship_to_proband_code AS family_role",
		"p.sex_code",
		"doc.data_type_code",
		"doc.format_code",
		"doc.url",
	}

	tx.Select(columns)
	tx.Order("s.id, doc.data_type_code, doc.format_code")
	if err := tx.Find(&igvInternal).Error; err != nil {
		return []IGVTrack{}, err
	}

	return igvInternal, nil
}

func PrepareIgvTracks(internalTracks []IGVTrack, presigner utils.PreSigner) (*types.IGVTracks, error) {
	result := types.IGVTracks{}

	grouped := map[string]types.IGVTrackEnriched{}

	for _, r := range internalTracks {
		key := strings.Join([]string{
			r.DataTypeCode,
			strconv.Itoa(r.PatientId),
		}, "|")

		enriched, exists := grouped[key]
		if !exists {
			enriched = types.IGVTrackEnriched{
				PatientId:  r.PatientId,
				Type:       r.DataTypeCode,
				Sex:        r.SexCode,
				FamilyRole: r.FamilyRole,
			}
		}

		presigned, err := presigner.GeneratePreSignedURL(r.URL)
		if err != nil {
			return nil, err
		}

		if r.FormatCode == "cram" {
			enriched.Name = fmt.Sprintf("Reads: %s %s", r.SampleId, r.FamilyRole)
			enriched.Format = r.FormatCode
			enriched.URL = presigned.URL
			enriched.URLExpireAt = presigned.URLExpireAt
		} else if r.FormatCode == "crai" {
			enriched.IndexURL = presigned.URL
			enriched.IndexURLExpireAt = presigned.URLExpireAt
		}

		grouped[key] = enriched
	}

	for _, track := range grouped {
		switch track.Type {
		case "alignment":
			// Ensure the proband is always first in the alignment list
			if track.FamilyRole == "proband" {
				result.Alignment = append([]types.IGVTrackEnriched{track}, result.Alignment...)
			} else {
				result.Alignment = append(result.Alignment, track)
			}
		}
	}

	return &result, nil
}
