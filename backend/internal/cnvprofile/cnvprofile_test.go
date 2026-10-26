package cnvprofile

import (
	"bytes"
	"os"
	"testing"

	"github.com/radiant-network/radiant-api/internal/bigwig"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

// The fixtures are written by test/data/bigwig/generate.py.
func openFixture(t *testing.T, name string) *bigwig.File {
	t.Helper()
	data, err := os.ReadFile("../../test/data/bigwig/" + name)
	require.NoError(t, err)
	f, err := bigwig.Open(bytes.NewReader(data))
	require.NoError(t, err)
	return f
}

var fixtureChromosomes = []types.CNVProfileChromosome{{Name: "1", Size: 1000}, {Name: "2", Size: 500}, {Name: "X", Size: 300}}

func Test_Chromosomes_InGenomeOrderWithoutChrPrefix(t *testing.T) {
	assert.Equal(t, fixtureChromosomes, Chromosomes(openFixture(t, "tn.bw")))
}

func Test_chromosomeName_KeepsMainChromosomes(t *testing.T) {
	name, ok := chromosomeName("chrX")
	assert.True(t, ok)
	assert.Equal(t, "X", name)
}

func Test_chromosomeName_LeavesOutOtherContigs(t *testing.T) {
	_, ok := chromosomeName("chr1_KI270706v1_random")
	assert.False(t, ok)
}

func Test_CopyRatioTrack_LinearRatioAtBinMiddle(t *testing.T) {
	got, err := CopyRatioTrack(openFixture(t, "tn.bw"), fixtureChromosomes)
	require.NoError(t, err)
	assert.Equal(t, []types.CNVProfileTrack{
		{Chromosome: "1", Positions: []int{50, 150}, Values: []float64{1, 2}},
		{Chromosome: "2", Positions: []int{50}, Values: []float64{0.5}},
		{Chromosome: "X", Positions: []int{}, Values: []float64{}},
	}, got)
}

func Test_BAFTrack_SkipsChromosomesAbsentFromTheFile(t *testing.T) {
	got, err := BAFTrack(openFixture(t, "baf.bw"), fixtureChromosomes)
	require.NoError(t, err)
	assert.Equal(t, []types.CNVProfileTrack{
		{Chromosome: "1", Positions: []int{10, 150}, Values: []float64{0.5, 0.25}},
		{Chromosome: "2", Positions: []int{20}, Values: []float64{1}},
	}, got)
}

func Test_BAFSample_KeepsOneVariantPerStrideAcrossChromosomes(t *testing.T) {
	got, stride, err := BAFSample(openFixture(t, "baf.bw"), fixtureChromosomes, 2)
	require.NoError(t, err)
	assert.Equal(t, 2, stride)
	assert.Equal(t, []types.CNVProfileTrack{
		{Chromosome: "1", Positions: []int{10}, Values: []float64{0.5}},
		{Chromosome: "2", Positions: []int{20}, Values: []float64{1}},
	}, got)
}

func Test_BAFSample_KeepsEveryVariantUnderTheLimit(t *testing.T) {
	got, stride, err := BAFSample(openFixture(t, "baf.bw"), fixtureChromosomes, 10)
	require.NoError(t, err)
	assert.Equal(t, 1, stride)
	assert.Equal(t, []int{10, 150}, got[0].Positions)
}

func Test_CopyRatioSample_KeepsOneBinPerStrideAcrossChromosomes(t *testing.T) {
	got, stride, err := CopyRatioSample(openFixture(t, "tn.bw"), fixtureChromosomes, 2)
	require.NoError(t, err)
	assert.Equal(t, 2, stride)
	assert.Equal(t, []types.CNVProfileTrack{
		{Chromosome: "1", Positions: []int{50}, Values: []float64{1}},
		{Chromosome: "2", Positions: []int{50}, Values: []float64{0.5}},
		{Chromosome: "X", Positions: []int{}, Values: []float64{}},
	}, got)
}

func Test_CopyRatioSample_KeepsEveryBinUnderTheLimit(t *testing.T) {
	got, stride, err := CopyRatioSample(openFixture(t, "tn.bw"), fixtureChromosomes, 10)
	require.NoError(t, err)
	assert.Equal(t, 1, stride)
	assert.Equal(t, []int{50, 150}, got[0].Positions)
}

func Test_CopyRatioRegion_KeepsOverlappingBins(t *testing.T) {
	got, err := CopyRatioRegion(openFixture(t, "tn.bw"), "1", 120, 130)
	require.NoError(t, err)
	assert.Equal(t, types.CNVProfileTrack{Chromosome: "1", Positions: []int{150}, Values: []float64{2}}, got)
}

func Test_BAFRegion_ChromosomeAbsentFromTheFile(t *testing.T) {
	got, err := BAFRegion(openFixture(t, "baf.bw"), "X", 0, 300)
	require.NoError(t, err)
	assert.Equal(t, types.CNVProfileTrack{Chromosome: "X", Positions: []int{}, Values: []float64{}}, got)
}

func Test_ParseROH_ReadsRegions(t *testing.T) {
	got, err := ParseROH([]byte("chr3\t121632491\t122164266\t1.57\t63\t0\nchr14\t66371417\t67475060\t1.50\t60\t1\n"))
	require.NoError(t, err)
	assert.Equal(t, []types.CNVProfileROH{
		{Chromosome: "3", Start: 121632491, End: 122164266, Score: 1.57, NbHom: 63, NbHet: 0},
		{Chromosome: "14", Start: 66371417, End: 67475060, Score: 1.5, NbHom: 60, NbHet: 1},
	}, got)
}

func Test_ParseROH_SkipsHeadersAndOtherContigs(t *testing.T) {
	got, err := ParseROH([]byte("#chrom\tstart\nchrM\t1\t2\t1\t1\t0\n\n"))
	require.NoError(t, err)
	assert.Equal(t, []types.CNVProfileROH{}, got)
}

func Test_ParseROH_Empty(t *testing.T) {
	got, err := ParseROH(nil)
	require.NoError(t, err)
	assert.Equal(t, []types.CNVProfileROH{}, got)
}

func Test_ParseROH_MissingColumns(t *testing.T) {
	_, err := ParseROH([]byte("chr3\t1\t2\n"))
	assert.EqualError(t, err, "roh line 1: 3 columns, want 6")
}

func Test_ParseROH_BadNumber(t *testing.T) {
	_, err := ParseROH([]byte("chr3\t1\t2\tx\t1\t0\n"))
	assert.ErrorContains(t, err, "roh line 1: strconv.ParseFloat")
}
