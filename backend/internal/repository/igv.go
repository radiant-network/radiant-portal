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

	alignmentFilter := fmt.Sprintf("tctx.case_id=%d AND (d.data_type_code='alignment' AND d.format_code in ('cram', 'crai'))", caseID)

	tx := r.db.Table(fmt.Sprintf("%s se", types.SequencingExperimentTable.Name))
	tx.Joins(fmt.Sprintf("LEFT JOIN %s tctx ON tctx.sequencing_experiment_id=se.id AND tctx.case_id=%d", types.TaskContextTable.Name, caseID))
	tx.Joins(fmt.Sprintf("LEFT JOIN %s thd ON thd.task_id=tctx.task_id", types.TaskHasDocumentTable.Name))
	tx.Joins(fmt.Sprintf("LEFT JOIN %s sa ON sa.id=se.sample_id", types.SampleTable.Name))
	tx.Joins(fmt.Sprintf("LEFT JOIN %s d ON thd.document_id=d.id", types.DocumentTable.Name))
	tx.Joins(fmt.Sprintf("LEFT JOIN %s f ON sa.patient_id=f.family_member_id AND f.case_id=tctx.case_id", types.FamilyTable.Name))
	tx.Joins(fmt.Sprintf("LEFT JOIN %s p ON f.family_member_id=p.id", types.PatientTable.Name))
	tx.Where(alignmentFilter)

	columns := []string{
		"se.id AS sequencing_experiment_id",
		"p.id as patient_id",
		"sa.submitter_sample_id AS sample_id",
		"f.relationship_to_proband_code AS family_role",
		"p.sex_code",
		"d.data_type_code",
		"d.format_code",
		"d.url",
	}

	tx.Select(columns)
	tx.Order("se.id, d.data_type_code, d.format_code")
	if err := tx.Find(&igvInternal).Error; err != nil {
		return []IGVTrack{}, err
	}

	return igvInternal, nil
}

func PrepareIgvTracks(internalTracks []IGVTrack, presigner utils.S3PreSigner) (*types.IGVTracks, error) {
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

		presigned, err := presigner.GenerateS3PreSignedURL(r.URL)
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
