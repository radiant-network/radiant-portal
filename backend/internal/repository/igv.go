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
	GetIGV(seqId int) ([]IGVTrack, error)
}

func NewIGVRepository(db *gorm.DB) *IGVRepository {
	if db == nil {
		log.Print("GermlineCNVOccurrencesRepository: db is nil")
		return nil
	}
	return &IGVRepository{db: db}
}

func (r *IGVRepository) GetIGV(seqId int) ([]IGVTrack, error) {
	var igvInternal []IGVTrack

	txInternal := r.db.Table(types.SequencingExperimentTable.Name).Where("id = ?", seqId).Select("case_id")

	alignmentFilter := "(d.data_type_code='alignment' AND d.format_code in ('cram', 'crai'))"

	tx := r.db.Table(fmt.Sprintf("%s se", types.SequencingExperimentTable.Name))
	tx.Joins(fmt.Sprintf("LEFT JOIN %s thse ON thse.sequencing_experiment_id=se.id", types.TaskHasSequencingExperimentTable.Name))
	tx.Joins(fmt.Sprintf("LEFT JOIN %s thd ON thd.task_id=thse.task_id", types.TaskHasDocumentTable.Name))
	tx.Joins(fmt.Sprintf("LEFT JOIN %s sa ON sa.id=se.sample_id", types.SampleTable.Name))
	tx.Joins(fmt.Sprintf("LEFT JOIN %s d ON thd.document_id=d.id", types.DocumentTable.Name))
	tx.Joins(fmt.Sprintf("LEFT JOIN %s f ON se.patient_id=f.family_member_id", types.FamilyTable.Name))
	tx.Joins(fmt.Sprintf("LEFT JOIN %s p ON se.patient_id=p.id", types.PatientTable.Name))
	tx.Where(fmt.Sprintf("se.case_id = (?) AND %s", alignmentFilter), txInternal)

	columns := []string{
		"se.id AS sequencing_experiment_id",
		"se.patient_id",
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
