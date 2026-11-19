package types

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func Test_IsChromosome_Autosomes(t *testing.T) {
	assert.True(t, IsChromosome("1"))
	assert.True(t, IsChromosome("22"))
}

func Test_IsChromosome_SexChromosomes(t *testing.T) {
	assert.True(t, IsChromosome("X"))
	assert.True(t, IsChromosome("Y"))
}

func Test_IsChromosome_Unknown(t *testing.T) {
	assert.False(t, IsChromosome(""))
	assert.False(t, IsChromosome("0"))
	assert.False(t, IsChromosome("23"))
	assert.False(t, IsChromosome("01"))
	assert.False(t, IsChromosome("chr1"))
	assert.False(t, IsChromosome("M"))
	assert.False(t, IsChromosome("x"))
}
