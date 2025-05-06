package utils

import (
	"github.com/Ferlab-Ste-Justine/radiant-api/internal/types"
	"github.com/stretchr/testify/assert"
	"testing"
)

func Consequence() types.Consequence {
	return types.Consequence{
		Picked:              true,
		Symbol:              "Symbol",
		Biotype:             "Biotype",
		GnomadPli:           1.1,
		GnomadLoeuf:         1.2,
		SpliceaiDs:          1.3,
		SpliceaiType:        []string{"SpliceaiType"},
		EnsemblTranscriptId: "TranscriptId",
		Canonical:           true,
		ManeSelect:          false,
		ManePlus:            true,
		ExonRank:            2,
		ExonTotal:           3,
		CodingDnaChange:     "CodingDnaChange",
		AaChange:            "AaChange",
		Consequence:         []string{"Consequence"},
		VepImpact:           "VepImpact",
		SiftPred:            "SiftPred",
		SiftScore:           1.4,
		FathmmPred:          "FathmmPred",
		FathmmScore:         1.5,
		CaddScore:           1.6,
		CaddPhred:           1.7,
		DannScore:           1.8,
		LrtPred:             "LrtPred",
		LrtScore:            1.9,
		RevelScore:          2.0,
		Polyphen2HvarPred:   "Polyphen2HvarPred",
		Polyphen2HvarScore:  2.1,
		PhyloP17wayPrimate:  2.2,
		RefseqMrnaId:        "RefseqMrnaId",
	}
}

func Test_ConsequenceToTranscript(t *testing.T) {
	consequence := Consequence()

	transcript := ConsequenceToTranscript(consequence)

	assert.Equal(t, consequence.EnsemblTranscriptId, transcript.TranscriptId)
	assert.Equal(t, consequence.Canonical, transcript.Canonical)
	assert.Equal(t, consequence.ManeSelect, transcript.ManeSelect)
	assert.Equal(t, consequence.ManePlus, transcript.ManePlus)
	assert.Equal(t, consequence.ExonRank, transcript.ExonRank)
	assert.Equal(t, consequence.ExonTotal, transcript.ExonTotal)
	assert.Equal(t, consequence.CodingDnaChange, transcript.CodingDnaChange)
	assert.Equal(t, consequence.AaChange, transcript.AaChange)
	assert.Equal(t, consequence.Consequence, transcript.Consequence)
	assert.Equal(t, consequence.VepImpact, transcript.VepImpact)
	assert.Equal(t, consequence.SiftPred, transcript.SiftPred)
	assert.Equal(t, consequence.SiftScore, transcript.SiftScore)
	assert.Equal(t, consequence.FathmmPred, transcript.FathmmPred)
	assert.Equal(t, consequence.FathmmScore, transcript.FathmmScore)
	assert.Equal(t, consequence.CaddScore, transcript.CaddScore)
	assert.Equal(t, consequence.CaddPhred, transcript.CaddPhred)
	assert.Equal(t, consequence.DannScore, transcript.DannScore)
	assert.Equal(t, consequence.LrtPred, transcript.LrtPred)
	assert.Equal(t, consequence.LrtScore, transcript.LrtScore)
	assert.Equal(t, consequence.RevelScore, transcript.RevelScore)
	assert.Equal(t, consequence.Polyphen2HvarPred, transcript.Polyphen2HvarPred)
	assert.Equal(t, consequence.Polyphen2HvarScore, transcript.Polyphen2HvarScore)
	assert.Equal(t, consequence.PhyloP17wayPrimate, transcript.PhyloP17wayPrimate)
	assert.Equal(t, consequence.RefseqMrnaId, transcript.RefseqMrnaId)
}

func Test_ConsequencesToVariantConsequences(t *testing.T) {
	consequence1 := Consequence()
	consequence1.Symbol = "AAA"
	consequence1.EnsemblTranscriptId = "TranscriptId_1"
	consequence2 := Consequence()
	consequence2.Symbol = "BBB"
	consequence2.EnsemblTranscriptId = "TranscriptId_2"
	consequence3 := Consequence()
	consequence3.Symbol = "CCC"
	consequence3.EnsemblTranscriptId = "TranscriptId_3"
	consequence4 := Consequence()
	consequence4.Symbol = "AAA"
	consequence4.EnsemblTranscriptId = "TranscriptId_4"
	consequence5 := Consequence()
	consequence5.Symbol = "BBB"
	consequence5.EnsemblTranscriptId = "TranscriptId_5"

	consequences := []types.Consequence{consequence1, consequence2, consequence3, consequence4, consequence5}

	variantConsequences := ConsequencesToVariantConsequences(consequences)

	assert.Equal(t, 3, len(variantConsequences))
	assert.Equal(t, "AAA", variantConsequences[0].Symbol)
	assert.Equal(t, 2, len(variantConsequences[0].Transcripts))
	assert.Equal(t, "BBB", variantConsequences[1].Symbol)
	assert.Equal(t, 2, len(variantConsequences[1].Transcripts))
	assert.Equal(t, "CCC", variantConsequences[2].Symbol)
	assert.Equal(t, 1, len(variantConsequences[2].Transcripts))
}
