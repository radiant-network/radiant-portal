package report

import (
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
)

var fileNameNow = time.Date(2026, 10, 19, 13, 45, 7, 0, time.FixedZone("EDT", -4*3600))

func Test_FileName_MrnCaseAndUtcTimestamp(t *testing.T) {
	assert.Equal(t, "MRN-283775_140_20261019T174507Z.xlsx", FileName("MRN-283775", 140, fileNameNow))
}

func Test_FileName_EmptyMrnDropped(t *testing.T) {
	assert.Equal(t, "140_20261019T174507Z.xlsx", FileName("", 140, fileNameNow))
}

func Test_FileName_MaskedMrnDropped(t *testing.T) {
	assert.Equal(t, "140_20261019T174507Z.xlsx", FileName("***", 140, fileNameNow))
}

func Test_FileName_UnsafeCharactersStripped(t *testing.T) {
	assert.Equal(t, "AB12_140_20261019T174507Z.xlsx", FileName("A/B 1\\2", 140, fileNameNow))
}
