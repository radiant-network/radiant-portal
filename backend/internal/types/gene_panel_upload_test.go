package types

import (
	"strings"
	"testing"

	"github.com/stretchr/testify/assert"
)

func Test_ValidateGenePanelCode_AcceptsLettersDigitsUnderscoreDash(t *testing.T) {
	assert.NoError(t, ValidateGenePanelCode("EPILEP"))
	assert.NoError(t, ValidateGenePanelCode("c_seg-y2"))
}

func Test_ValidateGenePanelCode_RejectsSpace(t *testing.T) {
	assert.ErrorContains(t, ValidateGenePanelCode("EPI LEP"), `panel code "EPI LEP"`)
}

func Test_ValidateGenePanelCode_RejectsLeadingUnderscore(t *testing.T) {
	assert.Error(t, ValidateGenePanelCode("_EPILEP"))
}

func Test_ValidateGenePanelCode_RejectsMoreThan50Characters(t *testing.T) {
	assert.NoError(t, ValidateGenePanelCode(strings.Repeat("A", 50)))
	assert.Error(t, ValidateGenePanelCode(strings.Repeat("A", 51)))
}

func Test_ValidateGenePanelCode_RejectsEmpty(t *testing.T) {
	assert.Error(t, ValidateGenePanelCode(""))
}
