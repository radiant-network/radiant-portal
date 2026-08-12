package postgres

import (
	"testing"

	"github.com/radiant-network/radiant-api/internal/utils"
	"github.com/stretchr/testify/assert"
)

func Test_validateSubjectXOR_OnlyPatient(t *testing.T) {
	assert.NoError(t, validateSubjectXOR(utils.IntPtr(1), nil))
}

func Test_validateSubjectXOR_OnlyFetus(t *testing.T) {
	assert.NoError(t, validateSubjectXOR(nil, utils.IntPtr(1)))
}

func Test_validateSubjectXOR_BothNil(t *testing.T) {
	err := validateSubjectXOR(nil, nil)
	assert.ErrorIs(t, err, ErrInvalidSubject)
}

func Test_validateSubjectXOR_BothSet(t *testing.T) {
	err := validateSubjectXOR(utils.IntPtr(1), utils.IntPtr(2))
	assert.ErrorIs(t, err, ErrInvalidSubject)
	assert.ErrorContains(t, err, "patient_id=1")
	assert.ErrorContains(t, err, "fetus_id=2")
}
