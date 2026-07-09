package utils

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func Test_NilIfEmpty_Empty(t *testing.T) {
	assert.Nil(t, NilIfEmpty(""))
}

func Test_NilIfEmpty_NonEmpty(t *testing.T) {
	result := NilIfEmpty("infantile")
	assert.NotNil(t, result)
	assert.Equal(t, "infantile", *result)
}
