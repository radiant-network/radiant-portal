// Package cnvprofile builds the tracks of a CNV profile from the DRAGEN CNV files: the
// tangent-normalized coverage (tn.bw, log2), the B-allele frequency (baf.bw) and the regions of
// homozygosity (roh.bed). Chromosomes are named as in StarRocks: 1-22, X and Y, without "chr".
package cnvprofile

import (
	"bufio"
	"bytes"
	"cmp"
	"fmt"
	"math"
	"slices"
	"strconv"
	"strings"

	"github.com/radiant-network/radiant-api/internal/bigwig"
	"github.com/radiant-network/radiant-api/internal/types"
)

// MaxCopyRatio caps the copy ratio, as the CQGC plot does: a few bins of extreme coverage would
// otherwise squash the scale.
const MaxCopyRatio = 6.5

var chromosomeOrder = func() map[string]int {
	order := map[string]int{"X": 23, "Y": 24}
	for i := 1; i <= 22; i++ {
		order[strconv.Itoa(i)] = i
	}
	return order
}()

// SortByLocus sorts items in genome order, chromosome (1-22, X, Y, then the others by name) then
// start: StarRocks sorts the chromosome names as text.
func SortByLocus[T any](items []T, locus func(T) (string, int)) {
	rank := func(name string) int {
		if order, ok := chromosomeOrder[name]; ok {
			return order
		}
		return len(chromosomeOrder) + 1
	}
	slices.SortStableFunc(items, func(a, b T) int {
		chromA, startA := locus(a)
		chromB, startB := locus(b)
		return cmp.Or(cmp.Compare(rank(chromA), rank(chromB)), strings.Compare(chromA, chromB), cmp.Compare(startA, startB))
	})
}

func chromosomeName(name string) (string, bool) {
	name = strings.TrimPrefix(name, "chr")
	_, ok := chromosomeOrder[name]
	return name, ok
}

// Chromosomes lists the chromosomes of any of the bigwigs in genome order, with their sizes: DRAGEN
// can leave a chromosome out of tn.bw (chrY of an exome) and keep it in baf.bw, or the reverse
// (chrY of a female sample). The size comes from the first bigwig that has the chromosome.
func Chromosomes(files ...*bigwig.File) []types.CNVProfileChromosome {
	byOrder := make([]*types.CNVProfileChromosome, len(chromosomeOrder)+1)
	for _, f := range files {
		for _, c := range f.Chroms() {
			if name, ok := chromosomeName(c.Name); ok && byOrder[chromosomeOrder[name]] == nil {
				byOrder[chromosomeOrder[name]] = &types.CNVProfileChromosome{Name: name, Size: int(c.Size)}
			}
		}
	}
	chromosomes := []types.CNVProfileChromosome{}
	for _, c := range byOrder {
		if c != nil {
			chromosomes = append(chromosomes, *c)
		}
	}
	return chromosomes
}

func copyRatio(log2 float64) float64 {
	return min(math.Exp2(log2), MaxCopyRatio)
}

func copyRatioPoint(iv bigwig.Interval) (int, float64) {
	return int(iv.Start+iv.End) / 2, copyRatio(float64(iv.Value))
}

func bafPoint(iv bigwig.Interval) (int, float64) {
	return int(iv.Start), float64(iv.Value)
}

// CopyRatioTrack gives one point per bin, at its middle: the linear copy ratio 2^tn.
func CopyRatioTrack(f *bigwig.File, chromosomes []types.CNVProfileChromosome) ([]types.CNVProfileTrack, error) {
	return track(f, chromosomes, 1, copyRatioPoint)
}

// BAFTrack gives one point per variant, at its position.
func BAFTrack(f *bigwig.File, chromosomes []types.CNVProfileChromosome) ([]types.CNVProfileTrack, error) {
	return track(f, chromosomes, 1, bafPoint)
}

// CopyRatioSample keeps one bin in every stride, in genome order, so that at most maxPoints are
// left: the overview of a genome, whose millions of bins a browser cannot draw. A sample keeps
// the spread of the bins, which a window mean narrows.
func CopyRatioSample(f *bigwig.File, chromosomes []types.CNVProfileChromosome, maxPoints int) ([]types.CNVProfileTrack, int, error) {
	intervals, err := readChromosomes(f, chromosomes)
	if err != nil {
		return nil, 0, fmt.Errorf("sample copy ratio: %w", err)
	}
	var total int
	for _, ivs := range intervals {
		total += len(ivs)
	}
	stride := max(1, (total+maxPoints-1)/maxPoints)
	return sampleTracks(chromosomes, intervals, stride, copyRatioPoint), stride, nil
}

// BAFSample keeps one variant in every stride, in genome order, so that at most maxPoints are
// left: the overview of a genome, whose millions of variants a browser cannot draw. A window mean
// would not do: the variants of a region sit at 0, 0.5 and 1, and their mean is 0.5 everywhere.
// The variants are 1-base intervals, so the bases covered count them before any is read.
func BAFSample(f *bigwig.File, chromosomes []types.CNVProfileChromosome, maxPoints int) ([]types.CNVProfileTrack, int, error) {
	stride := max(1, int((f.BasesCovered()+uint64(maxPoints)-1)/uint64(maxPoints))) //nolint:gosec // maxPoints is positive
	tracks, err := track(f, chromosomes, stride, bafPoint)
	if err != nil {
		return nil, 0, fmt.Errorf("sample baf: %w", err)
	}
	return tracks, stride, nil
}

// CopyRatioRegion gives the copy ratio of the bins that overlap [start, end) of a chromosome.
func CopyRatioRegion(f *bigwig.File, chromosome string, start, end int) (types.CNVProfileTrack, error) {
	return regionTrack(f, chromosome, start, end, copyRatioPoint)
}

// BAFRegion gives the BAF of the variants in [start, end) of a chromosome.
func BAFRegion(f *bigwig.File, chromosome string, start, end int) (types.CNVProfileTrack, error) {
	return regionTrack(f, chromosome, start, end, bafPoint)
}

func regionTrack(f *bigwig.File, chromosome string, start, end int, point func(bigwig.Interval) (int, float64)) (types.CNVProfileTrack, error) {
	t := types.CNVProfileTrack{Chromosome: chromosome, Positions: []int{}, Values: []float64{}}
	fileName, ok := fileChromosomeNames(f)[chromosome]
	if !ok {
		return t, nil
	}
	intervals, err := f.IntervalsIn(fileName, uint32(max(start, 0)), uint32(max(end, 0))) //nolint:gosec // clamped to positive
	if err != nil {
		return t, fmt.Errorf("read chromosome %s: %w", fileName, err)
	}
	appendPoints(&t, intervals, 0, 1, point)
	return t, nil
}

func fileChromosomeNames(f *bigwig.File) map[string]string {
	names := map[string]string{}
	for _, c := range f.Chroms() {
		if name, ok := chromosomeName(c.Name); ok {
			names[name] = c.Name
		}
	}
	return names
}

// readChromosomes reads every interval of the chromosomes the bigwig has, by chromosome name;
// the BAF of a female sample has no chrY.
func readChromosomes(f *bigwig.File, chromosomes []types.CNVProfileChromosome) (map[string][]bigwig.Interval, error) {
	names := fileChromosomeNames(f)
	intervals := map[string][]bigwig.Interval{}
	for _, c := range chromosomes {
		fileName, ok := names[c.Name]
		if !ok {
			continue
		}
		ivs, err := f.Intervals(fileName)
		if err != nil {
			return nil, fmt.Errorf("read chromosome %s: %w", fileName, err)
		}
		intervals[c.Name] = ivs
	}
	return intervals, nil
}

// sampleTracks keeps one interval in every stride across the chromosomes, in genome order.
func sampleTracks(chromosomes []types.CNVProfileChromosome, intervals map[string][]bigwig.Interval, stride int, point func(bigwig.Interval) (int, float64)) []types.CNVProfileTrack {
	tracks := []types.CNVProfileTrack{}
	first := 0
	for _, c := range chromosomes {
		ivs, ok := intervals[c.Name]
		if !ok {
			continue
		}
		t := types.CNVProfileTrack{Chromosome: c.Name, Positions: make([]int, 0, len(ivs)/stride+1), Values: make([]float64, 0, len(ivs)/stride+1)}
		first = appendPoints(&t, ivs, first, stride, point)
		tracks = append(tracks, t)
	}
	return tracks
}

// track reads the chromosomes the bigwig has (the BAF of a female sample has no chrY), keeping
// one interval in every stride across the whole genome.
func track(f *bigwig.File, chromosomes []types.CNVProfileChromosome, stride int, point func(bigwig.Interval) (int, float64)) ([]types.CNVProfileTrack, error) {
	names := fileChromosomeNames(f)
	tracks := []types.CNVProfileTrack{}
	first := 0
	for _, c := range chromosomes {
		fileName, ok := names[c.Name]
		if !ok {
			continue
		}
		intervals, err := f.Intervals(fileName)
		if err != nil {
			return nil, fmt.Errorf("read chromosome %s: %w", fileName, err)
		}
		t := types.CNVProfileTrack{Chromosome: c.Name, Positions: make([]int, 0, len(intervals)/stride+1), Values: make([]float64, 0, len(intervals)/stride+1)}
		first = appendPoints(&t, intervals, first, stride, point)
		tracks = append(tracks, t)
	}
	return tracks, nil
}

// appendPoints adds every stride-th interval with a value from first, and returns where the
// next chromosome starts so that the stride runs on across chromosomes.
func appendPoints(t *types.CNVProfileTrack, intervals []bigwig.Interval, first, stride int, point func(bigwig.Interval) (int, float64)) int {
	i := first
	for ; i < len(intervals); i += stride {
		if math.IsNaN(float64(intervals[i].Value)) {
			continue
		}
		position, value := point(intervals[i])
		t.Positions = append(t.Positions, position)
		t.Values = append(t.Values, round(value))
	}
	return i - len(intervals)
}

func round(value float64) float64 {
	return math.Round(value*1000) / 1000
}

// ParseROH reads the DRAGEN roh.bed: chromosome, start, end, score, homozygous and heterozygous
// variant counts. Regions off chromosomes 1-22, X and Y are left out.
func ParseROH(data []byte) ([]types.CNVProfileROH, error) {
	regions := []types.CNVProfileROH{}
	scanner := bufio.NewScanner(bytes.NewReader(data))
	for line := 1; scanner.Scan(); line++ {
		text := strings.TrimSpace(scanner.Text())
		if text == "" || strings.HasPrefix(text, "#") || strings.HasPrefix(text, "track") {
			continue
		}
		fields := strings.Fields(text)
		if len(fields) < 6 {
			return nil, fmt.Errorf("roh line %d: %d columns, want 6", line, len(fields))
		}
		name, ok := chromosomeName(fields[0])
		if !ok {
			continue
		}
		start, err1 := strconv.Atoi(fields[1])
		end, err2 := strconv.Atoi(fields[2])
		score, err3 := strconv.ParseFloat(fields[3], 64)
		nbHom, err4 := strconv.Atoi(fields[4])
		nbHet, err5 := strconv.Atoi(fields[5])
		for _, err := range []error{err1, err2, err3, err4, err5} {
			if err != nil {
				return nil, fmt.Errorf("roh line %d: %w", line, err)
			}
		}
		regions = append(regions, types.CNVProfileROH{Chromosome: name, Start: start, End: end, Score: score, NbHom: nbHom, NbHet: nbHet})
	}
	if err := scanner.Err(); err != nil {
		return nil, fmt.Errorf("read roh: %w", err)
	}
	return regions, nil
}
