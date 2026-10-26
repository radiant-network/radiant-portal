package bigwig

import (
	"bytes"
	"encoding/binary"
	"os"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

// The fixtures are written by test/data/bigwig/generate.py.
func openFixture(t *testing.T, name string) *File {
	t.Helper()
	data, err := os.ReadFile("../../test/data/bigwig/" + name)
	require.NoError(t, err)
	f, err := Open(bytes.NewReader(data))
	require.NoError(t, err)
	return f
}

func Test_Open_ReadsChromosomes(t *testing.T) {
	f := openFixture(t, "sections.bw")
	assert.Equal(t, []Chrom{{Name: "chr1", ID: 0, Size: 1000}, {Name: "chr2", ID: 1, Size: 500}, {Name: "chrX", ID: 2, Size: 300}}, f.Chroms())
}

func Test_Open_RejectsNonBigWig(t *testing.T) {
	_, err := Open(bytes.NewReader(make([]byte, headerSize)))
	assert.EqualError(t, err, "not a bigwig file")
}

func Test_Open_RejectsTruncatedFile(t *testing.T) {
	_, err := Open(bytes.NewReader([]byte{0x26, 0xFC, 0x8F, 0x88}))
	assert.ErrorContains(t, err, "read bigwig header")
}

func Test_Intervals_BedGraphSection(t *testing.T) {
	got, err := openFixture(t, "sections.bw").Intervals("chr1")
	require.NoError(t, err)
	assert.Equal(t, []Interval{{0, 100, 0}, {100, 200, 1.5}, {200, 300, -1}}, got)
}

func Test_Intervals_VarStepSection(t *testing.T) {
	got, err := openFixture(t, "sections.bw").Intervals("chr2")
	require.NoError(t, err)
	assert.Equal(t, []Interval{{10, 15, 0.25}, {50, 55, 0.75}}, got)
}

func Test_Intervals_FixedStepSection(t *testing.T) {
	got, err := openFixture(t, "sections.bw").Intervals("chrX")
	require.NoError(t, err)
	assert.Equal(t, []Interval{{100, 110, 0.1}, {120, 130, 0.2}, {140, 150, 0.3}}, got)
}

func Test_Intervals_ChromosomeWithoutData(t *testing.T) {
	got, err := openFixture(t, "tn.bw").Intervals("chrX")
	require.NoError(t, err)
	assert.Empty(t, got)
}

func Test_Intervals_UnknownChromosome(t *testing.T) {
	_, err := openFixture(t, "baf.bw").Intervals("chrY")
	assert.EqualError(t, err, `read intervals: chromosome "chrY" not in bigwig`)
}

func Test_IntervalsIn_KeepsOverlappingIntervals(t *testing.T) {
	got, err := openFixture(t, "zoomed.bw").IntervalsIn("chr1", 250, 450)
	require.NoError(t, err)
	assert.Equal(t, []Interval{{200, 300, 0.2}, {300, 400, 0.3}, {400, 500, 0.4}}, got)
}

func Test_IntervalsIn_FixedStepSection(t *testing.T) {
	got, err := openFixture(t, "sections.bw").IntervalsIn("chrX", 125, 135)
	require.NoError(t, err)
	assert.Equal(t, []Interval{{120, 130, 0.2}}, got)
}

func Test_ZoomLevels_ReadsReductions(t *testing.T) {
	assert.Equal(t, []uint32{1600}, openFixture(t, "zoomed.bw").ZoomLevels())
}

func Test_ZoomLevels_FileWithoutZoom(t *testing.T) {
	assert.Empty(t, openFixture(t, "sections.bw").ZoomLevels())
}

func Test_Summaries_ReadsWindows(t *testing.T) {
	got, err := openFixture(t, "zoomed.bw").Summaries("chr1", 0, 0, 100_000)
	require.NoError(t, err)
	require.Len(t, got, 63)
	assert.Equal(t, uint32(0), got[0].Start)
	assert.Equal(t, uint32(1600), got[0].End)
	assert.Equal(t, uint32(1600), got[0].ValidCount)
	assert.Equal(t, float32(0), got[0].Min)
	assert.InDelta(t, 0.4, got[0].Max, 1e-6)
	assert.InDelta(t, 300, got[0].Sum, 1e-3)
	assert.Equal(t, uint32(100_000), got[62].End)
}

func Test_Summaries_KeepsOverlappingWindows(t *testing.T) {
	got, err := openFixture(t, "zoomed.bw").Summaries("chr1", 0, 1601, 1602)
	require.NoError(t, err)
	require.Len(t, got, 1)
	assert.Equal(t, uint32(1600), got[0].Start)
}

func Test_Summaries_LevelOutOfRange(t *testing.T) {
	_, err := openFixture(t, "zoomed.bw").Summaries("chr1", 1, 0, 100)
	assert.EqualError(t, err, "zoom level 1 out of range: the file has 1")
}

func Test_BasesCovered_CountsBasesWithValue(t *testing.T) {
	assert.Equal(t, uint64(100_000), openFixture(t, "zoomed.bw").BasesCovered())
}

func Test_offset_OutOfRange(t *testing.T) {
	f := &File{order: binary.LittleEndian}
	_, err := f.offset([]byte{0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF})
	assert.EqualError(t, err, "offset 18446744073709551615 out of range")
}
