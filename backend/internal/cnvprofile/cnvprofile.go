// Package cnvprofile builds the tracks of a CNV profile from the DRAGEN CNV files: the
// tangent-normalized coverage (tn.bw, log2), the B-allele frequency (baf.bw) and the regions of
// homozygosity (roh.bed). Chromosomes are named as in StarRocks: 1-22, X and Y, without "chr".
package cnvprofile

import (
	"bufio"
	"bytes"
	"fmt"
	"math"
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

func chromosomeName(name string) (string, bool) {
	name = strings.TrimPrefix(name, "chr")
	_, ok := chromosomeOrder[name]
	return name, ok
}

// Chromosomes lists the chromosomes of a bigwig in genome order, with their sizes.
func Chromosomes(f *bigwig.File) []types.CNVProfileChromosome {
	byOrder := make([]*types.CNVProfileChromosome, len(chromosomeOrder)+1)
	for _, c := range f.Chroms() {
		if name, ok := chromosomeName(c.Name); ok {
			byOrder[chromosomeOrder[name]] = &types.CNVProfileChromosome{Name: name, Size: int(c.Size)}
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

// CopyRatioTrack gives one point per bin, at its middle: the linear copy ratio 2^tn.
func CopyRatioTrack(f *bigwig.File, chromosomes []types.CNVProfileChromosome) ([]types.CNVProfileTrack, error) {
	return track(f, chromosomes, func(iv bigwig.Interval) (int, float64) {
		return int(iv.Start+iv.End) / 2, min(math.Exp2(float64(iv.Value)), MaxCopyRatio)
	})
}

// BAFTrack gives one point per variant, at its position.
func BAFTrack(f *bigwig.File, chromosomes []types.CNVProfileChromosome) ([]types.CNVProfileTrack, error) {
	return track(f, chromosomes, func(iv bigwig.Interval) (int, float64) {
		return int(iv.Start), float64(iv.Value)
	})
}

// track reads the chromosomes the bigwig has: the BAF of a female sample has no chrY.
func track(f *bigwig.File, chromosomes []types.CNVProfileChromosome, point func(bigwig.Interval) (int, float64)) ([]types.CNVProfileTrack, error) {
	names := map[string]string{}
	for _, c := range f.Chroms() {
		if name, ok := chromosomeName(c.Name); ok {
			names[name] = c.Name
		}
	}
	tracks := []types.CNVProfileTrack{}
	for _, c := range chromosomes {
		fileName, ok := names[c.Name]
		if !ok {
			continue
		}
		intervals, err := f.Intervals(fileName)
		if err != nil {
			return nil, fmt.Errorf("read chromosome %s: %w", fileName, err)
		}
		t := types.CNVProfileTrack{Chromosome: c.Name, Positions: make([]int, 0, len(intervals)), Values: make([]float64, 0, len(intervals))}
		for _, iv := range intervals {
			if math.IsNaN(float64(iv.Value)) {
				continue
			}
			position, value := point(iv)
			t.Positions = append(t.Positions, position)
			t.Values = append(t.Values, math.Round(value*1000)/1000)
		}
		tracks = append(tracks, t)
	}
	return tracks, nil
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
