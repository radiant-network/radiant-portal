package types

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func assertChromosome(t *testing.T, name string, expected string) {
	t.Helper()
	chromosome, ok := NormalizeChromosome(name)
	assert.True(t, ok, name)
	assert.Equal(t, expected, chromosome, name)
}

func Test_NormalizeChromosome_Autosomes(t *testing.T) {
	assertChromosome(t, "1", "1")
	assertChromosome(t, "22", "22")
}

func Test_NormalizeChromosome_SexChromosomes(t *testing.T) {
	assertChromosome(t, "X", "X")
	assertChromosome(t, "y", "Y")
}

func Test_NormalizeChromosome_Mitochondrion(t *testing.T) {
	assertChromosome(t, "M", "M")
	assertChromosome(t, "MT", "M")
	assertChromosome(t, "mt", "M")
}

func Test_NormalizeChromosome_Unknown(t *testing.T) {
	for _, name := range []string{"", "0", "23", "01", "+1", "-1", "chr1", "chrM", "GL000216.2"} {
		_, ok := NormalizeChromosome(name)
		assert.False(t, ok, name)
	}
}
