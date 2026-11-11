package types

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func Test_OccurrenceType_TaskSelector_GermlineSNV_ResolvesGermlineAnnotationWithNoCohort(t *testing.T) {
	selector, err := OccurrenceTypeGermlineSNV.TaskSelector()

	assert.NoError(t, err)
	assert.Equal(t, TaskSelector{TaskTypeCode: RadiantGermlineAnnotationTask, SomaticCohort: SomaticCohortNone}, selector)
}

func Test_OccurrenceType_TaskSelector_GermlineCNV_ResolvesGermlineAlignmentWithNoCohort(t *testing.T) {
	selector, err := OccurrenceTypeGermlineCNV.TaskSelector()

	assert.NoError(t, err)
	assert.Equal(t, TaskSelector{TaskTypeCode: AlignmentGermlineVariantCallingTaskTypeCode, SomaticCohort: SomaticCohortNone}, selector)
}

// somatic_snv is the deprecated spelling of somatic_snv_tn: it must narrow to tumor-normal,
// not return every somatic task, otherwise the existing "SNV (TN)" button starts listing
// tumor-only tasks as soon as the ETL ingests them.
func Test_OccurrenceType_TaskSelector_SomaticSNV_DeprecatedAliasResolvesToTumorNormal(t *testing.T) {
	selector, err := OccurrenceTypeSomaticSNV.TaskSelector()

	assert.NoError(t, err)
	assert.Equal(t, TaskSelector{TaskTypeCode: RadiantSomaticAnnotationTask, SomaticCohort: SomaticCohortTumorNormal}, selector)
}

func Test_OccurrenceType_TaskSelector_SomaticSNVTumorNormal_ResolvesToTumorNormalCohort(t *testing.T) {
	selector, err := OccurrenceTypeSomaticSNVTumorNormal.TaskSelector()

	assert.NoError(t, err)
	assert.Equal(t, TaskSelector{TaskTypeCode: RadiantSomaticAnnotationTask, SomaticCohort: SomaticCohortTumorNormal}, selector)
}

func Test_OccurrenceType_TaskSelector_SomaticSNVTumorOnly_ResolvesToTumorOnlyCohort(t *testing.T) {
	selector, err := OccurrenceTypeSomaticSNVTumorOnly.TaskSelector()

	assert.NoError(t, err)
	assert.Equal(t, TaskSelector{TaskTypeCode: RadiantSomaticAnnotationTask, SomaticCohort: SomaticCohortTumorOnly}, selector)
}

// tumor_only_variant_calling is tumor-only by definition, so unlike somatic SNV the selector
// carries no cohort predicate — one would only let malformed clinical data hide the CNV tab.
func Test_OccurrenceType_TaskSelector_SomaticCNV_ResolvesTumorOnlyVariantCallingWithNoCohort(t *testing.T) {
	selector, err := OccurrenceTypeSomaticCNV.TaskSelector()

	assert.NoError(t, err)
	assert.Equal(t, TaskSelector{TaskTypeCode: TumorOnlyVariantCallingTaskTypeCode, SomaticCohort: SomaticCohortNone}, selector)
}

func Test_OccurrenceType_TaskSelector_Unknown_ReturnsError(t *testing.T) {
	selector, err := OccurrenceType("not_a_real_type").TaskSelector()

	assert.Error(t, err)
	assert.Equal(t, TaskSelector{}, selector)
	assert.Contains(t, err.Error(), "not_a_real_type")
}

func Test_OccurrenceType_TaskSelector_Empty_ReturnsError(t *testing.T) {
	selector, err := OccurrenceType("").TaskSelector()

	assert.Error(t, err)
	assert.Equal(t, TaskSelector{}, selector)
}

func Test_OccurrenceType_AllOccurrenceTypes_EveryValueResolves(t *testing.T) {
	for _, occurrenceType := range AllOccurrenceTypes {
		selector, err := occurrenceType.TaskSelector()

		assert.NoErrorf(t, err, "TaskSelector(%q) returned an error; want a selector", occurrenceType)
		assert.NotEmptyf(t, selector.TaskTypeCode, "TaskSelector(%q).TaskTypeCode = %q; want non-empty", occurrenceType, selector.TaskTypeCode)
	}
}
